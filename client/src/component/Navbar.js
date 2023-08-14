import React from 'react'
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
    let navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                {!localStorage.getItem('token') ?
                    <div className="navbar-buttons">
                        <Link className="auth-button" to="/signup" role="button">Signup</Link>
                        <Link className="auth-button" to="/login" role="button">Login</Link>
                    </div> : <button onClick={handleLogout} className="auth-button">Logout</button>}
            </div>
        </nav>
    );
}

export default Navbar
