import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../../components/Layout";

const baseUrl = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export default function EditOrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // Required fields based on editable API structure
  const requiredFields = [
    "senderName",
    "receiverName", 
    "pickupAddress",
    "deliveryAddress",
    "packageWeightKg",
    "packageLengthCm",
    "packageWidthCm", 
    "packageHeightCm",
    "pickupPhone",
    "deliveryPhone",
    "pickupTimeWindow"
  ];

  // Fetch existing order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await res.json();
        setFormData(data);
      } catch (err) {
        toast.error(`❌ ${err.message}`);
        navigate("/admin/orders"); // Redirect back if fetch fails
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));

    // Clear error for this field
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
      if (!formData[field] || formData[field] === "") {
        newErrors[field] = "This field is required";
      }
    });
    
    // Additional validation for numeric fields
    if (formData.packageWeightKg <= 0) {
      newErrors.packageWeightKg = "Weight must be greater than 0";
    }
    if (formData.packageLengthCm <= 0) {
      newErrors.packageLengthCm = "Length must be greater than 0";
    }
    if (formData.packageWidthCm <= 0) {
      newErrors.packageWidthCm = "Width must be greater than 0";
    }
    if (formData.packageHeightCm <= 0) {
      newErrors.packageHeightCm = "Height must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      toast.error("Please fix the validation errors");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Prepare the update payload with only editable fields
      const updatePayload = {
        senderName: formData.senderName,
        receiverName: formData.receiverName,
        pickupAddress: formData.pickupAddress,
        deliveryAddress: formData.deliveryAddress,
        packageWeightKg: parseFloat(formData.packageWeightKg),
        packageLengthCm: parseFloat(formData.packageLengthCm),
        packageWidthCm: parseFloat(formData.packageWidthCm),
        packageHeightCm: parseFloat(formData.packageHeightCm),
        pickupPhone: formData.pickupPhone,
        deliveryPhone: formData.deliveryPhone,
        pickupTimeWindow: formData.pickupTimeWindow,
        specialInstructions: formData.specialInstructions || "",
        isFragile: formData.isFragile || false,
        deliveryType: formData.deliveryType
      };

      const response = await fetch(`${baseUrl}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update order");
      }

      const data = await response.json();
      toast.success(`Order #${data.id} updated successfully!`);

      setTimeout(() => {
        navigate(`/admin/orders/${data.id}`);
      }, 1500);
    } catch (err) {
      toast.error(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Layout userType="admin">
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading order details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!formData) {
    return (
      <Layout userType="admin">
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Failed to load order details</p>
            <button 
              onClick={() => navigate("/admin/orders")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </Layout>
    );
  }

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
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Edit Order #{formData.id}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(formData.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-800 mr-4">Status</div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  formData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  formData.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {formData.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b-2 border-blue-600">
              <h2 className="text-lg font-medium text-gray-900">
                Edit Shipping Details
              </h2>
            </div>

            <div className="p-6 space-y-8">
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Sender Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      </span>
                      Sender Information
                    </h3>
                    <div className="space-y-4">
                      {/* Read-only Customer Email */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">
                          Sender Email 
                        </label>
                        <input
                          value={formData.customerEmail || ''}
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                        />
                      </div>
                      
                      {/* Editable Sender Name */}
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Sender Name *
                        </label>
                        <input
                          name="senderName"
                          placeholder="Enter sender name"
                          value={formData.senderName || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.senderName && (
                          <p className="text-red-500 text-xs mt-1">{errors.senderName}</p>
                        )}
                      </div>
                      
                      {/* Editable Pickup Address */}
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Sender Address *
                        </label>
                        <textarea
                          name="pickupAddress"
                          placeholder="Enter sender address"
                          value={formData.pickupAddress || ''}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        {errors.pickupAddress && (
                          <p className="text-red-500 text-xs mt-1">{errors.pickupAddress}</p>
                        )}
                      </div>
                      
                      {/* Editable Pickup Phone */}
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Pickup Phone *
                        </label>
                        <input
                          name="pickupPhone"
                          placeholder="Enter pickup phone"
                          value={formData.pickupPhone || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.pickupPhone && (
                          <p className="text-red-500 text-xs mt-1">{errors.pickupPhone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Receiver Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                      <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      </span>
                      Receiver Information
                    </h3>
                    <div className="space-y-4">
                      {/* Editable Receiver Name */}
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Receiver Name *
                        </label>
                        <input
                          name="receiverName"
                          placeholder="Enter receiver name"
                          value={formData.receiverName || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.receiverName && (
                          <p className="text-red-500 text-xs mt-1">{errors.receiverName}</p>
                        )}
                      </div>
                      
                      {/* Editable Delivery Address */}
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Receiver Address *
                        </label>
                        <textarea
                          name="deliveryAddress"
                          placeholder="Enter receiver address"
                          value={formData.deliveryAddress || ''}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                        {errors.deliveryAddress && (
                          <p className="text-red-500 text-xs mt-1">{errors.deliveryAddress}</p>
                        )}
                      </div>
                      
                      {/* Editable Delivery Phone */}
                      <div>
                        <label className="block text-xs font-medium text-black-500 mb-1">
                          Delivery Phone *
                        </label>
                        <input
                          name="deliveryPhone"
                          placeholder="Enter delivery phone"
                          value={formData.deliveryPhone || ''}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {errors.deliveryPhone && (
                          <p className="text-red-500 text-xs mt-1">{errors.deliveryPhone}</p>
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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="packageWeightKg"
                      placeholder="0.0"
                      value={formData.packageWeightKg || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.packageWeightKg && (
                      <p className="text-red-500 text-xs mt-1">{errors.packageWeightKg}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Length (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="packageLengthCm"
                      placeholder="0.0"
                      value={formData.packageLengthCm || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.packageLengthCm && (
                      <p className="text-red-500 text-xs mt-1">{errors.packageLengthCm}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Width (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="packageWidthCm"
                      placeholder="0.0"
                      value={formData.packageWidthCm || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.packageWidthCm && (
                      <p className="text-red-500 text-xs mt-1">{errors.packageWidthCm}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Height (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="packageHeightCm"
                      placeholder="0.0"
                      value={formData.packageHeightCm || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.packageHeightCm && (
                      <p className="text-red-500 text-xs mt-1">{errors.packageHeightCm}</p>
                    )}
                  </div>
                </div>

                {/* Read-only Package Type */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Package Type 
                    </label>
                    <input
                      value={formData.packageType || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery & Special Information */}
              <div className="border-t pt-6 border-gray-400">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  </span>
                  Delivery & Special Information
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  {/* Editable Pickup Time Window */}
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Pickup Time Window *
                    </label>
                    <input
                      name="pickupTimeWindow"
                      placeholder="e.g., 09:00 - 17:00"
                      value={formData.pickupTimeWindow || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.pickupTimeWindow && (
                      <p className="text-red-500 text-xs mt-1">{errors.pickupTimeWindow}</p>
                    )}
                  </div>

                  {/* Editable Delivery Type */}
                  <div>
                    <label className="block text-xs font-medium text-black-500 mb-1">
                      Delivery Type
                    </label>
                    <select
                      name="deliveryType"
                      value={formData.deliveryType || 'STANDARD'}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="STANDARD">STANDARD</option>
                      <option value="EXPRESS">EXPRESS</option>
                      <option value="SAME_DAY">SAME DAY</option>
                    </select>
                  </div>

                  {/* Read-only Pickup Date */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Pickup Date 
                    </label>
                    <input
                      value={formData.pickupDate || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Editable Special Instructions */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-black-500 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstructions"
                    placeholder="Enter any special handling instructions..."
                    value={formData.specialInstructions || ''}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-400 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Editable Fragile Checkbox */}
                <div className="mb-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="isFragile"
                      checked={formData.isFragile || false}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-400 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      Mark as Fragile
                    </span>
                  </label>
                </div>
              </div>

              {/* Read-only Information Section */}
              <div className="border-t pt-6 border-gray-400">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mr-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  </span>
                  Other Extra Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Payment Mode
                    </label>
                    <input
                      value={formData.paymentMode || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Declared Value
                    </label>
                    <input
                      value={formData.declaredValue || '0'}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Invoice Status
                    </label>
                    <input
                      value={formData.invoiceStatus || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-6 border-gray-400 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/orders`)}
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
                  {loading ? "Updating..." : "Update Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}