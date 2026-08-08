import React, { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, CheckCircle2, Lock, Mail, User } from 'lucide-react';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const passwordRules = [
  '6 to 12 characters',
  'At least 1 uppercase letter',
  'At least 1 lowercase letter',
  'At least 1 special character from @ $ & _',
];

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [emailCheck, setEmailCheck] = useState<'idle' | 'checking' | 'available' | 'exists'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const emailStatusText = useMemo(() => {
    if (emailCheck === 'checking') return 'Checking email availability...';
    if (emailCheck === 'available') return 'Email is available.';
    if (emailCheck === 'exists') return 'Email already exists.';
    return '';
  }, [emailCheck]);

  const handleEmailBlur = async () => {
    if (!email.trim()) {
      setEmailCheck('idle');
      return;
    }

    setEmailCheck('checking');

    try {
      const res = await authService.checkEmail(email.trim());
      setEmailCheck(res.exists ? 'exists' : 'available');
    } catch {
      setEmailCheck('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await authService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        couponCode,
      });
      navigate('/login', { replace: true });
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 bg-[#FAF7F2]">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-[#D4C4ED] shadow-2xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-[#7E3AF2] tracking-tight font-serif">EZRent</h1>
          <h2 className="text-2xl font-extrabold text-[#18181B]">Create Customer Account</h2>
          <p className="text-xs font-semibold text-[#6E6A78]">
            Register to browse, rent, and track your orders.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">First Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Last Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Email ID</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
            {emailStatusText && (
              <p
                className={`mt-1 text-[11px] font-bold ${
                  emailCheck === 'exists'
                    ? 'text-rose-600'
                    : emailCheck === 'available'
                    ? 'text-emerald-600'
                    : 'text-[#8A8694]'
                }`}
              >
                {emailStatusText}
              </p>
            )}
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

          <div className="rounded-2xl bg-[#FAF7F2] border border-[#EFE9F6] p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#18181B]">
              <CheckCircle2 className="w-4 h-4 text-[#7E3AF2]" />
              <span>Password Rules</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#6E6A78]">
              {passwordRules.map((rule) => (
                <p key={rule}>{rule}</p>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Coupon Code (Optional)</label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full bg-white px-4 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
              placeholder="xxxx10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-xs font-bold text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register'}</span>
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
