import mongoose from "mongoose";

export const ConnectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) {
            return;
        }
        await mongoose.connect(process.env.MONGODBURI);
        console.log("DB Connected");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error;
    }
};