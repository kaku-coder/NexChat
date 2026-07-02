import mongoose from "mongoose";


const connectDatabase = ()=>{
    mongoose.connect("mongodb+srv://prakash:MmeD7JehhtVGKgxQ@chat.sghpg6p.mongodb.net/chat-db")
    console.log("database connected successfully")
}

export default connectDatabase