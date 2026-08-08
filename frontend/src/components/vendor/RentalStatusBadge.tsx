import React from 'react';
import type { RentalOrder } from '../../types';

interface RentalStatusBadgeProps {
  status: RentalOrder['status'];
}

export const RentalStatusBadge: React.FC<RentalStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
          <span>Pending Request</span>
        </span>
      );
    case 'Approved':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          <span>Approved</span>
        </span>
      );
    case 'Active Subscription':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Subscription</span>
        </span>
      );
    case 'Returned & Completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EFE9F6] text-[#7E3AF2] border border-[#D4C4ED]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7E3AF2]" />
          <span>Completed</span>
        </span>
      );
    case 'Cancelled':
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          <span>{status}</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800 border border-gray-300">
          <span>{status}</span>
        </span>
      );
  }
};
