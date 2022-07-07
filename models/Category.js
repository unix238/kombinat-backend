const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Category', categorySchema);
