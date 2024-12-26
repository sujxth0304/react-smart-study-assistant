import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

useEffect(() => {
  const fetchStudyPlans = async () => {
    if (!user || !user.token) {  // Add this check
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/study-plans', {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
        
      if (response.data && response.data.studyPlans) {
        setStudyPlans(response.data.studyPlans);
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching study plans:', err);
      setError(err.response?.data?.message || 'Failed to fetch study plans');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
};

    fetchStudyPlans();
  }, [user, user?.token, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdatePlan = async (planId, updatedPlan) => {
    try {
      console.log('Updating study plan:', planId, updatedPlan); // Debugging log
      const response = await axios.put(`http://localhost:5000/api/study-plans/${planId}`, updatedPlan, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      console.log('Updated Study Plan:', response.data.studyPlan); // Debugging log
      setStudyPlans(studyPlans.map(plan => (plan._id === planId ? response.data.studyPlan : plan)));
    } catch (err) {
      console.error('Error updating study plan:', err); // Debugging log
      setError('Failed to update study plan');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>This is your study dashboard. You can add study-related features here.</p>
      <div className="study-plans">
        {studyPlans.length > 0 ? (
          studyPlans.map(plan => (
            <div key={plan._id} className="study-plan">
              <h2>{plan.title}</h2>
              <p>{plan.description}</p>
              <p>Tasks: {plan.tasks.length}</p>
              <button onClick={() => handleUpdatePlan(plan._id, { ...plan, title: 'Updated Title' })}>Update Plan</button>
            </div>
          ))
        ) : (
          <p>No study plans available. Please add a study plan.</p>
        )}
      </div>
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
