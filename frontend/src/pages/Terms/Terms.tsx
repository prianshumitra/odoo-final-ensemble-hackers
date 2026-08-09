import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { AuthBackgroundDoodle } from '../../components/common/AuthBackgroundDoodle';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1 relative overflow-hidden">
      <AuthBackgroundDoodle />
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-xs">
        <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-[23px] space-y-6 border border-[#E8E4DE]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#1C1C1C] flex items-center justify-center shadow-warm-xs border border-[#E8E4DE]">
              <FileText className="w-6 h-6 text-[#E8B923]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] my-0 font-serif">Terms & Conditions</h1>
              <p className="text-xs font-bold text-[#8A857F]">Last updated: August 2026</p>
            </div>
          </div>

          <div className="space-y-4">
            <section className="p-5 rounded-2xl bg-white border border-[#E8E4DE] space-y-2 shadow-warm-xs">
              <h2 className="text-base font-black text-[#1C1C1C] flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#E8B923]" />
                <span>1. Rental Agreement & Subscriptions</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#8A857F] leading-relaxed">
                By placing an order through EZRent, you agree to rent the selected furniture, appliances, or electronic equipment for the chosen rental duration (1 Month, 6 Months, 1 Year, etc.). All rentals are subject to identity verification and stock availability.
              </p>
            </section>

            <section className="p-5 rounded-2xl bg-white border border-[#E8E4DE] space-y-2 shadow-warm-xs">
              <h2 className="text-base font-black text-[#1C1C1C] flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#E8B923]" />
                <span>2. Delivery & Maintenance</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#8A857F] leading-relaxed">
                Free express delivery and assembly are provided for eligible orders. You are responsible for ensuring clear access to the installation area. Normal wear and tear is fully covered under our EZ Care Policy.
              </p>
            </section>

            <section className="p-5 rounded-2xl bg-white border border-[#E8E4DE] space-y-2 shadow-warm-xs">
              <h2 className="text-base font-black text-[#1C1C1C] flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#E8B923]" />
                <span>3. Returns & Upgrades</span>
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#8A857F] leading-relaxed">
                At the end of your rental tenure, you can choose to extend your plan, upgrade to newer models, or schedule a free pickup. Early termination options are available as outlined in your account dashboard.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
