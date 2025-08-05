import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import OrderDetails from "../../components/OrderDetails";
import Layout from "../../components/Layout";

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${
            process.env.REACT_APP_API_BASE_URL || "http://localhost:8080"
          }/api/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data); //your API returns full order object
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <Layout userType="admin">
      <div className="p-6 max-w-5xl mx-auto">
        {loading ? (
          <div className="text-gray-500">Loading order details...</div>
        ) : order ? (
          <OrderDetails order={order} onBack={() => window.history.back()} />
        ) : (
          <div className="text-red-500">Order not found</div>
        )}
      </div>
    </Layout>
  );
};

export default OrderDetailPage;
