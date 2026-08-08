import React from 'react';
import { X, ShoppingBag, User, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import type { RentalOrder } from '../../types';
import { RentalStatusBadge } from './RentalStatusBadge';

interface RentalDetailModalProps {
  rental: RentalOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (id: string, status: RentalOrder['status']) => void;
}

export const RentalDetailModal: React.FC<RentalDetailModalProps> = ({
  rental,
  isOpen,
  onClose,
  onUpdateStatus,
}) => {
  if (!isOpen || !rental) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#EAE4DB] animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8A8694] hover:text-[#18181B] bg-[#FAF7F2] hover:bg-[#EFE9F6] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-[#F4EFEA] pb-4 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-[#18181B]">
                Rental #{rental.id.slice(-6).toUpperCase()}
              </h3>
              <RentalStatusBadge status={rental.status} />
            </div>
            <p className="text-xs text-[#8A8694]">Order placed on {new Date(rental.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Product & Customer Details */}
        <div className="space-y-4">
          <div className="flex gap-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB]">
            <img
              src={rental.productImage}
              alt={rental.productName}
              className="w-20 h-20 object-cover rounded-xl shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#18181B] truncate">{rental.productName}</h4>
              <p className="text-xs text-[#8A8694] mt-0.5">
                Color: {rental.selectedColor || 'Default'} {rental.selectedSize ? `• Size: ${rental.selectedSize}` : ''}
              </p>
              <p className="text-sm font-extrabold text-[#7E3AF2] mt-1">
                Rs. {rental.amount.toLocaleString()} / {rental.unit}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#8A8694] uppercase tracking-wider text-[10px]">
                <User className="w-3.5 h-3.5 text-[#7E3AF2]" />
                <span>Customer</span>
              </div>
              <p className="font-bold text-[#18181B] truncate">{rental.userName}</p>
              <p className="text-[#6E6A78] truncate">{rental.userEmail}</p>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-[#8A8694] uppercase tracking-wider text-[10px]">
                <Calendar className="w-3.5 h-3.5 text-[#7E3AF2]" />
                <span>Tenure Plan</span>
              </div>
              <p className="font-bold text-[#18181B]">{rental.rentDuration}</p>
              <p className="text-[#6E6A78]">Subscription Model</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-emerald-900">Total Rental Rate</span>
            </div>
            <span className="font-extrabold text-emerald-900 text-sm">
              Rs. {rental.amount.toLocaleString()} / {rental.unit}
            </span>
          </div>
        </div>

        {/* Vendor Action Buttons depending on current status */}
        <div className="mt-6 pt-4 border-t border-[#F4EFEA] space-y-2">
          {rental.status === 'Pending' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onUpdateStatus(rental.id, 'Approved');
                  onClose();
                }}
                className="flex-1 py-2.5 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Approve Request</span>
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(rental.id, 'Rejected');
                  onClose();
                }}
                className="flex-1 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-xl border border-rose-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          )}

          {rental.status === 'Approved' && (
            <button
              onClick={() => {
                onUpdateStatus(rental.id, 'Active Subscription');
                onClose();
              }}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark as Active Subscription</span>
            </button>
          )}

          {rental.status === 'Active Subscription' && (
            <button
              onClick={() => {
                onUpdateStatus(rental.id, 'Returned & Completed');
                onClose();
              }}
              className="w-full py-2.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Mark Returned & Completed</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
