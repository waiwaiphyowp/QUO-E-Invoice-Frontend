import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../../services/authServices';
import { UserContext } from '../../contexts/userContext';
import './SignUp.css';

function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password || !formData.passwordConf) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.passwordConf) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    // console.log(formData)
    try {
      const newUser = await signUp(formData);
      setUser(newUser);
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-content">
        <h2>Sign Up</h2>
        {error && <div>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="passwordConf">Confirm Password</label>
            <input
              id="passwordConf"
              type="password"
              name="passwordConf"
              value={formData.passwordConf}
              onChange={handleChange}
              
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        
        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
      <div className="title-container">
        <h1>QUO</h1>
      </div>
    </div>
  );
}

export default SignUp;