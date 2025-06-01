// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Create this CSS file for styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    localStorage.setItem('token', data.token); // Store token in localStorage
                    navigate('/stats'); // Redirect to Menu (App.js)
                } else {
                    setError('No token received from server');
                }
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    const handleOrderNow = () => {
        localStorage.removeItem('token');
        navigate('/menu');
    };

    return (
        <div className="login-container">
            <button onClick={handleOrderNow} className="order-now-button">ORDER NOW</button>
            <h3>--------------------------------------------------------</h3>
            <h2>Login</h2>
            <h4>(staff only)</h4>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;