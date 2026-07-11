import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("MongoDB Connected ✔");
  } catch (error) {
    console.log("MongoDB connection error ❌", error);
  }
};