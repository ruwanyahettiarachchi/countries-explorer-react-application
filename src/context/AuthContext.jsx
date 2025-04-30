import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkAuth, login, logout } from '../services/auth';

// Create context
export const AuthContext = createContext();

// Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from session/cookie)
  useEffect(() => {
    const checkUserAuth = async () => {
      const { isAuthenticated, username } = checkAuth();
      
      if (isAuthenticated && username) {
        setUser({ username });
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };
    
    checkUserAuth();
  }, []);

  // Login handler
  const handleLogin = async (username, password) => {
    const result = login(username, password);
    
    if (result.success) {
      setUser({ username: result.username });
      return { success: true };
    }
    
    return { success: false, message: result.message };
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    setUser(null);
  };

  // Context value
  const value = {
    user,
    isAuthenticated: !!user,
    login: handleLogin,
    logout: handleLogout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};