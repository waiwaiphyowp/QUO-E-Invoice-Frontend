import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import InvoiceList from '../InoviceList/InvoicesList';
import './Home.css';

function Home() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);

  const handleLogout = () => {
    setUser(null);
    navigate('/signin');
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="home-wrapper">
      <Navbar 
        username={user.username}
        onLogout={handleLogout}
      />
      <div className="home-container">
        <div className="status-buttons">
          <button 
            className={`paid-btn ${status === 'paid' ? 'active' : ''}`} 
            onClick={() => setStatus('paid')}
          >
            Paid
          </button>
          <button 
            className={`unpaid-btn ${status === 'unpaid' ? 'active' : ''}`} 
            onClick={() => setStatus('unpaid')}
          >
            Unpaid
          </button>
          <button 
            className={`draft-btn ${status === 'draft' ? 'active' : ''}`} 
            onClick={() => setStatus('draft')}
          >
            Draft
          </button>
        </div>
        
        {status && (
          <InvoiceList 
            status={status} 
            title={`${status.charAt(0).toUpperCase() + status.slice(1)} Invoices`} 
          />
        )}
      </div>
    </div>
  );
}

export default Home;