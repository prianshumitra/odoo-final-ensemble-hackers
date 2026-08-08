import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Store, LogOut, RefreshCw } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [stats, setStats] = useState({
    customersCount: 0,
    vendorsCount: 0,
    pendingVendorsCount: 0,
    totalUsers: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await authService.getAdminStats();
      setStats(statsRes);
      const usersRes = await authService.getUsers();
      setUsers(usersRes || []);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSignOut = () => {
    signOut();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-black/60 backdrop-blur-xl text-white p-6 sm:p-12 font-sans space-y-8">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#7E3AF2] text-white flex items-center justify-center font-bold shadow-lg shadow-[#7E3AF2]/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Minimal Admin Dashboard
            </h1>
            <p className="text-xs text-gray-400">
              Authenticated via Environment Variables (<code className="text-purple-400">ADMIN_USERNAME</code> / <code className="text-purple-400">ADMIN_PASSWORD</code>)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5"
            title="Refresh database stats"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleSignOut}
            className="px-4 py-2.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Minimal Metrics Display */}
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Registered Customers */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl space-y-4 hover:border-[#7E3AF2]/60 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400">
                Customer Database
              </span>
              <div className="w-12 h-12 rounded-2xl bg-[#7E3AF2]/20 text-[#7E3AF2] flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div>
              <span className="text-5xl font-black text-white tracking-tight">
                {stats.customersCount}
              </span>
              <span className="block text-xs font-bold text-gray-400 mt-1">
                Total Registered Customers
              </span>
            </div>
          </div>

          {/* Card 2: Registered Vendors */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl space-y-4 hover:border-amber-500/60 transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                Vendor Database
              </span>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6" />
              </div>
            </div>

            <div>
              <span className="text-5xl font-black text-white tracking-tight">
                {stats.vendorsCount}
              </span>
              <span className="block text-xs font-bold text-gray-400 mt-1">
                Total Registered Vendors ({stats.pendingVendorsCount} Pending Review)
              </span>
            </div>
          </div>
        </div>

        {/* Minimal User Directory Reference */}
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              MongoDB Accounts Overview ({users.length} total)
            </h2>
            <span className="text-xs font-mono text-purple-400">Live Database Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-gray-400 font-bold uppercase tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-2.5 px-3">Name / User</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-500 text-xs">
                      No accounts found in MongoDB.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id || u.email} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3 font-bold text-white">{u.name}</td>
                      <td className="py-3 px-3 font-mono text-gray-400">{u.email}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : u.role === 'vendor'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {u.role || 'customer'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          u.status === 'active' || !u.status
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
