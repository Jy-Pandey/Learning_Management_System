import { CourseProgress } from "../models/courseProgress.model.js";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const updateLectureProgress = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const lectureId = req.params.lectureId;
  const userId = req.id;

  // pehle dekhenge is user ka is course me koi progress hai ya nhi
  // agar nahi hai to nya progress banayenge
  // agar progress hai to
  let courseProgress = await CourseProgress.findOne({ courseId, userId });

  if (!courseProgress) {
    courseProgress = new CourseProgress({
      courseId,
      userId,
      completed: false,
      lectureProgress: [],
    });
  }

  // Find the lecture progress in the course
  const lectureIndex = courseProgress.lectureProgress.findIndex(
    (lec) => lec.lectureId.toString() === lectureId
  );

  // Agar ye lecture progress me hai to isko marked viewed kardo nhi to ise lecture progress me add kardo
  if (lectureIndex !== -1) {
    // if lecture already exist, update its status
    courseProgress.lectureProgress[lectureIndex].viewed = true;
  } else {
    // Add new lecture progress
    courseProgress.lectureProgress.push({
      lectureId,
      viewed: true,
    });
  }

  const lectureProgressLength = courseProgress.lectureProgress.filter(
    (lec) => lec.viewed
  ).length;
  const course = await Course.findById(courseId);

  if (course.lectures.length === lectureProgressLength)
    courseProgress.completed = true; // course is completed

  await courseProgress.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        courseProgress,
        "Course progress updated successfully"
      )
    );
});

export const getCourseProgress = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.id;

  // console.log("Course Id is : ", courseId);
  
  const courseDetails = await Course.findById(courseId).populate("lectures");

  if (!courseDetails) {
    throw new ApiError(404, "Course not found");
  }
  // step-1 fetch the user course progress
  let courseProgress = await CourseProgress.findOne({
    courseId,
    userId,
  }).populate("courseId");

  // Step-2 If no progress found, return course details with an empty progress
  if (!courseProgress) {
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { courseDetails, progress: [], completed: false },
        "progress fetched"
      )
    );
  }

  // Step-3 Return the user's course progress alog with course details
  return res.status(200).json(
    new ApiResponse(200, {
      courseDetails,
      progress: courseProgress.lectureProgress,
      completed: courseProgress.completed,
    }, "Course progress fetched")
  );
});
export const markAsCompleted = asyncHandler(async(req, res) => {
  const courseId = req.params.courseId;
  const userId = req.id;

  const courseProgress = await CourseProgress.findOne({ courseId, userId });
  if (!courseProgress)
    throw new ApiError(404, "Course progress not found");

  courseProgress.lectureProgress.map(
    (lectureProgress) => (lectureProgress.viewed = true)
  );
  courseProgress.completed = true;
  await courseProgress.save();

  return res
    .status(200)
    .json(new ApiResponse(200, courseProgress, "Mark as completed successfully"));
})

export const markAsInCompleted = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.id;

  const courseProgress = await CourseProgress.findOne({ courseId, userId });
  if (!courseProgress) throw new ApiError(404, "Course progress not found");

  courseProgress.lectureProgress.map(
    (lectureProgress) => (lectureProgress.viewed = false)
  );
  courseProgress.completed = false;
  await courseProgress.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, courseProgress, "Mark as incompleted successfully")
    );
});