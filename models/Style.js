const mongoose = require('mongoose');

const styleScheme = new mongoose.Schema({
  title: { type: String, required: true },
});

module.exports = mongoose.model('Style', styleScheme);
