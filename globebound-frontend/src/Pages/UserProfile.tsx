import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import TextField from '../Components/TextField';
import Button from '../Components/Button';
import userService from '../Services/userService';
import authService from '../Services/authService';

interface UserData {
    username: string;
    email: string;
    age: string;
    phone: string;
}

function UserProfile() {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const [userData, setUserData] = useState<UserData>({
        username: '',
        email: '',
        age: '',
        phone: ''
    });

    const [editedData, setEditedData] = useState<UserData>(userData);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const data = await userService.getUserProfile();
            setUserData(data);
            setEditedData(data);
            setIsLoading(false);
        } catch (error: any) {
            setError('Failed to load user profile');
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedData(userData);
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError('');
        try {
            const updatedUser = await userService.updateUserProfile(editedData);
            setUserData(updatedUser);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await userService.deleteUserProfile();
            navigate('/');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to delete account');
            setShowDeleteConfirm(false);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !userData.username) {
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
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h3 className="mb-0">My Profile</h3>
                            </div>
                            <div className="card-body">
                                {error && (
                                    <div className="alert alert-danger mb-4">
                                        {error}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="form-label">Username</label>
                                    <TextField
                                        id="username"
                                        type="text"
                                        placeholder="Username"
                                        value={userData.username}
                                        onChange={() => {}}
                                        disabled={true}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Email</label>
                                    <TextField
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        value={isEditing ? editedData.email : userData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Age</label>
                                    <TextField
                                        id="age"
                                        type="number"
                                        placeholder="Age"
                                        value={isEditing ? editedData.age : userData.age}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Phone</label>
                                    <TextField
                                        id="phone"
                                        type="tel"
                                        placeholder="Phone"
                                        value={isEditing ? editedData.phone : userData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    {!isEditing ? (
                                        <>
                                            <Button onClick={handleEdit} disabled={isLoading}>
                                                Edit Profile
                                            </Button>
                                            <Button
                                                onClick={() => navigate('/change-password')}
                                                color="secondary"
                                                disabled={isLoading}
                                            >
                                                Change Password
                                            </Button>
                                            <Button
                                                onClick={() => setShowDeleteConfirm(true)}
                                                color="danger"
                                                disabled={isLoading}
                                            >
                                                Delete Profile
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button onClick={handleSave} disabled={isLoading}>
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                            <Button
                                                onClick={() => setIsEditing(false)}
                                                color="secondary"
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Profile</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete your profile? This action cannot be undone.
                            </div>
                            <div className="modal-footer">
                                <Button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    color="secondary"
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    color="danger"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Deleting...' : 'Delete Profile'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default UserProfile;