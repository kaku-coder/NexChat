import express from "express";
import passport from "../config/passport.js";
import { registerController, loginController, getMeController, tokenBlocklisting, googleCallbackController, refreshTokenController } from "../controller/auth.controller.js";
import { registerRules, loginRules, validate } from "../middlewares/validation.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ─── Normal Auth Routes ───────────────────────────────────────────────────────
router.post("/register", registerRules, validate, registerController);
router.post("/login", loginRules, validate, loginController);
router.get("/getMe", protect, getMeController);
router.post("/logout", protect, tokenBlocklisting);
router.post("/refresh", refreshTokenController);  // Access token silently renew karo

// ─── Google OAuth Routes ──────────────────────────────────────────────────────
// Step 1: User ko Google login page pe bhejo
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Step 2: Google callback ke baad yahan aata hai
router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/api/auth/google/failure" }),
    googleCallbackController
);

// Google login failure
router.get("/google/failure", (req, res) => {
    res.status(401).json({ success: false, message: "Google authentication failed" });
});

export default router;