import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Homepage from "../Pages/Home/Homepage/Homepage";
import React from "react";
import SignUp from "../Pages/Sign-up/SignUp";
import RequireAuth from "./Guards/RequireAuth";
import PendingPage from "../Pages/PendingPage/PendingPage";
import AuthGuard from "./Guards/AuthGuard";
import RequireApproval from "./Guards/RequireApproval";
import DashHome from "../AdminDashboard/DashHome/DashHome";
import DashLayout from "../Layout/DashLayout";
import WelcomePage from "../Pages/WelcomePage/WelcomePage";
import RequireAdmin from "./Guards/RequireAdmin";
import RequireNewbie from "./Guards/RequireNewbie";
import AnnouncementPage from "../Pages/Announcement/AnnouncementPage/AnnouncementPage";
import NoticeboardPage from "../Pages/NoticeBoard/NoticeboardPage/NoticeboardPage";
import PersonalInfo from "../Pages/PersonalInfo/PersonalInfo";
import UserPosts from "../Pages/UserPosts/UserPosts";
import ReportedPost from "../AdminDashboard/ReportedPost/ReportedPost";
import Blacklisted from "../Pages/Blacklisted/Blacklisted";
import RequireBlocklisted from "./Guards/RequireBlocklisted";
import SignIn from "../Pages/Sign-in/SignIn";

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
    path: "/welcome",
    element: <RequireNewbie><WelcomePage /></RequireNewbie>
  },
  {
    path: "/blocklisted",
    element: <RequireBlocklisted><Blacklisted /></RequireBlocklisted>
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
        path: "/noticeboard",
        element: <NoticeboardPage />,
      },
      {
        path: "/announcement",
        element: <AnnouncementPage />,
      },
      {
        path: "/personal-info",
        element: <PersonalInfo />
      },
      {
        path: "/my-posts",
        element: <UserPosts />
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
      {
        path: "reported-post",
        element: <ReportedPost />
      }
    ]
  },

]);
