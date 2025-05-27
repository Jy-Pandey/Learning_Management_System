import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "../features/authSlice.js"
import rootReducer from "./rootReducer.js";
import { authApi } from "@/features/api/authApi.js";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { courseProgressApi } from "@/features/api/courseProgressApi.js";

export const appStore = configureStore({
  reducer: rootReducer,
  middleware: (defaultMiddleware) =>
    defaultMiddleware().concat(authApi.middleware, courseApi.middleware, purchaseApi.middleware, courseProgressApi.middleware),
});
const initializeApp = async () => {
  const cookies = document.cookie;

  // Check if accessToken cookie exists
  const hasAccessToken = cookies.includes("accessToken=");
  if (hasAccessToken) {
    await appStore.dispatch(
      authApi.endpoints.loadUserProfile.initiate({}, { forceRefetch: true })
    );
  } else {
    console.log("User not logged in. Skipping profile fetch.");
  }
};
initializeApp();
