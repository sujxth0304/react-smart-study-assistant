import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pomodoro from './pages/Pomodoro';
import Notes from './pages/Notes';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/pomodoro" element={
        <ProtectedRoute>
          <Pomodoro />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/notes" element={
        <ProtectedRoute>
          <Notes />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;