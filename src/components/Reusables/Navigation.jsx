import { useAuth } from '../../contexts/AuthContext';
import './navigation.css';

//---------------------------------------
// Navigation component for the Oura Mind
// This reusable component provides a consistent navigation bar across the app
// Depending on the user's role, it shows different links
//----------------------------------------


function Navigation() {
    // Use the Auth context to get user info and auth functions
  const { user, logout, isAdmin } = useAuth();

  // To handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-left">
        <h2 className="nav-title">Oura Mind</h2>
        
        {/* All user types (Currently Reflector and Admins) will have their own dashboards
        -- This will show different resources depending on User Role*/}
        <div className="nav-links">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          
          {/* Only show journal-related links for Reflectors/non-admin users */}
          {!isAdmin && (
            <>
              <a href="/journal" className="nav-link">My Journal</a>
              <a href="/analysis" className="nav-link">Mood Trends</a>
              <a href="/journal/new" className="nav-link">Write New Journal Entry</a>
            </>
          )}
        </div>
      </div>
      
      {/* TO DO: User profile/account management */}
      <div className="nav-right">
        <a href="/profile" className="nav-user-link">
          Hi, {user?.name}! {isAdmin && <span className="admin-badge"> (Admin)</span>}
        </a>

        {/* Logout */}
        <button onClick={handleLogout} className="nav-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navigation;