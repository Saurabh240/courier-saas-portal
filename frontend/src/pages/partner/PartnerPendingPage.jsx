import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
// import StatusUpdateModal from "./StatusUpdateModal";
import Toast from "../../components/Toast";

export default function PartnerPendingPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState(null);
  const [modal, setModal]     = useState(null);
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/orders/partner?status=PENDING&limit=50");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrders(data.orders ?? data.content ?? []);
    } catch {
      setToast({ message: "Failed to load pending deliveries.", type: "error" });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleConfirm = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/status/manual", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: modal.order.orderId, status: "PICKED_UP" }),
      });
      if (!res.ok) throw new Error();
      setToast({ message: `Order ${modal.order.orderId} marked as PICKED UP.`, type: "success" });
      setModal(null);
      fetchOrders();
    } catch {
      setToast({ message: "Failed to update status.", type: "error" });
    } finally { setUpdating(false); }
  };

  const twLabel = (w) => ({ MORNING_8_12: "Morning 8–12", AFTERNOON_12_5: "Afternoon 12–5", EVENING_5_9: "Evening 5–9" }[w] ?? w ?? "");
  const twColor = (w) => {
    if (!w) return "bg-gray-100 text-gray-600";
    if (w.includes("MORNING"))   return "bg-yellow-100 text-yellow-700";
    if (w.includes("AFTERNOON")) return "bg-orange-100 text-orange-700";
    return "bg-purple-100 text-purple-700";
  };

  return (
    <Layout userType="partner">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Pending Deliveries</h1>
        <span className="text-sm font-semibold bg-gray-200 text-gray-600 w-7 h-7 rounded-full flex items-center justify-center">
          {orders.length}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 py-24 text-sm">No pending deliveries.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {orders.map((order) => {
            const label = twLabel(order.pickupTimeWindow);
            const color = twColor(order.pickupTimeWindow);
            const dateStr = order.pickupDate
              ? new Date(order.pickupDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "";
            const pkg = [
              order.isFragile ? "Fragile" : order.packageType,
              order.packageWeightKg ? `${order.packageWeightKg}kg` : null,
            ].filter(Boolean).join(" · ");

            return (
              <div key={order.orderId} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900">{order.orderId}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200">
                    PENDING
                  </span>
                </div>

                {/* Name */}
                <p className="text-base font-semibold text-gray-900 mb-1">
                  {order.receiverName ?? order.senderName ?? "—"}
                </p>

                {/* Address */}
                <p className="text-sm text-gray-500 flex items-start gap-1 mb-4">
                  <svg className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {order.pickupAddress ?? "—"}
                </p>

                {/* Meta: date · time window · package */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-5">
                  {dateStr && <span>{dateStr}</span>}
                  {label && <span className={`text-xs font-medium px-2 py-0.5 rounded ${color}`}>{label}</span>}
                  {pkg && <span>· {pkg}</span>}
                </div>

                {/* CTA */}
                <button
                  onClick={() => setModal({ order })}
                  className="w-full py-3 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800 active:scale-[0.98] transition-all"
                >
                  Mark as Picked Up
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <StatusUpdateModal
          order={modal.order}
          nextStatus="PICKED_UP"
          onConfirm={handleConfirm}
          onCancel={() => setModal(null)}
          loading={updating}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Layout>
  );
}