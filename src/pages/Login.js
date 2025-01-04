import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import './Login.css';
import UserPool from '../components/UserPool';
import { useAuth } from '../components/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });

        const authDetails = new AuthenticationDetails({
            Username: email,
            Password: password,
        });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                console.log('Login successful:', result);
                login(user); // AuthContext handles fetching attributes and tokens
                navigate('/');
            },
            onFailure: (err) => {
                console.error('Login failed:', err);
            },
            newPasswordRequired: (data) => {
                console.log('New password required:', data);
            },
        });
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <Link to="/SignUp">Sign Up</Link></p>
        </div>
    );
};

export default Login;
