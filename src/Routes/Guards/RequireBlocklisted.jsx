import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useUserInfo from "../../Hooks/useUserInfo";
import Loading from "../../Pages/Loading/Loading";
import React from "react";


const RequireBlocklisted = ({ children }) => {
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
    if (userInfo.verify !== "blocklisted") {
        return <Navigate to="/" state={{ from: location }} replace={true} />;
    }

    return children;
};

export default RequireBlocklisted;
