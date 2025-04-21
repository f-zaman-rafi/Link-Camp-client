import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Homepage from "../Pages/Home/Homepage/Homepage";
import React from "react";
import SignIn from "../Pages/Sign-In/SignIn";
import SignUp from "../Pages/Sign-up/SignUp";
import AuthGuard from "../Providers/AuthGuard";
import RequireAuth from "../Providers/RequireAuth";
import AddPost from "../Pages/AddPost/AddPost";
import NoticeFeed from "../Pages/NoticeBoard/NoticeFeed";
import PendingPage from "../Pages/PendingPage/PendingPage";
import RequireApproval from "../Providers/RequireApproval";

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: (
      <AuthGuard>
        <SignIn />
      </AuthGuard>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <AuthGuard>
        <SignUp />
      </AuthGuard>
    ),
  },
  {
    path: "/pending-request",
    element: <RequireApproval><PendingPage /></RequireApproval>
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Main />
      </RequireAuth>
    ),
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/add-post",
        element: <AddPost />,
      },
      {
        path: "/noticeboard",
        element: <NoticeFeed />,
      }
      ,
    ],
  },
]);
