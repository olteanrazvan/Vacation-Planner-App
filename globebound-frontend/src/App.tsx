import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import WelcomePage from "./Pages/WelcomePage";
import Authentification from "./Pages/Authentification";
import RegisterPage from "./Pages/RegisterPage";
import Dashboard from "./Pages/Dashboard";
import UserProfile from "./Pages/UserProfile";
import AccommodationDetail from "./Pages/AccommodationDetail";
import ChangePassword from "./Pages/ChangePassword";
import RoleProtectedRoute from './Components/RoleProtectedRoute';
import OwnerAccommodations from "./Pages/OwnerAccommodations";
import UserReservations from "./Pages/UserReservations";
import UserManagement from "./Pages/UserManagement";

function App() {
    return (
        <Router>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<WelcomePage />} />
                <Route path="authentication" element={<div><Outlet /></div>}>
                    <Route index element={<Authentification />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                {/* User routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/accommodation/:id" element={<AccommodationDetail />} />
                <Route path="/my-bookings" element={
                    <RoleProtectedRoute allowedRoles={['ROLE_USER', 'ROLE_OWNER', 'ROLE_MODERATOR']}>
                        <UserReservations />
                    </RoleProtectedRoute>
                } />

                {/* Owner routes */}
                <Route path="/my-properties" element={
                    <RoleProtectedRoute allowedRoles={['ROLE_OWNER']}>
                        <OwnerAccommodations />
                    </RoleProtectedRoute>
                } />
                <Route path="/bookings-management" element={
                    <RoleProtectedRoute allowedRoles={['ROLE_OWNER']}>
                        <div>Bookings Management (Coming Soon)</div>
                    </RoleProtectedRoute>
                } />
                <Route path="/add-property" element={
                    <RoleProtectedRoute allowedRoles={['ROLE_OWNER']}>
                        <div>Add Property (Coming Soon)</div>
                    </RoleProtectedRoute>
                } />

                {/* Moderator routes */}
                <Route path="/properties-approval" element={
                    <RoleProtectedRoute allowedRoles={['ROLE_MODERATOR']}>
                        <div>Properties Approval (Coming Soon)</div>
                    </RoleProtectedRoute>
                } />
                <Route path="/user-management" element={
                    <RoleProtectedRoute allowedRoles={['ROLE_MODERATOR']}>
                        <UserManagement />
                    </RoleProtectedRoute>
                } />
                <Route path="/reports" element={
                    <RoleProtectedRoute allowedRoles={['ROLE_MODERATOR']}>
                        <div>Reports & Analytics (Coming Soon)</div>
                    </RoleProtectedRoute>
                } />

                {/* Fallback for unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;