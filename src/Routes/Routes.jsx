import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Homepage from "../Pages/Home/Homepage/Homepage";
import React from "react";
import SignIn from "../Pages/Sign-In/SignIn";
import SignUp from "../Pages/Sign-up/SignUp";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
]);
