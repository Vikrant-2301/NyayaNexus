// BlogModel.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  name: String,
  content: String,
  approved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
    default: null,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  image: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  views: { type: Number, default: 0 },
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Blog || mongoose.model("Blog", blogSchema);
