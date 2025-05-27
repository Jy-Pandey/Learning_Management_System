import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AddCourse = () => {
  const navigate = useNavigate();
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, {data, isLoading, isSuccess, error, isError}] = useCreateCourseMutation();
  
  const handleCourseCreate = async () => {
    const res = await createCourse({ courseTitle, category });
  }

  useEffect(()=> {
    if(isSuccess && data) {
      navigate("/admin/course");
      toast.success(data?.message || "course created")
    }
    if(isError && error) {
      toast.error(error?.data.message || "Error while course created")
    }
  }, [isSuccess, isError])

  const getSelectedCategory = (value) => {
    setCategory(value);
  }

  return (
    <div className="flex-1 mx-10 mt-15">
      <div className="mb-4">
        <h1 className="font-bold text-xl">
          Lets add course, add some basic course details for your new course
        </h1>
        <p className="text-sm">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Possimus,
          laborum!
        </p>
      </div>
      {/* // category */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <Label className="text-lg ml-1">Title</Label>
          <Input
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            className="w-[630px] focus-visible:ring-0 border-2 border-blue-200 shadow-sm p-4"
            placeholder="Your Course Name"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-lg ml-1">Category</Label>
          <Select className="text-red-500" onValueChange={getSelectedCategory}>
            <SelectTrigger className="w-[280px] focus-visible:ring-0 border-2 border-blue-200">
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
      </div>
      <div className="flex items-center gap-6 mt-7">
        <Button variant="outline" onClick={() => navigate("/admin/course")}>
          Back
        </Button>
        <Button disabled={isLoading} onClick={handleCourseCreate} className="bg-gray-800">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Create"
          )}
        </Button>
      </div>
    </div>
  );
}
