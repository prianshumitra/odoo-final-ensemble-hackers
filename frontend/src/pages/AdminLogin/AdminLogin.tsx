import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, UserCheck, AlertCircle } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [username, setUsername] = useState('admin@123');
  const [password, setPassword] = useState('admin@123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await authService.adminLogin({ username, password });
      if (res.user) {
        signIn(res.token, res.user);
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid Admin Credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#120F1D] via-[#1E1B26] to-[#0A090E] text-white">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#7E3AF2] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#7E3AF2]/40">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">System Admin Portal</h1>
          <p className="text-xs text-gray-400">
            Isolated Administrator Control Panel
          </p>
        </div>

        {/* Credentials Notice Box */}
        <div className="bg-[#7E3AF2]/15 border border-[#7E3AF2]/40 p-3 rounded-2xl text-xs space-y-1">
          <p className="font-bold text-[#C4B2E2] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#7E3AF2]" />
            <span>Environment Variable Authentication</span>
          </p>
          <p className="text-[11px] text-gray-300">
            Admin User: <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-purple-300">admin@123</code>
            <br />
            Password: <code className="bg-black/40 px-1.5 py-0.5 rounded font-mono text-purple-300">admin@123</code>
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-gray-300 mb-1">Admin Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@123"
                className="w-full bg-white/10 text-white pl-9 pr-3 py-3 border border-white/15 rounded-xl focus:outline-none focus:border-[#7E3AF2] focus:ring-1 focus:ring-[#7E3AF2]"
              />
              <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-300 mb-1">Admin Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 text-white pl-9 pr-3 py-3 border border-white/15 rounded-xl focus:outline-none focus:border-[#7E3AF2] focus:ring-1 focus:ring-[#7E3AF2]"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-extrabold rounded-xl transition-all shadow-lg shadow-[#7E3AF2]/30 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Authenticating Admin...' : 'Log In to Admin Panel'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
