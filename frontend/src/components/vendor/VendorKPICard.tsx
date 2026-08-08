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
    <div className="bg-[#EFE9F6] rounded-3xl p-5 border border-[#D4C4ED] shadow-sm hover:border-[#7E3AF2] transition-all group flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8A8694]">
          {title}
        </span>
        <div className="w-10 h-10 rounded-2xl bg-white/80 border border-[#D4C4ED] text-[#7E3AF2] flex items-center justify-center group-hover:bg-[#7E3AF2] group-hover:text-white transition-colors shadow-xs">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
          {value}
        </div>

        {changeText && (
          <div className="flex items-center gap-1 mt-1 text-xs font-semibold">
            <span
              className={
                isPositive ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'
              }
            >
              {changeText}
            </span>
            <span className="text-[#8A8694] font-normal">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};
