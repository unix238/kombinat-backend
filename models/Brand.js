const mongoose = require('mongoose');

const brandScheme = new mongoose.Schema({
  title: { type: String, required: true },
});

module.exports = mongoose.model('Brand', brandScheme);
