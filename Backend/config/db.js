import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const DB_URL = process.env.MONGO_URL;
    await mongoose.connect(DB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("error while connecting");
    console.log(error.message);
  }
}
