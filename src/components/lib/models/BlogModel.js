import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    authorImg:{
        type:String,
        required:true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
});

export default mongoose.models.Blog || mongoose.model("Blog", Schema);

// const BlogModel = mongoose.models.blog || mongoose.model('blog',Schema);

// export default BlogModel;