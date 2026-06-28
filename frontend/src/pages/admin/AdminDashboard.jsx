import React from 'react';
import { useDashboard } from '/src/hooks/useDashboard.js';
import { KpiCard } from '/src/components/KpiCards.jsx';
import Layout from '/src/components/Layout.jsx';
import { Loader2 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const STATUS_COLORS = {
  PENDING: '#f59e0b',    
  IN_TRANSIT: '#6366f1', 
  DELIVERED: '#10b981',  
  CANCELLED: '#ef4444',
  PICKED_UP: '#3b82f6'
};

export default function AdminDashboard() {
  const { summary, details, loading, error } = useDashboard();

  if (loading) {
    return (
      <Layout userType="admin">
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
          <Loader2 className="animate-spin text-blue-600" size={36} />
          <p className="text-slate-500 text-sm font-medium">Fetching real-time platform metrics...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout userType="admin">
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          <h4 className="font-bold text-sm mb-1">Live Synchronization Problem</h4>
          <p className="text-xs">{error}</p>
        </div>
      </Layout>
    );
  }

  
  const totalOrdersVal = summary?.totalOrders || 0;
  const pendingOrdersVal = summary?.pendingOrders || 0;
  const deliveryRateVal = summary?.deliveryRate ? `${summary.deliveryRate}%` : '0%';
  const revenueVal = summary?.revenue ? `₹${summary.revenue.toLocaleString('en-IN')}` : '₹0';

  
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const formattedWeeklyData = daysOfWeek.map(day => ({
    day,
    orders: details?.weeklyOrders?.[day] || 0
  }));

  
  const statusKeys = ['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'];
  
  const formattedBreakdownData = statusKeys.map(key => {
    const target = details?.breakdown?.[key];
    return {
      name: key,
      value: target ? target.count : 0,
      percentage: target ? target.percentage : 0
    };
  });

  
  const hasChartData = totalOrdersVal > 0;

  return (
    <Layout userType="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        </div>

        {/*  KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Orders"
            value={totalOrdersVal.toLocaleString('en-IN')}
            subtext={`${summary?.totalOrdersGrowth || 0}% this week`}
            trendType="up"
          />
          <KpiCard
            title="Pending"
            value={pendingOrdersVal.toLocaleString('en-IN')}
            subtext={`${summary?.overdueOrders || 0} overdue`}
            trendType="neutral"
          />
          <KpiCard
            title="Delivery Rate"
            value={deliveryRateVal}
            subtext={`${summary?.deliveryRateGrowth || 0}% vs last month`}
            trendType="up"
          />
          <KpiCard
            title="Revenue (Month)"
            value={revenueVal}
            subtext={`${summary?.revenueGrowth || 0}%`}
            trendType="up"
          />
        </div>

        {/* Visual Charts Layout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Live Weekly Orders Bar Graph */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2 min-w-0">
            <h3 className="text-sm font-bold text-slate-800 mb-6 tracking-tight">Orders this week</h3>
            <div className="h-[280px] min-h-[280px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={formattedWeeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live  Status Pie Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[350px] min-w-0">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Status breakdown</h3>
            
            <div className="h-[180px] min-h-[180px] w-full flex items-center justify-center relative my-auto min-w-0">
              {!hasChartData ? (
                <div className="text-center text-slate-400 text-xs">
                  No active orders tracked yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={formattedBreakdownData.filter(item => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {formattedBreakdownData.filter(item => item.value > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#cbd5e1'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} Orders`, 'Volume']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Live Bottom Legend Layout List */}
            <div className="space-y-2 pt-4 border-t border-slate-50 text-xs font-medium">
              {formattedBreakdownData.map((item) => {
                const cleanName = item.name.replace('_', ' ').toLowerCase();
                return (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[item.name] }}
                      />
                      <span className="text-slate-500 capitalize">{cleanName}</span>
                    </div>
                    <span className="font-bold text-slate-700">{item.percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}