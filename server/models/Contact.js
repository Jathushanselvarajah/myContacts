const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true, minLength: 10, maxLength: 20 },
});

module.exports = mongoose.model("Contact", contactSchema);
