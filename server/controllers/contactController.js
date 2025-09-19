const Contact = require("../models/Contact.js");

const getContact = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const postContact = async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  try {
    const newContact = new Contact({ firstName, lastName, phone });
    await newContact.save();
    res.status(201).json({
      message:
        "Votre contact " + newContact.firstName + " a bien été enregistré",
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const patchContact = async (req, res) => {
  const id = req.params.id;
  try {
    const updateContact = await Contact.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({ updateContact });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const deleteContact = async (req, res) => {
  const id = req.params.id;
  try {
    const deleteContact = await Contact.findOneAndDelete({ _id: id });
    res
      .status(200)
      .json({ message: "Contact supprimé", deleteContact: deleteContact });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = { getContact, postContact, patchContact, deleteContact };
