// const mongoose = require('mongoose');
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

// module.exports = mongoose.model('Seller', sellerSchema);
export default mongoose.model("Seller", sellerSchema);
