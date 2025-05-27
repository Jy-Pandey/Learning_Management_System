import { Course } from "../models/course.model.js";
import {Lecture} from "../models/lecture.model.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req, res)=> {

  const {courseTitle, category} = req.body;
  if(!courseTitle || !category) {
    throw new ApiError(401, "courseTitle and category is required")
  }

  await Course.create({
    courseTitle,
    category,
    creator : req?.id,
  })

  return res
  .status(200)
  .json(
    new ApiResponse(200, {},  "Course created Successfully")
  )
});

export const searchCourse = async (req, res) => {
  try {
    const { query = "", sortByPrice = "" } = req.query;

    // search criteria using $text index
    const searchCriteria = {
      isPublished: true,
      // ...(query && { $text: { $search: query } }) // if query is there (...)pread makes it optional
    };
    if (query && query.trim() !== "") {
      searchCriteria.$text = { $search: query };
    }

    // filter by category (if any)
    // if (categories.length > 0) {
    //   searchCriteria.category = { $in: categories };
    // }

    // sorting
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1;
    } else if (sortByPrice === "high") {
      sortOptions.coursePrice = -1;
    } 
    else if(query) {
      // relevance sort by default
      sortOptions.score = { $meta: "textScore" };
    }

    // search and populate creator name/photo
    const courses = await Course.find(
      searchCriteria,
      query ? { score: { $meta: "textScore" } } : {}
    )
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
      error: error.message,
    });
  }
};

const getUserCourses = asyncHandler(async (req, res) => {
  const userId = req.id;
  const courses = await Course.find({creator : userId});
  if(!courses) {
    throw new ApiError(400, "No courses found")
  }

  return res
  .status(200) 
  .json(
    new ApiResponse(200, courses, "User Courses fetched succefully")
  )
})
const getPublishedCourses = asyncHandler(async (req, res) => {
  const courses = await Course.aggregate([
    {
      $match: {
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator",

        pipeline: [
          {
            $project: {
              name: 1,
              photoUrl: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$creator",
    },
  ]);

  if(!courses) {
    throw new ApiError(400, "No publish courses are available")
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, courses, "Published courses fetched successfully")
    );
})
const editCourse = asyncHandler( async (req, res) => {
  const courseId = req.params.courseId;
  const {courseTitle, subTitle, description, category, courseLevel, coursePrice} = req.body;
  const thumbnailLocalPath = req.file?.path;

  const course = await Course.findById(courseId);
  if(!course) {
    throw new ApiError(404, "Course not found")
  }

  if(course.creator.toString() !== req.id.toString()) {
    throw new ApiError(404, "You can't edit this course, you are not the owner");
  }
  
  // agar thumbnail new upload kiya hai to
  let thumbnail;
  if(thumbnailLocalPath) {
    if(course.courseThumbnail) {
      // agar thumbnail hai to purana dlt kro nya add karo
      const thumbnailPublicId = course.courseThumbnail.split("/").pop().split(".")[0]; 
      await deleteFromCloudinary(thumbnailPublicId);
    }
    //upload new
    thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if(!thumbnail.url) {
      throw new ApiError(500, "Failed to upload thumbnail on cloudinary");
    }
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId, 
  {
    $set : {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail : thumbnail?.url
    }
  },
  {new : true}
  );

  return res.status(200)
  .json(
    new ApiResponse(200, updatedCourse, "Course updated successfullly")
  )

})

const getCourseById = asyncHandler(async(req, res) => {
  const {courseId} = req.params;
  // course can have - how many purchased this , views, ratings
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200, course, "Course fetched Successfully")
  )
})

// Lecture
const createLecture = asyncHandler(async (req, res) => {
  const {lectureTitle} = req.body;
  const {courseId} = req.params;
  
  if(!lectureTitle || !courseId) {
    throw new ApiError(401, "Lecture title is required");
  }
  const course = await Course.findById(courseId);
  if(!course) {
    throw new ApiError(404, "Course not found");
  }

  const lecture = await Lecture.create({
    lectureTitle,
  })

  // add lecture to course
  course.lectures.push(lecture._id);
  await course.save();

  return res
  .status(200)
  .json(
    new ApiResponse(201, lecture, "Lecture created successfully")
  )
})

const getCourseLectures = asyncHandler(async(req, res) => {
  const {courseId} = req.params;
  // course me jo lectures array hai uske andar sare lecture documents aa jayenge with detail
  const course = await Course.findById(courseId).populate("lectures");
  if(!course) {
    throw new ApiError(404, "Course not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(201, course.lectures, "Course Lecture fetched successfully"));
})

const editLecture = asyncHandler(async (req, res) => {
  const {lectureTitle, videoInfo , isPreviewFree} = req.body;
  const {courseId, lectureId} = req.params;

  // console.log("Video Info", videoInfo);
  
  if(!lectureTitle) {
    throw new ApiError(401, "All fields are required");
  }
  const lecture = await Lecture.findById(lectureId);
  if(!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  // update fields
  const updatedLecture = await Lecture.findByIdAndUpdate(
    lectureId,
    {
      $set: {
        lectureTitle,
        videoUrl: videoInfo?.videoUrl,
        publicId: videoInfo?.publicId,
        isPreviewFree: isPreviewFree,
      },
    },
    { new: true }
  );

  if(!updatedLecture) {
    throw new ApiError(500, "Failed to Edit lecture")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, updatedLecture, "Lecture updated successfully")
  )
})
const getLectureById = asyncHandler(async(req, res) => {
  const { lectureId } = req.params;
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "Lecture updated successfully"));
})
const removeLecture = asyncHandler(async (req, res) => {
  const {courseId, lectureId } = req.params;
  const course = await Course.findById(courseId)

  const lecture = await Lecture.findByIdAndDelete(lectureId)
  if (!course) {
    throw new ApiError(404, "course not found");
  }
  if (!lecture) {
    throw new ApiError(404, "Failed to delete lecture");
  }

  // Delete lecture video from cloudinary
  if(lecture.publicId) {
    await deleteFromCloudinary(lecture.publicId, "video")
  }

  // remove lecture from course
  await Course.findByIdAndUpdate(
    courseId,
    {
      $pull : {
        lectures : lectureId
      }
    },
  )
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Lecture deleted successfully"));
});

const togglePublishUnpublishCourse = asyncHandler(async(req, res) => {
  const { courseId } = req.params;
  const { publish } = req.query;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "course not found");
  }

  // publish status based on the query paramter
  course.isPublished = publish === "true";
  await course.save();

  const publishStatus = course.isPublished? "published" : "unpublished"
  return res
  .status(200)
  .json(
    new ApiResponse(200, {}, `Course is ${publishStatus} successfully`)
  )
})
export {
  createCourse,
  getUserCourses,
  editCourse,
  getCourseById,
  createLecture,
  getCourseLectures,
  editLecture,
  getLectureById,
  removeLecture,
  togglePublishUnpublishCourse,
  getPublishedCourses,
};
