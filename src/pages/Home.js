import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className = "home-container">
      <h1>Welcome to Smart Study Assistant</h1>
      <p>The one-stop platform for smart study tools!</p>
      <nav>
      <Link to="/login" className="link-button">Login</Link>
      <Link to="/register" className="link-button">Register</Link>
      </nav>
    </div>
  );
};

export default Home;