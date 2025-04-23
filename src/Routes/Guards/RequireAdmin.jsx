import React from 'react';
import useAuth from '../../Hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../../Pages/Loading/Loading';
import useUserInfo from '../../Hooks/useUserInfo';

const RequireAdmin = ({ children }) => {
    const { userInfo, isLoading } = useUserInfo();
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading || isLoading) { return <Loading /> }

    if (!user) {
        return <Navigate to="/sign-in" state={{ from: location }} replace={true} />;
    }

    if (userInfo.userType !== "admin") {
        return <Navigate to="/" state={{ from: location }} replace={true} />;
    }

    return children;
};

export default RequireAdmin;


