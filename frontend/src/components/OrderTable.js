import React from "react";

export default function OrderTable({
  orders,
  totalItems,
  onPageChange,
  onFilterChange,
  filters,
  loading,
  hasNextPage,
  currentPage,
  onOrderClick,
}) {
  const pageSize = 25;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-500 text-white";
      case "CREATED":
        return "bg-blue-500 text-white";
      case "PENDING":
        return "bg-yellow-500 text-white";
      case "IN_TRANSIT":
        return "bg-teal-500 text-white";
      case "OUT_FOR_DELIVERY":
        return "bg-indigo-500 text-white";
      case "CANCELLED":
        return "bg-red-500 text-white";
      case "CONFIRMED":
        return "bg-emerald-500 text-white";
      case "PICKED_UP":
        return "bg-cyan-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-teal-500 text-white";
      case "PENDING":
        return "bg-orange-400 text-white";
      case "OVERDUE":
        return "bg-red-500 text-white";
      case "CANCELLED":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getPaymentModeColor = (mode) => {
    switch (mode) {
      case "COD":
        return "bg-amber-500 text-white";
      case "PREPAID":
        return "bg-green-500 text-white";
      case "CARD":
        return "bg-blue-500 text-white";
      case "UPI":
        return "bg-purple-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getDeliveryTypeColor = (type) => {
    switch (type) {
      case "EXPRESS":
        return "bg-red-500 text-white";
      case "STANDARD":
        return "bg-blue-500 text-white";
      case "ECONOMY":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div>
      {/* Search Filters */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search by Sender
            </label>
            <input
              type="text"
              placeholder="Enter sender name..."
              value={filters.sender || ""}
              onChange={(e) => onFilterChange("sender", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👤 Search by Receiver
            </label>
            <input
              type="text"
              placeholder="Enter receiver name..."
              value={filters.receiver || ""}
              onChange={(e) => onFilterChange("receiver", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ✉️ Search by Sender Email
            </label>
            <input
              type="text"
              placeholder="Enter customer email..."
              value={filters.email || ""}
              onChange={(e) => onFilterChange("email", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading orders...</p>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y divide-gray-200"
            role="table"
            aria-label="Orders table"
          >
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Sender
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Receiver
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Addresses
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Payment & Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Delivery Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                  Invoice Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders && orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr
                    key={order.orderId}
                    className={`hover:bg-blue-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() =>
                          onOrderClick && onOrderClick(order.orderId)
                        }
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                      >
                        #{order.orderId}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.senderName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.receiverName || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="mb-2">
                          <span className="text-s font-medium text-gray-500">
                            Pickup:
                          </span>
                          <div className="text-xs text-black-900 max-w-xs truncate">
                            📍 {order.pickupAddress || "N/A"}
                          </div>
                        </div>
                        <div>
                          <span className="text-s font-medium text-gray-500">
                            Delivery:
                          </span>
                          <div className="text-xs text-black-900 max-w-xs truncate">
                            📍 {order.deliveryAddress || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getPaymentModeColor(
                            order.paymentMode
                          )}`}
                        >
                          {order.paymentMode || "COD"}
                        </span>
                        <div className="text-xs text-gray-600 mt-1">
                          💰 ₹
                          {order.declaredValue
                            ? order.declaredValue.toLocaleString()
                            : "0"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getDeliveryTypeColor(
                          order.deliveryType
                        )}`}
                      >
                        {order.deliveryType || "STANDARD"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status
                          ? order.status.replace("_", " ")
                          : "CREATED"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getInvoiceStatusColor(
                          order.invoiceStatus
                        )}`}
                      >
                        {order.invoiceStatus || "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-16 text-center">
                    <div className="text-gray-500">
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-xl font-semibold text-gray-600 mb-2">
                        No orders found
                      </p>
                      <p className="text-sm text-gray-500">
                        Try adjusting your search criteria or create a new order
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Enhanced Pagination */}
      {!loading && orders && orders.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-800">
                <span className="font-medium">Showing</span>{" "}
                <span className="font-bold text-blue-600">
                  {startIndex + 1}
                </span>{" "}
                to <span className="font-bold text-blue-600">{endIndex}</span>{" "}
                of <span className="font-bold text-blue-600">{totalItems}</span>{" "}
                results
              </div>
              <div className="text-xs text-gray-800 bg-blue-100 px-3 py-1 rounded-full border">
                Page <span className="font-bold">{currentPage}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                disabled={currentPage === 1}
                onClick={() => onPageChange && onPageChange(currentPage - 1)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-200 hover:border-blue-400 hover:text-blue-600 shadow-sm hover:shadow-md"
                }`}
                aria-label="Previous page"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>

              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold">
                {currentPage}
              </div>

              <button
                disabled={!hasNextPage}
                onClick={() => onPageChange && onPageChange(currentPage + 1)}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                  !hasNextPage
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 shadow-sm hover:shadow-md"
                }`}
                aria-label="Next page"
              >
                Next
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
