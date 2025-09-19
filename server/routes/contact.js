const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const requireAuth = require("../middlewares/requireAuth");

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Gestion des contacts
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Récupère la liste de tous les contacts
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts retournée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contacts non trouvés
 */

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Crée un nouveau contact
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact créé avec succès
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Met à jour un contact par son ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du contact à modifier
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               phone:
 *                 type: string
 *             example:
 *               firstName: Sysko
 *               lastName: Sarrat
 *               phone: +331234567891
 *     responses:
 *       200:
 *         description: Contact modifié avec succès
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Supprime un contact par son ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du contact à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contact supprimé avec succès
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - phone
 *       properties:
 *         firstName:
 *           type: string
 *           description: Prénom du contact
 *           example: Jathushan
 *         lastName:
 *           type: string
 *           description: Nom de famille du contact
 *           example: Selvarajah
 *         phone:
 *           type: string
 *           description: Numéro de téléphone du contact
 *           example: +33783576452
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.use(requireAuth);

router.get("/", contactController.getContact);
router.post("/", contactController.postContact);
router.patch("/:id", contactController.patchContact);
router.delete("/:id", contactController.deleteContact);

module.exports = router;
