import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Store,
  CheckCircle2,
  Package,
  RotateCcw,
  Star,
  Truck,
  Layers,
  Zap,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const categories = [
    {
      title: 'Furniture & Living',
      desc: 'Sofas, ergonomic chairs, study desks, and luxury decor for home or workspace.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      badge: 'Popular',
    },
    {
      title: 'Tech & Electronics',
      desc: 'MacBooks, gaming rigs, 4K TVs, cameras, and audio gear available on flexible terms.',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      badge: 'Trending',
    },
    {
      title: 'Fitness & Sportswear',
      desc: 'Treadmills, smart bikes, tennis rackets, and professional sportswear.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
      badge: 'New',
    },
    {
      title: 'Event & Appliances',
      desc: 'Projectors, PA systems, portable ACs, refrigerators, and party equipment.',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      badge: 'Flexible',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Explore & Choose Plan',
      desc: 'Browse verified items and select hourly, daily, or monthly rental terms.',
      icon: Layers,
    },
    {
      step: '02',
      title: 'Escrow Security Deposit',
      desc: 'Transparent pricing with automated Odoo security deposit escrow protection.',
      icon: ShieldCheck,
    },
    {
      step: '03',
      title: 'Store Pickup or Delivery',
      desc: 'Pick up immediately at a local hub or receive sanitized doorstep delivery.',
      icon: Truck,
    },
    {
      step: '04',
      title: 'Return & Auto Refund',
      desc: 'Return the item upon expiration for immediate full deposit refund to your account.',
      icon: RotateCcw,
    },
  ];

  const stats = [
    { label: 'Active Rentals Managed', value: '12,500+' },
    { label: 'Verified Vendor Stores', value: '450+' },
    { label: 'On-Time Deposit Refund', value: '99.8%' },
    { label: 'Renter Satisfaction', value: '4.9 ★' },
  ];

  return (
    <div className="bg-[#F7F4EF] text-[#1C1C1C] min-h-screen flex flex-col flex-1 space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Hero Section */}
      <section className="relative p-[1px] rounded-3xl bg-gradient-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-md overflow-hidden">
        <div className="bg-[#FAF8F5] rounded-[23px] p-8 sm:p-12 lg:p-16 border border-[#E8E4DE] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Background Decorative Pattern */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#E8B923]/10 blur-3xl pointer-events-none" />

          {/* Left Text Column */}
          <div className="space-y-6 max-w-2xl text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 bg-white text-[#1C1C1C] text-xs font-black px-4 py-1.5 rounded-full border border-[#E8E4DE] shadow-warm-xs">
              <Sparkles className="w-4 h-4 text-[#E8B923]" />
              <span>The Next Generation Rental Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-[#1C1C1C] tracking-tight leading-tight font-serif">
              Rent Premium Gear & Furniture on <span className="underline decoration-[#E8B923] underline-offset-8">Your Terms</span>
            </h1>

            <p className="text-sm sm:text-base text-[#8A857F] font-bold leading-relaxed">
              Experience zero-commitment living. Access top-tier electronics, designer furniture, and fitness gear with automated deposit escrow and instant store pickup.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-4 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white font-black text-xs rounded-full transition-all shadow-warm-md flex items-center justify-center gap-2 group"
              >
                <span>Explore Rental Store</span>
                <ArrowRight className="w-4 h-4 text-[#E8B923] group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/vendor-signup"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-[#F3EFE8] text-[#1C1C1C] font-black text-xs rounded-full border border-[#E8E4DE] transition-all shadow-warm-xs flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4 text-[#1C1C1C]" />
                <span>Partner as Vendor</span>
              </Link>
            </div>

            {/* Micro Feature Bullets */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#E8E4DE] text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1C1C1C]">
                <CheckCircle2 className="w-4 h-4 text-[#E8B923] shrink-0" />
                <span>Zero Commitment</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1C1C1C]">
                <CheckCircle2 className="w-4 h-4 text-[#E8B923] shrink-0" />
                <span>Escrow Secured Deposit</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#1C1C1C]">
                <CheckCircle2 className="w-4 h-4 text-[#E8B923] shrink-0" />
                <span>100% Sanitized Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Image Feature Stack */}
          <div className="relative w-full lg:w-1/2 max-w-lg z-10">
            <div className="relative rounded-3xl bg-[#F3EFE8] border border-[#E8E4DE] p-4 shadow-warm-lg overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80"
                alt="Modern Furnished Room"
                className="w-full h-80 sm:h-96 object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Badge 1 */}
              <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E8E4DE] shadow-warm-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-black text-[#1C1C1C]">Odoo Verified</span>
                  <span className="text-[10px] font-bold text-[#8A857F]">Deposit Protection</span>
                </div>
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#E8E4DE] shadow-warm-md flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8B923] text-[#1C1C1C] flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-xs font-black text-[#1C1C1C]">Instant Store Pickup</span>
                  <span className="text-[10px] font-bold text-[#8A857F]">Same-day dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#E8E4DE] shadow-warm-xs text-center space-y-1"
          >
            <span className="text-2xl sm:text-3xl font-black text-[#1C1C1C]">{stat.value}</span>
            <p className="text-xs font-bold text-[#8A857F] uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Category Showcase Section */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#E8E4DE] pb-4">
          <div>
            <span className="text-xs font-black text-[#E8B923] uppercase tracking-widest">Catalog Categories</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight font-serif mt-1">
              Popular Rental Equipment
            </h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-black text-[#1C1C1C] hover:text-[#E8B923] flex items-center gap-1 transition-colors"
          >
            <span>View all items</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-[#FAF8F5] rounded-3xl border border-[#E8E4DE] p-4 shadow-warm-xs hover:shadow-warm-md transition-all group flex flex-col justify-between"
            >
              <div className="relative aspect-video sm:aspect-square rounded-2xl overflow-hidden bg-[#F3EFE8] mb-4">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 right-3 bg-[#0A0A0A] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-warm-xs">
                  {cat.badge}
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-black text-[#1C1C1C]">{cat.title}</h3>
                <p className="text-xs font-bold text-[#8A857F] leading-relaxed">{cat.desc}</p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-[#0A0A0A] pt-2 hover:underline"
                >
                  <span>Browse Category</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How EZRent Works Step-by-Step */}
      <section className="bg-[#FAF8F5] rounded-3xl p-8 sm:p-12 border border-[#E8E4DE] shadow-warm-md space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-black text-[#E8B923] uppercase tracking-widest">Seamless Experience</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] font-serif">
            How Renting Works in 4 Steps
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#8A857F]">
            Transparent pricing, instant store fulfillment, and quick deposit refunds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-[#E8E4DE] shadow-warm-xs space-y-4 relative group hover:border-[#0A0A0A] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#F3EFE8] text-[#1C1C1C] flex items-center justify-center font-black">
                  <st.icon className="w-6 h-6 text-[#1C1C1C]" />
                </div>
                <span className="text-2xl font-black text-[#E8E4DE] group-hover:text-[#E8B923] transition-colors">
                  {st.step}
                </span>
              </div>
              <h3 className="text-sm font-black text-[#1C1C1C]">{st.title}</h3>
              <p className="text-xs font-bold text-[#8A857F] leading-relaxed">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="p-[1px] rounded-3xl bg-gradient-to-r from-[#0A0A0A] via-[#1C1C1C] to-[#0A0A0A] shadow-warm-lg text-white overflow-hidden">
        <div className="p-8 sm:p-12 text-center space-y-6 rounded-[23px] bg-[#0A0A0A] relative">
          <div className="inline-flex items-center gap-2 bg-white/10 text-[#E8B923] text-xs font-black px-4 py-1.5 rounded-full border border-white/20">
            <Star className="w-3.5 h-3.5 fill-current text-[#E8B923]" />
            <span>Join 10,000+ Satisfied Renters Today</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white font-serif max-w-2xl mx-auto leading-tight">
            Upgrade Your Lifestyle Without Buying Full Price
          </h2>

          <p className="text-xs sm:text-sm text-[#8A857F] max-w-xl mx-auto font-bold">
            Start browsing our verified rental inventory with zero long-term commitments and instant pickup.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/products"
              className="px-8 py-4 bg-[#E8B923] hover:bg-[#D4A71B] text-[#1C1C1C] font-black text-xs rounded-full transition-all shadow-warm-md flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-[#1C1C1C]" />
              <span>Start Renting Now</span>
            </Link>
            <Link
              to="/vendor-signup"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-black text-xs rounded-full border border-white/20 transition-all"
            >
              <span>List Your Products as Vendor</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
