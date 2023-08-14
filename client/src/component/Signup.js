import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    let navigate = useNavigate();
    const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:5000/signup', { username, password, email });
            console.log(response.data);
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="auth-page">
            <div className="auth-form">
                <h2>Sign Up</h2>
                <div className="form-field">
                    <label className="form-label">Email Id:</label>
                    <input type="text" className="form-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-field">
                    <label className="form-label">Username:</label>
                    <input type="text" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-field">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="auth-button" onClick={handleSignup}>Sign Up</button>
            </div>
        </div>
    )
}

export default Signup
