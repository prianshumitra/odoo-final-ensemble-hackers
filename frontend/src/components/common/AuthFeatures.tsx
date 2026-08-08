import React from 'react';
import { CheckCircle2, ShieldCheck, Zap, Store, CreditCard, BarChart3 } from 'lucide-react';

interface AuthFeaturesProps {
  type?: 'customer' | 'vendor';
}

export const AuthFeatures: React.FC<AuthFeaturesProps> = ({ type = 'customer' }) => {
  const customerFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      title: 'Flexible Rentals',
      description: 'Rent premium gear by the hour, day, or month with zero hassle.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      title: 'Secure & Verified',
      description: 'All vendors are strictly vetted to ensure you get quality products.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />,
      title: 'Instant Approvals',
      description: 'Book your items instantly and manage rentals right from your dashboard.',
    },
  ];

  const vendorFeatures = [
    {
      icon: <Store className="w-5 h-5 text-[#7E3AF2]" />,
      title: 'Reach More Customers',
      description: 'Expand your rental business and reach thousands of verified users.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-500" />,
      title: 'Powerful Dashboard',
      description: 'Manage inventory, dynamic pricing, and real-time stock effortlessly.',
    },
    {
      icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
      title: 'Guaranteed Payouts',
      description: 'Enjoy secure, automated payments with full transparent reporting.',
    },
  ];

  const features = type === 'vendor' ? vendorFeatures : customerFeatures;

  return (
    <div className="hidden md:flex flex-col justify-between w-1/2 bg-transparent p-10">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-black text-[#18181B] tracking-tight">
            {type === 'vendor' ? 'Grow Your Business' : 'Welcome to EZRent'}
          </h2>
          <p className="text-sm font-semibold text-[#6E6A78] mt-2 leading-relaxed">
            {type === 'vendor'
              ? 'Join our premium marketplace and start turning your idle inventory into a steady revenue stream.'
              : 'Join the ultimate flexible rental marketplace for tech, furniture, and premium gear.'}
          </p>
        </div>

        <div className="space-y-6 pt-4">
          {features.map((feat, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-[#D4C4ED]/60">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-[#18181B]">{feat.title}</h3>
                <p className="text-xs font-semibold text-[#6E6A78] leading-relaxed mt-1">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-white/60 p-4 rounded-xl border border-[#D4C4ED]/50 flex items-center gap-4">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-700">JS</div>
          <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-emerald-700">AR</div>
          <div className="w-8 h-8 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-rose-700">MK</div>
        </div>
        <div>
          <p className="text-xs font-bold text-[#18181B]">Join 10,000+ users</p>
          <p className="text-[10px] font-semibold text-[#6E6A78]">Trusted worldwide</p>
        </div>
      </div>
    </div>
  );
};
