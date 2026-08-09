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
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-transparent">
      <div className="w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-lg">
        <div className="w-full bg-[#FAF8F5] p-8 rounded-[23px] space-y-6 border border-[#E8E4DE]">
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-black text-[#1C1C1C] tracking-tight font-serif">EZRent</h1>
            <h2 className="text-2xl font-black text-[#1C1C1C]">Reset Password</h2>
            <p className="text-xs font-bold text-[#8A857F]">Enter your registered email ID to receive a password reset link</p>
          </div>

          {message && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F3EFE8] px-9 py-2.5 border border-[#E8E4DE] text-xs font-bold text-[#1C1C1C] placeholder-[#8A857F] rounded-xl focus:outline-none focus:border-[#0A0A0A] focus:bg-white shadow-inner transition-all"
                  placeholder="registered@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857F]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-xs font-bold text-white rounded-full transition-all shadow-warm-xs flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Sending Link...' : 'Submit Request'}</span>
              <ArrowRight className="w-4 h-4 text-[#E8B923]" />
            </button>
          </form>

          <p className="text-center text-xs font-bold text-[#8A857F] pt-2">
            Remembered your password?{' '}
            <Link to="/login" className="font-black text-[#1C1C1C] hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
