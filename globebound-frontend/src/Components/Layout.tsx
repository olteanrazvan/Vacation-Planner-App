import React from 'react';
import Navigation from './Navigation';
import backgroundImage from "../background.jpg";

interface LayoutProps {
    children: React.ReactNode;
    showNav?: boolean;
}

function Layout({ children, showNav = true }: LayoutProps) {
    return (
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            margin: '0',
            padding: '0',
            minHeight: '100vh',
            position: 'relative'
        }}>
            {showNav && <Navigation />}
            <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                minHeight: '100vh',
                paddingTop: showNav ? '60px' : '0'
            }}>
                {children}
            </div>
        </div>
    );
}

export default Layout;