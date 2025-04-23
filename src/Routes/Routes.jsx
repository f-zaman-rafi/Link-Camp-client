import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Homepage from "../Pages/Home/Homepage/Homepage";
import React from "react";
import SignIn from "../Pages/Sign-In/SignIn";
import SignUp from "../Pages/Sign-up/SignUp";
import RequireAuth from "./Guards/RequireAuth";
import AddPost from "../Pages/AddPost/AddPost";
import NoticeFeed from "../Pages/NoticeBoard/NoticeFeed";
import PendingPage from "../Pages/PendingPage/PendingPage";
import AuthGuard from "./Guards/AuthGuard";
import RequireApproval from "./Guards/RequireApproval";
import UserList from "../Pages/Admin/Users/UserList";
import RequireRole from "./Guards/RequireRole";
import DashHome from "../AdminDashboard/DashHome/DashHome";
import DashLayout from "../Layout/DashLayout";
import WelcomePage from "../Pages/WelcomePage/WelcomePage";
import RequireAdmin from "./Guards/RequireAdmin";

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
      },
      {
        path: "/welcome",
        element: <WelcomePage />
      },

    ],
  },
  {
    path: "/admin-dash",
    element: <RequireAdmin><DashLayout /></RequireAdmin>,
    children: [
      {
        path: "/admin-dash",
        element: <DashHome />
      },
    ]

  },
  {
    path: "/user-list",
    element: <RequireRole requiredRole='admin'><UserList /></RequireRole>
  },

]);
