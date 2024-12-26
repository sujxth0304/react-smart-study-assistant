import React, { createContext, useState, useContext, useEffect } from 'react';

// creating Auth Context
const AuthContext = createContext();

// custom hook for auth context
export const useAuth = () => useContext(AuthContext);

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Add loading state


  // check localStorage for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);  // Set loading to false after check
  }, []);

  // Login function  
  const login = (userData) => {
    // Make sure we're storing the token properly
    const userToStore = {
      ...userData,
      token: userData.token  // Ensure token is included
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};