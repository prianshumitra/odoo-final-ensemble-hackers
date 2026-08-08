import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Building2, FileBadge, Lock, Mail } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const VendorSignUp: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [companyName, setCompanyName] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user?.role === 'vendor' && user.status === 'active') {
    return <Navigate to="/vendor" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await authService.registerVendor({
        companyName,
        gstNo,
        email,
        password,
        confirmPassword,
      });
      setSuccessMsg(res.message || 'Vendor application submitted successfully.');
      setTimeout(() => navigate('/login', { replace: true }), 1800);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Unable to submit vendor application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#D4C4ED] shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-[#7E3AF2] tracking-tight font-serif">EZRent</h1>
          <h2 className="text-2xl font-extrabold text-[#18181B]">Vendor Partner Registration</h2>
          <p className="text-xs font-semibold text-[#6E6A78]">
            Register your business profile to manage rental inventory like a seller console.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Company Name</label>
            <div className="relative">
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
              />
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">GST No</label>
            <div className="relative">
              <input
                type="text"
                value={gstNo}
                onChange={(e) => setGstNo(e.target.value)}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
              />
              <FileBadge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-xs font-bold text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Submitting Application...' : 'Submit Vendor Application'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#6E6A78]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#7E3AF2] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};
