 import mongoose from "mongoose";
 
import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
    path: './env'
})


connectDB()
.then(()=>{
    application.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Mongo DB connection Failed !!!",err);
})

