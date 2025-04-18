import {asyncHandler} from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async(req,res)=>{
   // get user details from frontend
   // validation -not empty
   // check if user already exists:username,email
   //check for images,check for avatar
   //upload them to cloudinary,avatar
   // create user object -create entry in db
   // remove password and refresh token fields from response
   // check for user creation
   //return response to frontend

   const {fullname,email,username,password}= req.body
   console.log("fullname:",fullname)
   console.log("email:",email)
   console.log("username:",username)
   console.log("password:",password)
  
   res.status(201).json({
    success: true,
    message: "User registereddd successfully",
    data: {
        fullname,
        email,
        username,
    }
});
})


export const login = (req, res) => {
    // Add login logic here
    res.json({ message: "Login successful" });
};