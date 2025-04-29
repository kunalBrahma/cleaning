import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of the AuthContext
interface AuthContextType {
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (userData: { name: string; email: string }) => void;
  logout: () => void;
}

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigate = useNavigate();

  // Check if the user is authenticated
  const isAuthenticated = !!user;

  // Login function
  const login = (userData: { name: string; email: string }) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
    navigate('/dashboard'); // Redirect to dashboard after login
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from localStorage
    navigate('/login'); // Redirect to login after logout
  };

  // Load user data from localStorage on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

