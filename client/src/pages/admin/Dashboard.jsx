import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import React from 'react'
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi';

const Dashboard = () => {
  const {data, isLoading, isError} = useGetPurchasedCoursesQuery();
  if (isLoading) return <h1 className='mt-20'>Loading...</h1>;
  if (isError)
    return <h1 className="text-red-500 mt-20">Failed to get purchased course</h1>;

  const purchasedCourse = data?.data || [];

  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId.courseTitle,
    price: course.courseId.coursePrice,
  }));

  const totalRevenue = purchasedCourse.reduce(
    (acc, course) => acc + (course.amount || 0), 0
  );

  const totalSales = purchasedCourse.length;
  // console.log("data : ", data);
  
  // const courseData = [
  //   { name: "React", price: 3000 },
  //   { name: "JavaScript", price: 2500 },
  //   { name: "Python", price: 2800 },
  // ];
  
  return (
    <div className="grid gap-5 md:gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-12">
      <Card className="shadow-lg w-20xl hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-xl">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-blue-600">₹{totalRevenue}</p>
        </CardContent>
      </Card>
      {/* Course Prices Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="name" //"name" key wala data X-axis pe dikhana hai
                stroke="#6b7280" // axis line ka color grey
                // angle={-30} // Rotated labels for better visibility
                // textAnchor="end"
                interval={0} // Display all labels
              />
              <YAxis stroke="#6b7280" />
              <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
              // Mouse se hover karne pe data box (tooltip) dikhata hai
              <Line
                type="monotone" //Line ko smooth curve banata hai
                dataKey="price" //Line ka data "price" key se aayega (Y-axis)
                stroke="#4a90e2" // Changed color to a different shade of blue
                strokeWidth={3} //	Line ki thickness 3px
                dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard

