import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import EventDetailPage from './pages/EventDetailPage';
import Chatpage from './pages/Chatpage';
import LoginPage from './pages/LoginPage';
import CallbackPage from './pages/CallbackPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authLoaded } = useAuth();

  if (!authLoaded) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { isAuthenticated, authLoaded } = useAuth();

  if (!authLoaded) {
    return <div>Loading...</div>; // Prevents flashing UI
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        }
      />

      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/events/:itemId"
        element={
          <ProtectedRoute>
            <Layout>
              <EventDetailPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory-assistant"
        element={
          <ProtectedRoute>
            <Layout>
              <Chatpage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
