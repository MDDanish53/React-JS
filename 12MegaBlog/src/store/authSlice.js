import { createSlice } from "@reduxjs/toolkit";

//initial state of slice
const initialState = {
  status: false,
  userData: null,
};

//creating slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //actions of reducers
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload.userData;
    },
    logout: (state) => {
      state.status = false;
      state.userData = null;
    },
  },
});

//exporting actions of reducers
export const { login, logout } = authSlice.actions;

//exporting reducers
export default authSlice.reducer;
