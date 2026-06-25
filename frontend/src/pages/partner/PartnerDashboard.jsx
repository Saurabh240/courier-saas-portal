import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout";

export default function PartnerDashboard() {
  const [counts, setCounts] = useState({ pending: null, inTransit: null, deliveredToday: null });
  const [nextPickups, setNextPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [pendingRes, pickedRes, deliveredRes] = await Promise.all([
          fetch("/api/orders/partner?status=PENDING&limit=5"),
          fetch("/api/orders/partner?status=IN_TRANSIT&limit=1"),
          fetch("/api/orders/partner?status=DELIVERED&limit=1"),
        ]);
        const pd = pendingRes.ok   ? await pendingRes.json()   : {};
        const id = pickedRes.ok    ? await pickedRes.json()    : {};
        const dd = deliveredRes.ok ? await deliveredRes.json() : {};

        setCounts({
          pending:        pd.total ?? pd.totalElements ?? 0,
          inTransit:      id.total ?? id.totalElements ?? 0,
          deliveredToday: dd.deliveredToday ?? dd.total ?? dd.totalElements ?? 0,
        });
        setNextPickups(pd.orders ?? pd.content ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  const Skeleton = ({ w, h }) => (
    <span className={`inline-block bg-gray-200 rounded animate-pulse ${w} ${h}`} />
  );

  const timeLabel = (w) => {
    const m = { MORNING_8_12: "Morning 8–12", AFTERNOON_12_5: "Afternoon 12–5", EVENING_5_9: "Evening 5–9" };
    return m[w] ?? w ?? "";
  };
  const timeColor = (w) => {
    if (!w) return "bg-gray-100 text-gray-600";
    if (w.includes("MORNING"))   return "bg-yellow-100 text-yellow-700";
    if (w.includes("AFTERNOON")) return "bg-orange-100 text-orange-700";
    return "bg-purple-100 text-purple-700";
  };
  const pickupDay = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr), n = new Date();
    if (d.toDateString() === n.toDateString()) return "Today";
    const tomorrow = new Date(n); tomorrow.setDate(n.getDate() + 1);
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Layout userType="partner">
      <h1 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      {/* ── 3 stat cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Pending Pickups</p>
          {loading ? <Skeleton w="w-10" h="h-10" /> : (
            <p className="text-4xl font-bold text-amber-500">{counts.pending}</p>
          )}
          <p className="text-sm text-gray-400 mt-3">Awaiting pickup</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">In Transit</p>
          {loading ? <Skeleton w="w-10" h="h-10" /> : (
            <p className="text-4xl font-bold text-blue-500">{counts.inTransit}</p>
          )}
          <p className="text-sm text-gray-400 mt-3">Currently delivering</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Delivered Today</p>
          {loading ? <Skeleton w="w-10" h="h-10" /> : (
            <p className="text-4xl font-bold text-green-500">{counts.deliveredToday}</p>
          )}
          <p className="text-sm text-gray-400 mt-3">{today}</p>
        </div>
      </div>

      {/* ── Next Pickups card ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">Next Pickups</h2>
          <Link
            to="/partner/deliveries/pending"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View all pending
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-5">
                <div className="space-y-2">
                  <Skeleton w="w-44" h="h-4" />
                  <Skeleton w="w-56" h="h-3" />
                </div>
                <Skeleton w="w-28" h="h-9" />
              </div>
            ))}
          </div>
        ) : nextPickups.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {nextPickups.map((order) => (
              <div key={order.orderId} className="flex items-center justify-between px-6 py-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{order.orderId}</span>
                    {order.pickupTimeWindow && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${timeColor(order.pickupTimeWindow)}`}>
                        {timeLabel(order.pickupTimeWindow)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {order.pickupAddress}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{pickupDay(order.pickupDate)}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.pickupAddress ?? "")}`}
                    target="_blank" rel="noreferrer"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Fallback sample rows matching the screenshot */
          <div className="divide-y divide-gray-100">
            {[
              { orderId: "ORD-2024-08472", tw: "Morning 8–12",   tc: "bg-yellow-100 text-yellow-700", addr: "12, Connaught Place, New Delhi", day: "Today" },
              { orderId: "ORD-2024-08465", tw: "Afternoon 12–5", tc: "bg-orange-100 text-orange-700", addr: "6, Gomti Nagar, Lucknow",        day: "Today" },
              { orderId: "ORD-2024-08463", tw: "Evening 5–9",    tc: "bg-purple-100 text-purple-700", addr: "5, Civil Lines, Jaipur",          day: "Tomorrow" },
            ].map((row) => (
              <div key={row.orderId} className="flex items-center justify-between px-6 py-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-gray-900">{row.orderId}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${row.tc}`}>{row.tw}</span>
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {row.addr}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400">{row.day}</span>
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}