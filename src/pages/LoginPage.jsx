import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { login, loading, isAuthenticated, clearError } = useAuth();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    clearError();
    setLocalError('');
  }, [clearError]);

  console.log('LoginPage: Auth status:', { isAuthenticated, loading });

  // Only redirect if we're not loading and user is authenticated
  if (!loading && isAuthenticated) {
    console.log('LoginPage: User authenticated, redirecting to:', from);
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }

    console.log('LoginPage: Attempting login...');

    const result = await login(email, password);
    console.log('LoginPage: Login result:', result);
    
    if (!result.success) {
      console.error('LoginPage: Login failed:', result.error);
      setLocalError(result.error);
    } else {
      console.log('LoginPage: Login successful!');
      // Redirect will happen automatically on next render when isAuthenticated becomes true
    }
  };

  // Show loading state if authentication is being checked
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: '#1a1a1a'
      }}>
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="auth-page">
      
      <form onSubmit={handleSubmit} className="auth-form">
        
        <h2 className="auth-title">Login to Your Journal</h2>
        
        {localError && (
          <div className="auth-error" role="alert">
            {localError}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="form-input"
            required
            autoComplete="email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="form-input"
            required
            autoComplete="current-password"
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="auth-submit-btn"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;