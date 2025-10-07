# MyContacts

Gestionnaire de contacts full‑stack (React + Vite + TypeScript côté front, Node.js / Express / MongoDB côté back) avec authentification JWT et documentation Swagger.

---
## 🚀 Déploiements en ligne
Frontend (Netlify): https://mycontacts92.netlify.app/register  
Backend Swagger (Render): https://mycontacts-gogq.onrender.com/api-docs/

---
## 🧪 Compte de test
Vous pouvez utiliser les identifiants suivants pour vous connecter (ou créer un nouvel utilisateur) :

Email: `jathus@email.fr`  
Mot de passe: `1234`

---
## 🛠️ Stack technique
**Frontend**: React , Vite, TypeScript, React Router  
**Backend**: Node.js, Express , MongoDB (Mongoose), JWT, Bcrypt  
**Docs**: Swagger  
**Tests**: Jest + Supertest

---
## ⚙️ Installation locale
### 1. Cloner le repo
```bash
git clone https://github.com/Jathushanselvarajah/myContacts.git
cd myContacts
```
### 2. Backend
Créer un fichier `.env` dans `server/` :
```
MONGO_URI=mongodb+srv://jathus_db_user:1234592@mycontacts.p4a99zh.mongodb.net/?retryWrites=true&w=majority&appName=MyContacts
JWT_SECRET=mon_jwt_secret
PORT=5000
```
Installer & lancer :
```bash
cd server
npm install
npm start
```
### 3. Frontend
Créer un fichier `client/.env` (optionnel si fallback localhost) :
```
VITE_API_BASE_URL=http://localhost:5000
```
Installer & lancer :
```bash
cd client
npm install
npm run dev
```
Accéder à l'app : http://localhost:5173

---
## 📘 Scripts principaux
Backend:
- `npm start` : lance l'API Express
- `npm test`  : lance les tests Jest

Frontend:
- `npm run dev` : mode développement (Vite)
- `npm run build` : build de production

---
## 🔐 Authentification
- Inscription: `POST /auth/register` { email, password }
- Connexion: `POST /auth/login` → retourne un token JWT
- Les routes `/contacts` nécessitent le header: `Authorization: Bearer <token>`

---
## 📑 Endpoints principaux
Base API (prod): `https://mycontacts-gogq.onrender.com`  
Swagger: `/api-docs`

| Méthode | Endpoint | Protégé | Description |
|---------|----------|---------|-------------|
| POST | /auth/register | ❌ | Créer un utilisateur |
| POST | /auth/login | ❌ | Se connecter (JWT) |
| GET | /contacts | ✅ | Lister les contacts |
| POST | /contacts | ✅ | Créer un contact |
| PATCH | /contacts/:id | ✅ | Mettre à jour un contact |
| DELETE | /contacts/:id | ✅ | Supprimer un contact |

> Les schémas détaillés sont visibles dans Swagger.

---
## 🧾 Modèle Contact (Swagger)
```json
{
  "firstName": "Jathushan",
  "lastName": "Selvarajah",
  "phone": "+33783576452"
}
```

---
## 🔄 Flux d'utilisation rapide
1. Register (si pas déjà créé)
2. Login → récupérer le token
3. Appeler les endpoints `/contacts` avec le header Authorization
4. Gérer vos contacts depuis l'interface front

---
## 🌍 Déploiement
### Front (Netlify)
- Build command: `npm install && npm run build`
- Publish directory: `dist` (défini dans `netlify.toml`)
- Variable d'env: `VITE_API_BASE_URL=https://mycontacts-gogq.onrender.com`

### Back (Render)
- Web Service Node
- Start command: `node index.js`
- Variables: `MONGO_URI`, `JWT_SECRET`

---
## 📫 Contact
Auteur: Jathushan  
Swagger: https://mycontacts-gogq.onrender.com/api-docs/  
Frontend: https://mycontacts92.netlify.app/
