import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';
import logoImg from '../../assets/logo.png';

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
    <footer className="bg-[#FAF8F5] border-t border-[#E8E4DE] shadow-warm-xs pt-14 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-[#E8E4DE]">
          <div className="flex items-center gap-4 bg-[#F3EFE8] p-5 rounded-2xl border border-[#E8E4DE] shadow-warm-xs">
            <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center shrink-0 shadow-warm-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1C1C1C]">Free Express Delivery</h4>
              <p className="text-xs font-bold text-[#8A857F] mt-0.5">Complimentary white-glove setup on orders over Rs. 1,000</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#F3EFE8] p-5 rounded-2xl border border-[#E8E4DE] shadow-warm-xs">
            <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center shrink-0 shadow-warm-xs">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1C1C1C]">Flexible Rent & Upgrade</h4>
              <p className="text-xs font-bold text-[#8A857F] mt-0.5">Swap, extend, or return anytime with zero hassle</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#F3EFE8] p-5 rounded-2xl border border-[#E8E4DE] shadow-warm-xs">
            <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center shrink-0 shadow-warm-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#1C1C1C]">100% Quality Inspected</h4>
              <p className="text-xs font-bold text-[#8A857F] mt-0.5">Sanitized & certified premium quality gear</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-2 -mt-4">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <img src={logoImg} alt="Logo" className="h-16 sm:h-20 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>
            <p className="text-xs font-bold text-[#8A857F] leading-relaxed max-w-sm">
              EZRent is your premier subscription platform for high-end furniture, home electronics, gaming consoles, and smart appliances.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-[#1C1C1C] uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2 text-xs font-bold">
              <li><Link to="/" className="text-[#8A857F] hover:text-[#0A0A0A] transition-colors">Storefront</Link></li>
              <li><Link to="/orders" className="text-[#8A857F] hover:text-[#0A0A0A] transition-colors">My Rental Orders</Link></li>
              <li><Link to="/vendor" className="text-[#8A857F] hover:text-[#0A0A0A] transition-colors">Vendor Console</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-black text-[#1C1C1C] uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs font-bold text-[#8A857F]">
              <li className="hover:text-[#0A0A0A] cursor-pointer transition-colors">Living Room Furniture</li>
              <li className="hover:text-[#0A0A0A] cursor-pointer transition-colors">4K OLED TVs</li>
              <li className="hover:text-[#0A0A0A] cursor-pointer transition-colors">Gaming & Workstations</li>
              <li className="hover:text-[#0A0A0A] cursor-pointer transition-colors">Bedrooms & Study</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black text-[#1C1C1C] uppercase tracking-wider">Join Newsletter</h4>
            <p className="text-xs font-bold text-[#8A857F]">
              Subscribe for exclusive member discounts and new arrival alerts.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-[#F3EFE8] text-[#1C1C1C] text-xs font-bold rounded-full pl-9 pr-24 py-3 border border-[#E8E4DE] focus:outline-none focus:border-[#0A0A0A] focus:bg-white transition-all shadow-inner"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A857F]" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-warm-xs"
              >
                <span>Join</span>
                <ArrowRight className="w-3 h-3 text-[#E8B923]" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-emerald-600 font-bold animate-in fade-in">
                ✓ Thank you for subscribing!
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E8E4DE] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#8A857F]">
          <p>© {new Date().getFullYear()} EZRent Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for Odoo Ensemble Hackers
          </p>
        </div>
      </div>
    </footer>
  );
};
