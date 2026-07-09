import Message from "../models/chatSave.model.js";
import User from "../models/auth.model.js";

// Fetch message history between two users
export const getMessagesController = async (req, res) => {
  const { userId } = req.params;
  const myId = req.user._id;

  try {
    const messages = await Message.find({
      $or: [
        { sender: myId, receiver: userId },
        { sender: userId, receiver: myId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessagesController:", error);
    res.status(500).json({ success: false, message: "Server error fetching messages" });
  }
};

// Fetch list of all registered users (excluding current user) to start chat with
export const getChatUsersController = async (req, res) => {
  const myId = req.user._id;

  try {
    // Get all users except current user
    const users = await User.find({ _id: { $ne: myId } }).select("-password -refreshToken");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error in getChatUsersController:", error);
    res.status(500).json({ success: false, message: "Server error fetching users" });
  }
};

// Update user details
export const updateProfileController = async (req, res) => {
  const myId = req.user._id;
  const { userName, avatar, bio } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      myId,
      { userName, avatar, bio },
      { new: true }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in updateProfileController:", error);
    res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};
