import express from "express"
import cors from "cors"
import "dotenv/config"

const PORT = process.env.PORT || 5000
const app= express()

// Middlewares
app.use(cors())
app.use(express.json())

// DB

// Routes

app.get("/",(req,res)=>{
    res.json({
        message: "Server Started"
    })
})

app.listen(PORT,()=>{
    console.log("Server Started")
})