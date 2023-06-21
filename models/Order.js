const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: {
    type: [
      {
        item: {
          item: mongoose.Schema.Types.ObjectId,
          quantity: Number,
          size: String,
        },
        size: String,
      },
    ],
    ref: "Item",
    required: true,
  },
  deliveryData: {
    type: {
      name: String,
      address: String,
      city: String,
      zip: String,
      phone: String,
      email: String,
    },
  },
  salt: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" },
  paymentID: { type: String, required: false },
  paymentDate: { type: Date, required: false },
  paymentCardPan: { type: String, required: false },
  paymentCardOwner: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
