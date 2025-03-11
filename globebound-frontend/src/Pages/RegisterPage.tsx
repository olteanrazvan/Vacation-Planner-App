import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import TextField from '../Components/TextField';
import Button from '../Components/Button';
import CheckBox from '../Components/CheckBox';
import authService from '../Services/authService';

function RegisterPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        age: '',
        phone: '',
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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            await authService.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                age: formData.age,
                phone: formData.phone
            });
            navigate('/authentication');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to register. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout showNav={false}>
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card shadow">
                            <div className="card-body p-5">
                                <h2 className="text-center mb-4">Register</h2>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleRegister}>
                                    <div className="row mb-3">
                                        <div className="col">
                                            <TextField
                                                id="username"
                                                type="text"
                                                placeholder="Username"
                                                value={formData.username}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <TextField
                                            id="email"
                                            type="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <TextField
                                            id="password"
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <TextField
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <TextField
                                            id="age"
                                            type="number"
                                            placeholder="Age"
                                            value={formData.age}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <TextField
                                            id="phone"
                                            type="tel"
                                            placeholder="Phone Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <CheckBox id="terms" text="I agree to the Terms and Conditions" />
                                    </div>
                                    <Button onClick={handleRegister} disabled={isLoading}>
                                        {isLoading ? 'Registering...' : 'Register'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default RegisterPage;