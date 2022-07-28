const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: {
    type: [
      { item: mongoose.Schema.Types.ObjectId, quantity: Number, size: String },
    ],
    ref: 'Item',
    required: true,
  },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
