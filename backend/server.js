import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

import app from "./src/app.js";
import connectDatabase from "./src/config/ConnectDatabase.js";
import Message from "./src/models/chatSave.model.js";
import User from "./src/models/auth.model.js";

// Wrap Express app with HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
  }
});

// Store user ID -> socket ID mapping
const onlineUsers = new Map();

// Socket Auth Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }
    
    const decoded = jwt.verify(token, process.env.JSONTOKEN_Secreate);
    const user = await User.findById(decoded.id).select("-password");
    
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }
    
    socket.user = user;
    next();
  } catch (err) {
    console.error("Socket authentication error:", err.message);
    next(new Error("Authentication error: Invalid session"));
  }
});

// Socket Event Handlers
io.on("connection", (socket) => {
  const userId = socket.user._id.toString();
  onlineUsers.set(userId, socket.id);
  socket.join(userId);
  console.log(`⚡ User connected: ${socket.user.userName} (${userId})`);

  // Broadcast user online status
  io.emit("user_status_changed", { userId, status: "online" });

  // Handle typing statuses
  socket.on("typing", ({ receiverId, isTyping }) => {
    io.to(receiverId).emit("typing_status", { senderId: userId, isTyping });
  });

  // Handle call signalling (voice/video calling)
  socket.on("call_user", ({ receiverId, type }) => {
    io.to(receiverId).emit("incoming_call", { 
      senderId: userId, 
      senderName: socket.user.userName, 
      senderAvatar: socket.user.avatar,
      type 
    });
  });

  socket.on("call_accepted", ({ receiverId }) => {
    io.to(receiverId).emit("call_connected");
  });

  socket.on("call_rejected", ({ receiverId }) => {
    io.to(receiverId).emit("call_denied");
  });

  socket.on("end_call", ({ receiverId }) => {
    io.to(receiverId).emit("call_terminated");
  });

  // Handle sending messages (saving to MongoDB + broadcasting)
  socket.on("send_message", async (data) => {
    const { receiverId, text, type, mediaUrl } = data;
    if (!receiverId) return;

    try {
      // Save message to MongoDB
      const newMessage = await Message.create({
        sender: userId,
        receiver: receiverId,
        text: text || "",
        type: type || "text",
        mediaUrl: mediaUrl || null,
        status: "sent"
      });

      const messageResponse = {
        _id: newMessage._id,
        sender: userId,
        receiver: receiverId,
        text: newMessage.text,
        type: newMessage.type,
        mediaUrl: newMessage.mediaUrl,
        status: newMessage.status,
        createdAt: newMessage.createdAt
      };

      // Acknowledge back to sender
      socket.emit("message_sent_ack", messageResponse);

      // Send to receiver
      io.to(receiverId).emit("receive_message", messageResponse);

      // Auto-update to delivered status after minor delay
      setTimeout(async () => {
        newMessage.status = "delivered";
        await newMessage.save();
        socket.emit("message_status_update", { messageId: newMessage._id, status: "delivered" });
        io.to(receiverId).emit("message_status_update", { messageId: newMessage._id, status: "delivered" });
      }, 500);

    } catch (err) {
      console.error("Error saving message:", err.message);
      socket.emit("message_error", { error: "Could not save message" });
    }
  });

  // Mark messages as read
  socket.on("mark_as_read", async ({ senderId }) => {
    try {
      await Message.updateMany(
        { sender: senderId, receiver: userId, status: { $ne: "read" } },
        { $set: { status: "read" } }
      );
      io.to(senderId).emit("messages_read_receipt", { readerId: userId });
    } catch (err) {
      console.error("Error reading messages:", err.message);
    }
  });

  // Delete message
  socket.on("delete_message", async ({ messageId, receiverId }) => {
    try {
      const msg = await Message.findOne({ _id: messageId, sender: userId });
      if (msg) {
        msg.text = "This message was deleted";
        msg.type = "deleted";
        await msg.save();
        
        io.to(userId).to(receiverId).emit("message_deleted", { messageId, senderId: userId });
      }
    } catch (err) {
      console.error("Error deleting message:", err.message);
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    onlineUsers.delete(userId);
    console.log(`🔌 User disconnected: ${userId}`);
    io.emit("user_status_changed", { userId, status: "offline" });
  });
});

// Start Server
server.listen(3000, async () => {
  await connectDatabase();
  console.log("App is running on port 3000");
});