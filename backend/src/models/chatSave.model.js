import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender is required"]
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Receiver is required"]
  },
  text: {
    type: String,
    default: ""
  },
  type: {
    type: String,
    enum: ["text", "image", "call_log", "deleted"],
    default: "text"
  },
  mediaUrl: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent"
  }
}, { timestamps: true });

export default mongoose.model("Message", messageSchema);
