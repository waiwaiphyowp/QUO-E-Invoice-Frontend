import React, { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'; 
import './Invoices.css';

function Invoices() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/signin');
  };

  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="invoices-wrapper">
      <Navbar 
        username={user.username}
        onLogout={handleLogout}
      />
      <div className="invoices-content">
        <button className="create-invoice-btn">+ Create New Invoice</button>
      </div>
    </div>
  );
}

export default Invoices;