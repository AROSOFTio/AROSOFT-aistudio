import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, ShoppingCart, TrendingUp, Loader2 } from 'lucide-react';

interface DashboardStats {
  posts: number;
  orders: number;
  users: number;
  revenue: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    posts: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin/login');
          return;
        }

        const response = await fetch('/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch dashboard stats');

        const data = await response.json();
        setStats({
          posts: Number(data.posts || 0),
          orders: Number(data.orders || 0),
          users: Number(data.users || 0),
          revenue: Number(data.revenue || 0),
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    { name: 'Total Posts', value: stats.posts.toLocaleString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Orders', value: stats.orders.toLocaleString(), icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { name: 'Total Users', value: stats.users.toLocaleString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Revenue', value: `UGX ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {error}
        </div>
      )}

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
        <h2 className="text-lg font-semibold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-500 text-sm">
          Stats are now loaded from your live database in real time.
        </p>
      </div>
    </div>
  );
}
