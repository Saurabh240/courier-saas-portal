import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Toast from "../../components/Toast";

const STATUS_OPTIONS = [
  "PENDING","CONFIRMED","PICKED_UP","IN_TRANSIT","OUT_FOR_DELIVERY","CANCELLED",
];

const getStatusColor = (status) => {
  switch (status) {
    case "DELIVERED":       return "bg-green-100 text-green-700 border border-green-200";
    case "PENDING":         return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "IN_TRANSIT":      return "bg-teal-100 text-teal-700 border border-teal-200";
    case "OUT_FOR_DELIVERY":return "bg-indigo-100 text-indigo-700 border border-indigo-200";
    case "CANCELLED":       return "bg-red-100 text-red-700 border border-red-200";
    case "CONFIRMED":       return "bg-emerald-100 text-emerald-700 border border-emerald-200";
    case "PICKED_UP":       return "bg-cyan-100 text-cyan-700 border border-cyan-200";
    default:                return "bg-gray-100 text-gray-600 border border-gray-200";
  }
};

function ActionDropdown({ order, onStatusUpdated }) {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async (newStatus) => {
    setOpen(false);
    setUpdating(true);
    try {
      const res = await fetch("/api/status/manual", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      onStatusUpdated(order.orderId, newStatus, "success");
    } catch {
      onStatusUpdated(order.orderId, null, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={updating}
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-40"
        aria-label="Actions"
      >
        {/* three-dot icon */}
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
            <button
              onClick={() => { setOpen(false); navigate(`/staff/orders/${order.orderId}`); }}
              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
              View Details
            </button>
            <div className="border-t border-gray-100 my-1" />
            <p className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Update Status</p>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleUpdate(s)}
                className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {s.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function StaffPendingOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const pageSize = 25;

  const fetchOrders = useCallback(async (page, searchVal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "PENDING", page, limit: pageSize });
      if (searchVal) params.set("search", searchVal);
      const res = await fetch(`/api/orders/staff?${params}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      const list  = data.orders ?? data.content ?? [];
      const total = data.total ?? data.totalElements ?? list.length;
      setOrders(list);
      setTotalItems(total);
      setHasNextPage(data.hasNext ?? data.hasNextPage ?? list.length === pageSize);
    } catch {
      setToast({ message: "Failed to load orders.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(currentPage, search); }, [currentPage, search, fetchOrders]);

  const handleStatusUpdated = (orderId, newStatus, type) => {
    if (type === "success") {
      setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status: newStatus } : o));
      setToast({ message: `Order #${orderId} updated to ${newStatus.replace(/_/g, " ")}.`, type: "success" });
    } else {
      setToast({ message: "Failed to update status.", type: "error" });
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex   = Math.min(startIndex + pageSize, totalItems);

  return (
    <Layout userType="staff">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
          Pending Orders
          <span className="text-sm font-semibold bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full">
            {totalItems}
          </span>
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search by order ID or customer email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-4 text-sm text-gray-500">Loading orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {["Order ID","Customer","Pickup Address","Delivery Address","Status","Partner","Created",""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {orders.length > 0 ? orders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm font-medium text-blue-500 hover:underline cursor-pointer">
                        {order.orderId}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {order.customerEmail ?? order.senderEmail ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate">
                      {order.pickupAddress ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-[180px] truncate">
                      {order.deliveryAddress ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status?.replace(/_/g, " ") ?? "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {order.assignedPartnerName ?? order.partnerName ?? "—"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                        : "—"}
                    </td>
                    <td className="px-2 py-3 text-center">
                      <ActionDropdown order={order} onStatusUpdated={handleStatusUpdated} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-sm text-gray-400">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-white">
            <p className="text-sm text-gray-500">
              Showing {startIndex + 1}–{endIndex} of {totalItems} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <span className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!hasNextPage}
                className="px-2 py-1.5 rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Layout>
  );
}