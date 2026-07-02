import jwt from "jsonwebtoken";
import User from "../models/auth.model.js";
import getRedisClient from "../config/redis.js";
import tokenBlock from "../models/tokenBlocklisting.model.js";

export const protect = async (req, res, next) => {
    let token;

    // Get token from Header, Cookie, or Query
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
        token = req.cookies.token;
    } else if (req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
    }

    // 1️⃣ Check Redis first (fast) — if Redis fails, skip to MongoDB
    try {
        const redis = getRedisClient();
        const isBlockedInRedis = await redis.get(`blocklist:${token}`);
        if (isBlockedInRedis) {
            return res.status(401).json({ success: false, message: "Token is blocklisted. Please log in again." });
        }
    } catch (redisErr) {
        console.error("Redis check failed, falling back to MongoDB:", redisErr.message);
    }

    // 2️⃣ Fallback: Check MongoDB
    const isBlockedInDB = await tokenBlock.findOne({ token });
    if (isBlockedInDB) {
        return res.status(401).json({ success: false, message: "Token is blocklisted. Please log in again." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JSONTOKEN_Secreate);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found with this token" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};
