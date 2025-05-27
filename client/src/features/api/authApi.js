import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateUser, userLoggedIn, userLoggedOut } from "../authSlice.js";

// isme ham Rtk query likhenge jis se ham Api se data fetch karke layenge
// aur authSlice ke reducers ka use karke store me user ki value store kara denge
const USER_API = "http://localhost:8080/api/v1/users/";
export const authApi = createApi({
  reducerPath: "authApi", //Yeh batata hai store me data kis key pe store hoga
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: "register",
        method: "POST",
        body: inputData,
      }),
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        // receive data from frontend
        url: "login",
        method: "POST",
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
        try {
          const result = await queryFulfilled;
          // console.log("Get store current state", getState);
          // console.log("Result from API", result);
          dispatch(userLoggedIn({ user: result.data.data.user })); // store login data into store
          // RTK backend se aaye response ko data : {JSON res} me store kar deta hai result.data.data.user karke ham dekh sakte hai
        } catch (error) {
          console.log("Error while login : ", error);
        }
      },
    }),
    loginAsInstructor: builder.mutation({
      query: () => ({
        url: "asInstructor",
        method: "POST",
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "logout",
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut()); // go and update store where set user to null
        } catch (error) {
          console.log("Error while logout is : ", error);
        }
      },
    }),
    loadUserProfile: builder.query({
      query: () => ({
        url: "profile",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.data.user }));
        } catch (error) {
          console.log("Error while loading user Profile : ", error);
        }
      },
    }),
    updateUserProfile: builder.mutation({
      query: (formData) => ({
        url: "update-profile",
        method: "PATCH",
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // console.log("Result from API", result.data);
          dispatch(updateUser({ user: result.data.data.user }));
        } catch (error) {
          console.log("Error while updating profile: ", error);
        }
      },
      // transformResponse: (response) => response.data.user,
    }),
  }),
});

// export mutation so that we can call this in components
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLoginAsInstructorMutation,
  useLogoutUserMutation,
  useLoadUserProfileQuery,
  useUpdateUserProfileMutation
} = authApi;
