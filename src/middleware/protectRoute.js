import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(), // ✅ Ensure the user is authenticated
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      const user = await User.findOne({ clerkId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in protectRoute middleware:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];
