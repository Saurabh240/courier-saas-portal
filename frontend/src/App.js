import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Route, Routes, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StaffDashboard from "./pages/staff/StaffDashboard";
import PartnerDashboard from "./pages/partner/PartnerDashboard";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";
import PendingOrdersPage from "./pages/admin/PendingOrdersPage";
import DeliveredOrdersPage from "./pages/admin/DeliveredOrdersPage";
import CreateOrderPage from "./pages/admin/CreateOrderPage";
import OrderDetailPage from "./pages/admin/OrderDetailPage";
import EditOrderPage from "./pages/admin/EditOrderPage";
// Protect routes based on role
function PrivateRoute({ children, role }) {
  const { user } = useAuth();
  return user && user.role === role ? children : <Navigate to="/login" />;
}



// HomeRedirect component to show HomePage for non-logged users or redirect by role
function HomeRedirect() {
  const { user } = useAuth();

  if (!user) return <Home />; // Show public home if not logged in

  // Redirect logged-in users based on their role
  switch (user.role) {
    case "ADMIN":
      return <Navigate to="/admin" />;
    case "STAFF":
      return <Navigate to="/staff" />;
    case "DELIVERY_PARTNER":
      return <Navigate to="/partner" />;
    case "CUSTOMER":
      return <Navigate to="/customer" />;
    default:
      return <Navigate to="/" />;
  }
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }
  return (
    
      <>
      
    <Routes>
      <Route path="/" element={<HomeRedirect />} />

      {/* Public routes */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Private routes */}
      <Route
        path="/admin"
        element={
          <PrivateRoute role="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/admin/orders/pending" element={<PendingOrdersPage />} />
      <Route path="/admin/orders/delivered" element={<DeliveredOrdersPage />} />
      <Route path="admin/orders/new" element={<CreateOrderPage />} />
      <Route path="/admin/orders/:id" element={<OrderDetailPage />} />
      <Route path="/admin/orders/edit/:id" element={<EditOrderPage />} />
      <Route
        path="/staff"
        element={
          <PrivateRoute role="STAFF">
            <StaffDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/partner"
        element={
          <PrivateRoute role="DELIVERY_PARTNER">
            <PartnerDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/customer"
        element={
          <PrivateRoute role="CUSTOMER">
            <CustomerDashboard />
          </PrivateRoute>
        }
      />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
     <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
        />
        </>
    
  );
}

export default App;
