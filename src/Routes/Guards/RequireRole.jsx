// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import useUserInfo from '../../Hooks/useUserInfo';
// import Loading from '../../Pages/Loading/Loading';

// const RequireRole = ({ children, requiredRole }) => {
//     const { userInfo, isLoading } = useUserInfo();
//     const location = useLocation();

//     if (isLoading) {
//         return <Loading />
//     }

//     if (!userInfo || userInfo.userType !== requiredRole) {
//         return <Navigate to="/" state={{ from: location }} replace={true} />;
//     }

//     return children;
// };

// export default RequireRole;

// import { Route } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';

// <Route path="/admin">
//   <ProtectedRoute requiredRole="admin">
//     <AdminPage />
//   </ProtectedRoute>
// </Route>
