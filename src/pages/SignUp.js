import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import UserPool from '../components/UserPool';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js'; 

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('Consumer');
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const attributeList = [
            new CognitoUserAttribute({
                Name: 'custom:role',
                Value: role
            })
        ];
    
        UserPool.signUp(email, password, attributeList, null, (err, data) => {
            if (err) {
                console.error('Error during registration:', err);
            } else {
                console.log('Registration successful:', data);
                navigate('/confirm-email'); // Redirect to confirmation page
            }
        });
    };
    

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
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
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="Consumer">Consumer</option>
                    <option value="Provider">Provider</option>
                </select>
                <button type="submit">Sign Up</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
};

export default SignUp;