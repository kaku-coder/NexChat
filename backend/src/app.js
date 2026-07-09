import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import "./config/passport.js"; // strategy register karo
import authRouter from "./routes/auth.routes.js"
import chatRouter from "./routes/chat.routes.js"

const app = express()

// ─── CORS — Frontend (5173) ko allow karo ────────────────────────────────────
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,                // cookies allow karo
}))

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize()) // passport middleware


app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRouter)
app.use("/api/chat",chatRouter)

export default app;