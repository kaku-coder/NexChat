import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenBlock from "../models/tokenBlocklisting.model.js";
import getRedisClient from "../config/redis.js";





export const registerController = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Validation: Check if fields are provided
        if (!userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        const salt = 12
        const hashPassword = await bcrypt.hash(password,salt)
        console.log(hashPassword)

        // Create a new user instance
        const newUser = new User({
            userName,
            email,
            password: hashPassword
        });

        // Save to MongoDB
        await newUser.save();

        // Generate JWT Token using newUser._id
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JSONTOKEN_Secreate,
            { expiresIn: "7d" }
        );

        // Set token cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                password
            },
            token: token
        });
        console.log(newUser+"user register sucessfully")
    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare password with hashed password in DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id },
            process.env.JSONTOKEN_Secreate,
            { expiresIn: "7d" }
        );

        // Set token cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email
            },
            token: token
        });
        console.log(user+"user login sucessfylly")
    } catch (error) {
        console.error("Error in login:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const tokenBlocklisting = async (req, res) => {
    try {
        // Token already extracted by protect middleware — just grab it
        let token;
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies?.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(400).json({ success: false, message: "No token found" });
        }

        // Decode to get expiry time (for Redis TTL)
        const decoded = jwt.verify(token, process.env.JSONTOKEN_Secreate);
        const remainingSeconds = decoded.exp - Math.floor(Date.now() / 1000);

        // 1️⃣ Save in Redis with TTL (auto-expire when token expires)
        try {
            const redis = getRedisClient();
            await redis.set(`blocklist:${token}`, "true", "EX", remainingSeconds);
            console.log("✅ Token saved to Redis blocklist");
        } catch (redisErr) {
            console.error("⚠️  Redis save failed, falling back to MongoDB only:", redisErr.message);
        }

        // 2️⃣ Save in MongoDB (permanent backup)
        await tokenBlock.create({ token });

        // Clear cookie
        res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


export const getMeController = async (req, res) => {
    try {
        // req.user is already fetched and attached by the 'protect' middleware
        res.status(200).json({
            success: true,
            user: req.user
        });
        console.log(User)
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};