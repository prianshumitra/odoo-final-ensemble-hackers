import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Lock, Mail, Store } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AuthFeatures } from '../../components/common/AuthFeatures';
import { AuthBackgroundDoodle } from '../../components/common/AuthBackgroundDoodle';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }

    if (user.role === 'vendor' && user.status === 'active') {
      return <Navigate to="/vendor" replace />;
    }

    return <Navigate to="/" replace />;
  }

  const nextPath = (location.state as { from?: string } | null)?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await authService.login({ email, password });
      if (res.user.role === 'vendor') {
        if (res.user.status !== 'active') {
          setErrorMsg('Vendor account is pending admin approval. You can sign in after approval.');
          return;
        }
        signIn(res.token, res.user);
        navigate('/vendor', { replace: true });
        return;
      }

      signIn(res.token, res.user);

      if (res.user.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      navigate(nextPath || '/', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Invalid User ID or Password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-transparent relative overflow-hidden">
      <AuthBackgroundDoodle />
      {/* Warm ambient border wrapper */}
      <div className="w-full max-w-4xl p-[1px] rounded-3xl bg-gradient-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-lg z-10 relative">
        <div className="w-full bg-[#FAF8F5] rounded-[23px] overflow-hidden flex flex-col md:flex-row border border-[#E8E4DE]">
          <AuthFeatures type="customer" />
          
          <div className="w-full md:w-1/2 p-8 sm:p-10 space-y-6 flex flex-col justify-center bg-transparent">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight font-serif">EZRent</h1>
              <h2 className="text-2xl font-black text-[#1C1C1C]">Sign In</h2>
              <p className="text-xs font-bold text-[#8A857F]">
                Customer and vendor accounts use the same secure login.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Login ID</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#F3EFE8] px-9 py-2.5 border border-[#E8E4DE] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
                    placeholder="name@example.com"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857F]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F3EFE8] px-9 py-2.5 border border-[#E8E4DE] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857F]" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-xs font-bold text-white rounded-full transition-all shadow-warm-xs flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 text-[#E8B923]" />
              </button>
            </form>

            <div className="flex items-center justify-between text-xs text-[#8A857F]">
              <Link to="/forgot-password" className="font-bold text-[#1C1C1C] hover:text-[#E8B923] hover:underline transition-colors">
                Forgot Password?
              </Link>
              <Link to="/admin-login" className="font-bold text-[#1C1C1C] hover:text-[#E8B923] transition-colors">
                Admin Login
              </Link>
            </div>

            <div className="pt-3 border-t border-[#E8E4DE] space-y-2 text-center text-xs">
              <p className="text-[#8A857F] font-bold">
                Do not have an account?{' '}
                <Link to="/signup" className="font-black text-[#1C1C1C] hover:underline">
                  Register Here
                </Link>
              </p>
              <Link
                to="/vendor-signup"
                className="inline-flex items-center gap-1.5 font-black text-amber-800 hover:text-amber-900"
              >
                <Store className="w-3.5 h-3.5 text-[#E8B923]" />
                <span>Become a vendor</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
