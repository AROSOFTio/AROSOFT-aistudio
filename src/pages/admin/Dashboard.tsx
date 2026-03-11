import React, { useEffect, useState } from 'react';
import { Users, FileText, ShoppingCart, TrendingUp } from 'lucide-react';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    orders: 0,
    users: 0,
  });

  useEffect(() => {
    // In a real app, fetch these from an API
    setStats({
      posts: 12,
      orders: 45,
      users: 3,
    });
  }, []);

  const statCards = [
    { name: 'Total Posts', value: stats.posts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Total Users', value: stats.users, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Revenue', value: 'UGX 2.4M', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
        <div className="text-slate-500 text-sm">
          No recent activity to display.
        </div>
      </div>
    </div>
  );
}
