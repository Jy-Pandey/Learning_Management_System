import { authApi } from "@/features/api/authApi.js";
import authReducer from "../features/authSlice.js"
import { combineReducers } from "@reduxjs/toolkit";
import { courseApi } from "@/features/api/courseApi.js";
import { purchaseApi } from "@/features/api/purchaseApi.js";
import { courseProgressApi } from "@/features/api/courseProgressApi.js";


const rootReducer = combineReducers({
  // Redux slice
  auth: authReducer, // Redux store ke andar auth Slice

  // RTK Query reducers
  [authApi.reducerPath]: authApi.reducer, // ye store me "authApi" key ke andar authApi se aaye hue data ko store kar dega
  [courseApi.reducerPath] : courseApi.reducer,
  [purchaseApi.reducerPath] : purchaseApi.reducer,
  [courseProgressApi.reducerPath] : courseProgressApi.reducer,
});

export default rootReducer;
