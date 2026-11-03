import express from "express"
import cors from "cors"
import "dotenv/config"
import { connectDB } from "./config/db.js"
import authRouter from "./routes/authRoutes.js";

const PORT = process.env.PORT || 5000
const app= express()



// Middlewares
app.use(cors())
app.use(express.json())

// DB

connectDB()

// Routes
app.use("/api/auth",authRouter)

app.get("/",(req,res)=>{
    res.json({
        message: "Server Started"
    })
})

app.listen(PORT,()=>{
    console.log("Server Started")
})