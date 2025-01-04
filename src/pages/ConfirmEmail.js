import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../components/UserPool';
import './ConfirmEmail.css'; // Optional CSS for styling

const ConfirmEmail = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });

        user.confirmRegistration(code, true, (err, result) => {
            if (err) {
                console.error('Error confirming email:', err);
                setMessage(`Error: ${err.message}`);
                return;
            }
            console.log('Email confirmed:', result);
            setMessage('Email successfully confirmed. You can now log in.');
        });
    };

    const handleResendCode = () => {
        const user = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });
    
        user.resendConfirmationCode((err, result) => {
            if (err) {
                console.error('Error resending code:', err);
                setMessage(`Error: ${err.message}`);
                return;
            }
            console.log('Confirmation code resent:', result);
            setMessage('Confirmation code resent. Check your email.');
        });
    };

    return (
        <div className="confirm-email-container">
            <h2>Confirm Email</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="6-digit Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button type="submit">Confirm Email</button>
            </form>
            <button style={{ marginTop: '10px' }} onClick={handleResendCode}>Resend Code</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ConfirmEmail;
