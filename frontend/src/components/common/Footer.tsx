import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#EAE4DB] pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-[#E4DFD6]">
          <div className="flex items-center gap-4 bg-[#EFE9F6] p-5 rounded-2xl border border-[#D4C4ED] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white text-[#7E3AF2] flex items-center justify-center shrink-0 shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#18181B]">Free Express Delivery</h4>
              <p className="text-xs text-[#8A8694] mt-0.5">Complimentary white-glove setup on orders over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#EFE9F6] p-5 rounded-2xl border border-[#D4C4ED] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white text-[#7E3AF2] flex items-center justify-center shrink-0 shadow-xs">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#18181B]">Flexible Rent & Upgrade</h4>
              <p className="text-xs text-[#8A8694] mt-0.5">Swap, extend, or return anytime with zero hassle</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#EFE9F6] p-5 rounded-2xl border border-[#D4C4ED] shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-white text-[#7E3AF2] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#18181B]">100% Quality Inspected</h4>
              <p className="text-xs text-[#8A8694] mt-0.5">Sanitized & certified premium quality gear</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-[#18181B] text-white font-bold tracking-tight shadow-md">
                <span className="text-xs uppercase tracking-widest text-[#D4C4ED] mr-1.5 font-semibold">BR.F</span>
                <span className="font-extrabold text-sm tracking-wide">EZ Rent</span>
              </div>
            </Link>
            <p className="text-xs text-[#6E6A78] leading-relaxed max-w-sm">
              Diligent Wombat is your premier subscription platform for high-end furniture, home electronics, gaming consoles, and smart appliances.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><Link to="/" className="text-[#6E6A78] hover:text-[#7E3AF2] transition-colors">Products</Link></li>
              <li><Link to="/terms" className="text-[#6E6A78] hover:text-[#7E3AF2] transition-colors">Terms & Condition</Link></li>
              <li><Link to="/about" className="text-[#6E6A78] hover:text-[#7E3AF2] transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-[#6E6A78] hover:text-[#7E3AF2] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs font-medium text-[#6E6A78]">
              <li className="hover:text-[#7E3AF2] cursor-pointer">Living Room Furniture</li>
              <li className="hover:text-[#7E3AF2] cursor-pointer">4K OLED TVs</li>
              <li className="hover:text-[#7E3AF2] cursor-pointer">Gaming & Workstations</li>
              <li className="hover:text-[#7E3AF2] cursor-pointer">Bedrooms & Study</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Join Newsletter</h4>
            <p className="text-xs text-[#6E6A78]">
              Subscribe for exclusive member discounts and new arrival alerts.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-white text-[#1E1B26] text-xs rounded-full pl-9 pr-24 py-3 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2] shadow-xs"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold px-3.5 py-2 rounded-full transition-colors flex items-center gap-1"
              >
                <span>Join</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-600 font-semibold animate-in fade-in">
                ✓ Thank you for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E4DFD6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A8694]">
          <p>© {new Date().getFullYear()} EZ Rent Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for Odoo Ensemble Hackers
          </p>
        </div>
      </div>
    </footer>
  );
};
