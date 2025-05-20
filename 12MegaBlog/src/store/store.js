import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

//creating a store
const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;
