import { useState } from "react";
import Login from "./pages/login";
import { HeroSection } from "./pages/student/HeroSection.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import { Courses } from "./pages/student/Courses";
import { MyLearning } from "./pages/student/MyLearning";
import { Profile } from "./pages/student/Profile";
import { Logout } from "./pages/Logout";
import Sidebar from "./pages/admin/Sidebar.jsx";
import Dashboard from "./pages/admin/Dashboard";
import { CourseTable } from "./pages/admin/course/CourseTable";
import { AddCourse } from "./pages/admin/course/AddCourse";
import { EditCourse } from "./pages/admin/course/EditCourse";
import { CreateLecture } from "./pages/admin/lecture/createLecture";
import { EditLecture } from "./pages/admin/lecture/EditLecture";
import { CourseDetail } from "./pages/student/CourseDetail";
import { CourseProgress } from "./pages/student/courseProgress";
import { SearchPage } from "./pages/student/SearchPage";
import {
  AdminRoute,
  AuthenticatedUser,
  ProtectedRoute,
} from "./components/ProtectedRoutes";
import { PurchaseCourseProtectedRoute } from "./components/PurchaseCourseProtectedRoute";
import { ThemeProvider } from "./components/ThemeProvider.jsx";

function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "",
          element: (
            <>
              <HeroSection />
              <Courses />
            </>
          ),
        },
        {
          path: "login",
          element: (
            <AuthenticatedUser>
              <Login />
            </AuthenticatedUser>
          ),
        },
        {
          path: "register",
          element: <Login />,
        },
        {
          path: "/my-learning",
          element: (
            <ProtectedRoute>
              // only login person can access
              <MyLearning />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/course/search",
          element: (
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "/logout",
          element: <Logout />,
        },
        {
          path: "/course-detail/:courseId",
          element: (
            <ProtectedRoute>
            <CourseDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "/course-progress/:courseId",
          element: (
            <ProtectedRoute>
              <PurchaseCourseProtectedRoute>
                <CourseProgress />
              </PurchaseCourseProtectedRoute>
            </ProtectedRoute>
          ),
        },

        // admin routes
        {
          path: "/admin",
          element: <AdminRoute><Sidebar /></AdminRoute>,
          children: [
            {
              path: "dashboard",
              element: <Dashboard />,
            },
            {
              path: "course",
              element: <CourseTable />,
            },
            {
              path: "course/create",
              element: <AddCourse />,
            },
            {
              path: "course/:courseId",
              element: <EditCourse />,
            },
            {
              path: "course/:courseId/lecture",
              element: <CreateLecture />,
            },
            {
              path: "course/:courseId/lecture/:lectureId",
              element: <EditLecture />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div>
    <ThemeProvider>
      <RouterProvider router={appRouter}></RouterProvider>
    </ThemeProvider>
    </div>
  );
}

export default App;
