import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/Layout';

const STATUS_STYLING = {
  PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
  'PICKED UP': 'bg-blue-50 text-blue-600 border-blue-200',
  IN_TRANSIT: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  DELIVERED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-600 border-rose-200'
};


const getEmailFromToken = (token) => {
  try {
    if (!token) return '';
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload).sub || JSON.parse(jsonPayload).email || '';
  } catch (e) {
    return '';
  }
};

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const userEmail = getEmailFromToken(token);

      try {
    
        const response = await axios.get(`/api/orders/customer?page=${page}&limit=10&email=${encodeURIComponent(userEmail)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let data = [];
        let pagesCalculated = 1;

        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
          data = response.data.content || response.data.orders || [];
          pagesCalculated = response.data.totalPages || 1;
        } else {
          data = Array.isArray(response.data) ? response.data : [];
        }

        setOrders(data);
        
     
        if (activeTab === 'All') {
          setFilteredOrders(data);
        } else if (activeTab === 'Active') {
          setFilteredOrders(data.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'));
        } else {
          setFilteredOrders(data.filter(o => o.status?.toUpperCase() === activeTab.toUpperCase()));
        }

        setTotalPages(pagesCalculated);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your orders.');
        setOrders([]);
        setFilteredOrders([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [page, activeTab]);

  // Tab Filtering logic
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'All') {
      setFilteredOrders(orders);
    } else if (tabName === 'Active') {
      setFilteredOrders(orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED'));
    } else {
      setFilteredOrders(orders.filter(o => o.status?.toUpperCase() === tabName.toUpperCase()));
    }
  };

  return (
    <Layout userType="customer">
      <div className="space-y-6">
        
        {/* Title & Counter */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Orders</h1>
          <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full mt-1">
            {filteredOrders.length}
          </span>
        </div>

        {/* Pill Sub-Tabs Layout */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
          {['All', 'Active', 'Delivered', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white border-slate-900' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 space-y-4 animate-pulse">
            <div className="h-5 bg-slate-200 rounded w-1/6" />
            <div className="space-y-3 pt-4">
              {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-slate-100 rounded" />)}
            </div>
          </div>
        ) : error ? (
          <div className="p-5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty State Section */
          <div className="bg-white border border-slate-100 rounded-2xl p-16 text-center max-w-xl mx-auto my-12 shadow-sm">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold mb-4">📦</div>
            <h3 className="text-md font-bold text-slate-800 mb-1">No orders yet</h3>
            <p className="text-slate-400 text-xs mb-6">Place your first order and get your items delivered instantly.</p>
            <button
              onClick={() => navigate('/customer/orders/new')}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition"
            >
              Place Your First Order
            </button>
          </div>
        ) : (
          /*  Ordered Table View */
          <div className="bg-white rounded-2xl border border-slate-150/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">From</th>
                    <th className="p-4">To</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700 font-bold">
                  {filteredOrders.map((order) => {
                    const pickupLocation = order.pickupAddress || order.from || 'N/A';
                    const dropLocation = order.deliveryAddress || order.to || 'N/A';
                    const itemDetails = order.packageDetails || order.packageType || 'Parcel';

                    return (
                      <tr key={order.id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="p-4 pl-6 font-bold text-slate-900 tracking-tight">
                          {order.orderId || `ORD-${order.id}`}
                        </td>
                        <td className="p-4 text-slate-400 font-medium">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          }) : 'N/A'}
                        </td>
                        <td className="p-4 text-slate-500 font-medium max-w-[180px] truncate" title={pickupLocation}>
                          {pickupLocation}
                        </td>
                        <td className="p-4 text-slate-500 font-medium max-w-[180px] truncate" title={dropLocation}>
                          {dropLocation}
                        </td>
                        <td className="p-4 text-slate-400 font-medium max-w-[150px] truncate" title={itemDetails}>
                          {itemDetails}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wide uppercase border ${STATUS_STYLING[order.status?.toUpperCase()] || 'bg-slate-50 text-slate-500'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6">
                          {order.status === 'DELIVERED' ? (
                            <button
                              onClick={() => navigate(`/customer/invoice/${order.orderId || order.id}`)}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition font-bold"
                            >
                              📥 <span className="underline decoration-indigo-200">Invoice</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/customer/track?orderId=${order.orderId || order.id}`)}
                              className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition font-bold"
                            >
                              📦 <span className="underline decoration-blue-200">Track</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Segment */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center px-6 text-xs font-semibold">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                Previous
              </button>
              <span className="text-slate-400">Page {page} of {totalPages}</span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}