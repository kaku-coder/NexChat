import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import "./config/passport.js"; // strategy register karo
import authRouter from "./routes/auth.routes.js"

const app = express()

// ─── CORS — Frontend (5173) ko allow karo ────────────────────────────────────
app.use(cors({
    origin: "http://localhost:5173",  // frontend URL
    credentials: true,                // cookies allow karo
}))

app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize()) // passport middleware



app.use("/api/auth",authRouter)

export default app;