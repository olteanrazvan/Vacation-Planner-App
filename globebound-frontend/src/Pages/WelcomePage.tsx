// WelcomePage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Components/Layout';
import Button from '../Components/Button';

function WelcomePage() {
    const navigate = useNavigate();

    return (
        <Layout showNav={false}>
            <div className="container">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
                    <div className="text-center" style={{ maxWidth: '400px' }}>
                        <h1 className="display-4 mb-4">GlobeBound</h1>
                        <p className="lead mb-4">Your next adventure begins here</p>
                        <div className="d-flex flex-column gap-3">
                            <Button onClick={() => navigate('/authentication')}>
                                Login
                            </Button>
                            <Button onClick={() => navigate('/authentication/register')} color="secondary">
                                Register
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default WelcomePage;