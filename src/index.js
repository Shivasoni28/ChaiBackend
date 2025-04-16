 import mongoose from "mongoose";
 import express from "express"
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import userRouter from "../src/routes/user.route.js"
import { app } from "./app.js";
dotenv.config({
    path: './env'
})


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({encoded:true,limit:"16kb"}))


// route declaration
app.use("/api/v1/users",userRouter)
connectDB()

