import { Menu, School } from "lucide-react";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DarkMode } from "../DarkMode.jsx";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import {
  useLoginAsInstructorMutation,
  useLogoutUserMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  // console.log("user is", user);

  const navigate = useNavigate();
  const [logoutUser, { data, isLoading, isSuccess, isError, error }] =
    useLogoutUserMutation();
  const [
    loginAsInstructor,
    { data: instructorData, isLoading: instructorIsLoading },
  ] = useLoginAsInstructorMutation();

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message);
      navigate("/login");
    }
    if (isError && error) {
      toast.error(error.data.message);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSuccess && instructorData) {
      toast.success(instructorData.message);
    }
  }, [isSuccess]);

  const handleBecomeEducator = async () => {
    const res = await loginAsInstructor();
    window.location.reload();
  };

  const handleLogout = async () => {
    const res = await logoutUser();
    console.log("logout res", res);
  };

  return (
    <div
      className="flex h-16 dark:bg-[#020817] bg-white border-b dark:border-b-gray-800 border-b-gray-200 fixed top-0 left-0 right-0 duration-300 z-10
     justify-between items-center px-18"
    >
      {/* Desktop */}
      <div className="w-full hidden md:flex justify-between h-full">
        <div className="h-16 flex w-60 gap-4 items-center">
          <School size={30} />
          <Link to="/">
            <h1 className="hidden md:block font-extrabold text-2xl">
              E-learning
            </h1>
          </Link>
        </div>
        {/* user icon and dark mode icon */}
        <div className=" flex gap-6 items-center">
          {user ? (
            <div className="flex items-center cursor-pointer">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Link to="my-learning">My Learning</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="profile">Edit Profile</Link>
                    </DropdownMenuItem>
                    {user?.role === "student" ? (
                      <DropdownMenuItem onClick={handleBecomeEducator}>
                        Become an Educator
                      </DropdownMenuItem>
                    ) : (
                      <></>
                    )}
                    <DropdownMenuItem>
                      <Link to="logout" onClick={handleLogout}>
                        Log out
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  {user?.role === "instructor" && (
                    <Link to="/admin/dashboard" className="text-center">
                      <DropdownMenuItem className=" bg-blue-400 hover:!bg-blue-500 p-2 mt-4 font-semibold">
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="flex gap-4 items-center">
                <Button className="cursor-pointer">
                  <Link to="/login">Login</Link>
                </Button>
                <Button className="cursor-pointer">
                  <Link to="/register">SignUp</Link>
                </Button>
              </div>
            </div>
          )}
          <DarkMode />
        </div>
      </div>
      {/* Mobile Device */}
      <div className="md:hidden flex justify-between w-full">
        <div>
          <Link to="/">
            <h1 className="font-extrabold text-2xl">E-learning</h1>
          </Link>
        </div>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

const MobileNavbar = ({ user }) => {
  const [
    loginAsInstructor,
    { data: instructorData, isSuccess, isLoading: instructorIsLoading },
  ] = useLoginAsInstructorMutation();

  const handleBecomeEducator = async () => {
    await loginAsInstructor();
    window.location.reload();
  };

  useEffect(() => {
    if (isSuccess && instructorData) {
      toast.success(instructorData.message);
    }
  }, [isSuccess]);
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="rounded-full hover:bg-gray-200"
            variant="outline"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col">
          <SheetHeader className="flex flex-row items-center justify-between mt-5">
            <SheetTitle className="font-extrabold text-2xl">
              E-Learning
            </SheetTitle>
            <DarkMode />
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mx-4">
            <Link to="my-learning">
              <span>My-Learning</span>
            </Link>
            <Link to="profile">
              <span>Edit Profile</span>
            </Link>
            {user?.role === "student" ? (
              <span onClick={handleBecomeEducator}>Become an Educator</span>
            ) : (
              <></>
            )}
            {user?.role == "instructor" ? (
              <Link to="/admin/course/">
                <span>Courses</span>
              </Link>
            ) : (
              <></>
            )}
            <Link to="logout">
              <span>Log out</span>
              {/* <span onClick={handleLogout}>Log out</span> */}
            </Link>
          </nav>
          <div>
            {user?.role == "instructor" && (
              <SheetFooter>
                <SheetClose asChild>
                  <Link to="/admin/dashboard">
                    <Button>Dashboard</Button>
                  </Link>
                </SheetClose>
              </SheetFooter>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
