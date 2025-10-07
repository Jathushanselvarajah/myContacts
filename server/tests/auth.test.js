const request = require("supertest");
const mongoose = require("mongoose");
require("dotenv").config();

// 1) Démarrer le serveur (side-effect d'index.js)
//    On ne dépend PAS de sa valeur de retour, juste de l'effet.
let server; // au cas où index.js exporte l'instance http.Server
beforeAll(async () => {
  process.env.NODE_ENV = "test";
  server = require("../index"); // démarre le serveur si index.js fait listen()

  // Connexion à la base de tests
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  // Si index.js exporte un server http, on le ferme proprement
  if (server && typeof server.close === "function") {
    await new Promise((resolve) => server.close(resolve));
  }
});

// 2) Utiliser Supertest sur une URL (serveur déjà en écoute)
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.TEST_BASE_URL || `http://localhost:${PORT}`;
const api = request(BASE_URL);

// Charger le modèle après la connexion
const User = require("../models/User");

describe("Auth API", () => {
  afterEach(async () => {
    await User.deleteMany();
  });

  test("POST /auth/register - crée un nouvel utilisateur", async () => {
    const res = await api
      .post("/auth/register")
      .send({ email: "test@example.fr", password: "123456" });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Utilisateur créé avec succès");
  });

  test("POST /auth/register - refuse email déjà utilisé", async () => {
    await User.create({ email: "test@example.fr", password: "123456" });
    const res = await api
      .post("/auth/register")
      .send({ email: "test@example.fr", password: "abcdef" });
    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("Email déjà utilisé");
  });

  test("POST /auth/login - connexion réussie", async () => {
    await User.create({ email: "login@example.fr", password: "123456" });
    const res = await api
      .post("/auth/login")
      .send({ email: "login@example.fr", password: "123456" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
