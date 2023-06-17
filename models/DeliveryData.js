const mongoose = require("mongoose");

const deliveryData = new mongoose.Schema({
  country: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
});

module.exports = mongoose.model("DeliveryData", deliveryData);
