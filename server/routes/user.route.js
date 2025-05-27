import { Router } from "express";
import { getUserProfile, loginAsInstructor, loginUser, logoutUser, registerUser, updateUserProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

// secured Routes
router.route("/logout").post(logoutUser);
router.route("/asInstructor").post(isAuthenticated, loginAsInstructor);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/update-profile").patch(
  upload.single("photoUrl"),
  isAuthenticated,
  updateUserProfile
)

export default router;