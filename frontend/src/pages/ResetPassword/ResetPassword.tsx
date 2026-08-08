import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/api';

export const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Password and Confirm Password must match.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.resetPassword(token || '', { password, confirmPassword });
      setSuccessMsg(res.message || 'Password updated successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Error updating password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-[#FAF7F2] p-8 rounded-3xl border border-[#D4C4ED] shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#7E3AF2] tracking-tight">EZRent</h1>
          <h2 className="mt-1 text-2xl font-extrabold text-[#18181B]">Create New Password</h2>
          <p className="text-xs text-[#6E6A78]">Enter your new password below to regain account access</p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">New Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                placeholder="6-12 chars, 1 upper, 1 lower, 1 special (@ $ & _)"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                placeholder="Re-enter new password"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-xs font-bold text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Updating Password...' : 'Save New Password'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#6E6A78] pt-2">
          <Link to="/login" className="font-bold text-[#7E3AF2] hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
