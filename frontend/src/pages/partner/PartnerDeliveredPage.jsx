import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import Toast from "../../components/Toast";

const PAGE_SIZE = 25;

export default function PartnerDeliveredPage() {
  const [orders, setOrders]       = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [hasNext, setHasNext]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);
  const [weekCount, setWeekCount] = useState(null);
  const [dateFrom, setDateFrom]   = useState("");
  const [dateTo, setDateTo]       = useState("");

  const fetchOrders = useCallback(async (p, from, to) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ status: "DELIVERED", page: p, limit: PAGE_SIZE });
      if (from) params.set("dateFrom", from);
      if (to)   params.set("dateTo",   to);
      const res = await fetch(`/api/orders/partner?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      const list = data.orders ?? data.content ?? [];
      setOrders(list);
      setTotal(data.total ?? data.totalElements ?? list.length);
      setHasNext(data.hasNext ?? data.hasNextPage ?? list.length === PAGE_SIZE);
      setWeekCount(data.weekCount ?? data.deliveredThisWeek ?? null);
    } catch {
      setToast({ message: "Failed to load delivery history.", type: "error" });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(page, dateFrom, dateTo); }, [page, dateFrom, dateTo, fetchOrders]);

  const handleDateChange = (field, val) => {
    if (field === "from") { setDateFrom(val); setPage(1); }
    else                  { setDateTo(val);   setPage(1); }
  };

  const startIdx = (page - 1) * PAGE_SIZE + 1;
  const endIdx   = Math.min(page * PAGE_SIZE, total);

  return (
    <Layout userType="partner">
      {/* Page heading + date filters */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-xl font-semibold text-gray-800">Delivery History</h1>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => handleDateChange("from", e.target.value)}
            placeholder="mm/dd/yyyy"
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => handleDateChange("to", e.target.value)}
            placeholder="mm/dd/yyyy"
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Week count banner */}
      {weekCount != null && (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-5 text-sm font-medium text-gray-700">
          <span className="text-base">📦</span>
          {weekCount} deliveries this week
        </div>
      )}

      {/* Orders list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-400 py-24 text-sm">No delivered orders found.</p>
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {orders.map((order) => {
                const deliveredAt = order.deliveredAt
                  ? new Date(order.deliveredAt).toLocaleString("en-CA", {
                      year: "numeric", month: "2-digit", day: "2-digit",
                      hour: "2-digit", minute: "2-digit", hour12: false,
                    }).replace(",", "")
                  : null;

                return (
                  <div key={order.orderId} className="flex items-start justify-between px-5 py-5">
                    {/* Left: order info */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-gray-900">{order.orderId}</span>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                          DELIVERED
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-0.5">
                        {order.receiverName ?? order.senderName ?? "—"}
                      </p>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {order.deliveryAddress ?? "—"}
                      </p>
                    </div>

                    {/* Right: timestamp + proof icon */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-4">
                      {deliveredAt ? (
                        <p className="text-sm text-gray-500">Delivered at {deliveredAt}</p>
                      ) : (
                        <p className="text-sm text-gray-400">—</p>
                      )}
                      {order.proofImageUrl ? (
                        <a href={order.proofImageUrl} target="_blank" rel="noreferrer">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                            </svg>
                          </div>
                        </a>
                      ) : (
                        <p className="text-xs text-gray-400">No proof</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Showing {startIdx}–{endIdx} of {total} results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="px-2 py-1.5 text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <span className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md">
                  {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                  className="px-2 py-1.5 text-gray-500 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Layout>
  );
}