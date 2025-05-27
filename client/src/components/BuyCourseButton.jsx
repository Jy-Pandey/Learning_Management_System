import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { useCreateCheckoutSessionMutation } from '@/features/api/purchaseApi'
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const BuyCourseButton = ({ courseId }) => {
  const [
    createCheckoutSession,
    { data, isLoading, isSuccess, isError, error },
  ] = useCreateCheckoutSessionMutation();

  const handleCoursePurchase = async () => {
    await createCheckoutSession(courseId)
  }
  if(data) {
    console.log("Session url getting in frontend", data?.data?.url);
  }

  useEffect(() => {
    if (isSuccess) {
      if (data?.data?.url) {
        window.location.href = data.data.url; // Redirect to stripe checkout url
      } else {
        toast.error("Invalid response from server.");
      }
    }
    if (isError) {
      toast.error(error?.data?.message || "Failed to create checkout session");
    }
  }, [data, isSuccess, isError, error]);

  return (
    <Button
      disabled={isLoading}
      onClick={handleCoursePurchase}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Please wait
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
};
