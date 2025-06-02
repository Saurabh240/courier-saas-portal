import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from './Pages/admin/AdminDashboard';
import StaffDashboard from './Pages/staff/StaffDashboard';
import PartnerDashboard from './Pages/partner/PartnerDashboard';
import CustomerDashboard from './Pages/customer/CustomerDashboard';
import LoginPage from './Pages/LoginPage';
import { AuthProvider, useAuth } from './Context/AuthContext';
import SignUp from './Pages/SignUp';

function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  return user && user.role === role ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/admin" element={<PrivateRoute role="ADMIN"><AdminDashboard /></PrivateRoute>} />
          <Route path="/staff" element={<PrivateRoute role="STAFF"><StaffDashboard /></PrivateRoute>} />
          <Route path="/partner" element={<PrivateRoute role="DELIVERY_PARTNER"><PartnerDashboard /></PrivateRoute>} />
          <Route path="/customer" element={<PrivateRoute role="CUSTOMER"><CustomerDashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;