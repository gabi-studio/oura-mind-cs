//----------------------
// AuthContext.jsx
// This file manages user authentication state and provides methods for login, registration
//----------------------


import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/authService';

// Create a "box" to store authentication info
const AuthContext = createContext();

// A hook to easily access AuthContext
// So components can use it without needing to import useContext directly

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// This component wraps up the app and provides auth info to everything inside
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the logged-in user
  const [loading, setLoading] = useState(true); // Show loading state while checking login
  const [error, setError] = useState(null); // Store any auth-related errors

  // When the app starts, check if a user is already logged in
  // This is done by making a request to the backend to get the current user
  // If a user is found, set it in state; otherwise, set user to null
  const checkIfLoggedIn = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_OURA_API_BASE_URL}/auth/me`, {
        credentials: 'include', // Include credentials with the request
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('Auth check: User found:', data.user);
        setUser(data.user);
      } else {
        // console.log('Auth check: No user logged in');
        setUser(null);
      }
    } catch (error) {
      // console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  //--------------------
  // Log a user in
  // Takes an email and password, 
  // sends them to the server, and stores the user data if successful
  // If login fails,
  // It returns an object with success status and error message if any
  //--------------------
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      console.log('AuthContext: Starting login...');
      const data = await loginUser(email, password);
      console.log('AuthContext: Login response:', data);

      if (data && data.user) {
        setUser(data.user);
        console.log('AuthContext: User set successfully:', data.user);
        return { success: true };
      } else {
        console.error('AuthContext: No user data in response');
        return { success: false, error: 'No user data received' };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  //--------------------
  // Register a new user
  // Taakes a name, email, and password,
  // sends them to the server, and stores the user data if successful
  // If registration fails, it returns an object with success status and error message if any
  // --------------------
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setError(null);

      const data = await registerUser(name, email, password);
      if (data && data.user) {
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: 'No user data received' };
      }
    } catch (error) {
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };


  //--------------------
  // Log a user out
  // This calls the logout service and clears the user state
  // Redirect to landing page after logout
  // --------------------
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      window.location.href = '/'; 
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  //--------------------
  // Update user profile (name + email)
  // TO DO:
  //--------------------    
  const updateProfile = async (name, email) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_OURA_API_BASE_URL}/auth/update-profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) throw new Error('Profile update failed');

      const data = await response.json();
      setUser(data.user); // Update local user context with new data
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  //--------------------
  // Update user password
  // TO DO:
  //--------------------  
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${import.meta.env.VITE_OURA_API_BASE_URL}/auth/update-password`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: currentPassword, newPassword }),
      });

      if (!response.ok) throw new Error('Password update failed');

      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Check if a user is logged in on app startup
  useEffect(() => {
    checkIfLoggedIn();
  }, []);

  // Bundle everything to share with the rest of the app
  const authInfo = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,    
    updatePassword,   
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    clearError: () => setError(null),
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};
