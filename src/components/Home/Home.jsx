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
          <button className="paid-btn" onClick={() => navigate('/paid')}>Paid</button>
          <button className="unpaid-btn" onClick={() => navigate('/unpaid')}>Unpaid</button>
          <button className="draft-btn" onClick={() => navigate('/draft')}>Draft</button>
        </div>
      </div>
    </div>
  );
}

export default Home;