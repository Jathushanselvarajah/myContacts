const Contact = require("../models/Contact.js");

const getContact = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const postContact = async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  try {
    const newContact = new Contact({
      firstName,
      lastName,
      phone,
      user: req.user.id,
    });
    await newContact.save();
    res.status(201).json({
      message: `Votre contact ${newContact.firstName} a bien été enregistré`,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const patchContact = async (req, res) => {
  const id = req.params.id;
  try {
    const updateContact = await Contact.findOneAndUpdate(
      { _id: id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!updateContact) {
      return res.status(404).json({ message: "Contact non trouvé" });
    }

    res.status(200).json({ updateContact });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const deleteContact = async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Contact.findOneAndDelete({
      _id: id,
      user: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Contact non trouvé" });
    }

    res.status(200).json({
      message: "Contact supprimé",
      deleteContact: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { getContact, postContact, patchContact, deleteContact };
