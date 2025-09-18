require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connecté à MongoDB Atlas"))
  .catch((err) => console.error("Erreur MongoDB :", err));

app.use(express.json());
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

try {
  app.listen(PORT, () => {
    console.log("Le serveur est lancé sur l'url : http://localhost:" + PORT);
  });
} catch (error) {
  console.error("Erreur lors du démarrage du serveur:", error);
}
