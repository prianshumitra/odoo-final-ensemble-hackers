import React from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import type { RentalOrder } from '../../types';
import { RentalStatusBadge } from './RentalStatusBadge';

interface VendorRentalTableProps {
  rentals: RentalOrder[];
  onSelectRental: (rental: RentalOrder) => void;
  onUpdateStatus: (id: string, status: RentalOrder['status']) => void;
}

export const VendorRentalTable: React.FC<VendorRentalTableProps> = ({
  rentals,
  onSelectRental,
  onUpdateStatus,
}) => {
  if (rentals.length === 0) {
    return (
      <div className="bg-[#EFE9F6] rounded-3xl p-12 text-center border border-[#D4C4ED] space-y-3">
        <p className="text-base font-extrabold text-[#18181B]">No rental activity yet</p>
        <p className="text-xs text-[#8A8694] max-w-sm mx-auto">
          Once customers place rental orders for your products, orders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#EFE9F6] rounded-3xl border border-[#D4C4ED] shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D4C4ED]/60 bg-[#EFE9F6]/80 text-[11px] font-bold uppercase tracking-wider text-[#8A8694]">
              <th className="py-3.5 px-4">Rental ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Tenure Plan</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4C4ED]/40 text-xs font-semibold">
            {rentals.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-white/60 transition-colors group cursor-pointer"
                onClick={() => onSelectRental(r)}
              >
                <td className="py-3.5 px-4 font-mono font-bold text-[#7E3AF2]">
                  #{r.id.slice(-6).toUpperCase()}
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-[#18181B]">{r.userName}</span>
                    <span className="text-[10px] text-[#8A8694] truncate max-w-[140px]">
                      {r.userEmail}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={r.productImage}
                      alt={r.productName}
                      className="w-8 h-8 object-cover rounded-lg shrink-0 bg-white"
                    />
                    <span className="font-bold text-[#18181B] truncate max-w-xs">
                      {r.productName}
                    </span>
                  </div>
                </td>

                <td className="py-3.5 px-4 text-[#6E6A78]">{r.rentDuration}</td>

                <td className="py-3.5 px-4 font-extrabold text-[#18181B]">
                  Rs. {r.amount.toLocaleString()} / {r.unit}
                </td>

                <td className="py-3.5 px-4">
                  <RentalStatusBadge status={r.status} />
                </td>

                <td className="py-3.5 px-4 text-right">
                  <div
                    className="flex items-center justify-end gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onSelectRental(r)}
                      className="p-1.5 text-[#8A8694] hover:text-[#7E3AF2] hover:bg-white rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {r.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(r.id, 'Approved')}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(r.id, 'Rejected')}
                          className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {r.status === 'Approved' && (
                      <button
                        onClick={() => onUpdateStatus(r.id, 'Active Subscription')}
                        className="px-2 py-1 text-[11px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                      >
                        Activate
                      </button>
                    )}

                    {r.status === 'Active Subscription' && (
                      <button
                        onClick={() => onUpdateStatus(r.id, 'Returned & Completed')}
                        className="px-2 py-1 text-[11px] font-bold bg-[#7E3AF2] text-white rounded-lg hover:bg-[#6C2BD9]"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View Cards */}
      <div className="block md:hidden divide-y divide-[#D4C4ED]/60">
        {rentals.map((r) => (
          <div
            key={r.id}
            onClick={() => onSelectRental(r)}
            className="p-4 space-y-3 hover:bg-white/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#7E3AF2]">
                #{r.id.slice(-6).toUpperCase()}
              </span>
              <RentalStatusBadge status={r.status} />
            </div>

            <div className="flex items-center gap-3">
              <img
                src={r.productImage}
                alt={r.productName}
                className="w-12 h-12 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#18181B] truncate">{r.productName}</h4>
                <p className="text-[11px] text-[#8A8694]">Renter: {r.userName}</p>
                <p className="text-xs font-extrabold text-[#18181B] mt-0.5">
                  Rs. {r.amount.toLocaleString()} / {r.unit}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
