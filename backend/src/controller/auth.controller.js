import User from "../models/auth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import tokenBlock from "../models/tokenBlocklisting.model.js";
import getRedisClient from "../config/redis.js";
import { sendWelcomeEmail, sendLoginNotificationEmail } from "../services/mail.services.js";

// ─── Helper: Access Token (7 days) ───────────────────────────────────────────
const generateAccessToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JSONTOKEN_Secreate,
        { expiresIn: "7d" }  // Extended for chat persistence
    );
};

// ─── Helper: Refresh Token (7 days) ──────────────────────────────────────────
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }   // Long-lived
    );
};

// ─── Helper: Dono tokens set karo ────────────────────────────────────────────
const issueTokenAndCookie = async (res, user) => {
    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Refresh token DB mein save karo
    user.refreshToken = refreshToken;
    await user.save();

    // Access token → cookie (7 days)
    res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    });

    // Refresh token → alag cookie (7 days)
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
    });

    return { accessToken, refreshToken };
};




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

        // Access + Refresh token issue karo
        const { accessToken } = await issueTokenAndCookie(res, newUser);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
            },
            accessToken
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

        // Access + Refresh token issue karo
        const { accessToken } = await issueTokenAndCookie(res, user);

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email
            },
            accessToken
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


// ─── Google OAuth Callback Controller ────────────────────────────────────────
export const googleCallbackController = async (req, res) => {
    try {
        const user = req.user; // passport ne attach kiya hai

        // JWT token generate karo + cookie set karo (pass full user object and await)
        const { accessToken } = await issueTokenAndCookie(res, user);

        const isNewUser = !user.googleId || 
            (Date.now() - new Date(user.createdAt).getTime()) < 10000; // 10 sec window

        // Email bhejo (async — response block nahi karega)
        if (isNewUser) {
            sendWelcomeEmail({
                to: user.email,
                userName: user.userName,
                avatar: user.avatar,
            }).catch((err) => console.error("Welcome email error:", err.message));
        } else {
            sendLoginNotificationEmail({
                to: user.email,
                userName: user.userName,
            }).catch((err) => console.error("Login notification email error:", err.message));
        }

        // Frontend pe redirect karo with token in query
        res.redirect(`http://localhost:5173/auth/success?token=${accessToken}`);

    } catch (error) {
        console.error("Google callback error:", error);
        res.redirect("http://localhost:5173/auth/failure");
    }
};


// ─── Refresh Token Controller ─────────────────────────────────────────────────
export const refreshTokenController = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken;

        if (!incomingRefreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token not found. Please login again." });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid or expired refresh token. Please login again." });
        }

        // DB se user fetch karo + refresh token match karo
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== incomingRefreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token mismatch. Please login again." });
        }

        // Naya access token issue karo (refresh token same rahega)
        const newAccessToken = generateAccessToken(user._id);

        res.cookie("token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
        });

        return res.status(200).json({
            success: true,
            message: "Access token refreshed",
            accessToken: newAccessToken,
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};