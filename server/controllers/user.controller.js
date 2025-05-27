import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateAccessToken } from "../utils/generateAccessToken.js";

const registerUser = asyncHandler( async (req, res) => {
  
  const {email, name, password} = req.body;
  if(!email || !name || !password) {
    throw new ApiError(400, "All fields are required");
  }
  
  const user = await User.findOne({email})
  if(user) {
    throw new ApiError(400, "User already exist");
  }

  const createduser = await User.create({
    name,
    email,
    password,
  })
  if(!createduser) {
    throw new ApiError(500, "Failed to create an account");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, createduser, "User created successfully")
  )
})

const loginUser = asyncHandler( async (req, res) => {

  const {email, password} = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({email});
  if(!user) {
    throw new ApiError(404, "User doesnot exist")
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if(!isPasswordValid) {
    throw new ApiError(401, "Incorrect field");
  }

  const accessToken = await generateAccessToken(user);

  const options = {
    httpOnly : true,
    secure : true,
  }
  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .json(
    new ApiResponse(200, {user, accessToken}, "User logged in Successfully")
  )
})

const logoutUser = asyncHandler( async (req, res) => {
  // clear the cookie to logout user
  const options = {
    httpOnly: true, //The cookie cannot be accessed or modified using JavaScript prevent XSS attack
    secure: true, //The cookie is only sent over HTTPS connections from browser to server.
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
})
const loginAsInstructor = asyncHandler(async(req, res) => {
  const user = await User.findByIdAndUpdate(
    req.id,
    {
      $set: {
        role: "instructor",
      },
    },
    { new: true }
  );

  return res.
  status(200)
  .json(
    new ApiResponse(200, user, "Login as instructor successfully")
  )

})
const getUserProfile = asyncHandler( async (req, res)=> {
  const userId = req.id;
  if (!userId) {
    throw new ApiError(404, "Unauthorized request!!");
  }
  const user = await User.findById(req?.id)
    .populate({ path: "enrolledCourses" , populate : {path : "creator"}})
    .select(" -password");
  // console.log("user is", user);
  
  if(!user) {
    throw new ApiError(401, "User not found");
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200, {user : user}, "User profile fetched Successfully")
  )
})

const updateUserProfile = asyncHandler( async(req, res) => {
  const {name} = req.body;
  const userId = req.id;

  if(name === "") {
    throw new ApiError(401, "All fields are required");
  }

  const user = await User.findById(userId);
  if(!user) {
    throw new ApiError(404, "User not Found");
  }
  const profileLocalPath = req.file?.path;
  if (!profileLocalPath) {
    throw new ApiError(400, "Profile photo is required");
  }

  // delete previoud profile photo and update new one
  if(user.photoUrl) {
    const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
    await deleteFromCloudinary(publicId);
  }

  const profilePhoto = await uploadOnCloudinary(profileLocalPath);
  if (!profilePhoto?.url) {
    throw new ApiError(500, "Cloudinary upload failed");
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set : {
        name,
        photoUrl : profilePhoto?.url,
      }
    },
    {new : true}
  ).select("-password")

  return res
  .status(200)
  .json(
    new ApiResponse(200, {user : updatedUser}, "User profile updated succefully")
  )
})
export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  loginAsInstructor,
};