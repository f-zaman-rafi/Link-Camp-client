import { Navigate, useLocation } from "react-router-dom"; // For handling navigation
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication state
import useUserInfo from "../../Hooks/useUserInfo"; // Custom hook to fetch user information
import Loading from "../../Pages/Loading/Loading"; // Component to display while loading
import React from "react"; // Import React

const RequireBlocklisted = ({ children }) => {
  const { user, loading } = useAuth(); // Get authentication status and loading state
  const location = useLocation(); // Get the current location
  const { userInfo, isLoading } = useUserInfo(); // Get user information and loading state

  // Show loading if authentication or user info is loading
  if (loading || isLoading) {
    return <Loading />;
  }

  // Redirect to sign-in if the user is not authenticated
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace={true} />;
  }

  // Redirect to home page if the user's verification status is not "blocklisted"
  if (userInfo?.verify !== "blocklisted") {
    return <Navigate to="/" state={{ from: location }} replace={true} />;
  }

  // Render the protected children if the user is authenticated and blocklisted
  return children;
};

export default RequireBlocklisted;
