import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user : null, // user value will be storing in this store
  isAuthenticated : false
}
const authSlice = createSlice({
  name : 'authSlice', //slice name
  initialState,
  reducers : {

    // at the time of dispatch we will be passing the user value that will stored in action's payload
    userLoggedIn : (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    userLoggedOut : (state, _) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser : (state, action) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    }

  }
})

export const {userLoggedIn, userLoggedOut, updateUser} = authSlice.actions;
export default authSlice.reducer;