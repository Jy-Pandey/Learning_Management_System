import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLectures, getLectureById, getPublishedCourses, getUserCourses, removeLecture, searchCourse, togglePublishUnpublishCourse } from "../controllers/course.controller.js";
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/")
.get(isAuthenticated, getUserCourses)
.post(isAuthenticated, createCourse)

router.route("/search").get(isAuthenticated, searchCourse);
router.route("/published-courses").get(getPublishedCourses)
router.route("/:courseId")
.get(isAuthenticated, getCourseById)
.patch(isAuthenticated, upload.single("courseThumbnail"), editCourse)
.put(isAuthenticated, togglePublishUnpublishCourse)

// Lecture routes
router.route("/:courseId/create").post(isAuthenticated, createLecture)
router.route("/:courseId/lectures").get(isAuthenticated, getCourseLectures)
router.route("/:courseId/lectures/:lectureId")
.get(isAuthenticated, getLectureById)
.patch(isAuthenticated, editLecture)
.delete(isAuthenticated, removeLecture)

export default router;