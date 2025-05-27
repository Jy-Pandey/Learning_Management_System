import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowLeftCircle } from 'lucide-react';
import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { LectureTab } from './LectureTab';
import { useGetCourseByIdQuery } from '@/features/api/courseApi';

export const EditLecture = () => {
  const params = useParams();
  const courseId = params.courseId;

  const { data: courseData } = useGetCourseByIdQuery(courseId);
  const CourseTitle = courseData?.data?.courseTitle;
  return (
    <div className="mt-15">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button
              size="ghost"
              variant="outline"
              className="rounded-full flex items-center bg-gray-50 p-1"
            >
              <ArrowLeft size={10} />
            </Button>
          </Link>
          <h1 className="font-bold text-xl">{`Update Your Lecture for "${CourseTitle}" course`}</h1>
        </div>
      </div>
      <LectureTab />
    </div>
  );
}
