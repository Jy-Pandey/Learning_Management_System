import { BuyCourseButton } from '@/components/BuyCourseButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi';
import { BadgeInfo, Lock, PlayCircle } from 'lucide-react';
import React from 'react'
import ReactPlayer from 'react-player';
import { useNavigate, useParams } from 'react-router-dom';

export const CourseDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const courseId = params.courseId;

  const {data, isLoading, isError} = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) return <h1 className='mt-15'>Loading...</h1>;
  if (isError) return <h1 className="mt-15">Failed to load course details</h1>;

  const course = data?.data?.course;
  const purchased = data?.data?.purchased;

  const handleCourseProgress = () => {
    if(purchased) {
      navigate(`/course-progress/${courseId}`)
    }
  }

  return (
    <div className="mt-18 space-y-4">
      <div className="bg-[#2D2F31] dark:bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h2 className="font-bold text-2xl md:text-3xl">
            {course?.courseTitle}
          </h2>
          <p className="text-base md:text-lg">{course?.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {course?.creator.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm mt-2">
            <BadgeInfo size={16} />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p>Students enrolled: {course?.enrolledStudents.length}</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="font-sm font-semibold">
            {course?.description}
            Technology has rapidly transformed the way we live, work, and
            connect. From smartphones to AI, our world is more digital than
            ever. In the midst of all this progress, it's important to pause and
            reflect. Are we using these tools to enrich our lives, or are we
            becoming too dependent? Balance is the key.
          </p>
          <Card className="mt-10">
            <CardHeader>
              <CardTitle className="font-md">Course Content</CardTitle>
              <CardDescription>
                {course?.lectures.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {lecture?.isPreviewFree ? (
                      <PlayCircle size={14} />
                    ) : (
                      <Lock size={14} />
                    )}
                  </span>
                  <p>{lecture?.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card className="space-y-0">
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer
                  width="100%"
                  height={"100%"}
                  url={course?.lectures[0]?.videoUrl}
                  controls={true}
                />
              </div>
              <h1 className="font-bold text-xl">
                {course?.lectures[0]?.lectureTitle}
              </h1>
              <Separator className="my-2" />
              
              <div className="flex gap-4">
                <h1 className="text-lg md:text-xl text-red-700 font-semibold line-through">
                  ₹{course?.coursePrice + 200}
                </h1>
                <h1 className="text-lg md:text-xl font-semibold">
                  ₹{course?.coursePrice}
                </h1>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              {purchased ? (
                <Button
                  // variant="destructive"
                  onClick={handleCourseProgress}
                  className="w-full bg-green-500 text-white hover:bg-green-600"
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
