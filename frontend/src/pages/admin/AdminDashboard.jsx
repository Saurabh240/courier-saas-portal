import React from "react";
import Layout from "../../components/Layout";

const AdminDashboard = () => {
  return (
    <Layout userType="admin">
      <h1 className="text-2xl font-bold">Welcome to Admin Dashboard</h1>
      {/* Add your admin-specific content here */}
    </Layout>
  );
};

export default AdminDashboard;
