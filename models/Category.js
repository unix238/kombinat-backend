const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  // link: { type: String, required: true, unique: true },
  tags: { type: [mongoose.Schema.Types.ObjectId], ref: 'Tag' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', categorySchema);
