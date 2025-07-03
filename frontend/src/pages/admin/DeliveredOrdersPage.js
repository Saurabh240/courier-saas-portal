import React, { useState, useEffect } from "react";
import OrderTable from "../../components/OrderTable";

const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export default function DeliveredOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filters, setFilters] = useState({ 
    sender: "", 
    receiver: "", 
    email: "" 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 25;

  const fetchOrders = async (page = 1, searchFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
        status: 'DELIVERED'
      });

      if (searchFilters.sender) {
        params.append('senderName', searchFilters.sender);
      }
      if (searchFilters.receiver) {
        params.append('receiverName', searchFilters.receiver);
      }
      if (searchFilters.email) {
        params.append('customerEmail', searchFilters.email);
      }

      const token = localStorage.getItem("token");
      
      // Debug token issues
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      console.log('Making request with token:', token ? 'Token exists' : 'No token');

      const response = await fetch(`${baseUrl}/api/orders?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      // Handle specific 401 error
      if (response.status === 401) {
        localStorage.removeItem("token"); // Clear invalid token
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.content) {
        setOrders(data.content);
        setTotalItems(data.totalElements || 0);
        setTotalPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        setOrders(data);
        setTotalItems(data.length);
        setTotalPages(Math.ceil(data.length / pageSize));
      } else {
        setOrders([]);
        setTotalItems(0);
        setTotalPages(1);
      }

    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
      setOrders([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage, filters);
  }, [currentPage, filters]);

  const onFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Delivered Orders</h2>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-red-700 font-medium">Authentication Error</p>
              <p className="text-red-600 text-sm">{error}</p>
              {error.includes('Session expired') && (
                <p className="text-red-600 text-xs mt-1">Please refresh the page and login again.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <OrderTable
        orders={orders}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={onPageChange}
        filters={filters}
        onFilterChange={onFilterChange}
        loading={loading}
      />
    </div>
  );
}