import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./lib/inngest.js";
import { connectDB } from "./lib/db.js";
import { protectRoute } from "./middleware/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoute from "./routes/sessionRoutes.js";

dotenv.config();

const app = express();

// ✅ MUST COME BEFORE ROUTES
app.use(
  cors({ origin: "https://talent-iq-bice.vercel.app", credentials: true }),
);
app.use(express.json()); // 🔥 THIS WAS MISSING
app.use(clerkMiddleware());

// ✅ Inngest route
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  }),
);

app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoute);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  console.log("Connected to DB");
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
});
