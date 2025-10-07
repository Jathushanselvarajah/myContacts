import React, { useEffect, useState } from "react";
import "../Contacts.css";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

interface Contact {
  _id?: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState<Contact>({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const token = localStorage.getItem("token");

  async function load() {
    try {
      const res = await fetch(`${API_URL}/contacts`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de chargement");
      setContacts(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.firstName || !form.phone) return;

    const method = editingId ? "PATCH" : "POST";
    const url = editingId
      ? `${API_URL}/contacts/${editingId}`
      : `${API_URL}/contacts`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur de sauvegarde");

      setForm({ firstName: "", lastName: "", phone: "" });
      setEditingId(null);
      load();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id?: string) {
    if (!id || !confirm("Supprimer ce contact ?")) return;
    try {
      const res = await fetch(`${API_URL}/contacts/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Erreur de suppression");
      setContacts((c) => c.filter((x) => x._id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  function handleEdit(c: Contact) {
    setForm({ firstName: c.firstName, lastName: c.lastName, phone: c.phone });
    setEditingId(c._id || null);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="contacts-container">
      <h2>Contacts</h2>

      <form onSubmit={handleSubmit} className="contact-form">
        <input
          placeholder="Prénom"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          placeholder="Nom"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <input
          placeholder="Téléphone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />
        <button type="submit">{editingId ? "Mettre à jour" : "Ajouter"}</button>
      </form>

      {contacts.length === 0 ? (
        <p className="no-contact">Aucun contact</p>
      ) : (
        <ul className="contact-list">
          {contacts.map((c) => (
            <li key={c._id} className="contact-item">
              <span>
                <strong>{c.firstName}</strong> {c.lastName} — {c.phone}
              </span>
              <div className="contact-actions">
                <button className="edit-btn" onClick={() => handleEdit(c)}>
                  Modifier
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(c._id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
