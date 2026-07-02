import mongoose from "mongoose";

const tokenBlocklistingSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "token is required for blocklisting"]
    }
}, {
    timestamps: true
});

const tokenBlock = mongoose.model("tokenBlock", tokenBlocklistingSchema);
export default tokenBlock;