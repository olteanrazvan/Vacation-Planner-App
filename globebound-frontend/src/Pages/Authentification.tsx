import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import TextField from '../Components/TextField';
import Button from '../Components/Button';
import authService from '../Services/authService';

function Authentification() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.login({
                username: formData.username,
                password: formData.password
            });
            navigate('/dashboard');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout showNav={false}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow mt-5">
                            <div className="card-body p-5">
                                <h2 className="text-center mb-4">Login</h2>
                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <TextField
                                            id="username"
                                            type="text"
                                            placeholder="Username"
                                            value={formData.username}
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
                                    <Button onClick={handleLogin} disabled={isLoading}>
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </Button>
                                </form>
                                <div className="mt-3 text-center">
                                    <p>Don't have an account? <a href="/authentication/register">Register here</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Authentification;