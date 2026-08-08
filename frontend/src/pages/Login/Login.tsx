import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Lock, Mail, Store } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AuthFeatures } from '../../components/common/AuthFeatures';

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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-transparent">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-[#D4C4ED] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <AuthFeatures type="customer" />
        
        <div className="w-full md:w-1/2 p-8 sm:p-10 space-y-6 flex flex-col justify-center">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-[#7E3AF2] tracking-tight font-serif">EZRent</h1>
            <h2 className="text-2xl font-extrabold text-[#18181B]">Sign In</h2>
          <p className="text-xs font-semibold text-[#6E6A78]">
            Customer and vendor accounts use the same secure login.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Login ID</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                placeholder="name@example.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                placeholder="Enter your password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-xs font-bold text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-xs text-[#6E6A78]">
          <Link to="/forgot-password" className="font-bold text-[#7E3AF2] hover:underline">
            Forgot Password?
          </Link>
          <Link to="/admin-login" className="font-bold text-[#18181B] hover:text-[#7E3AF2]">
            Admin Login
          </Link>
        </div>

        <div className="pt-3 border-t border-[#EFE9F6] space-y-2 text-center text-xs">
          <p className="text-[#6E6A78]">
            Do not have an account?{' '}
            <Link to="/signup" className="font-bold text-[#7E3AF2] hover:underline">
              Register Here
            </Link>
          </p>
          <Link
            to="/vendor-signup"
            className="inline-flex items-center gap-1.5 font-bold text-amber-700 hover:text-amber-800"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Become a vendor</span>
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
};
