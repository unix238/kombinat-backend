// const mongoose = require('mongoose');
import mongoose from "mongoose";

const brandScheme = new mongoose.Schema({
  title: { type: String, required: true },
});

// module.exports = mongoose.model('Brand', brandScheme);
export default mongoose.model("Brand", brandScheme);
