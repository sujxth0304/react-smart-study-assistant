import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <p>This is your study dashboard. You can add study-related features here.</p>
      <button  className = "logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
