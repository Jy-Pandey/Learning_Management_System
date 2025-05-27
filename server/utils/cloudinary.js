import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { asyncHandler } from "./asyncHandler.js";
dotenv.config({});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, resourceType = "image") => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });
    console.log("file uploaded on : ", response.url);

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    console.log("Error while saving on cloudinary !!", error);
    fs.unlinkSync(localFilePath); //remove the locally saved file
  }
};
const deleteFromCloudinary = async (publicId, type = "image") => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: type,
    });
    console.log(`Deleted ${type} with publicId: ${publicId}`);
  } catch (error) {
    console.error("Error while deleting from Cloudinary:", error);
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };