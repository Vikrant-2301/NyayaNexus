import mongoose from "mongoose";

export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://kingsaksham90:Saksham123@cluster0.vafjotx.mongodb.net/blog-app');
    console.log("DB Connected");
}