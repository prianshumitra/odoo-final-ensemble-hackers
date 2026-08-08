import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, UserCheck, Store } from 'lucide-react';

interface SignUpProps {
  onSelectRole?: (role: 'customer' | 'vendor') => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onSelectRole }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleChange = (selectedRole: 'customer' | 'vendor') => {
    setRole(selectedRole);
    onSelectRole?.(selectedRole);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectRole?.(role);
    if (role === 'vendor') {
      navigate('/vendor');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6 bg-[#FAF7F2] p-8 rounded-3xl border border-[#D4C4ED] shadow-xl">
        {/* Role Selector Tabs */}
        <div className="bg-[#EFE9F6] p-1.5 rounded-2xl flex items-center gap-1 border border-[#D4C4ED]/60">
          <button
            type="button"
            onClick={() => handleRoleChange('customer')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'customer'
                ? 'bg-[#18181B] text-white shadow-md'
                : 'text-[#6E6A78] hover:text-[#18181B]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer Sign Up</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange('vendor')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'vendor'
                ? 'bg-[#7E3AF2] text-white shadow-md shadow-[#7E3AF2]/30'
                : 'text-[#6E6A78] hover:text-[#7E3AF2]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Vendor Sign Up</span>
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-[#18181B]">
            {role === 'vendor' ? 'Register Vendor Business' : 'Create Customer Account'}
          </h2>
          <p className="mt-1 text-xs text-[#6E6A78]">
            {role === 'vendor'
              ? 'Join as a verified vendor and list your rental products'
              : 'Join today to rent products on flexible tenure plans'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="full-name" className="block text-xs font-bold text-[#18181B] mb-1">
              Full Name
            </label>
            <div className="relative">
              <input
                id="full-name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                placeholder="Enter Your Name"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <div>
            <label htmlFor="email-address" className="block text-xs font-bold text-[#18181B] mb-1">
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
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                placeholder="name@example.com"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-[#18181B] mb-1">
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
                className="w-full bg-white px-9 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                placeholder="••••••••"
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 text-xs font-bold rounded-xl text-white transition-all shadow-md flex items-center justify-center gap-2 ${
              role === 'vendor' ? 'bg-[#7E3AF2] hover:bg-[#6C2BD9]' : 'bg-[#18181B] hover:bg-[#7E3AF2]'
            }`}
          >
            <span>{role === 'vendor' ? 'Register & Open Vendor Dashboard' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#6E6A78] pt-2">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#7E3AF2] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
