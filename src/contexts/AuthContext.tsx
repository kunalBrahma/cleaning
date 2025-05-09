/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface AuthContextType {
  user: { id: string; name: string; email: string; phone?: string } | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string, phoneNumber: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Axios instance for API
const api = axios.create({
  baseURL: "/api",
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
  const [loading, setLoading] = useState(true); // Ensure loading is true initially
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

  // Signup with backend - match the name signUp to match your AuthDialog
  // And map phoneNumber to phone for the backend
  const signUp = async (name: string, email: string, password: string, phoneNumber: string): Promise<boolean> => {
    try {
      // Map phoneNumber to phone for the backend
      const response = await api.post("/auth/signup", { 
        name, 
        email, 
        password, 
        phone: phoneNumber // Backend expects 'phone', not 'phoneNumber'
      });
      
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

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Verify token and fetch user data on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      try {
        // Set user immediately from localStorage
        setUser(JSON.parse(storedUser));

        // Verify token with backend
        const verifyToken = async () => {
          try {
            const response = await api.get("/auth/me");
            // Update with fresh user data from server
            setUser(response.data.user);
            localStorage.setItem("user", JSON.stringify(response.data.user));
          } catch (error: any) {
            console.error("Token verification failed:", error);
            // Only logout if we get a 401 Unauthorized response
            if (error.response?.status === 401) {
              logout();
            }
          } finally {
            setLoading(false); // Set loading to false after verification
          }
        };

        verifyToken();
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        logout();
        setLoading(false);
      }
    } else {
      setLoading(false); // Set loading to false if no token or user is found
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signUp, logout }}>
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