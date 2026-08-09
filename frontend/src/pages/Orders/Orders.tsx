import React, { useState, useEffect } from 'react';
import { Package, Printer } from 'lucide-react';
import type { FullRentalOrder } from '../../types';
import { orderService } from '../../services/api';
import { getSocket } from '../../services/socket';

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

    const socket = getSocket();
    const handleOrderChange = () => {
      fetchMyOrders();
    };

    socket.on('order:created', handleOrderChange);
    socket.on('order:updated', handleOrderChange);

    return () => {
      socket.off('order:created', handleOrderChange);
      socket.off('order:updated', handleOrderChange);
    };
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'quotation':
      case 'quotation_sent':
        return {
          label: 'Submitted (Awaiting Vendor Confirmation)',
          cls: 'bg-[#E8B923]/15 text-[#1C1C1C] border border-[#E8B923]/40 font-black',
        };
      case 'confirmed':
      case 'reserved':
        return {
          label: 'Confirmed by Vendor (Preparing Shipment)',
          cls: 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold',
        };
      case 'picked_up':
        return {
          label: 'Shipped / In Transit',
          cls: 'bg-[#0A0A0A] text-white border border-[#0A0A0A] font-bold',
        };
      case 'late_return':
      case 'late_pickup':
        return {
          label: '⚠️ Overdue Return',
          cls: 'bg-rose-100 text-rose-900 border border-rose-300 font-black animate-pulse',
        };
      case 'completed':
        return {
          label: 'Completed & Deposit Refunded',
          cls: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold',
        };
      default:
        return {
          label: status.toUpperCase(),
          cls: 'bg-[#FAF8F5] text-[#1C1C1C] border border-[#E8E4DE] font-bold',
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-xs">
        <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-[23px] space-y-6 border border-[#E8E4DE]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#1C1C1C] flex items-center justify-center border border-[#E8E4DE] shadow-warm-xs">
              <Package className="w-6 h-6 text-[#E8B923]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1C1C1C] my-0">My Rental Orders & Invoices</h1>
              <p className="text-xs text-[#8A857F] font-bold">Track active rental subscriptions, delivery status, and download tax invoices</p>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-xs font-bold text-[#8A857F] py-8">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-2xl border border-[#E8E4DE] shadow-warm-xs">
                <p className="text-sm font-black text-[#1C1C1C]">No rental orders found yet</p>
                <p className="text-xs text-[#8A857F] font-bold mt-1">Browse our store products to start your first rental!</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="p-5 rounded-2xl bg-white border border-[#E8E4DE] shadow-warm-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#E8E4DE] pb-3">
                    <div>
                      <span className="text-xs font-black text-[#1C1C1C] bg-[#FAF8F5] px-2.5 py-1 rounded-full border border-[#E8E4DE]">{order.orderRef}</span>
                      <span className="text-[11px] text-[#8A857F] font-bold ml-2">
                        • Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {(() => {
                      const b = getStatusBadge(order.status);
                      return (
                        <span className={`text-xs px-3 py-1 rounded-full ${b.cls}`}>
                          {b.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Order Lines */}
                  <div className="space-y-1.5">
                    {order.lines?.map((line, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <p className="font-bold text-[#1C1C1C]">
                          • {line.productName} (Qty: {line.quantity})
                        </p>
                        <span className="font-bold text-[#8A857F]">Rs. {line.amount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-3 border-t border-[#E8E4DE]">
                    <div className="text-[11px] text-[#8A857F] font-bold">
                      <span>Period: {order.rentalPeriod?.start ? new Date(order.rentalPeriod.start).toLocaleDateString() : 'N/A'} → {order.rentalPeriod?.end ? new Date(order.rentalPeriod.end).toLocaleDateString() : 'N/A'}</span>
                      <br />
                      <span>Security Deposit: <strong className="text-amber-800">Rs. {order.securityDeposit?.amount || 500}</strong> ({order.securityDeposit?.status})</span>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-black text-base text-[#1C1C1C]">Rs. {(order.total || 0).toLocaleString()}</span>
                      <a
                        href={orderService.getQuotationPDFUrl(order._id)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white font-bold rounded-full text-xs flex items-center gap-1.5 transition-colors shadow-warm-xs"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#E8B923]" />
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
