import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export default function CreateOrderPage() {
  const [formData, setFormData] = useState({
    customerEmail: "",
    senderName: "",
    receiverName: "",
    pickupAddress: "",
    deliveryAddress: "",
    pickupPhone: "",
    deliveryPhone: "",
    pickupDate: "", // format: YYYY-MM-DD
    pickupTimeWindow: "",
    pickupTimeStart: "",
    pickupTimeEnd: "",

    declaredValue: "",
    packageWeightKg: "",
    packageLengthCm: "",
    packageWidthCm: "",
    packageHeightCm: "",

    deliveryType: "STANDARD",
    packageType: "BOX",
    invoiceStatus: "PENDING",

    specialInstructions: "",
    isFragile: false,
    paymentMode: "COD",
  });

  const requiredFields = [
    "customerEmail",
    "senderName",
    "receiverName",
    "pickupAddress",
    "deliveryAddress",
    "pickupPhone",
    "deliveryPhone",
    "pickupDate",
    "pickupTimeStart",
    "pickupTimeEnd",
    "declaredValue",
    "packageWeightKg",
    "packageLengthCm",
    "packageWidthCm",
    "packageHeightCm",
  ];

  const [message] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));

    // Clear the error for this field if it was showing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      formData.pickupTimeWindow = `${formData.pickupTimeStart} - ${formData.pickupTimeEnd}`;

      const response = await fetch(`${baseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // get backend error
        throw new Error(errorData.message || "Order creation failed");
      }

      const data = await response.json();

      // SUCCESS TOAST
      toast.success(`Order #${data.id} created successfully!`);

      // Redirect after toast
      setTimeout(() => {
        navigate(`/admin/orders/${data.id}`);
      }, 1500);
    } catch (err) {
      // ❌ ERROR TOAST
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout userType="admin">
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">📦</span>
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Record shipment
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6 ">
          <div className="bg-white rounded-lg shadow-sm ">
            <div className="px-6 py-4 border-b-2 border-blue-600">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping Details
              </h2>
            </div>

            {message && (
              <div className="mx-6 mt-4 p-3 rounded-md bg-blue-50 border border-blue-200">
                <p className="text-sm text-blue-800">{message}</p>
              </div>
            )}

            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      </span>
                      Sender Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Sender Name
                        </label>
                        <input
                          name="senderName"
                          placeholder="Enter sender name"
                          value={formData.senderName}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors["senderName"] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors["senderName"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Sender Email
                        </label>
                        <input
                          name="customerEmail"
                          placeholder="Enter customer email"
                          value={formData.customerEmail}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors["customerEmail"] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors["customerEmail"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Sender Address
                        </label>
                        <textarea
                          name="pickupAddress"
                          placeholder="Enter pickup address"
                          value={formData.pickupAddress}
                          onChange={handleChange}
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        {errors["pickupAddress"] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors["pickupAddress"]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      </span>
                      Tracking Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Pickup Date
                        </label>
                        <input
                          type="date"
                          name="pickupDate"
                          value={formData.pickupDate}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors["pickupDate"] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors["pickupDate"]}
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-black-500 mb-1">
                            Pickup Available From
                          </label>
                          <input
                            type="time"
                            name="pickupTimeStart"
                            value={formData.pickupTimeStart}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {errors["pickupTimeStart"] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors["pickupTimeStart"]}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-black-500 mb-1">
                            Pickup Available Until
                          </label>
                          <input
                            type="time"
                            name="pickupTimeEnd"
                            value={formData.pickupTimeEnd}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          {errors["pickupTimeEnd"] && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors["pickupTimeEnd"]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      </span>
                      Receiver Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Receiver Name
                        </label>
                        <input
                          name="receiverName"
                          placeholder="Enter receiver name"
                          value={formData.receiverName}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors["receiverName"] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors["receiverName"]}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Receiver Address
                        </label>
                        <textarea
                          name="deliveryAddress"
                          placeholder="Enter delivery address"
                          value={formData.deliveryAddress}
                          onChange={handleChange}
                          required
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        {errors["deliveryAddress"] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors["deliveryAddress"]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      </span>
                      Office of origin
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Delivery Type
                        </label>
                        <select
                          name="deliveryType"
                          value={formData.deliveryType}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="STANDARD">STANDARD</option>
                          <option value="EXPRESS">EXPRESS</option>
                          <option value="SAME_DAY">SAME DAY</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Pickup Phone
                        </label>
                        <input
                          name="pickupPhone"
                          placeholder="Pickup phone"
                          value={formData.pickupPhone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors["pickupPhone"] && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors["pickupPhone"]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div className="border-t pt-6 border-gray-400">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  Package Information
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Weight
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="packageWeightKg"
                      placeholder="0.0"
                      value={formData.packageWeightKg}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors["packageWeightKg"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors["packageWeightKg"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Length
                    </label>
                    <input
                      type="number"
                      name="packageLengthCm"
                      placeholder="0.0"
                      value={formData.packageLengthCm}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors["packageLengthCm"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors["packageLengthCm"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Width
                    </label>
                    <input
                      type="number"
                      name="packageWidthCm"
                      placeholder="0.0"
                      value={formData.packageWidthCm}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors["packageWidthCm"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors["packageWidthCm"]}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Height
                    </label>
                    <input
                      type="number"
                      name="packageHeightCm"
                      placeholder="0.0"
                      value={formData.packageHeightCm}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors["packageHeightCm"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors["packageHeightCm"]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Special Instructions
                    </label>
                    <input
                      name="specialInstructions"
                      placeholder="Enter Description"
                      value={formData.specialInstructions}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Invoice Status
                    </label>
                    <select
                      name="invoiceStatus"
                      value={formData.invoiceStatus}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Package Type
                    </label>
                    <select
                      name="packageType"
                      value={formData.packageType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="BOX">BOX</option>
                      <option value="DOCUMENT">DOCUMENT</option>
                      <option value="ENVELOPE">ENVELOPE</option>
                      <option value="PALLET">PALLET</option>
                    </select>
                    {errors["packageType"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors["packageType"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Other & Extra Information */}
              <div className="border-t pt-6 border-gray-400">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  Other & Extra Information
                </h3>
                <div className="mb-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isFragile"
                      checked={formData.isFragile}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600  border-gray-400 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Fragile
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left: Delivery Phone */}
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Delivery Phone
                    </label>
                    <input
                      name="deliveryPhone"
                      placeholder="Enter delivery phone"
                      value={formData.deliveryPhone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors["deliveryPhone"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors["deliveryPhone"]}
                      </p>
                    )}
                  </div>

                  {/* Middle: Payment Mode */}
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Payment Mode
                    </label>
                    <select
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="COD">COD</option>
                      <option value="ONLINE">ONLINE</option>{" "}
                    </select>
                  </div>

                  {/* Right: Declared Value */}
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Value Declared
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="declaredValue"
                      placeholder="0.00"
                      value={formData.declaredValue}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors["declaredValue"] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors["declaredValue"]}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 border-gray-400 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)} // Ye line add kar
                  className="px-6 py-2 border border-gray-400 rounded-md text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Create New Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
