import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../Register.css";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur d'inscription");
      nav("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <h2>Créer un compte</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "S'inscrire"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <p className="login-link">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </div>
  );
}
