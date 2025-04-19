import React from "react";
import useAuth from "../Hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <p className="max-w-screen max-h-screen text-center items-center">
        Checking user...
      </p>
    );
  }
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace={true} />;
  }
  return children;
};

export default RequireAuth;
