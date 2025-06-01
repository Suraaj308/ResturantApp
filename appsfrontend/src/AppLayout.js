// AppLayout.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import './AppLayout.css';

const AppLayout = ({ children }) => {
    const token = localStorage.getItem('token');
    const location = useLocation();

    // Define protected routes
    const protectedRoutes = ['/', '/tables', '/ordertickets'];

    // Redirect to login if no token and trying to access a protected route
    if (!token && protectedRoutes.includes(location.pathname)) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="app-layout">
            {token && <Sidebar />}
            <div className="content">
                {children}
            </div>
        </div>
    );
};

export default AppLayout;