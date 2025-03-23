import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"
import { userRoute } from "./route/userRoutes.js"
import { studentRoute } from "./route/studentRoute.js"

const app=express()
dotenv.config()
app.use(express.json())
app.use(cors({
    origin:"https://student-manangement-frontend.vercel.app",
    credentials:true
}))
app.use("/User",userRoute)
app.use("/student",studentRoute)
app.get("/",(req,res)=>{
    res.send("hello this is student management web")
})





app.listen(process.env.PORT,()=>{
    connectDB()
    console.log(`port running on ${process.env.PORT}`)
})

