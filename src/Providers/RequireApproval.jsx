import React from "react";
import useAuth from "../Hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../Pages/Loading/Loading";

const RequireApproval = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Loading />
        );
    }
    if (!user) {
        return <Navigate to="/sign-in" state={{ from: location }} replace={true} />;
    }

    return children;
};

export default RequireApproval;
