import mongoose from "mongoose";

const ArticleSubmissionSchema = new mongoose.Schema({
  name: String,
  email: String,
  title: String,
  content: String,
  image: String, // ✅ this must exist
  approved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true
});


export default mongoose.models.ArticleSubmission ||
  mongoose.model("ArticleSubmission", ArticleSubmissionSchema);
