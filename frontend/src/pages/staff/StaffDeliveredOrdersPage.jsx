import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import Toast from "../../components/Toast";

const getStatusColor = (status) => {
  switch (status) {
    case "DELIVERED": return "bg-green-100 text-green-700 border border-green-200";
    default:          return "bg-gray-100 text-gray-600 border border-gray-200";
  }
};

function ThreeDotMenu({ order }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Actions"
      >
        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1">
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
          </div>
        </>
      )}
    </div>
  );
}

export default function StaffDeliveredOrdersPage() {
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
      const params = new URLSearchParams({ status: "DELIVERED", page, limit: pageSize });
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
      setToast({ message: "Failed to load delivered orders.", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(currentPage, search); }, [currentPage, search, fetchOrders]);

  // Export CSV
  const handleExportCSV = () => {
    if (!orders.length) return;
    const headers = ["Order ID","Customer","Pickup Address","Delivery Address","Status","Partner","Created"];
    const rows = orders.map((o) => [
      o.orderId, o.customerEmail ?? o.senderEmail ?? "",
      o.pickupAddress ?? "", o.deliveryAddress ?? "",
      o.status ?? "", o.assignedPartnerName ?? o.partnerName ?? "",
      o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "delivered-orders.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex   = Math.min(startIndex + pageSize, totalItems);

  return (
    <Layout userType="staff">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
          Delivered Orders
          <span className="text-sm font-semibold bg-gray-200 text-gray-700 px-2.5 py-0.5 rounded-full">
            {totalItems}
          </span>
        </h1>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Export CSV
        </button>
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
                      <ThreeDotMenu order={order} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-16 text-center text-sm text-gray-400">
                      No delivered orders found.
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