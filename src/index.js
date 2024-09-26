 import mongoose from "mongoose";
 
import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
    path: './env'
})

connectDB()
/*(async()=> {
 try {
  await mongoose.connect("mongodb://localhost:27017")  ; 
  console.log("database connection");
 } catch (error) {
    console.error("ERROR:",error)
    throw err
 }   


})()
 */