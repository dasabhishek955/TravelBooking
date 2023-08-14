import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    let navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            setToken(response.data.token);
            console.log('Login successful');
            console.log(response.data.token);
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            navigate("/", { state: { user_id: response.data.user_id } });

        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-form">
                <h2>Login</h2>
                <div className="form-field">
                    <label className="form-label">Username:</label>
                    <input type="text" className="form-input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="form-field">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-input" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="auth-button" onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
}

export default Login