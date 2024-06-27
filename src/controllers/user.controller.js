import {asyncHandler}from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const generateAccessAndRefreshTokens = async(userId)=>{
    try {
      const user  =  await User.findById(userId)
      const accessToken=  user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      // bar 2 password required n ho user sek
      user.refreshToken = refreshToken
      await user.save({validateBeforeSave : false})
  
      return {accessToken,refreshToken}
       
    } catch (error) 
    {
      throw new ApiError(500,"Something went wrong while genrating refresh and refresh token and access token")
    }
  }
  
const registerUser = asyncHandler(async (req,res)=>{
    // res.status(200).json({
    //    message:"okk"
    // })

    const {fullname,email,username,password}=  req.body

    if(
        [fullname,email,username,password].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are reqired")
    }
    
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exist")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar){
        throw new ApiError(400,"avatar file is required")
    }

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        email,
        password,
        username:username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registration the user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
       )
})
//   login user
 const loginUser = asyncHandler(async (req,res)=>{
    const {email,username,password} = req.body
    if(!username && !email){
        throw new ApiError(400,"username or email is required")
    }

    const user = await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"user does not exist")
    }
    const isPasswordValid =await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401,"password is not correct")
    }
    const loggedInUser = await User.findById(user._id).
    select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
             "User logged in Successfull"
        )
    )
 })

export {registerUser}