import React, { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../../Pages/Loading/Loading";
import useUserInfo from "../../Hooks/useUserInfo";

const RequireApproval = ({ children }) => {
    const { user, loading } = useAuth();
    const { userInfo, inLoading: isLoading } = useUserInfo();
    const location = useLocation();
    const [delayed, setDelayed] = useState(true);


    useEffect(() => {
        const timer = setTimeout(() => setDelayed(false), 2000);
        return () => clearTimeout(timer);
    }, [])

    if (loading || delayed || isLoading) {
        return (
            <Loading />
        );
    }
    if (!user) {
        return <Navigate to="/sign-in" state={{ from: location }} replace={true} />;
    }
    if (userInfo?.verify === "approved") {
        return <Navigate to="/" state={{ from: location }} replace={true} />
    }

    return children;
};

export default RequireApproval;
