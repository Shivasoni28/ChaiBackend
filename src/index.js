import express from "express"
import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
import userRouter from "../src/routes/user.route.js"


dotenv.config({
    path: './env'
})

// route declaration

app.use("/api/v1/users",userRouter)

  
 
  connectDB()
