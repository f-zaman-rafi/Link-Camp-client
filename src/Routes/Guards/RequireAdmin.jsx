import React from "react";
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication state
import { Navigate, useLocation } from "react-router-dom"; // For handling navigation
import Loading from "../../Pages/Loading/Loading"; // Component to display while loading
import useUserInfo from "../../Hooks/useUserInfo"; // Custom hook to fetch user information

const RequireAdmin = ({ children }) => {
  const { userInfo, isLoading } = useUserInfo(); // Get user information and loading state
  const { user, loading } = useAuth(); // Get authentication status and loading state
  const location = useLocation(); // Get the current location

  if (loading || isLoading) {
    return <Loading />;
  } // Show loading if authentication or user info is loading

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace={true} />; // Redirect to sign-in if not authenticated
  }

  if (userInfo?.userType !== "admin") {
    // Check if the user is an admin
    return <Navigate to="/" state={{ from: location }} replace={true} />; // Redirect to home if not an admin
  }

  return children; // Render the protected children if the user is an admin
};

export default RequireAdmin;
