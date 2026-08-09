import React, { useState, useEffect } from 'react';
import { Package, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { FullRentalOrder } from '../../types';
import { orderService } from '../../services/api';
import { getSocket } from '../../services/socket';
import { AuthBackgroundDoodle } from '../../components/common/AuthBackgroundDoodle';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<FullRentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<number>(Date.now());

  // Update timer every second for real-time live countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      case 'pending':
        return {
          label: 'Pending Vendor Approval',
          cls: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
          icon: Clock,
        };
      case 'active':
      case 'confirmed':
        return {
          label: 'Active Rental (Timer Running)',
          cls: 'bg-emerald-100 text-emerald-900 border border-emerald-400 font-extrabold',
          icon: Clock,
        };
      case 'overdue':
        return {
          label: '⚠️ OVERDUE (Late Fee 2%/day Accruing)',
          cls: 'bg-rose-100 text-rose-900 border border-rose-400 font-black animate-pulse',
          icon: AlertTriangle,
        };
      case 'completed':
        return {
          label: 'Completed & Returned',
          cls: 'bg-blue-100 text-blue-900 border border-blue-300 font-bold',
          icon: CheckCircle,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          cls: 'bg-gray-100 text-gray-700 border border-gray-300 font-bold',
          icon: XCircle,
        };
      default:
        return {
          label: status.toUpperCase(),
          cls: 'bg-gray-100 text-gray-800 font-bold',
          icon: Clock,
        };
    }
  };

  const renderTimer = (order: FullRentalOrder) => {
    if (!order.rentalEnd) return null;
    const endMs = new Date(order.rentalEnd).getTime();
    const diff = endMs - now;

    if (order.status === 'pending') {
      return (
        <span className="text-amber-700 font-semibold text-xs">
          Awaiting vendor confirmation before rental timer begins.
        </span>
      );
    }

    if (order.status === 'completed') {
      return (
        <span className="text-emerald-700 font-semibold text-xs">
          Rental concluded and item returned.
        </span>
      );
    }

    if (order.status === 'cancelled') {
      return (
        <span className="text-gray-500 font-semibold text-xs">
          Order cancelled.
        </span>
      );
    }

    if (diff > 0 && (order.status === 'active' || order.status === 'confirmed')) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      return (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-mono font-bold">
          <Clock className="w-4 h-4 text-emerald-600 animate-spin" />
          <span>Timer: {days}d {hours}h {mins}m {secs}s remaining until due date</span>
        </div>
      );
    } else {
      const lateDays = Math.max(1, Math.ceil(Math.abs(diff) / (1000 * 60 * 60 * 24)));
      const dailyLateRate = (order.total * 0.02);
      const computedLateFee = order.lateFee || Math.round(dailyLateRate * lateDays);

      return (
        <div className="flex flex-col gap-1 bg-rose-50 text-rose-900 p-3 rounded-xl border border-rose-300 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-rose-700">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Rental is Overdue by {lateDays} day(s)!</span>
          </div>
          <p className="text-[11px] text-rose-800">
            Late Fee Charge (2%/day): <span className="font-extrabold text-rose-900">Rs. {computedLateFee.toLocaleString()}</span> (Rs. {dailyLateRate}/day)
          </p>
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1 relative overflow-hidden">
      <AuthBackgroundDoodle />
      <div className="p-px rounded-3xl bg-linear-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-xs">
        <div className="bg-[#FAF8F5] p-8 sm:p-12 rounded-[23px] space-y-6 border border-[#E8E4DE]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#1C1C1C] flex items-center justify-center border border-[#E8E4DE] shadow-warm-xs">
              <Package className="w-6 h-6 text-[#E8B923]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#1C1C1C] my-0">My Rental Orders & Real-time Timers</h1>
              <p className="text-xs text-[#8A857F] font-bold">Track active rental timers, return dates, and late fees synced with database</p>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p className="text-center text-xs font-bold text-[#8A857F] py-8">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-2xl border border-[#E8E4DE] shadow-warm-xs">
                <p className="text-sm font-black text-[#1C1C1C]">No rental orders found yet</p>
                <p className="text-xs text-[#8A857F] font-bold mt-1">Browse vendor products to start your first rental!</p>
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
                        • Ordered on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {(() => {
                      const b = getStatusBadge(order.status);
                      return (
                        <span className={`text-xs px-3 py-1 rounded-full flex items-center gap-1.5 ${b.cls}`}>
                          <b.icon className="w-3.5 h-3.5" />
                          <span>{b.label}</span>
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
                        <span className="font-bold text-[#8A857F]">Rs. {line.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Realtime Timer & Late Fee Widget */}
                  <div className="py-1">
                    {renderTimer(order)}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-3 border-t border-[#E8E4DE]">
                    <div className="text-[11px] text-[#8A857F] font-bold space-y-0.5">
                      <div>
                        Start Date: <strong className="text-[#1C1C1C]">{order.rentalStart ? new Date(order.rentalStart).toLocaleDateString() : 'N/A'}</strong>
                      </div>
                      <div>
                        Due Date: <strong className="text-[#1C1C1C]">{order.rentalEnd ? new Date(order.rentalEnd).toLocaleDateString() : 'N/A'}</strong>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] text-[#8A857F] block">Total Amount</span>
                        <span className="font-black text-base text-[#1C1C1C]">
                          Rs. {((order.total || 0) + (order.lateFee || 0)).toLocaleString()}
                          {order.lateFee ? <span className="text-xs text-rose-600 font-normal"> (incl. Rs. {order.lateFee} late fee)</span> : null}
                        </span>
                      </div>
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
