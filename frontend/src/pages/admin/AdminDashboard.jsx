import React, { useContext } from 'react';
import { AuthContext } from '/src/context/AuthContext.jsx';
import { useDashboard } from '/src/hooks/useDashboard.js';
import { KpiCard, KpiSkeleton } from '/src/components/KpiCards.jsx';
import Layout from '/src/components/Layout.jsx';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const STATUS_COLORS = {
  PENDING: '#f59e0b',    
  IN_TRANSIT: '#6366f1', 
  DELIVERED: '#10b981',  
  CANCELLED: '#ef4444'   
};

// 1. STABLE DESIGN FALLBACKS MOCK DATA (Matches your Figma Screen)
const MOCK_WEEKLY = [
  { day: 'Mon', orders: 48 },
  { day: 'Tue', orders: 60 },
  { day: 'Wed', orders: 52 },
  { day: 'Thu', orders: 78 },
  { day: 'Fri', orders: 88 },
  { day: 'Sat', orders: 42 },
  { day: 'Sun', orders: 28 }
];

const MOCK_BREAKDOWN = [
  { name: 'PENDING', value: 16, percentage: 16 },
  { name: 'IN_TRANSIT', value: 24, percentage: 24 },
  { name: 'DELIVERED', value: 56, percentage: 56 },
  { name: 'CANCELLED', value: 4, percentage: 4 }
];

export default function AdminDashboard() {
  const { data, loading, error, refetch } = useDashboard();

  // If loading is true but we want to see layout structure instead of loading skeletons,
  // we can bypass the initial loading return or let it manage errors cleanly.
  if (error) {
    console.log("API not connected yet, using layout design data mode.");
  }

  // 2. MERGE REAL DATA OR DUMMY DATA FOR STABLE GRAPH DRAWING
  const kpis = data?.kpis || {
    totalOrders: { value: '1,284', subtext: '12% this week', trend: 'up' },
    pending: { value: '312', subtext: '24 overdue', trend: 'neutral' },
    deliveryRate: { value: '94%', subtext: '2% vs last month', trend: 'up' },
    revenue: { value: '₹84,000', subtext: '8%', trend: 'up' }
  };
  
  const weeklyOrders = data?.weeklyOrders?.length ? data.weeklyOrders : MOCK_WEEKLY;
  const statusBreakdown = data?.statusBreakdown?.length ? data.statusBreakdown : MOCK_BREAKDOWN;

  return (
    <Layout userType="ADMIN">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
        </div>

        {/* KPI Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Orders"
            value={kpis.totalOrders?.value}
            subtext={kpis.totalOrders?.subtext}
            trendType={kpis.totalOrders?.trend}
          />
          <KpiCard
            title="Pending"
            value={kpis.pending?.value}
            subtext={kpis.pending?.subtext}
            trendType={kpis.pending?.trend}
          />
          <KpiCard
            title="Delivery Rate"
            value={kpis.deliveryRate?.value}
            subtext={kpis.deliveryRate?.subtext}
            trendType={kpis.deliveryRate?.trend}
          />
          <KpiCard
            title="Revenue (Month)"
            value={kpis.revenue?.value}
            subtext={kpis.revenue?.subtext}
            trendType={kpis.revenue?.trend}
          />
        </div>

        {/* Visual Charts Layout Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bar Graph Card Container */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm lg:col-span-2">
            <h3 className="text-sm font-bold text-slate-800 mb-6 tracking-tight">Orders this week</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyOrders} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Allocation Distribution Box */}
          <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[350px]">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">Status breakdown</h3>
            
            <div className="h-[180px] w-full flex items-center justify-center relative my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name.toUpperCase()] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Bottom Label Legend List Layout */}
            <div className="space-y-2 pt-4 border-t border-slate-50 text-xs font-medium">
              {statusBreakdown.map((entry) => {
                const cleanName = entry.name.replace('_', ' ').toLowerCase();
                return (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: STATUS_COLORS[entry.name.toUpperCase()] }}
                      />
                      <span className="text-slate-500 capitalize">{cleanName}</span>
                    </div>
                    <span className="font-bold text-slate-700">{entry.percentage}%</span>
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