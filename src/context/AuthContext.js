import React, { creayeContext, useState, useContext, useEffect, createContext } from 'react';
// creating Auth Context
const AuthContext = createContext();
// custom hook for auth context
export const useAuth = () => useContext(AuthContext);
// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // check localStorage for saved user on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if(savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Login function  
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    // Logout function
    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return(
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}