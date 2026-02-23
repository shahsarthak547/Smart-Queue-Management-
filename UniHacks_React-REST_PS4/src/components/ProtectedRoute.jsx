import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const authDataString = localStorage.getItem('auth_data');
    const userRole = localStorage.getItem('role'); // 'user' or 'institution' (mapped to admin in frontend context)

    const isAuthenticated = !!authDataString;

    if (!isAuthenticated) {
        // Redirect to login but save the current location to redirect back after login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // If user is logged in but doesn't have the required role, redirect to their default dashboard
        const defaultPath = userRole === 'institution' ? '/admin/dashboard' : '/dashboard';
        return <Navigate to={defaultPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
