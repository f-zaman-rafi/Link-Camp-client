import { createBrowserRouter } from "react-router-dom"; // For creating the router
import Main from "../Layout/Main"; // Main layout component
import Homepage from "../Pages/Home/Homepage/Homepage"; // Homepage component
import React from "react"; // Import React
import SignUp from "../Pages/Sign-up/SignUp"; // Sign-up page component
import RequireAuth from "./Guards/RequireAuth"; // Authentication guard for protected routes
import PendingPage from "../Pages/PendingPage/PendingPage"; // Page for users with pending approval
import AuthGuard from "./Guards/AuthGuard"; // Guard for routes accessible only to unauthenticated users
import RequireApproval from "./Guards/RequireApproval"; // Guard for routes requiring user approval
import DashHome from "../AdminDashboard/DashHome/DashHome"; // Admin dashboard homepage
import DashLayout from "../Layout/DashLayout"; // Admin dashboard layout
import WelcomePage from "../Pages/WelcomePage/WelcomePage"; // Welcome page for new users
import RequireAdmin from "./Guards/RequireAdmin"; // Guard for admin-only routes
import RequireNewbie from "./Guards/RequireNewbie"; // Guard for routes for new users (incomplete profile)
import AnnouncementPage from "../Pages/Announcement/AnnouncementPage/AnnouncementPage"; // Announcement page
import NoticeboardPage from "../Pages/NoticeBoard/NoticeboardPage/NoticeboardPage"; // Noticeboard page
import PersonalInfo from "../Pages/PersonalInfo/PersonalInfo"; // Personal information page
import UserPosts from "../Pages/UserPosts/UserPosts"; // Page displaying user's posts
import ReportedPost from "../AdminDashboard/ReportedPost/ReportedPost"; // Page for reported posts in admin dashboard
import Blacklisted from "../Pages/Blacklisted/Blacklisted"; // Page for blocklisted users
import RequireBlocklisted from "./Guards/RequireBlocklisted"; // Guard for blocklisted users
import SignIn from "../Pages/Sign-in/SignIn"; // Sign-in page component

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: (
      <AuthGuard> {/* Apply AuthGuard to prevent logged-in users from accessing */}
        <SignIn />
      </AuthGuard>
    ),
  },
  {
    path: "/sign-up",
    element: (
      <AuthGuard> {/* Apply AuthGuard to prevent logged-in users from accessing */}
        <SignUp />
      </AuthGuard>
    ),
  },

  {
    path: "/pending-request",
    element: <RequireApproval><PendingPage /></RequireApproval> //Requires approved user to access
  },
  {
    path: "/welcome",
    element: <RequireNewbie><WelcomePage /></RequireNewbie> //Requires new user status to access
  },
  {
    path: "/blocklisted",
    element: <RequireBlocklisted><Blacklisted /></RequireBlocklisted> //Requires blocklisted user status to access
  },
  {
    path: "/",
    element: (
      <RequireAuth> {/* Requires authenticated user to access */}
        <Main />
      </RequireAuth>
    ),
    children: [
      {
        path: "/",
        element: <Homepage />, // Homepage for authenticated users
      },
      {
        path: "/noticeboard",
        element: <NoticeboardPage />, // Noticeboard page for authenticated users
      },
      {
        path: "/announcement",
        element: <AnnouncementPage />, // Announcement page for authenticated users
      },
      {
        path: "/personal-info",
        element: <PersonalInfo /> // Personal info page for authenticated users
      },
      {
        path: "/my-posts",
        element: <UserPosts /> // User's posts page for authenticated users
      },


    ],
  },
  {
    path: "/admin-dash",
    element: <RequireAdmin><DashLayout /></RequireAdmin>, // Requires admin user to access
    children: [
      {
        path: "/admin-dash",
        element: <DashHome /> // Admin dashboard homepage
      },
      {
        path: "reported-post",
        element: <ReportedPost /> // Reported posts page for admin
      }
    ]
  },

]);