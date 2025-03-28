import React, { useContext } from 'react';
import { UserContext } from '../../contexts/userContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar'; 
import './Home.css';

function Home() {
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
    <div className="home-wrapper">
      <Navbar 
        username={user.username}
        onLogout={handleLogout}
      />
      <div className="home-container">
          <div className="status-buttons">
        <button className="paid-btn">Paid</button>
        <button className="unpaid-btn">Unpaid</button>
        <button className="draft-btn">Draft</button>
        </div>
      </div>
    </div>
  );
}

export default Home;