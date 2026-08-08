import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface VendorKPICardProps {
  title: string;
  value: string | number;
  changeText?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  accentColor?: string;
}

export const VendorKPICard: React.FC<VendorKPICardProps> = ({
  title,
  value,
  changeText,
  isPositive = true,
  icon: Icon,
}) => {
  return (
    <div className="bg-[#FAF8F5] rounded-3xl p-5 border border-[#E8E4DE] shadow-warm-xs hover:border-[#0A0A0A] transition-all group flex flex-col justify-between hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black uppercase tracking-wider text-[#8A857F]">
          {title}
        </span>
        <div className="w-10 h-10 rounded-2xl bg-white border border-[#E8E4DE] text-[#0A0A0A] flex items-center justify-center group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors shadow-2xs">
          <Icon className="w-5 h-5 group-hover:text-[#E8B923]" />
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
          {value}
        </div>

        {changeText && (
          <div className="flex items-center gap-1 mt-1 text-xs font-bold">
            <span
              className={
                isPositive ? 'text-emerald-700 font-black' : 'text-rose-600 font-black'
              }
            >
              {changeText}
            </span>
            <span className="text-[#8A857F] font-medium">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};
