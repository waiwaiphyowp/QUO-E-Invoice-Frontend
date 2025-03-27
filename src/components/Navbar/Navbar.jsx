import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ username, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/home">QUO</Link>
      </div>
      <div className="navbar-user">
        <span className="username">Welcome, {username}!</span>
      </div>
      <div className="navbar-links">
        <Link to="/home">Home</Link>
        <Link to="/invoices">Invoices</Link>
      </div>
      <div className="logout-container">
        <button 
          className="logout-btn"
          onClick={handleLogoutClick}
        >
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;