import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

export default function StaffDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch stats + recent orders in parallel
        const [statsRes, ordersRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/dashboard"),
        ]);

        if (!statsRes.ok) throw new Error("Failed to fetch stats");
        if (!ordersRes.ok) throw new Error("Failed to fetch orders");

        const statsData  = await statsRes.json();
        const ordersData = await ordersRes.json();

        setStats(statsData);
        // Show last 5 orders as "recent updates"
        const list = Array.isArray(ordersData) ? ordersData : (ordersData.orders ?? ordersData.content ?? []);
        setRecentOrders(list.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // pending = statusCountMap.PENDING + statusCountMap.IN_TRANSIT
  const pendingCount = stats
    ? ((stats.statusCountMap?.PENDING ?? 0) + (stats.statusCountMap?.IN_TRANSIT ?? 0))
    : null;

  const deliveredCount  = stats?.delivered    ?? null;
  const inTransitCount  = stats?.inTransit    ?? null;
  const totalOrders     = stats?.totalOrders  ?? null;
  const createdToday    = stats?.createdToday ?? null;

  const Skeleton = ({ className }) => (
    <span className={`inline-block bg-gray-200 rounded animate-pulse ${className}`} />
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":        return "text-green-600";
      case "PENDING":          return "text-yellow-600";
      case "IN_TRANSIT":       return "text-teal-600";
      case "OUT_FOR_DELIVERY": return "text-indigo-600";
      case "CANCELLED":        return "text-red-600";
      case "PICKED_UP":        return "text-cyan-600";
      default:                 return "text-gray-600";
    }
  };

  return (
    <Layout userType="staff">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error} — showing last known data.
        </div>
      )}

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {/* Pending + In Transit */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Pending Orders
          </p>
          {loading ? <Skeleton className="w-16 h-9" /> : (
            <p className="text-4xl font-bold text-amber-500">{pendingCount ?? 0}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">Pending + In Transit</p>
        </div>

        {/* Delivered */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Delivered
          </p>
          {loading ? <Skeleton className="w-16 h-9" /> : (
            <p className="text-4xl font-bold text-teal-500">{deliveredCount ?? 0}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">All time</p>
        </div>

        {/* In Transit */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            In Transit
          </p>
          {loading ? <Skeleton className="w-16 h-9" /> : (
            <p className="text-4xl font-bold text-blue-500">{inTransitCount ?? 0}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">Currently delivering</p>
        </div>

        {/* Created Today */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Created Today
          </p>
          {loading ? <Skeleton className="w-16 h-9" /> : (
            <p className="text-4xl font-bold text-purple-500">{createdToday ?? 0}</p>
          )}
          <p className="text-xs text-gray-400 mt-2">New orders</p>
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
                <circle cx="12" cy="12" r="10"/>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/>
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">View Pending Orders</span>
            {!loading && pendingCount != null && (
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </Link>

        <Link
          to="/staff/orders/delivered"
          className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-teal-500">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">View Delivered Orders</span>
            {!loading && deliveredCount != null && (
              <span className="text-xs font-semibold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                {deliveredCount}
              </span>
            )}
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>

      {/* ── Recent Orders ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Recent Orders</h2>
          {!loading && totalOrders != null && (
            <span className="text-xs text-gray-400">{totalOrders} total orders</span>
          )}
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="w-3/4 h-4" />
                  <Skeleton className="w-1/2 h-3" />
                </div>
                <Skeleton className="w-20 h-5 rounded-full" />
              </div>
            ))}
          </div>
        ) : recentOrders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentOrders.map((order, i) => {
              // initials from senderName
              const initials = (order.senderName ?? "?")
                .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

              return (
                <div key={order.orderId ?? i} className="flex items-center gap-4 px-5 py-4">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-blue-500">
                        #{order.orderId}
                      </span>
                      {" · "}
                      <span className="text-gray-600">{order.senderName}</span>
                      {" → "}
                      <span className="text-gray-600">{order.receiverName}</span>
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {order.pickupAddress} → {order.deliveryAddress}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span className={`text-xs font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(order.status)}`}>
                    {order.status?.replace(/_/g, " ") ?? "—"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-5 py-12 text-center text-sm text-gray-400">
            No recent orders found.
          </div>
        )}
      </div>
    </Layout>
  );
}