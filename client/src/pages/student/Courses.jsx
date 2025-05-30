import React from 'react'
import { Course } from './Course';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPublishedCoursesQuery } from '@/features/api/courseApi';
import { Link } from 'react-router-dom';

export const Courses = () => {
  const {data, isLoading, isError} = useGetPublishedCoursesQuery();
  // console.log("data : ", data);

  if(isError) {
    return (<h1>Error while loading courses..</h1>)
  }
  
  const courses = data?.data;
  return (
    <div className="bg-gray-100 dark:bg-[#141414]">
      <div className="max-w-7xl mx-auto py-6 ">
        <h2 className="font-bold text-3xl text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8  px-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, index) => (
                <CourseSkeleton key={index} />
              ))
            : courses &&
              courses?.map((course) => (
                <Link key={course?._id} to={`/course-detail/${course._id}`}>
                  <Course course={course} />
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};
