import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EAE4DB] shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#18181B] my-0">Terms & Conditions</h1>
            <p className="text-xs text-[#8A8694]">Last updated: August 2026</p>
          </div>
        </div>

        <div className="prose prose-purple max-w-none space-y-6 text-sm text-[#3E3A47] leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7E3AF2]" />
              1. Rental Agreement & Subscriptions
            </h2>
            <p>
              By placing an order through Diligent Wombat, you agree to rent the selected furniture, appliances, or electronic equipment for the chosen rental duration (1 Month, 6 Months, 1 Year, etc.). All rentals are subject to identity verification and stock availability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7E3AF2]" />
              2. Delivery & Maintenance
            </h2>
            <p>
              Free express delivery and assembly are provided for eligible orders. You are responsible for ensuring clear access to the installation area. Normal wear and tear is fully covered under our Diligent Care Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#18181B] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7E3AF2]" />
              3. Returns & Upgrades
            </h2>
            <p>
              At the end of your rental tenure, you can choose to extend your plan, upgrade to newer models, or schedule a free pickup. Early termination options are available as outlined in your account dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
