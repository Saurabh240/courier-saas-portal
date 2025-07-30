import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronLeft, MoreVertical, Edit, Mail } from 'lucide-react';
export default function OrderDetails({ order, onBack }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleEdit = () => {
    navigate(`/admin/orders/${order.id}/edit`);
  };

  const handleSendEmail = () => {
    toast.info("📧 Sending email... (feature coming soon)");
  };

  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>Order not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CREATED":
        return "bg-blue-100 text-blue-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_TRANSIT":
        return "bg-purple-100 text-purple-800";
      case "OUT_FOR_DELIVERY":
        return "bg-indigo-100 text-indigo-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "CONFIRMED":
        return "bg-teal-100 text-teal-800";
      case "PICKED_UP":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getInvoiceStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "OVERDUE":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentModeColor = (mode) => {
    switch (mode) {
      case "COD":
        return "bg-amber-100 text-amber-800";
      case "ONLINE":
        return "bg-green-100 text-green-800";
      case "CARD":
        return "bg-blue-100 text-blue-800";
      case "UPI":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDeliveryTypeColor = (type) => {
    switch (type) {
      case "EXPRESS":
        return "bg-red-100 text-red-800";
      case "STANDARD":
        return "bg-blue-100 text-blue-800";
      case "ECONOMY":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPackageTypeColor = (type) => {
    switch (type) {
      case "BOX":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "ENVELOPE":
        return "bg-green-50 text-green-700 border border-green-200";
      case "TUBE":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300">
      {/* Header */}
      {/* Header Row */}
      <div className="px-6 py-5">
        <div className="flex items-center justify-between mb-6 border-b-2 border-gray-300 py-2">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200 group"
              aria-label="Go back to previous page"
            >
              <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-0.5 transition-transform duration-200" />
            </button>
            <div className="border-l border-gray-500 pl-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id}
              </h1>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-gray-50 hover:bg-gray-300 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <MoreVertical className="w-4 h-4 mr-2" />
              Admin Actions
            </button>

            {showDropdown && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                />
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        handleEdit();
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <Edit className="w-4 h-4 mr-3 text-gray-500" />
                      Edit Order
                    </button>
                    <button
                      onClick={() => {
                        handleSendEmail();
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                    >
                      <Mail className="w-4 h-4 mr-3 text-gray-500" />
                      Send Email
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide">
              Invoice Status
            </label>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getInvoiceStatusColor(order.invoiceStatus)}`}>
              {order.invoiceStatus || "N/A"}
            </div>
          </div>

          <div className="space-y-2 md:text-right">
            <label className="block text-sm font-medium text-gray-500 uppercase tracking-wide">
              Order Status
            </label>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {order.status || "Not Set"}
            </div>
          </div>
        </div>
    </div>

    {/* Content */}
    <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Sender Details */}
            <div className="bg-blue-200 rounded-lg p-4 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Sender Details
              </h3>
              <dl className="space-y-3">
                <div className="flex items-center bg-white rounded-md p-3">
                  <dt className="text-sm font-medium text-gray-600 w-24">
                    Name:
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.senderName}
                  </dd>
                </div>
                <div className="flex items-center bg-white rounded-md p-3">
                  <dt className="text-sm font-medium text-gray-600 w-24">
                    Email:
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.customerEmail}
                  </dd>
                </div>
                <div className="flex items-start bg-white rounded-md p-3">
                  <dt className="text-sm font-medium text-gray-600 w-24">
                    Address:
                  </dt>
                  <dd className="text-sm text-gray-600 max-w-xs">
                    {order.pickupAddress}
                  </dd>
                </div>
                {order.pickupPhone && (
                  <div className="flex items-center bg-white rounded-md p-3">
                    <dt className="text-sm font-medium text-gray-600 w-24">
                      Phone:
                    </dt>
                    <dd className="text-sm text-gray-600">
                      {order.pickupPhone}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Receiver Details */}
            <div className="bg-green-200 rounded-lg p-4 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Receiver Details
              </h3>
              <dl className="space-y-3">
                <div className="flex items-center bg-white rounded-md p-3">
                  <dt className="text-sm font-medium text-gray-600 w-24">
                    Name:
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.receiverName}
                  </dd>
                </div>
                <div className="flex items-start bg-white rounded-md p-3">
                  <dt className="text-sm font-medium text-gray-600 w-24">
                    Address:
                  </dt>
                  <dd className="text-sm text-gray-600 max-w-xs">
                    {order.deliveryAddress}
                  </dd>
                </div>
                {order.deliveryPhone && (
                  <div className="flex items-center bg-white rounded-md p-3">
                    <dt className="text-sm font-medium text-gray-600 w-24">
                      Phone:
                    </dt>
                    <dd className="text-sm text-gray-600">
                      {order.deliveryPhone}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Package Information */}
            <div className="bg-purple-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Package Information
              </h3>
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-600">Type:</dt>
                  <dd
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getPackageTypeColor(
                      order.packageType
                    )}`}
                  >
                    {order.packageType}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-600">Weight:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.packageWeightKg} kg
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-600">
                    Dimensions:
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.packageLengthCm} × {order.packageWidthCm} ×{" "}
                    {order.packageHeightCm} cm
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-600">Value:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    ₹{order.declaredValue.toLocaleString("en-IN")}
                  </dd>
                </div>
                {order.isFragile && (
                  <div className="flex items-center justify-between">
                    <dt className="text-sm font-medium text-gray-600">
                      Special:
                    </dt>
                    <dd className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-red-100 text-red-800">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      Fragile
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Pickup Information */}
            <div className="bg-amber-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Pickup Information
              </h3>
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-600">Date:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.pickupDate}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-600">Time:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.pickupTimeWindow}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Payment & Delivery */}
            <div className="bg-indigo-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment & Delivery
              </h3>
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-600">
                    Payment:
                  </dt>
                  <dd
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getPaymentModeColor(
                      order.paymentMode
                    )}`}
                  >
                    {order.paymentMode}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-600">
                    Delivery:
                  </dt>
                  <dd
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getDeliveryTypeColor(
                      order.deliveryType
                    )}`}
                  >
                    {order.deliveryType}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className="bg-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Special Instructions
                </h3>
                <div className="text-sm text-gray-600 bg-white p-3 rounded border-l-4 border-yellow-400">
                  {order.specialInstructions}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
