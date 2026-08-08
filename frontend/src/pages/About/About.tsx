import React from 'react';
import { Sparkles, Users, Award, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10 flex-1">
      {/* Hero Header */}
      <div className="p-[3px] rounded-3xl bg-gradient-to-r from-[#C4B2E2] via-[#D4C4ED] to-[#EAE4DB] shadow-md">
        <div className="bg-gradient-to-r from-[#EFE9F6] via-[#FAF7F2] to-[#F5EBE0] rounded-[23px] p-8 sm:p-12 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 bg-white text-[#7E3AF2] text-xs font-extrabold px-3.5 py-1 rounded-full border border-[#D4C4ED] shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About EZRent</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18181B] my-0 tracking-tight">
            Redefining How You Experience Modern Living
          </h1>
          <p className="text-sm text-[#6E6A78] max-w-2xl mx-auto leading-relaxed">
            We believe high-quality furniture, workstation setups, and gaming technology should be accessible without heavy upfront commitments.
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#EFE9F6] p-6 rounded-3xl border border-[#D4C4ED] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#7E3AF2] flex items-center justify-center border border-[#D4C4ED]/60 shadow-xs">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#18181B]">Premium Quality</h3>
          <p className="text-xs text-[#6E6A78] leading-relaxed">
            Every sofa, OLED TV, and laptop undergoes a 25-point inspection before delivery.
          </p>
        </div>

        <div className="bg-[#EFE9F6] p-6 rounded-3xl border border-[#D4C4ED] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#7E3AF2] flex items-center justify-center border border-[#D4C4ED]/60 shadow-xs">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#18181B]">Customer First</h3>
          <p className="text-xs text-[#6E6A78] leading-relaxed">
            Over 50,000 happy subscribers across major metropolitan hubs.
          </p>
        </div>

        <div className="bg-[#EFE9F6] p-6 rounded-3xl border border-[#D4C4ED] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white text-[#7E3AF2] flex items-center justify-center border border-[#D4C4ED]/60 shadow-xs">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#18181B]">Sustainable Future</h3>
          <p className="text-xs text-[#6E6A78] leading-relaxed">
            Promoting a circular economy by extending product lifecycles through refurbishing.
          </p>
        </div>
      </div>
    </div>
  );
};
