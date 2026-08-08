import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#C4B2E2] via-[#D4C4ED] to-[#EAE4DB] shadow-md">
        <div className="bg-gradient-to-br from-[#EFE9F6] via-[#FAF7F2] to-[#F5EBE0] p-8 sm:p-12 rounded-[23px] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#7E3AF2] flex items-center justify-center shadow-xs border border-[#D4C4ED]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] my-0">Terms & Conditions</h1>
              <p className="text-xs text-[#6E6A78]">Last updated: August 2026</p>
            </div>
          </div>

          <div className="space-y-4">
            <section className="p-5 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-2 shadow-xs">
              <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#7E3AF2]" />
                <span>1. Rental Agreement & Subscriptions</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6A78] leading-relaxed">
                By placing an order through EZRent, you agree to rent the selected furniture, appliances, or electronic equipment for the chosen rental duration (1 Month, 6 Months, 1 Year, etc.). All rentals are subject to identity verification and stock availability.
              </p>
            </section>

            <section className="p-5 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-2 shadow-xs">
              <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#7E3AF2]" />
                <span>2. Delivery & Maintenance</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6A78] leading-relaxed">
                Free express delivery and assembly are provided for eligible orders. You are responsible for ensuring clear access to the installation area. Normal wear and tear is fully covered under our EZ Care Policy.
              </p>
            </section>

            <section className="p-5 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-2 shadow-xs">
              <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5 text-[#7E3AF2]" />
                <span>3. Returns & Upgrades</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#6E6A78] leading-relaxed">
                At the end of your rental tenure, you can choose to extend your plan, upgrade to newer models, or schedule a free pickup. Early termination options are available as outlined in your account dashboard.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
