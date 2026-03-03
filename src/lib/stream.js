import { StreamChat } from "stream-chat";
import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error(
    "STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables",
  );
}

export const chatClient = StreamChat.getInstance(apiKey, apiSecret); // will be used for chat functionality in the app
export const streamClient = new StreamClient(apiKey, apiSecret); // will be used for video calls

export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log("✅ Stream user upserted:", userData.id);
  } catch (err) {
    console.error("❌ Error upserting Stream user:", err);
  }
};

export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log("✅ Stream user deleted:", userId);
  } catch (err) {
    console.error("❌ Error deleting Stream user:", err);
  }
};
