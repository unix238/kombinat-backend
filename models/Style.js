// const mongoose = require('mongoose');
import mongoose from "mongoose";

const styleScheme = new mongoose.Schema({
  title: { type: String, required: true },
});

// module.exports = mongoose.model('Style', styleScheme);
export default mongoose.model("Style", styleScheme);
