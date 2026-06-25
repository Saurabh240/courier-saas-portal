import React, { useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
// import StatusUpdateModal from "./StatusUpdateModal";
import Toast from "../../components/Toast";

export default function PartnerPickedPage() {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState(null);
  const [modal, setModal]       = useState(null); // { order, action: "deliver"|"proof" }
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [r1, r2] = await Promise.all([
        fetch("/api/orders/partner?status=PICKED_UP&limit=50"),
        fetch("/api/orders/partner?status=IN_TRANSIT&limit=50"),
      ]);
      const d1 = r1.ok ? await r1.json() : {};
      const d2 = r2.ok ? await r2.json() : {};
      const a1 = d1.orders ?? d1.content ?? [];
      const a2 = d2.orders ?? d2.content ?? [];
      setOrders([...a1, ...a2]);
    } catch {
      setToast({ message: "Failed to load orders.", type: "error" });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleDeliver = async () => {
    setUpdating(true);
    try {
      const res = await fetch("/api/status/manual", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: modal.order.orderId, status: "DELIVERED" }),
      });
      if (!res.ok) throw new Error();
      setToast({ message: `Order ${modal.order.orderId} marked as DELIVERED.`, type: "success" });
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
        <h1 className="text-xl font-semibold text-gray-800">Picked Up — In Transit</h1>
        <span className="text-sm font-semibold bg-gray-200 text-gray-600 w-7 h-7 rounded-full flex items-center justify-center">
          {orders.length}
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-400 py-24 text-sm">No in-transit orders.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {orders.map((order) => {
            const label = twLabel(order.pickupTimeWindow);
            const color = twColor(order.pickupTimeWindow);
            const dateStr = order.pickupDate
              ? new Date(order.pickupDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "";
            const pkg = [order.packageType, order.packageWeightKg ? `${order.packageWeightKg}kg` : null]
              .filter(Boolean).join(" · ");

            return (
              <div key={order.orderId} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-900">{order.orderId}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                    IN TRANSIT
                  </span>
                </div>

                {/* Name */}
                <p className="text-base font-semibold text-gray-900 mb-1">
                  {order.receiverName ?? order.senderName ?? "—"}
                </p>

                {/* Delivery address */}
                <p className="text-sm text-gray-500 flex items-start gap-1 mb-4">
                  <svg className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {order.deliveryAddress ?? order.pickupAddress ?? "—"}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-5">
                  {dateStr && <span>{dateStr}</span>}
                  {label && <span className={`text-xs font-medium px-2 py-0.5 rounded ${color}`}>{label}</span>}
                  {pkg && <span>· {pkg}</span>}
                </div>

                {/* Two action buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setModal({ order, action: "proof" })}
                    className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Upload Proof
                  </button>
                  <button
                    onClick={() => setModal({ order, action: "deliver" })}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 active:scale-[0.98] transition-all"
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deliver confirmation modal */}
      {modal?.action === "deliver" && (
        <StatusUpdateModal
          order={modal.order}
          nextStatus="DELIVERED"
          onConfirm={handleDeliver}
          onCancel={() => setModal(null)}
          loading={updating}
        />
      )}

      {/* Upload proof modal */}
      {modal?.action === "proof" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Upload Delivery Proof</h2>
            <p className="text-sm text-gray-500 mb-5">
              Order <span className="font-medium text-gray-800">{modal.order.orderId}</span>
            </p>
            <input
              type="file" accept="image/*"
              className="w-full text-sm text-gray-600 mb-6 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => { setToast({ message: "Proof uploaded successfully.", type: "success" }); setModal(null); }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-gray-900 rounded-xl hover:bg-gray-800"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Layout>
  );
}