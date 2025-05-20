import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //react hook form
  const { register, handleSubmit } = useForm();
  //to display errors
  const [error, setError] = useState("");

  //handleSubmit
  const login = async (data) => {
    //empty the error
    setError("");
    try {
      //if session exist then user is logged in
      const session = await authService.login(data);
      //getting userData from getCurrentUser method, not from session
      if (session) {
        const userData = await authService.getCurrentUser();
        //if userData exists then dispatch it to authLogin
        if (userData) dispatch(authLogin(userData));
        //if logged in then navigate the user to route
        navigate("/");
      }
    } catch (err) {
      //if session does not exist then user is not logged in
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <div
        className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}
      >
        <div className="mb-2 flex justify-center">
          <span className="inline-block w-full max-w-[100px">
            <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-2xl font-bold leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-base text-black/60">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-medium text-primary transition-all duration-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
        {/*Error Display*/}
        {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
        {/*handleSubmit is a keyword, event & method from useForm*/}
        <form onSubmit={handleSubmit(login)} className="mt-8">
          <div className="space-y-5">
            {/*Input for email*/}
            {/*as we are using react hook form so we have to spread its register, here, email is key. the object is used to pass the options*/}
            {/* here, email is key.*/}
            {/* the object is used to pass the options*/}
            {/*regexr for regular expression pattern*/}
            <Input
              label="Email: "
              placeholder="Enter your email"
              type="email"
              {...register("email", {
                required: true,
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    "Email address must be a valid address",
                },
              })}
            />
            {/*Input for password*/}
            <Input
              label="Password: "
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: true,
              })}
            />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
