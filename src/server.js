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
    const signature = req.headers["x-inngest-signature"];
    const body = JSON.stringify(req.body);
    console.log("\n🔐 Inngest Sync Request:");
    console.log("  Path:", req.path);
    console.log("  Method:", req.method);
    console.log("  Signature present:", !!signature);
    console.log(
      "  Signature first 20 chars:",
      signature?.substring(0, 20) || "NONE",
    );
    console.log("  Headers:", {
      "x-inngest-server-kind": req.headers["x-inngest-server-kind"],
      "x-inngest-signature":
        req.headers["x-inngest-signature"]?.substring(0, 30) + "...",
      "content-type": req.headers["content-type"],
    });
    console.log("  Body keys:", Object.keys(req.body));
    console.log("  Body size:", body.length, "bytes");
    console.log(
      "  INNGEST_SIGNING_KEY env:",
      !!process.env.INNGEST_SIGNING_KEY,
    );
    console.log(
      "  INNGEST_SIGNING_KEY length:",
      process.env.INNGEST_SIGNING_KEY?.length || 0,
    );
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
