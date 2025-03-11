// src/Components/Navigation.tsx
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import authService, { UserRole } from '../Services/authService';

function Navigation() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    const userRole = user?.role as UserRole;
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const renderRoleBasedLinks = () => {
        switch (userRole) {
            case 'ROLE_OWNER':
                return (
                    <>
                        <li className="nav-item">
                            <a className="nav-link" href="/my-properties">My Properties</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/my-bookings">My Bookings</a>
                        </li>
                    </>
                );
            case 'ROLE_MODERATOR':
                return (
                    <>
                        <li className="nav-item">
                            <a className="nav-link" href="/user-management">User Management</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/my-bookings">My Bookings</a>
                        </li>
                    </>
                );
            case 'ROLE_USER':
            default:
                return (
                    <>
                        <li className="nav-item">
                            <a className="nav-link" href="/my-bookings">My Bookings</a>
                        </li>
                    </>
                );
        }
    };

    const displayRole = (role: string) => {
        return role.replace('ROLE_', '');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
            <div className="container">
                <div className="text-muted me-3">
                    {currentDate}
                </div>
                <a className="navbar-brand" href="/dashboard">GlobeBound</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/dashboard">Home</a>
                        </li>
                        {renderRoleBasedLinks()}
                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        {user?.username && (
                            <span className="text-muted">
                                Welcome, {user.username} ({displayRole(user.role)})
                            </span>
                        )}
                        <Button
                            onClick={() => navigate('/profile')}
                            color="outline-primary"
                        >
                            My Profile
                        </Button>
                        <Button
                            onClick={handleLogout}
                            color="outline-danger"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;