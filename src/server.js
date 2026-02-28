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

// 🔍 Debug middleware: Log Inngest requests (remove in production)
app.use((req, res, next) => {
  if (req.path.startsWith("/api/inngest")) {
    console.log("🔐 Inngest Request Headers:");
    console.log("  x-inngest-signature:", req.headers["x-inngest-signature"]);
    console.log(
      "  x-inngest-server-kind:",
      req.headers["x-inngest-server-kind"],
    );
    console.log(
      "  env INNGEST_SIGNING_KEY present:",
      !!process.env.INNGEST_SIGNING_KEY,
    );
    console.log("  Request body length:", JSON.stringify(req.body).length);
  }
  next();
});

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
