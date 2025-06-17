import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Navigation from './components/Reusables/Navigation';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ReflectorDashboard from './components/Dashboard/ReflectorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import CreateJournalEntryPage from './pages/CreateJournalEntryPage';
import JournalEntryPage from './pages/JournalEntryPage';
import EditJournalEntryPage from './pages/EditJournalEntryPage';
import CompletedToolViewPage from './pages/CompletedToolViewPage';
import ToolFormPage from './pages/ToolFormPage';
import EditToolEntryPage from './pages/EditToolEntryPage';
import MyJournalsPage from './pages/backup-MyJournalsPage';
import Analysis from './pages/Analysis';
import './styles/Landing.css';
import './styles/PlaceholderPages.css';
import './styles/App.css';

// Landing page component
function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="landing-title">Welcome to Oura Mind Journal</h1>
        <p className="landing-subtitle">
          A safe space for reflection, growth, and emotional wellness.
        </p>
        <div className="landing-buttons">
          <a href="/login" className="landing-btn login">
            Login
          </a>
          <a href="/register" className="landing-btn register">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard that chooses admin vs reflector view
function Dashboard() {
  const { isAdmin } = useAuth();
  
  return (
    <div>
      
      {isAdmin ? <AdminDashboard /> : <ReflectorDashboard />}
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navigation />
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            

            {/* To Do: Add the Analytics Page */}

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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;