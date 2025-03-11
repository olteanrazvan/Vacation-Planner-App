import { Navigate } from 'react-router-dom';
import authService, { UserRole } from '../Services/authService';

interface RoleProtectedRouteProps {
    children: JSX.Element;
    allowedRoles: UserRole[];
}

function RoleProtectedRoute({ children, allowedRoles }: RoleProtectedRouteProps) {
    const userRole = authService.getUserRole();

    if (!authService.isAuthenticated()) {
        return <Navigate to="/authentication" replace />;
    }

    if (!userRole || !allowedRoles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default RoleProtectedRoute;