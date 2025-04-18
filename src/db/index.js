import mongoose from "mongoose";
import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import { app } from "../app.js";



const connectDB = async () =>{
try {
  const connectionInstance =  await mongoose.connect("mongodb://localhost:27017/BackendDatabase")
  console.log(`\n MongoDB connected!! DB HOST : ${connectionInstance.connection.host}`);
  app.on("error",(error)=>{
    console.log("ERRR:",error);
    throw error
  })

  app.listen(process.env.PORT ,()=>{
    console.log(`App is listening on Port ${process.env.PORT }`);
  })
} catch (error) {
    console.log("MongoDB connection error",error);
    process.exit(1)
}
}

export default connectDB;
