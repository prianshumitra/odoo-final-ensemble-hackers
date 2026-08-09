import React from 'react';
import { CheckCircle2, ShieldCheck, Zap, Store, CreditCard, BarChart3 } from 'lucide-react';

interface AuthFeaturesProps {
  type?: 'customer' | 'vendor';
}

export const AuthFeatures: React.FC<AuthFeaturesProps> = ({ type = 'customer' }) => {
  const customerFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-[#E8B923]" />,
      title: 'Flexible Rentals',
      description: 'Rent premium gear by the hour, day, or month with zero hassle.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#E8B923]" />,
      title: 'Secure & Verified',
      description: 'All vendors are strictly vetted to ensure you get quality products.',
    },
    {
      icon: <CheckCircle2 className="w-5 h-5 text-[#E8B923]" />,
      title: 'Instant Approvals',
      description: 'Book your items instantly and manage rentals right from your dashboard.',
    },
  ];

  const vendorFeatures = [
    {
      icon: <Store className="w-5 h-5 text-[#E8B923]" />,
      title: 'Reach More Customers',
      description: 'Expand your rental business and reach thousands of verified users.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-[#E8B923]" />,
      title: 'Powerful Dashboard',
      description: 'Manage inventory, dynamic pricing, and real-time stock effortlessly.',
    },
    {
      icon: <CreditCard className="w-5 h-5 text-[#E8B923]" />,
      title: 'Guaranteed Payouts',
      description: 'Enjoy secure, automated payments with full transparent reporting.',
    },
  ];

  const features = type === 'vendor' ? vendorFeatures : customerFeatures;

  return (
    <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#F3EFE8]/60 p-10 border-r border-[#E8E4DE]">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-black text-[#1C1C1C] tracking-tight font-serif">
            {type === 'vendor' ? 'Grow Your Business' : 'Welcome to EZRent'}
          </h2>
          <p className="text-xs font-bold text-[#8A857F] mt-2 leading-relaxed">
            {type === 'vendor'
              ? 'Join our premium marketplace and start turning your idle inventory into a steady revenue stream.'
              : 'Join the ultimate flexible rental marketplace for tech, furniture, and premium gear.'}
          </p>
        </div>

        <div className="space-y-6 pt-4">
          {features.map((feat, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#0A0A0A] flex items-center justify-center shrink-0 shadow-warm-xs">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1C1C1C]">{feat.title}</h3>
                <p className="text-xs font-bold text-[#8A857F] leading-relaxed mt-1">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-white p-4 rounded-2xl border border-[#E8E4DE] shadow-warm-xs flex items-center gap-4">
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-[#E8B923] border-2 border-white flex items-center justify-center text-[10px] font-black">JS</div>
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-[#E8B923] border-2 border-white flex items-center justify-center text-[10px] font-black">AR</div>
          <div className="w-8 h-8 rounded-full bg-[#0A0A0A] text-[#E8B923] border-2 border-white flex items-center justify-center text-[10px] font-black">MK</div>
        </div>
        <div>
          <p className="text-xs font-black text-[#1C1C1C]">Join 10,000+ users</p>
          <p className="text-[10px] font-bold text-[#8A857F]">Trusted worldwide</p>
        </div>
      </div>
    </div>
  );
};
