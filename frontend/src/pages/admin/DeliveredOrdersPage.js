import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OrderTable from "../../components/OrderTable";
import Layout from "../../components/Layout";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export default function DeliveredOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({
    id: "",
    sender: "",
    receiver: "",
  });
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const pageSize = 25;

  // Fetch all delivered orders once
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token)
          throw new Error("No authentication token found. Please login again.");

        const response = await fetch(`${baseUrl}/api/orders?status=DELIVERED`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem("token");
          throw new Error("Session expired. Please login again.");
        }

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const orderList = Array.isArray(data) ? data : data.content || [];
        setOrders(orderList);
        setFilteredOrders(orderList);
      } catch (err) {
        setError(err.message);
        setOrders([]);
        setFilteredOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // frontend filtering
  useEffect(() => {
    const result = orders.filter((order) => {
      const matchId =
        !filters.id ||
        order.id?.toString().toLowerCase().includes(filters.id.toLowerCase());
      const matchSender =
        !filters.sender ||
        order.senderName?.toLowerCase().includes(filters.sender.toLowerCase());
      const matchReceiver =
        !filters.receiver ||
        order.receiverName
          ?.toLowerCase()
          .includes(filters.receiver.toLowerCase());
      return matchId && matchSender && matchReceiver;
    });

    setFilteredOrders(result);
    setCurrentPage(1); // reset page when filter changes
  }, [filters, orders]);

  const totalItems = filteredOrders.length;
  const startIndex = totalItems > 0 ? (currentPage - 1) * pageSize : 0;
  const endIndex =
    totalItems > 0 ? Math.min(startIndex + pageSize, totalItems) : 0;

  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const onPageChange = (page) => setCurrentPage(page);

  const onOrderClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <Layout userType="admin">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Delivered Orders</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            {error}
          </div>
        )}

        <OrderTable
          orders={paginatedOrders}
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={onPageChange}
          filters={filters}
          onFilterChange={onFilterChange}
          loading={loading}
          hasNextPage={endIndex < totalItems}
          onOrderClick={onOrderClick}
        />
      </div>
    </Layout>
  );
}
