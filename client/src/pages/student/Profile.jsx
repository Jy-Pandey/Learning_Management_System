import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Course } from "./Course";
import {
  useLoadUserProfileQuery,
  useUpdateUserProfileMutation,
} from "@/features/api/authApi.js";
import { toast } from "sonner";

export const Profile = () => {
  
  const { data, isLoading, refetch, isError : loadProfileIsError, error : loadProfileError, } = useLoadUserProfileQuery();

  // console.log("profile data :", data);
  
  const [name, setName] = useState();
  const [profilePhoto, setProfilePhoto] = useState("");
  
  const [
    updateUserProfile,
    {
      data: updatedUser, //iske andar mera JSON as it is h
      isLoading: updatedUserIsLoading,
      isSuccess,
      isError,
      error
    },
  ] = useUpdateUserProfileMutation();

  useEffect(() => {
    if (data?.data?.user?.name) {
      setName(data.data.user.name);
    }
    if(loadProfileIsError && loadProfileError) {
      toast.error(loadProfileError.data.message);
    }
  }, [data, loadProfileIsError]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updatedUser.message || "Profile updated.");
    }
    if (isError) { // error field ke andar data field ke andar message aata hai error
      toast.error(error.data.message || "Failed to update profile");
    }
  }, [error, updatedUser, isSuccess, isError]);

  if (isLoading) return <h1 className="mt-24">Profile is Loading..</h1>;
  const { user } = data.data;

  const handleChangeProfile = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const handleUpdateUser = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("photoUrl", profilePhoto);
    const res = await updateUserProfile(formData);
    // console.log("Updated user", res);
    
  };

  return (
    <div className="max-w-4xl mx-auto px-4 my-24">
      <h1 className="font-bold text-2xl text-center md:text-left">PROFILE</h1>
      <div className="flex flex-col md:flex-row items-center md:items-center gap-8 my-8">
        <div className="flex flex-col items-center ">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-2">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center md:text-left">
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.name}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.email}
              </span>
            </h1>
          </div>
          <div className="mb-2">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100 ">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user?.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-bold text-center">
                  Edit Profile
                </DialogTitle>
                <DialogDescription className="text-center">
                  Make changes to your profile here. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    type="text"
                    placeholder={"Name"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    onChange={(e) => handleChangeProfile(e)}
                    type="file"
                    accept="image/*"
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updatedUserIsLoading}
                  onClick={handleUpdateUser}
                >
                  {updatedUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-8">
        <h1 className="font-semibold text-xl mb-8 italic">
          Courses you're enrolled in
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5">
          {user?.enrolledCourses.length === 0 ? (
            <h1 className="font-semibold text-xl ">
              You haven't enrolled yet ..
            </h1>
          ) : (
            user?.enrolledCourses.map((course) => <Course key={course?._id} course={course} />)
          )}
        </div>
      </div>
    </div>
  );
};
