import express from "express";
import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.route("/upload-video").post(upload.single("lectureVideo"), async (req, res) => {
  try {
    const videoFileLocalPath = req.file.path;
    const result = await uploadOnCloudinary(videoFileLocalPath, "video");
    if (!result.url) {
      throw new ApiError(500, "Failed to upload video on cloudinary");
    }
    return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Video Uploaded successfully")
    )
  } catch (error) {
    throw new ApiError(500, error.message);
  }
})
export default router;