import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUserCoursesQuery } from '@/features/api/courseApi';
import { Edit } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];
export const CourseTable = () => {
  const navigate = useNavigate();
  const {data, isLoading, isSuccess, isError, error} = useGetUserCoursesQuery();
  const courses = data?.data; // Array of courses
  // console.log("Courses are : ", courses);
  
  if(isLoading) return (<h1 className='mt-24 text-center'>Loading...</h1>)
  return (
    <div className="mt-20 mx-10">
      <Button onClick={() => navigate("create")}>Add course</Button>
      <h1 className="font-bold text-2xl text-center my-4">Courses</h1>
      <Table className="mt-10">
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] font-bold">Price</TableHead>
            <TableHead className="font-bold">Status</TableHead>
            <TableHead className="text-center font-bold">Title</TableHead>
            <TableHead className="text-right font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course?._id}>
              <TableCell className="font-medium">
                ₹{course?.coursePrice || "NA"}
              </TableCell>
              <TableCell>
                <Badge
                  className={`${
                    course?.isPublished ? "bg-blue-500" : "bg-red-400"
                  } px-2 py-1`}
                >
                  {course?.isPublished ? "published" : "draft"}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-center">
                {course?.courseTitle}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-gray-200 dark:bg-white dark:hover:bg-gray-200 dark:text-black"
                  onClick={() => {
                    navigate(`${course?._id}`);
                  }}
                >
                  Edit
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
