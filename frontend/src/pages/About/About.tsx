import React from 'react';
import { Sparkles, Users, Award, Heart } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10 flex-1">
      {/* Hero Header */}
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-xs">
        <div className="bg-[#FAF8F5] rounded-[23px] p-8 sm:p-12 text-center space-y-4 border border-[#E8E4DE]">
          <span className="inline-flex items-center gap-1.5 bg-white text-[#1C1C1C] text-xs font-black px-3.5 py-1 rounded-full border border-[#E8E4DE] shadow-warm-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E8B923]" />
            <span>About EZRent</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1C1C1C] my-0 tracking-tight font-serif">
            Redefining How You Experience Modern Living
          </h1>
          <p className="text-sm font-bold text-[#8A857F] max-w-2xl mx-auto leading-relaxed">
            We believe high-quality furniture, workstation setups, and gaming technology should be accessible without heavy upfront commitments.
          </p>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E4DE] shadow-warm-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center shadow-warm-xs">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#1C1C1C]">Premium Quality</h3>
          <p className="text-xs font-bold text-[#8A857F] leading-relaxed">
            Every sofa, OLED TV, and laptop undergoes a 25-point inspection before delivery.
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E4DE] shadow-warm-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center shadow-warm-xs">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#1C1C1C]">Customer First</h3>
          <p className="text-xs font-bold text-[#8A857F] leading-relaxed">
            Over 50,000 happy subscribers across major metropolitan hubs.
          </p>
        </div>

        <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E4DE] shadow-warm-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A0A0A] text-[#E8B923] flex items-center justify-center shadow-warm-xs">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#1C1C1C]">Sustainable Future</h3>
          <p className="text-xs font-bold text-[#8A857F] leading-relaxed">
            Promoting a circular economy by extending product lifecycles through refurbishing.
          </p>
        </div>
      </div>
    </div>
  );
};
