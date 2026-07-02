import express from "express";
import { registerController, loginController, getMeController, tokenBlocklisting } from "../controller/auth.controller.js";
import { registerRules, loginRules, validate } from "../middlewares/validation.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerRules, validate, registerController);
router.post("/login", loginRules, validate, loginController);
router.get("/getMe", protect, getMeController);
router.post("/logout", protect, tokenBlocklisting);

export default router;