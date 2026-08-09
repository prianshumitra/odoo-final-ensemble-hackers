import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Building2, FileBadge, Lock, Mail } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AuthBackgroundDoodle } from '../../components/common/AuthBackgroundDoodle';

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
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 bg-transparent relative overflow-hidden">
      <AuthBackgroundDoodle />
      {/* Warm ambient border wrapper */}
      <div className="w-full max-w-xl p-[1px] rounded-3xl bg-gradient-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-lg z-10 relative">
        <div className="w-full bg-[#FAF8F5] rounded-[23px] overflow-hidden p-8 space-y-6 border border-[#E8E4DE]">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight font-serif">EZRent</h1>
            <h2 className="text-2xl font-black text-[#1C1C1C]">Vendor Partner Registration</h2>
            <p className="text-xs font-bold text-[#8A857F]">
              Register your business profile to manage rental inventory like a seller console.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Company Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#F3EFE8] px-9 py-2.5 border border-[#E8E4DE] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
                />
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857F]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">GST No</label>
              <div className="relative">
                <input
                  type="text"
                  value={gstNo}
                  onChange={(e) => setGstNo(e.target.value)}
                  className="w-full bg-[#F3EFE8] px-9 py-2.5 border border-[#E8E4DE] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
                />
                <FileBadge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857F]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F3EFE8] px-9 py-2.5 border border-[#E8E4DE] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857F]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#F3EFE8] px-9 py-2.5 border border-[#E8E4DE] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857F]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-[#F3EFE8] px-9 py-2.5 border border-[#E8E4DE] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857F]" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-xs font-bold text-white rounded-full transition-all shadow-warm-xs flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Submitting Application...' : 'Submit Vendor Application'}</span>
              <ArrowRight className="w-4 h-4 text-[#E8B923]" />
            </button>
          </form>

          <p className="text-center text-xs font-bold text-[#8A857F]">
            Already have an account?{' '}
            <Link to="/login" className="font-black text-[#1C1C1C] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
