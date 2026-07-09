import "dotenv/config";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/auth.model.js";

const clientID = process.env.CLINT_ID?.trim();
const clientSecret = process.env.CLINT_SECREAT?.trim();

if (!clientID || !clientSecret) {
    throw new Error("❌ CLINT_ID or CLINT_SECREAT missing in .env file!");
}

passport.use(
    new GoogleStrategy(
        {
            clientID,
            clientSecret,
            callbackURL: "http://localhost:3000/api/auth/google/callback",
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check karo kya user pehle se exist karta hai (Google ID se)
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    // User already exists → sirf return karo
                    return done(null, user);
                }

                // Email se check karo (agar pehle normal register kiya tha)
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Existing user ko Google ID link karo
                    user.googleId = profile.id;
                    user.avatar = profile.photos[0]?.value || null;
                    await user.save();
                    return done(null, user);
                }

                // Bilkul naya user → create karo
                const newUser = await User.create({
                    userName: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0]?.value || null,
                });

                return done(null, newUser);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

export default passport;
