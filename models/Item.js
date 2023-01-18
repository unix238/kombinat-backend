const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  sizes: { type: [String], required: true },
  descriptions: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  characteristics: { type: String, required: true },
  images: { type: [String], required: true },
  tags: { type: [mongoose.Schema.Types.ObjectId], ref: 'Tag' },
  categories: { type: [mongoose.Schema.Types.ObjectId], ref: 'Category' },
  quantity: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Item', itemSchema);
