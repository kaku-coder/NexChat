import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { 
  getMessagesController, 
  getChatUsersController, 
  updateProfileController 
} from "../controller/chat.controller.js";

const router = express.Router();

// Get list of other chat contacts
router.get("/users", protect, getChatUsersController);

// Get message history with a user
router.get("/messages/:userId", protect, getMessagesController);

// Update profile details
router.put("/profile", protect, updateProfileController);

export default router;
