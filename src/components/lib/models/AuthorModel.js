import mongoose from "mongoose";

const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    socialLinks: {
        twitter: String,
        linkedin: String,
        website: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.models.Author || mongoose.model("Author", AuthorSchema);