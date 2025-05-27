import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = "http://localhost:8080/api/v1/courses/";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
    credentials: "include",
  }),
  tagTypes: ["refetch_user_courses"],
  tagTypes: ["refetch_lectures"],
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["refetch_user_courses"],
      // create course karte hi jinhone is tag ko provide kr rkha hia unhe refetch kardo
    }),
    getSearchCourse: builder.query({
      query: ({ searchQuery, sortByPrice }) => {
        let queryString = `search?query=${encodeURIComponent(searchQuery)}`;

        // append categories
        // if (categories && categories.length > 0) {
        //   const categoryString = categories
        //     .map((cat) => encodeURIComponent(cat))
        //     .join(",");
        //   queryString += `&categories=${categoryString}`;
        // }
        // Append sortByPrice if available
        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }

        return {
          url: queryString,
          method: "GET",
        };
      },
    }),
    getUserCourses: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["refetch_user_courses"],
    }),
    getPublishedCourses: builder.query({
      query: () => ({
        url: "published-courses",
        method: "GET",
      }),
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `${courseId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["refetch_user_courses"],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `${courseId}`,
        method: "GET",
      }),
    }),
    // Lecture
    createLecture: builder.mutation({
      query: ({ lectureTitle, courseId }) => ({
        url: `${courseId}/create`,
        method: "POST",
        body: { lectureTitle },
      }),
      invalidatesTags: ["refetch_lectures"],
      invalidatesTags: ["refetch_user_courses"],
    }),
    getCourseLectures: builder.query({
      query: (courseId) => ({
        url: `${courseId}/lectures`,
        method: "GET",
      }),
      providesTags: ["refetch_lectures"],
    }),
    editLecture: builder.mutation({
      query: ({
        lectureTitle,
        videoInfo,
        isPreviewFree,
        courseId,
        lectureId,
      }) => ({
        url: `${courseId}/lectures/${lectureId}`,
        method: "PATCH",
        body: { lectureTitle, videoInfo, isPreviewFree },
      }),
    }),
    invalidatesTags: ["refetch_lectures"],
    getLectureById: builder.query({
      query: ({ courseId, lectureId }) => ({
        url: `${courseId}/lectures/${lectureId}`,
        method: "GET",
      }),
    }),
    removeLecture: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `${courseId}/lectures/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["refetch_lectures"],
    }),
    publishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}?publish=${query}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetUserCoursesQuery,
  useEditCourseMutation,
  useGetCourseByIdQuery,
  useCreateLectureMutation,
  useGetCourseLecturesQuery,
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
  usePublishCourseMutation,
  useGetPublishedCoursesQuery,
  useGetSearchCourseQuery
} = courseApi;
