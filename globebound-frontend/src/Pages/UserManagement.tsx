import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout';
import Button from '../Components/Button';
import moderatorService, { UserManagementData } from '../Services/moderatorService';
import authService from '../Services/authService';

function UserManagement() {
    const [users, setUsers] = useState<UserManagementData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await moderatorService.getAllUsers();
            setUsers(data);
            setError('');
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromoteToOwner = async (userId: number) => {
        if (!window.confirm('Are you sure you want to promote this user to Owner?')) {
            return;
        }

        try {
            setIsLoading(true);
            await moderatorService.promoteToOwner(userId);
            setSuccessMessage('User successfully promoted to owner');
            await fetchUsers(); // Refresh the list
        } catch (err: any) {
            console.error('Error promoting user:', err);
            setError(err.response?.data?.message || 'Failed to promote user to owner');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromoteToModerator = async (userId: number) => {
        if (!window.confirm('Are you sure you want to promote this user to Moderator?')) {
            return;
        }

        try {
            setIsLoading(true);
            await moderatorService.promoteToModerator(userId);
            setSuccessMessage('User successfully promoted to moderator');
            await fetchUsers();
        } catch (err: any) {
            console.error('Error promoting user:', err);
            setError(err.response?.data?.message || 'Failed to promote user to moderator');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await moderatorService.deleteUser(userId);
            setSuccessMessage('User successfully deleted');
            await fetchUsers(); // Refresh the list
        } catch (err) {
            console.error('Error deleting user:', err);
            setError('Failed to delete user');
        }
    };

    const currentUser = authService.getCurrentUser();

    if (isLoading) {
        return (
            <Layout>
                <div className="container py-4">
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container py-4">
                <h2 className="mb-4">User Management</h2>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        {error}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setError('')}
                            aria-label="Close"
                        />
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        {successMessage}
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setSuccessMessage('')}
                            aria-label="Close"
                        />
                    </div>
                )}

                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Age</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {users.map((user) => (
                                    <tr key={user.userId}>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.age}</td>
                                        <td>{user.phone}</td>
                                        <td>
                                                <span className={`badge ${
                                                    user.userType === 'MODERATOR'
                                                        ? 'bg-danger'
                                                        : user.userType === 'OWNER'
                                                            ? 'bg-success'
                                                            : 'bg-primary'
                                                }`}>
                                                    {user.userType}
                                                </span>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                {user.userType === 'USER' && user.userId !== Number(currentUser?.userId) && (
                                                    <>
                                                        <Button
                                                            onClick={() => handlePromoteToOwner(user.userId)}
                                                            color="primary"
                                                            className="btn-sm"
                                                        >
                                                            Promote to Owner
                                                        </Button>
                                                        <Button
                                                            onClick={() => handlePromoteToModerator(user.userId)}
                                                            color="success"
                                                            className="btn-sm"
                                                        >
                                                            Promote to Moderator
                                                        </Button>
                                                    </>
                                                )}
                                                {user.userId !== Number(currentUser?.userId) && user.userType !== 'MODERATOR' && (
                                                    <Button
                                                        onClick={() => handleDeleteUser(user.userId)}
                                                        color="danger"
                                                        className="btn-sm"
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UserManagement;