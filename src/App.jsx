import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navigation from './components/Reusables/Navigation';

import LandingPage from './pages/LandingPage';
import PublicNavBar from './components/PublicNavBar/PublicNavBar';
import AboutOuraPage from './pages/AboutOuraPage';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
// import ReflectorDashboard from './components/Dashboard/ReflectorDashboard';
// import AdminDashboard from './components/Dashboard/AdminDashboard';
// These imports are now moved to the pages section ^^

import AdminDashboard from './pages/AdminDashboard';
import ReflectorDashboard from './pages/ReflectorDashboard';

import CreateJournalEntryPage from './pages/JournalWritePage';
import JournalEntryPage from './pages/JournalEntryPage';
import EditJournalEntryPage from './pages/EditJournalEntryPage';

import CompletedToolViewPage from './pages/CompletedToolViewPage';
import ToolFormPage from './pages/ToolFormPage';

import MyJournalsPage from './pages/MyJournalsPage';
import Analysis from './pages/Analysis';

import PublicEntryPage from './pages/PublicEntryPage';

import Footer from './components/Reusables/Footer';

import { ToastContainer } from 'react-toastify';


import './styles/Landing.css';
import './styles/PlaceholderPages.css';
import './styles/App.css';


// -------------------------------
// Landing page component
// -------------------------------
// function LandingPage() {
//   return (
//     <div className="landing-page">
//       <div className="landing-container">
//         <h1 className="landing-title">Welcome to Oura Mind Journal</h1>
//         <p className="landing-subtitle">
//           A safe space for reflection, growth, and emotional wellness.
//         </p>
//         <div className="landing-buttons">
//           <a href="/login" className="landing-btn login">Login</a>
//           <a href="/register" className="landing-btn register">Sign Up</a>
//         </div>
//       </div>
//     </div>
//   );
// }

// -------------------------------
// Main Dashboard selector
// This component decides which dashboard to show based on user role
// -------------------------------
function Dashboard() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <ReflectorDashboard />;
}

// -------------------------------
// Main App Content
// Handles navigation visibility
// and routes for the application
// -------------------------------
function AppContent() {
  const location = useLocation();
  // Pages without nav: landing, login, register, and public journal entries
  // Public journal entries will have a token in the URL
  // const hideNavOn = ['/', '/login', '/register'];
  const { isAuthenticated } = useAuth();
  const isPublicShare = location.pathname.startsWith('/public/');
  const showPublicNavBar = !isAuthenticated && !isPublicShare;
  const showAuthenticatedNavbar = isAuthenticated;

  return (
    <>
        
      {showPublicNavBar && <PublicNavBar />}
      {showAuthenticatedNavbar && <Navigation />}

      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutOuraPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/public/:token" element={<PublicEntryPage />} />

        {/* 
        --- Every route below this line requires authentication 
        --- ProtectedRoute component will handle the authentication check
        --- If not authenticated, it redirects to the login page
        */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal/new"
            element={
              <ProtectedRoute>
                <CreateJournalEntryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal/:entryId"
            element={
              <ProtectedRoute>
                <JournalEntryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal/:entryId/edit"
            element={
              <ProtectedRoute>
                <EditJournalEntryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tools/:toolPath/:entryId"
            element={
              <ProtectedRoute>
                <ToolFormPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tools/:path/view/:entryId"
            element={
              <ProtectedRoute>
                <CompletedToolViewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tools/:toolPath/edit/:entryId"
            element={
              <ProtectedRoute>
                <ToolFormPage isEditing={true} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <MyJournalsPage />
              </ProtectedRoute>
            }
          />

          

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

    <ToastContainer />
      {showAuthenticatedNavbar && <Footer />}
    </>
  );
}

// -------------------------------
// App Root
// -------------------------------
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>

    
  );
}

export default App;
