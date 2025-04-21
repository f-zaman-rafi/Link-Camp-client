import React from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from './useAuth';

const RequireRole = ({ children, requiredRole }) => {
    const { userInfo } = useAuth();

    if (!userInfo || userInfo.userType !== requiredRole) {
        return <Redirect to="/not-authorized" />;
    }

    return children;
};

export default RequireRole;


// import { Route } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';

// <Route path="/admin">
//   <ProtectedRoute requiredRole="admin">
//     <AdminPage />
//   </ProtectedRoute>
// </Route>
