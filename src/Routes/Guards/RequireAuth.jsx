import React from "react";
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication state
import { Navigate, useLocation } from "react-router-dom"; // For handling navigation
import Loading from "../../Pages/Loading/Loading"; // Component to display while loading
import useUserInfo from "../../Hooks/useUserInfo"; // Custom hook to fetch user information

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth(); // Get authentication status and loading state
  const location = useLocation(); // Get the current location
  const { userInfo, isLoading } = useUserInfo(); // Get user information and loading state

  // Show loading if authentication or user info is loading
  if (loading || isLoading) {
    return (
      <Loading />
    );
  }

  // Redirect to sign-in if the user is not authenticated
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace={true} />;
  }

  // Redirect to pending-request page if user verification is pending
  if (userInfo?.verify === "pending") {
    return <Navigate to="/pending-request" state={{ from: location }} replace={true} />;
  }

  // Redirect to blocklisted page if user is blocklisted
  if (userInfo?.verify === "blocklisted") {
    return <Navigate to="/blocklisted" state={{ from: location }} replace={true} />;
  }

  // Redirect to welcome page if the user's name is empty (indicating incomplete profile)
  if (userInfo?.name === "") {
    return <Navigate to="/welcome" state={{ from: location }} replace={true} />;
  }

  // Render the protected children if the user passes all checks
  return children;
};

export default RequireAuth;