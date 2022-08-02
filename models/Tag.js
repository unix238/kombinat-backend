const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // link: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Tag', tagSchema);
