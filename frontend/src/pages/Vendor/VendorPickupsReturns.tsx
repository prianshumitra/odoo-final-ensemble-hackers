import React, { useState, useEffect } from 'react';
import { Truck, RotateCcw, CheckCircle2, ShieldCheck } from 'lucide-react';
import type { FullRentalOrder } from '../../types';
import { orderService } from '../../services/api';
import { getSocket } from '../../services/socket';

export const VendorPickupsReturns: React.FC = () => {
  const [orders, setOrders] = useState<FullRentalOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'pickups' | 'returns'>('pickups');

  const [selectedReturnOrder, setSelectedReturnOrder] = useState<FullRentalOrder | null>(null);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [damagedItem, setDamagedItem] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchOrders();

    const socket = getSocket();
    const handleOrderChange = () => {
      fetchOrders();
    };

    socket.on('order:created', handleOrderChange);
    socket.on('order:updated', handleOrderChange);

    return () => {
      socket.off('order:created', handleOrderChange);
      socket.off('order:updated', handleOrderChange);
    };
  }, []);

  const handleConfirmPickup = async (id: string) => {
    await orderService.processPickup(id);
    fetchOrders();
  };

  const handleConfirmReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnOrder) return;
    try {
      const res = await orderService.processReturn(selectedReturnOrder._id);
      alert(`Return Confirmed! Computed Late Fee: Rs. ${res.lateFeeCalculated || 0}. Deposit Refunded: Rs. ${res.securityDeposit?.refundedAmount || 0}`);
      setSelectedReturnOrder(null);
      setInspectionNotes('');
      setDamagedItem(false);
      fetchOrders();
    } catch (err: any) {
      alert('Error processing return');
    }
  };

  const pickupList = orders.filter((o) => ['confirmed', 'reserved', 'late_pickup'].includes(o.status));
  const returnList = orders.filter((o) => ['picked_up', 'late_return'].includes(o.status));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#1C1C1C]">Pickup & Return Operations</h1>
          <p className="text-xs text-[#8A857F] font-bold">Daily dispatch schedule, item inspection checklist, and deposit settlement</p>
        </div>
      </div>

      <div className="bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#E8E4DE] flex gap-2 w-fit shadow-warm-xs">
        <button
          onClick={() => setActiveTab('pickups')}
          className={`px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === 'pickups' ? 'bg-[#0A0A0A] text-white shadow-warm-xs' : 'text-[#8A857F] hover:text-[#1C1C1C]'
          }`}
        >
          <Truck className="w-4 h-4 text-[#E8B923]" />
          <span>Pending Pickups ({pickupList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`px-5 py-2.5 rounded-full text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === 'returns' ? 'bg-[#0A0A0A] text-white shadow-warm-xs' : 'text-[#8A857F] hover:text-[#1C1C1C]'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-[#E8B923]" />
          <span>Pending Returns ({returnList.length})</span>
        </button>
      </div>

      {activeTab === 'pickups' ? (
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#E8E4DE] overflow-hidden shadow-warm-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3EFE8] text-[#1C1C1C] font-black uppercase tracking-wider border-b border-[#E8E4DE]">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Pickup Scheduled</th>
                <th className="p-4">Fulfillment Method</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DE]">
              {pickupList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-bold text-[#8A857F]">
                    No pending pickups today.
                  </td>
                </tr>
              ) : (
                pickupList.map((o) => (
                  <tr key={o._id} className="hover:bg-white transition-colors">
                    <td className="p-4 font-black text-[#1C1C1C]">{o.orderRef}</td>
                    <td className="p-4 font-bold text-[#1C1C1C]">{o.customerName}</td>
                    <td className="p-4 text-xs font-semibold text-[#8A857F]">
                      {o.rentalPeriod?.start ? new Date(o.rentalPeriod.start).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-4 font-bold text-[#1C1C1C]">{o.deliveryMethod || 'Standard Delivery'}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-[#E8B923]/20 text-[#1C1C1C] text-[10px] font-black rounded-full border border-[#E8B923]/40">
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleConfirmPickup(o._id)}
                        className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white font-bold rounded-full text-xs flex items-center gap-1.5 mx-auto transition-colors shadow-warm-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E8B923]" />
                        <span>Confirm Pickup</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-[#FAF8F5] rounded-3xl border border-[#E8E4DE] overflow-hidden shadow-warm-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3EFE8] text-[#1C1C1C] font-black uppercase tracking-wider border-b border-[#E8E4DE]">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Return Scheduled</th>
                <th className="p-4">Deposit Held</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E4DE]">
              {returnList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-bold text-[#8A857F]">
                    No items pending return right now.
                  </td>
                </tr>
              ) : (
                returnList.map((o) => (
                  <tr key={o._id} className="hover:bg-white transition-colors">
                    <td className="p-4 font-black text-[#1C1C1C]">{o.orderRef}</td>
                    <td className="p-4 font-bold text-[#1C1C1C]">{o.customerName}</td>
                    <td className="p-4 text-xs font-semibold text-[#8A857F]">
                      {o.rentalPeriod?.end ? new Date(o.rentalPeriod.end).toLocaleString() : 'N/A'}
                    </td>
                    <td className="p-4 font-black text-amber-800">Rs. {o.securityDeposit?.amount || 500}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-[#E8B923]/20 text-[#1C1C1C] text-[10px] font-black rounded-full border border-[#E8B923]/40">
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedReturnOrder(o)}
                        className="px-4 py-2 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white font-bold rounded-full text-xs flex items-center gap-1.5 mx-auto transition-colors shadow-warm-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#E8B923]" />
                        <span>Inspect & Settle</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedReturnOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] max-w-md w-full p-6 rounded-3xl border border-[#E8E4DE] shadow-warm-lg space-y-4">
            <div className="flex justify-between items-center border-b border-[#E8E4DE] pb-3">
              <h3 className="text-base font-black text-[#1C1C1C]">Return Inspection Checklist</h3>
              <button onClick={() => setSelectedReturnOrder(null)} className="text-[#8A857F] hover:text-[#1C1C1C] font-bold">✕</button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-[#E8E4DE] shadow-warm-xs">
                <p className="font-black text-[#1C1C1C]">{selectedReturnOrder.orderRef} - {selectedReturnOrder.customerName}</p>
                <p className="text-xs text-[#8A857F] font-bold mt-0.5">Security Deposit Held: <strong className="text-[#1C1C1C]">Rs. {selectedReturnOrder.securityDeposit?.amount}</strong></p>
              </div>

              <div>
                <label className="block font-bold text-[#1C1C1C] mb-1">Item Condition Notes</label>
                <textarea
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Record scratches, missing accessories, or clean condition..."
                  className="w-full bg-white px-3.5 py-2.5 border border-[#E8E4DE] rounded-2xl text-xs font-medium focus:outline-none focus:border-[#0A0A0A]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-rose-700 bg-rose-50/80 p-3 rounded-2xl border border-rose-200">
                <input
                  type="checkbox"
                  checked={damagedItem}
                  onChange={(e) => setDamagedItem(e.target.checked)}
                  className="accent-rose-600 w-4 h-4 rounded"
                />
                <span>Item returned damaged (Flag repair workflow & deduct deposit)</span>
              </label>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white font-black rounded-full transition-all shadow-warm-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#E8B923]" />
                <span>Confirm Return & Calculate Settlement</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
