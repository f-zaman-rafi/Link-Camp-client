import React from "react";
import useAuth from "../../Hooks/useAuth"; // Custom hook to get authentication status
import { Navigate, useLocation } from "react-router-dom"; // For handling navigation
import Loading from "../../Pages/Loading/Loading"; // Component to display while loading

const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth(); // Get user and loading state from the auth hook
  const location = useLocation(); // Get the current location

  if (loading) {
    return (
      <Loading /> // Display loading component while checking authentication
    );
  }

  if (user) {
    return <Navigate to="/" state={{ from: location }} replace={true} />; // If user is logged in, redirect to home page
  }

  return children; // If not loading and not logged in, render the children (protected route)
};

export default AuthGuard;
