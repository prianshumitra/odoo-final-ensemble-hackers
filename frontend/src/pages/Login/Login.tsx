import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    console.log('Login attempt:', { email, password });
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-[#EAE4DB] shadow-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-[#18181B] text-white font-bold mb-4">
            <span className="text-xl">EZ</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#18181B]">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#6E6A78]">
            Log in to your account to manage your rentals
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold text-[#3E3A47] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-[#E4DFD6] placeholder-[#A09BA6] text-[#1E1B26] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EFE9F6] focus:border-[#7E3AF2] focus:z-10 sm:text-sm transition-all"
                  placeholder="name@example.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#8A8694]" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#3E3A47] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-[#E4DFD6] placeholder-[#A09BA6] text-[#1E1B26] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#EFE9F6] focus:border-[#7E3AF2] focus:z-10 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#8A8694]" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#7E3AF2] focus:ring-[#EFE9F6] border-[#E4DFD6] rounded-md cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[#6E6A78] cursor-pointer">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-semibold text-[#7E3AF2] hover:text-[#6D28D9]">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#18181B] hover:bg-[#7E3AF2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7E3AF2] transition-all shadow-md"
          >
            Sign in
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAE4DB]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#8A8694]">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center py-2.5 px-4 border border-[#E4DFD6] rounded-xl bg-white text-sm font-semibold text-[#3E3A47] hover:bg-[#FAF7F2] transition-colors">
              Google
            </button>
            <button className="flex items-center justify-center py-2.5 px-4 border border-[#E4DFD6] rounded-xl bg-white text-sm font-semibold text-[#3E3A47] hover:bg-[#FAF7F2] transition-colors">
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-[#6E6A78]">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-[#7E3AF2] hover:text-[#6D28D9]">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
