import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateLectureMutation,
  useGetCourseByIdQuery,
  useGetCourseLecturesQuery,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Lecture } from "./Lecture";

export const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const { data: courseData } = useGetCourseByIdQuery(courseId);
  const CourseTitle = courseData?.data?.courseTitle;

  const [createLecture, { data, isLoading, isSuccess, isError, error}] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureIsLoading,
    error: lectureError,
    refetch,
  } = useGetCourseLecturesQuery(courseId);

  let lectures;
  if(lectureData) {
    lectures = lectureData.data;
  }
  // console.log("Course Lectures :", lectureData);
  
  const handleCreateLecture = async () => {
    const lecRes = await createLecture({ lectureTitle, courseId });
    // console.log("lecture res : ", lecRes);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message);
    }
    if (isError && error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, error]);

  return (
    <div className="flex-1 mx-10 mt-15">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          {`Lets add lecture, add some basic course details for your "${CourseTitle}" course`}
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      <div>
        <div className="flex flex-col gap-3">
          <Label className="text-lg ml-1">Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            className="w-[630px] focus-visible:ring-0 border-2 border-blue-200 shadow-sm p-4"
            placeholder="Your Course Name"
          />
        </div>
      </div>
      <div className="flex items-center gap-6 mt-7">
        <Button variant="outline" onClick={() => navigate("/admin/course")}>
          Back to course
        </Button>
        <Button
          disabled={isLoading}
          onClick={handleCreateLecture}
          className="bg-gray-800 dark:bg-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Create lecture"
          )}
        </Button>
      </div>
      <div className="mt-10">
        {lectureIsLoading ? (
          <p>Loading lectures...</p>
        ) : lectureError ? (
          <p>Failed to load lectures.</p>
        ) : lectures.length === 0 ? (
          <p>No lectures availabe</p>
        ) : (
          lectures.map((lecture, index) => (
            <Lecture
              key={lecture._id}
              lecture={lecture}
              courseId={courseId}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
};
