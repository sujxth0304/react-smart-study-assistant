import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';   

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Get loading state from context

  // Loading state check
  if (loading) {
    return <div>Loading...</div>; // You can show a loading spinner or text
  }

  if (!user) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }
  return children; // Return children components if authenticated
};

export default ProtectedRoute;
