import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './pages/admin/AdminDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignUp';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protect routes based on role
function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  return user && user.role === role ? children : <Navigate to="/login" />;
}

// Home route redirect logic
function HomeRedirect() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // Redirect to specific dashboard based on user role
  switch (user.role) {
    case 'ADMIN':
      return <Navigate to="/admin" />;
    case 'STAFF':
      return <Navigate to="/staff" />;
    case 'DELIVERY_PARTNER':
      return <Navigate to="/partner" />;
    case 'CUSTOMER':
      return <Navigate to="/customer" />;
    default:
      return <Navigate to="/login" />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect / to login or user-specific dashboard */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Public Routes */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Private Routes */}
          <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
          <Route path="/staff" element={<PrivateRoute role="STAFF"><StaffDashboard /></PrivateRoute>} />
          <Route path="/partner" element={<PrivateRoute role="DELIVERY_PARTNER"><PartnerDashboard /></PrivateRoute>} />
          <Route path="/customer" element={<PrivateRoute role="CUSTOMER"><CustomerDashboard /></PrivateRoute>} />

          {/* Catch-All Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
