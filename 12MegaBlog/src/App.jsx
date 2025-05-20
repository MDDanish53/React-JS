import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import authService from "./appwrite/auth";
import { login, logout } from "./store/authSlice";
import { Header, Footer } from "./components";
import { Outlet } from "react-router-dom";

function App() {
  //loading state
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  // when our app is called this function is called
  useEffect(() => {
    //getting the current user
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          //if .getCurrentUser exists then call login with userData
          dispatch(login({ userData }));
        } else {
          //if .getCurrentUser does not exists then call logout
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  });

  //conditional rendering
  return !loading ? (
    <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
      <div className="w-full block">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null;
}

export default App;
