/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
  user: { id: string; name: string; email: string; phone?: string } | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Axios instance for API
const api = axios.create({
  baseURL: "http://localhost:5000",
  // Changed to false since we're using token-based auth, not cookie-based auth
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

// Set up interceptor to always include the token in requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; name: string; email: string; phone?: string } | null>(null);
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  // Login with backend
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user: userData, token } = response.data;

      if (userData && token) {
        localStorage.setItem("token", token);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
        return true;
      } else {
        console.error("Login response missing user data or token");
        return false;
      }
    } catch (error: any) {
      console.error("Login failed:", error.response?.data?.message || error.message);
      return false;
    }
  };

  // Signup with backend
  const signUp = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      // Include all fields in request, including optional phone
      const signupData = { name, email, password, phone: phone || "" };
      console.log("Sending signup data:", signupData);
      
      const response = await api.post("/auth/signup", signupData);
      const { user: userData, token } = response.data;

      if (userData && token) {
        localStorage.setItem("token", token);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/dashboard");
        return true;
      } else {
        console.error("Signup response missing user data or token");
        return false;
      }
    } catch (error: any) {
      console.error("Signup failed:", error.response?.data?.message || error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        
        // Optionally verify token is still valid
        // This makes a request to the backend when the app loads to verify the token
        api.get("/auth/me")
          .catch(() => {
            // If token is invalid, log the user out
            logout();
          });
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};