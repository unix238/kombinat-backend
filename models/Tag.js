// const mongoose = require('mongoose');
import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true },
  // link: { type: String, required: true, unique: true },
});

// module.exports = mongoose.model('Tag', tagSchema);
export default mongoose.model("Tag", tagSchema);
