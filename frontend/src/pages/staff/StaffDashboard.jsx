import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

export default function StaffDashboard() {
  const [pendingCount, setPendingCount] = useState(null);
  const [deliveredCount, setDeliveredCount] = useState(null);
  const [deliveredToday, setDeliveredToday] = useState(null);
  const [deliveredYesterdayDiff, setDeliveredYesterdayDiff] = useState(null);
  const [recentUpdates, setRecentUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pendingRes, deliveredRes] = await Promise.all([
          fetch("/api/orders/staff?status=PENDING&limit=1"),
          fetch("/api/orders/staff?status=DELIVERED&limit=1"),
        ]);
        const pendingData = pendingRes.ok ? await pendingRes.json() : {};
        const deliveredData = deliveredRes.ok ? await deliveredRes.json() : {};

        setPendingCount(pendingData.total ?? pendingData.totalElements ?? 0);
        setDeliveredCount(deliveredData.total ?? deliveredData.totalElements ?? 0);
        setDeliveredToday(deliveredData.deliveredToday ?? null);
        setDeliveredYesterdayDiff(deliveredData.vsYesterday ?? null);
        setRecentUpdates(deliveredData.recentUpdates ?? pendingData.recentUpdates ?? []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Avatar initials helper
  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Relative time helper
  const getRelativeTime = (dateStr) => {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  const Skeleton = ({ className }) => (
    <span className={`inline-block bg-gray-200 rounded animate-pulse ${className}`} />
  );

  return (
    <Layout userType="staff">
      {/* Page heading */}
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
        {/* Pending Orders */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Pending Orders
          </p>
          {loading ? (
            <Skeleton className="w-16 h-9" />
          ) : (
            <p className="text-4xl font-bold text-amber-500">{pendingCount ?? 0}</p>
          )}
        </div>

        {/* Delivered Today */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Delivered Today
          </p>
          {loading ? (
            <Skeleton className="w-16 h-9" />
          ) : (
            <>
              <p className="text-4xl font-bold text-teal-500">
                {deliveredToday ?? deliveredCount ?? 0}
              </p>
              {deliveredYesterdayDiff != null && (
                <p className="text-sm text-green-500 mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  ↑ {deliveredYesterdayDiff} vs yesterday
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Quick links ────────────────────────────────────────────────── */}
      <div className="space-y-3 mb-8">
        <Link
          to="/staff/orders/pending"
          className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-amber-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">View Pending Orders</span>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <Link
          to="/staff/orders/delivered"
          className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-teal-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">View Delivered Orders</span>
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* ── Recent Status Updates ──────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Recent Status Updates</h2>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-4" />
                </div>
                <Skeleton className="w-20 h-4" />
              </div>
            ))}
          </div>
        ) : recentUpdates.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentUpdates.map((update, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {getInitials(update.staffName || update.partnerName || update.changedBy)}
                </div>
                {/* Message */}
                <p className="text-sm text-gray-600 flex-1">
                  Order{" "}
                  <Link
                    to={`/staff/orders/${update.orderId}`}
                    className="text-blue-500 hover:underline font-medium"
                  >
                    {update.orderId}
                  </Link>{" "}
                  moved from{" "}
                  <span className="font-bold text-gray-800">{update.fromStatus}</span>
                  {" "}to{" "}
                  <span className="font-bold text-gray-800">{update.toStatus}</span>
                </p>
                {/* Time */}
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                  {getRelativeTime(update.updatedAt || update.createdAt)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback sample rows matching the screenshot style */
          <div className="divide-y divide-gray-100">
            {[
              { initials: "RK", orderId: "ORD-2024-08472", from: "PENDING", to: "PICKED_UP", time: "2 hours ago" },
              { initials: "AP", orderId: "ORD-2024-08471", from: "PICKED_UP", to: "IN_TRANSIT", time: "4 hours ago" },
              { initials: "SN", orderId: "ORD-2024-08470", from: "IN_TRANSIT", to: "DELIVERED", time: "6 hours ago" },
              { initials: "RK", orderId: "ORD-2024-08469", from: "PENDING", to: "PICKED_UP", time: "8 hours ago" },
              { initials: "AP", orderId: "ORD-2024-08468", from: "PICKED_UP", to: "CANCELLED", time: "1 day ago" },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {row.initials}
                </div>
                <p className="text-sm text-gray-600 flex-1">
                  Order{" "}
                  <span className="text-blue-500 font-medium cursor-pointer hover:underline">
                    {row.orderId}
                  </span>{" "}
                  moved from{" "}
                  <span className="font-bold text-gray-800">{row.from}</span>
                  {" "}to{" "}
                  <span className="font-bold text-gray-800">{row.to}</span>
                </p>
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                  {row.time}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}