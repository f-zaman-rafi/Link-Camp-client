import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth"; // Custom hook for authentication state
import { Navigate, useLocation } from "react-router-dom"; // For handling navigation
import Loading from "../../Pages/Loading/Loading"; // Component to display while loading
import useUserInfo from "../../Hooks/useUserInfo"; // Custom hook to fetch user information

const RequireApproval = ({ children }) => {
  const { user, loading } = useAuth(); // Get authentication status and loading state
  const { userInfo, isLoading } = useUserInfo(); // Get user information and loading state (renamed to isLoading)
  const location = useLocation(); // Get the current location
  const [delayed, setDelayed] = useState(true); // State to introduce a delay before checking approval

  useEffect(() => {
    // Set a timer to change 'delayed' to false after 1 second
    const timer = setTimeout(() => setDelayed(false), 1000);
    // Clear the timer if the component unmounts to prevent memory leaks
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this effect runs only once after the initial render

  // Show loading if authentication is loading, there's a delay, or user info is loading
  if (loading || delayed || isLoading) {
    return <Loading />;
  }

  // Redirect to sign-in if the user is not authenticated
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace={true} />;
  }

  // Redirect to home page if the user's verification status is "approved"
  if (userInfo?.verify === "approved") {
    return <Navigate to="/" state={{ from: location }} replace={true} />;
  }

  // Render the protected children if the user is authenticated and not yet approved
  return children;
};

export default RequireApproval;
