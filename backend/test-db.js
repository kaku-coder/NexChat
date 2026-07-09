import mongoose from "mongoose";
import User from "./src/models/auth.model.js";
import Message from "./src/models/chatSave.model.js";

const uri = "mongodb+srv://prakash:MmeD7JehhtVGKgxQ@chat.sghpg6p.mongodb.net/chat-db";

async function test() {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");

    const userCount = await User.countDocuments();
    console.log("Total users in DB:", userCount);

    const users = await User.find().limit(5);
    console.log("Sample Users:", users.map(u => ({ id: u._id, name: u.userName, email: u.email, avatar: u.avatar })));

    const messageCount = await Message.countDocuments();
    console.log("Total messages in DB:", messageCount);

    const messages = await Message.find().limit(5);
    console.log("Sample Messages:", messages);

    await mongoose.disconnect();
    console.log("Disconnected successfully!");
  } catch (err) {
    console.error("Test failed:", err);
  }
}

test();
