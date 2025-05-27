// import RichTextEditor from "@/components/RichTextEditor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  useEditCourseMutation,
  useGetCourseByIdQuery,
  usePublishCourseMutation,
} from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const CourseTab = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: "",
  });
  const [previewThumbnail, setPreviewThumbnail] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const { data: courseData, isLoading: courseIsLoading, refetch } =
    useGetCourseByIdQuery(courseId);
  const [editCourse, { data, isLoading, isSuccess, isError, error }] =
    useEditCourseMutation();

  const [publishCourse, {data : publishData, error : publishError, isSuccess : publishIsSuccess, refetch : publishedDataRefetch}] = usePublishCourseMutation();

  // fetch course data and to fill them in forms by default
  const course = courseData?.data;
  useEffect(() => {
    if (course) {
      setInput({
        courseTitle: course.courseTitle,
        subTitle: course.subTitle,
        description: course.description,
        category: course.category,
        courseLevel: course.courseLevel,
        coursePrice: course.coursePrice,
        courseThumbnail: "", // ye file hai aur course me url hai isliye set nhi kr skte
      });
    }
  }, [courseData]);

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Course updated");
    }
    if (isError && error) {
      toast.error(error.data.message || "Error in updating course");
    }
  }, [isSuccess, error]);

  // useEffect(() => {
  //   publishedDataRefetch();
  // }, [publishData]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handlePublishCourse = async(action) => {
    try {
      const response = await publishCourse({ courseId, query: action });
      if (response.data) {
        refetch();
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to publish or unpublish course");
    }
  }

  const handleUpdateCourse = async () => {
    const formData = new FormData();
    formData.append("courseTitle", input.courseTitle);
    formData.append("subTitle", input.subTitle);
    formData.append("description", input.description);
    formData.append("category", input.category);
    formData.append("courseLevel", input.courseLevel);
    formData.append("coursePrice", input.coursePrice);
    formData.append("courseThumbnail", input.courseThumbnail);

    const res = await editCourse({ formData, courseId });
    console.log("Response from backend :", res);
  };

  const selectCategory = (value) => {
    setInput({ ...input, category: value });
  };
  const selectCourseLevel = (value) => {
    setInput({ ...input, courseLevel: value });
  };
  // get file
  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, courseThumbnail: file });
      const fileReader = new FileReader();
      fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
      fileReader.readAsDataURL(file);
    }
  };
  if (courseIsLoading) {
    return <h1 className="mt-24 text-center">Loading...</h1>;
  }
  const isPublished = courseData?.data?.isPublished;
  const lectures = courseData?.data?.lectures

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <div>
          <CardTitle>Basic Course Information</CardTitle>
          <CardDescription className="mt-2">
            Make changes to your courses here. Click save when you're done.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <Button
          // publish hai to false bhejo mtlb unPublish kro
            onClick={() => {handlePublishCourse(isPublished? "false" : "true")}}
            disabled={lectures?.length === 0}
            variant="outline"
          >
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button>Remove Course</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-5">
          <div>
            <Label className="mb-2 ml-1">Title</Label>
            <Input
              type="text"
              name="courseTitle"
              value={input.courseTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Fullstack developer"
            />
          </div>
          <div>
            <Label className="mb-2 ml-1">Subtitle</Label>
            <Input
              type="text"
              name="subTitle"
              value={input.subTitle}
              onChange={changeEventHandler}
              placeholder="Ex. Become a Fullstack developer from zero to hero in 2 months"
            />
          </div>
          <div>
            <Label className="mb-2 ml-1">Description</Label>
            {/* <RichTextEditor input={input} setInput={setInput} /> */}
            <textarea
              className="border-2 focus:border-gray-200 p-2 focus:outine-none"
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              rows="3"
              cols="120"
            ></textarea>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="mb-3 ml-1">Category</Label>
              <Select value={input.category} onValueChange={selectCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    <SelectItem value="Next JS">Next JS</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Frontend Development">
                      Frontend Development
                    </SelectItem>
                    <SelectItem value="Fullstack Development">
                      Fullstack Development
                    </SelectItem>
                    <SelectItem value="MERN Stack Development">
                      MERN Stack Development
                    </SelectItem>
                    <SelectItem value="Javascript">Javascript</SelectItem>
                    <SelectItem value="Python">Python</SelectItem>
                    <SelectItem value="Docker">Docker</SelectItem>
                    <SelectItem value="MongoDB">MongoDB</SelectItem>
                    <SelectItem value="HTML">HTML</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-3 ml-1">Course Level</Label>
              <Select
                value={input.courseLevel}
                onValueChange={selectCourseLevel}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Course Level</SelectLabel>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Advance">Advance</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-3 ml-1">Price in (INR)</Label>
              <Input
                type="number"
                name="coursePrice"
                value={input.coursePrice}
                onChange={changeEventHandler}
                placeholder="199"
                className="w-fit"
              />
            </div>
          </div>
          <div className="mt-10">
            <Label className="mb-3 ml-1">Course Thumbnail</Label>
            <Input
              type="file"
              onChange={selectThumbnail}
              accept="image/*"
              className="w-fit"
            />
            {previewThumbnail && (
              <img
                src={previewThumbnail}
                className="w-64 my-2"
                alt="Course Thumbnail"
              />
            )}
          </div>
          <div className="flex gap-6 mt-8">
            <Button onClick={() => navigate("/admin/course")} variant="outline">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleUpdateCourse}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
