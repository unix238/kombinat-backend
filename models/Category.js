// const mongoose = require('mongoose');
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: { type: [mongoose.Schema.Types.ObjectId], ref: "Tag" },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// module.exports = mongoose.model('Category', categorySchema);
export default mongoose.model("Category", categorySchema);
