import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import TextField from '../Components/TextField';
import Button from '../Components/Button';
import authService from '../Services/authService';
import userService from "../Services/userService";

function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await authService.changePassword({
                oldPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            alert('Password changed successfully!');
            navigate('/profile');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to change password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                <h3 className="mb-0">Change Password</h3>
                            </div>
                            <div className="card-body">
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label">Current Password</label>
                                        <TextField
                                            id="currentPassword"
                                            type="password"
                                            placeholder="Enter current password"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">New Password</label>
                                        <TextField
                                            id="newPassword"
                                            type="password"
                                            placeholder="Enter new password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label">Confirm New Password</label>
                                        <TextField
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm new password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <Button onClick={handleSubmit} disabled={isLoading}>
                                            {isLoading ? 'Changing Password...' : 'Change Password'}
                                        </Button>
                                        <Button
                                            onClick={() => navigate('/profile')}
                                            color="secondary"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ChangePassword;