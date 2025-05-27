import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card'
import React from 'react'

export const Course = ({course}) => {
  return (
    <Card className="overflow-hidden rounded-lg dark:bg-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-left pt-0 gap-1">
      <div className="bg-orange-300">
        <img
          src={
            course?.courseThumbnail ||
            "https://i.ytimg.com/vi/b9eMGE7QtTk/maxresdefault.jpg"
          }
          alt="Course"
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="space-y-3 px-4">
        <h1 className="hover:underline font-bold text-left text-lg truncate">
          {course?.courseTitle}
        </h1>
        <div className="flex justify-between">
          <div className="flex gap-2 items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  course?.creator?.photoUrl || "https://github.com/shadcn.png"
                }
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1 className="font-md text-sm">{course?.creator?.name}</h1>
          </div>
          <Badge className="bg-blue-600 text-white px-3 py-1 text-xs rounded-full">
            {course?.courseLevel}
          </Badge>
        </div>
        <div className="flex justify-between">
          <div className="text-md font-semibold flex gap-4">
            <span className="text-red-600 line-through font-normal">
              ₹{course?.coursePrice + 200}
            </span>
            <span>₹{course?.coursePrice}</span>
            {/* <span>Hindi</span> */}
          </div>
          <div className='text-sm  flex items-end'>
            <span className='font-semibold'>{course?.lectures.length}+</span>
            <span className="italic hover:underline">Lectures</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
