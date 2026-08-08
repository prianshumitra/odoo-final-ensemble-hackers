import React, { useState, useEffect } from 'react';
import { Package, Printer } from 'lucide-react';
import type { FullRentalOrder } from '../../types';
import { orderService } from '../../services/api';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<FullRentalOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#C4B2E2] via-[#D4C4ED] to-[#EAE4DB] shadow-md">
        <div className="bg-gradient-to-br from-[#EFE9F6] via-[#FAF7F2] to-[#F5EBE0] p-8 sm:p-12 rounded-[23px] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#7E3AF2] flex items-center justify-center border border-[#D4C4ED] shadow-xs">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] my-0">My Rental Orders & Invoices</h1>
              <p className="text-xs text-[#6E6A78]">Track active rental subscriptions, delivery status, and download tax invoices</p>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-xs font-bold text-[#8A8694] py-8">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center p-8 bg-white/80 rounded-2xl border border-[#D4C4ED]">
                <p className="text-sm font-bold text-[#18181B]">No rental orders found yet</p>
                <p className="text-xs text-[#8A8694] mt-1">Browse our store products to start your first rental!</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 rounded-2xl bg-white/90 border border-[#D4C4ED] shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#D4C4ED]/60 pb-3">
                    <div>
                      <span className="text-xs font-extrabold text-[#7E3AF2]">{order.orderRef}</span>
                      <span className="text-[11px] text-[#8A8694] ml-2">
                        • Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                        order.status === 'confirmed' || order.status === 'picked_up'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-purple-100 text-[#7E3AF2] border border-[#D4C4ED]'
                      }`}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Order Lines */}
                  <div className="space-y-1.5">
                    {order.lines?.map((line, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <p className="font-semibold text-[#18181B]">
                          • {line.productName} (Qty: {line.quantity})
                        </p>
                        <span className="font-bold text-[#6E6A78]">Rs. {line.amount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-3 border-t border-[#E5E7EB]">
                    <div className="text-[11px] text-[#6E6A78]">
                      <span>Period: {new Date(order.rentalPeriod?.start).toLocaleDateString()} → {new Date(order.rentalPeriod?.end).toLocaleDateString()}</span>
                      <br />
                      <span>Security Deposit: <strong className="text-amber-700">Rs. {order.securityDeposit?.amount || 500}</strong> ({order.securityDeposit?.status})</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-black text-base text-[#7E3AF2]">Rs. {(order.total || 0).toLocaleString()}</span>
                      <a
                        href={orderService.getQuotationPDFUrl(order._id)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-[#EFE9F6] text-[#7E3AF2] font-bold rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#7E3AF2] hover:text-white transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Invoice</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
