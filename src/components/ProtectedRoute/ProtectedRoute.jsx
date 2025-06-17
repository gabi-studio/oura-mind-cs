//----------------------
// /components/ProtectedRoute.jsx
// This component protects routes that require authentication
// It checks if the user is authenticated, is an admin, etc.
// If not, it redirects to the login page or dashboard as appropriate
//-----------------------

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';



const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Get authentication status from useAuth context
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // console.log('ProtectedRoute: checking access...', {
  //   isAuthenticated,
  //   isAdmin,
  //   loading,
  //   currentPath: location.pathname,
  //   adminOnly
  // });

  // Show loading spinner and loading message while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#1a1a1a'
      }}>
        <LoadingSpinner text="Checking access..." />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If admin-only route but user is not admin, redirect to dashboard
  if (adminOnly && !isAdmin) {
    console.log('ProtectedRoute: Admin required but user is not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // All checks passed, render the protected component
  // Children refers to the component in App.jsx that is wrapped by ProtectedRoute
  console.log('ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;