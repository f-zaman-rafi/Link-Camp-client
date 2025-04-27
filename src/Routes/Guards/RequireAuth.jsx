import React from "react";
import useAuth from "../../Hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../../Pages/Loading/Loading";
import useUserInfo from "../../Hooks/useUserInfo";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { userInfo, isLoading } = useUserInfo();




  if (loading || isLoading) {
    return (
      <Loading />

    );
  }
  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace={true} />;
  }
  if (userInfo.verify === "pending") {
    return <Navigate to="/pending-request" state={{ from: location }} replace={true} />;
  }
  if (userInfo.verify === "blocklisted") {
    return <Navigate to="/blocklisted" state={{ from: location }} replace={true} />;
  }
  if (userInfo.name === "") {
    return <Navigate to="/welcome" state={{ from: location }} replace={true} />;
  }
  return children;
};

export default RequireAuth;
