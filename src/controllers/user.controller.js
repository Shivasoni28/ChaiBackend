import {asyncHandler} from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async(req,res)=>{
    res.status(200).json({
        success:true,
        message:"User registered successfully"
    })
})


export const login = (req, res) => {
    // Add login logic here
    res.json({ message: "Login successful" });
};