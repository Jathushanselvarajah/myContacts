// tests/contacts.test.js
const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

let server; // si index.js exporte http.Server, on le fermera proprement
let token; // JWT du user principal
let otherToken; // JWT d'un autre user (pour vérifier l'isolation)
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.TEST_BASE_URL || `http://localhost:${PORT}`;
const api = request(BASE_URL);

const User = require("../models/User");
const Contact = require("../models/Contact");

async function createContactViaAPI(jwt, data) {
  const res = await api
    .post("/contacts")
    .set("Authorization", `Bearer ${jwt}`)
    .send(data);
  expect(res.statusCode).toBe(201);

  // Comme POST /contacts ne renvoie pas l'objet, on va le récupérer via GET
  const list = await api.get("/contacts").set("Authorization", `Bearer ${jwt}`);
  expect(list.statusCode).toBe(200);

  const found = list.body.find(
    (c) =>
      c.firstName === data.firstName &&
      c.lastName === data.lastName &&
      c.phone === data.phone
  );
  expect(found).toBeDefined();
  return found; // { _id, firstName, lastName, phone, user }
}

describe("Contacts API (scopé par utilisateur)", () => {
  beforeAll(async () => {
    process.env.NODE_ENV = "test";

    // Démarre le serveur (side-effect d'index.js)
    server = require("../index");

    // Connexion à la même base (MONGO_URI)
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI manquant dans .env");
    await mongoose.connect(uri);

    // Nettoyage global AVANT les tests
    await User.deleteMany({});
    await Contact.deleteMany({});

    // Crée deux users et récupère leurs tokens
    const u1 = { email: "user@test.com", password: "contactspass123" };
    const u2 = { email: "other@test.com", password: "otherpass123" };

    await api.post("/auth/register").send(u1);
    const login1 = await api.post("/auth/login").send(u1);
    token = login1.body.token;

    await api.post("/auth/register").send(u2);
    const login2 = await api.post("/auth/login").send(u2);
    otherToken = login2.body.token;
  });

  afterAll(async () => {
    // Nettoyage global APRÈS les tests (optionnel, mais propre)
    await Contact.deleteMany({});
    await User.deleteMany({});

    await mongoose.connection.close();
    if (server && typeof server.close === "function") {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  afterEach(async () => {
    // Nettoie les contacts entre chaque test
    await Contact.deleteMany({});
  });

  test("POST /contacts - ajoute un contact pour l'utilisateur connecté", async () => {
    const res = await api
      .post("/contacts")
      .set("Authorization", `Bearer ${token}`)
      .send({ firstName: "John", lastName: "Doe", phone: "+33123456789" });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toMatch(
      /Votre contact John a bien été enregistré/
    );

    // Vérifie qu'un autre user ne voit pas ce contact
    const otherList = await api
      .get("/contacts")
      .set("Authorization", `Bearer ${otherToken}`);
    const existsForOther = otherList.body.some(
      (c) => c.firstName === "John" && c.lastName === "Doe"
    );
    expect(existsForOther).toBe(false);
  });

  test("GET /contacts - ne retourne que les contacts du user connecté", async () => {
    // crée 2 contacts pour user #1
    await createContactViaAPI(token, {
      firstName: "Jane",
      lastName: "Doe",
      phone: "0101010101",
    });
    await createContactViaAPI(token, {
      firstName: "Alice",
      lastName: "Wonder",
      phone: "0202020202",
    });

    // crée 1 contact pour user #2
    await createContactViaAPI(otherToken, {
      firstName: "Bob",
      lastName: "Other",
      phone: "0303030303",
    });

    // liste user #1
    const list1 = await api
      .get("/contacts")
      .set("Authorization", `Bearer ${token}`);
    expect(list1.statusCode).toBe(200);
    expect(list1.body.length).toBe(2);
    expect(
      list1.body.every((c) => ["Jane", "Alice"].includes(c.firstName))
    ).toBe(true);

    // liste user #2
    const list2 = await api
      .get("/contacts")
      .set("Authorization", `Bearer ${otherToken}`);
    expect(list2.statusCode).toBe(200);
    expect(list2.body.length).toBe(1);
    expect(list2.body[0].firstName).toBe("Bob");
  });

  test("PATCH /contacts/:id - modifie un contact du user connecté et refuse celui d'un autre user", async () => {
    // contact appartenant à user #1
    const mine = await createContactViaAPI(token, {
      firstName: "EditMe",
      lastName: "Owner1",
      phone: "0404040404",
    });

    // contact appartenant à user #2
    const others = await createContactViaAPI(otherToken, {
      firstName: "NotYours",
      lastName: "Owner2",
      phone: "0505050505",
    });

    // je peux modifier le mien
    const ok = await api
      .patch(`/contacts/${mine._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "0999999999" });
    expect(ok.statusCode).toBe(200);
    expect(ok.body).toHaveProperty("updateContact");
    expect(ok.body.updateContact.phone).toBe("0999999999");

    // je ne peux PAS modifier celui d'un autre (doit répondre 404)
    const ko = await api
      .patch(`/contacts/${others._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ phone: "0888888888" });
    expect([403, 404]).toContain(ko.statusCode); // selon ton choix, on attend 404
  });

  test("DELETE /contacts/:id - supprime mon contact et refuse celui d'un autre user", async () => {
    // contact appartenant à user #1
    const mine = await createContactViaAPI(token, {
      firstName: "DeleteMe",
      lastName: "Owner1",
      phone: "0606060606",
    });

    // contact appartenant à user #2
    const others = await createContactViaAPI(otherToken, {
      firstName: "KeepMe",
      lastName: "Owner2",
      phone: "0707070707",
    });

    // je peux supprimer le mien
    const ok = await api
      .delete(`/contacts/${mine._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(ok.statusCode).toBe(200);
    expect(ok.body.message).toBe("Contact supprimé");
    expect(ok.body).toHaveProperty("deleteContact");
    expect(ok.body.deleteContact._id).toBe(String(mine._id));

    // je ne peux PAS supprimer celui d'un autre (doit répondre 404)
    const ko = await api
      .delete(`/contacts/${others._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect([403, 404]).toContain(ko.statusCode); // selon ton choix, on attend 404
  });
});
