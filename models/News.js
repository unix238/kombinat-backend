const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  subTitle: { type: String, required: true },
  secondSubTitle: { type: String },
  link: { type: String, required: true },
  isImageLeft: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('News', newsSchema);
