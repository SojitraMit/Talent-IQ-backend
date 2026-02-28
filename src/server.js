import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB()
  .then(() => {
    console.log("Connected to DB...");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}...`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
