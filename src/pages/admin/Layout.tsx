import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, LogOut } from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Posts', path: '/admin/posts', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <span className="text-xl font-bold text-slate-900">Arosoft Admin</span>
        </div>
        <div className="flex-1 py-6 flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5 text-slate-400 group-hover:text-red-700" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shrink-0">
          <h1 className="text-lg font-semibold text-slate-900">
            {navItems.find((i) => location.pathname.startsWith(i.path))?.name || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
