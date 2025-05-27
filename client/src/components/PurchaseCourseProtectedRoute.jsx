import { useGetCourseDetailWithStatusQuery } from '@/features/api/purchaseApi';
import React, { Children } from 'react'
import { Navigate, useParams } from 'react-router-dom'

export const PurchaseCourseProtectedRoute =  ({children}) => {
  // agar tumne(user) coursePurchase kiya hai to hi tum course-progress ja sakte ho baki nahi 
  const {courseId} = useParams();
  const {data, isLoading} = useGetCourseDetailWithStatusQuery(courseId);
  // console.log("data is : ", data);
  
  let purchased;
  if (isLoading) return <p className='mt-20'>Loading...</p>;
  else{
    purchased = data?.data?.purchased;
  }
  return purchased ? children : <Navigate to={`/course-detail/${courseId}`}/>
}
