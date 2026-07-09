import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "username is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true,"email is already exists"],
        trim: true
    },
    password: {
        type: String,
        // Not required for Google OAuth users
    },
    googleId: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: "Hey there! I am using NexChat."
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);