import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  

   if(
    [fullname,email,username,password].some((field)=>
        field.trim() === ""
    )
   ){
    throw new ApiError(400,"All fields are required")
   }
   const existedUser= await User.findOne({
    $or: [
      { email: email.toLowerCase() },
      { username: username.toLowerCase() }
    ]
   })

   if(existedUser){
    throw new ApiError(409,"User with email or username already exists")
   }
   const avatarLocalPath = req.files?.avatar?.[0]?.path;
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
   
   console.log('Avatar File Info:', req.files?.avatar?.[0]);
   console.log('Avatar Local Path:', avatarLocalPath);
   
   if (!avatarLocalPath) {
     throw new ApiError(400, "Avatar file is required");
   }
   console.log('Request Body:', req.body);
console.log('Request Files:', req.files);
   // Upload to Cloudinary
   const avatar = await uploadOnCloudinary(avatarLocalPath);
   
   if (!avatar || !avatar.url) {
    throw new ApiError(400, "Avatar URL is required");
  }
  
  
   
   // Optionally upload cover image to Cloudinary
   const coverImage = coverImageLocalPath
     ? await uploadOnCloudinary(coverImageLocalPath)
     : "";
   
   // Create the user
   if (!avatar?.url) {
    throw new ApiError(400, "Avatar URL is required");
  }
  
  const user = await User.create({
    fullname,
    email,
    password,
    username: username.toLowerCase(),
    avatar: avatar.url, // ✅ must be a string URL
    coverImage: coverImage?.url || "", // ✅ same here
  });
  

   // Ensure that user creation was successful
   if (!user) {
     throw new ApiError(500, "Something went wrong while registering the user");
   }
   
   const createdUser = await User.findById(user._id).select("-password -refreshToken");
   
   return res.status(201).json(
     new ApiResponse(200, createdUser, "User registered successfully")
   );
  })
   



export const login = (req, res) => {
    // Add login logic here
    res.json({ message: "Login successful" });
}