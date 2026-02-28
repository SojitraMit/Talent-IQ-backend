import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();

// ✅ MUST COME BEFORE ROUTES
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json()); // 🔥 THIS WAS MISSING

// ✅ Inngest route
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
