import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [studyPlans, setStudyPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudyPlans = async () => {
      if (!user || !user.token) {
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
  }, [user, logout, navigate]);

  const handleUpdatePlan = async (planId, updatedPlan) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/study-plans/${planId}`,
        updatedPlan,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      
      if (response.data && response.data.studyPlan) {
        setStudyPlans(studyPlans.map(plan => 
          plan._id === planId ? response.data.studyPlan : plan
        ));
      }
    } catch (err) {
      console.error('Error updating study plan:', err);
      setError('Failed to update study plan');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          Smart Study
        </div>
        <nav className="nav-links">
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            Study Plans
          </Link>
          <Link to="/dashboard/pomodoro" className={`nav-link ${location.pathname === '/dashboard/pomodoro' ? 'active' : ''}`}>
            Pomodoro Timer
          </Link>
          <Link to="/dashboard/notes" className={`nav-link ${location.pathname === '/dashboard/notes' ? 'active' : ''}`}>
            Notes
          </Link>
          <Link to="/dashboard/settings" className={`nav-link ${location.pathname === '/dashboard/settings' ? 'active' : ''}`}>
            Settings
          </Link>
          <button 
            onClick={handleLogout} 
            className="nav-link logout-button" 
            style={{ 
              border: 'none', 
              width: '100%', 
              textAlign: 'left',
              backgroundColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-container">
          <h1>Dashboard</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="study-plans">
            {studyPlans.length > 0 ? (
              studyPlans.map(plan => (
                <div key={plan._id} className="study-plan">
                  <h2>{plan.title}</h2>
                  <p>{plan.description}</p>
                  <p>Tasks: {plan.tasks.length}</p>
                  <button onClick={() => handleUpdatePlan(plan._id, { ...plan, title: 'Updated Title' })}>
                    Update Plan
                  </button>
                </div>
              ))
            ) : (
              <p>No study plans available. Please add a study plan.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;