require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connecté à MongoDB Atlas"))
  .catch((err) => console.error("Erreur MongoDB :", err));

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "myContacts",
      version: "1.0.0",
      description: "Swagger pour myContacts",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/auth", authRoutes);
app.use("/contacts", contactRoutes);

try {
  app.listen(PORT, () => {
    console.log("Le serveur est lancé sur l'url : http://localhost:" + PORT);
  });
} catch (error) {
  console.error("Erreur lors du démarrage du serveur:", error);
}
