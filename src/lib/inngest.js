import { Inngest } from "inngest";
import User from "../models/User.js";
import { connectDB } from "./db.js";

export const inngest = new Inngest({
  id: "Talent-IQ",
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY, // ✅ Required for signature verification
});

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;
    const user = new User({
      clerkId: id,
      email: email_addresses[0]?.email_address || null,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    });
    await user.save();
  },
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  },
);

export const functions = [syncUser, deleteUserFromDB];
