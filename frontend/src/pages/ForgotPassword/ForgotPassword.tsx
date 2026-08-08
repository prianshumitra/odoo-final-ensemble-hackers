import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/api';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      // Exact specification response message
      setMessage(res.message || 'The password reset link has been sent to your email.');
    } catch (err: any) {
      setMessage('The password reset link has been sent to your email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-[#FAF7F2] p-8 rounded-3xl border border-[#D4C4ED] shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-black text-[#7E3AF2] tracking-tight">EZRent</h1>
          <h2 className="mt-1 text-2xl font-extrabold text-[#18181B]">Reset Password</h2>
          <p className="text-xs text-[#6E6A78]">Enter your registered email ID to receive a password reset link</p>
        </div>

        {message && (
          <div className="p-4 bg-purple-50 border border-purple-200 text-[#7E3AF2] text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                placeholder="registered@example.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-xs font-bold text-white rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Sending Link...' : 'Submit Request'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#6E6A78] pt-2">
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-[#7E3AF2] hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
