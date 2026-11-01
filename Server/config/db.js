import mongoose from "mongoose"

const MONGO_URI=(process.env.MONGODB_URI).toString()

export const connectDB = async ()=>{
    mongoose.connect(MONGO_URI).then(()=>{
        console.log("Database Connected")
    }).catch((e)=>{
        console.error("DB error",e)
    })
}