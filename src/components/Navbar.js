import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../styles/img/logo.png';

function Navbar() {
    return (
        <nav>
            <div className="container">
                <Link to="/">
                    <img src={logo} alt='Logo' />
                </Link>
                <div className="nav-links">
                    <Link style={{backgroundColor: "#161616"}} to="/">Home</Link>
                    <Link style={{backgroundColor: "#161616"}} to="/products">Produtos</Link>
                    <Link style={{backgroundColor: "#161616"}} to="/reports">Relatórios</Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;