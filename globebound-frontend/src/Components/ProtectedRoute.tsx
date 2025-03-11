import { Navigate } from 'react-router-dom';
import authService from '../Services/authService';

interface ProtectedRouteProps {
    children: JSX.Element;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/authentication" replace />;
    }

    return children;
}

export default ProtectedRoute;