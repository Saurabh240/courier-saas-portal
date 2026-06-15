import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const BASE_API_URL = 'http://localhost:8080';

export const useDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BASE_API_URL}/api/dashboard/summary`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const apiData = response.data;
      
      // Map KPI stats directly from backend fields
      setSummary({
        totalOrders: apiData.totalOrders || 0,
        pendingOrders: apiData.pendingOrders || 0,
        deliveryRate: apiData.deliverySuccessRate || 0,
        revenue: apiData.revenueThisMonth || 0,
        // Fallbacks for growth parameters
        totalOrdersGrowth: apiData.totalOrdersGrowth || 0, 
        overdueOrders: apiData.overdueOrders || 0,     
        deliveryRateGrowth: apiData.deliveryRateGrowth || 0,
        revenueGrowth: apiData.revenueGrowth || 0,
      });
      
      // 2. Parse Weekly Chart and Status Donut charts cleanly
      setDetails({
        weeklyOrders: apiData.weeklyOrderCounts?.reduce((acc, item) => {
          // Safeguard: make sure item and item.date exist before running replace
          if (item && item.date) {
            const dateObj = new Date(item.date.replace(/-/g, '\/'));
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            acc[dayName] = item.count;
          }
          return acc;
        }, {}) || {},
        
        // Pass down the breakdown dictionary object as-is
        breakdown: apiData.statusBreakdown || {},
        recentOrders: apiData.recentOrders || []
      });
      
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard metrics.');
      setSummary(null);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();

    intervalRef.current = setInterval(() => {
      fetchDashboardData();
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchDashboardData]);

  return { summary, details, loading, error, refetch: fetchDashboardData };
};