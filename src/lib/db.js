import mongoose from "mongoose";
// import dotenv from "dotenv";

// dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
  } catch (err) {
    console.error("Failed to connect to DB", err);
    throw err; // Rethrow the error to be handled by the caller
  }
};
