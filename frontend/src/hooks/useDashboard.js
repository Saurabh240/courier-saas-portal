import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  const fetchDashboardData = useCallback(async () => {
    // Read directly from localStorage since it's not exposed in AuthContext value
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('/api/dashboard/summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch dashboard metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch load
    setLoading(true);
    fetchDashboardData();

    // Polling interval 60s
    intervalRef.current = setInterval(() => {
      fetchDashboardData();
    }, 60000);

    // Strict cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchDashboardData]);

  return { data, loading, error, refetch: fetchDashboardData };
};