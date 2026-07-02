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
        required: [true, "password is required"]
    }
});

export default mongoose.model("User", userSchema);