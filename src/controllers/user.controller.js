import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async(userId)=>{
   // req body -> data
  // username or email 
  // find the user
  // password check
  // generate refresh and access token
  // send cookie
  try{
   const user= await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found when generating tokens");
   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();

   user.refreshToken= refreshToken;
   await user.save({ validateBeforeSave: false }).catch(err => {
  console.error("Save error:", err); // Log DB-level issues
});

   return {accessToken,refreshToken}
  }
  catch(error){
      console.error("Token generation error:", error); 
       throw new ApiError(500,"Something went wrong while generating Refresh And Access tokens")
  }
  
}
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
   
export const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
  // username or email 
  // find the user
  // password check
  // generate refresh and access token
  // send cookie
  try {
    const { username, email, password } = req.body;

    if (!(username || email)) {
      throw new ApiError(400, "Username or email is required");
    }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedUser, accessToken, refreshToken },
          "User logged in successfully"
        )
      );
  } catch (error) {
    console.error("🔥 Login error:", error); 
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});


export const logoutUser = asyncHandler(async (req,res)=>{
  console.log(req.user);
  await  User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken:undefined
      }
    },
    {
      new:true
    }
  )
  const options = {
    httpOnly:true,
    secure: true
   }

   return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User logged Out successfully"))
})

export const refreshAccessToken = asyncHandler(async (req,res)=>{
 const incomingRefreshToken = req.cookies.refreshToken || req.body.resfreshToken ;
 if(!incomingRefreshToken){
  throw new ApiError(401,"unauthorized request");
 }

 try {
  const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
  const user = await User.findById(decodedToken?._id)
 
  if(!user){
   throw new ApiError(401,"Invalid refreshToken")
  }
 
  if(incomingRefreshToken !== user.refreshToken){
   throw new ApiError(401,"Refresh Token is Expired or used");
  }
 
  const options ={
   httpOnly:true,
   secure:true
  }
 
  const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id);
  return res.status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("newrefreshToken",newrefreshToken,options)
  .json(new ApiResponse(200,
   {accessToken,refreshToken:newrefreshToken}
   ,"Access Token Refreshed"
  ))
 } catch (error) {
  throw new ApiError(404,error?.message || "Inavlid refresh Token")
 }
 
})
export const login = (req, res) => {
    // Add login logic here
    res.json({ message: "Login successful" });
}