import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDatabase from "./src/config/ConnectDatabase.js";

app.listen(3000,async()=>{
    await connectDatabase()
    console.log("app is running on port 3000")
})