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
          <h1 className="text-2xl font-black text-[#18181B]">Pickup & Return Operations</h1>
          <p className="text-xs text-[#6E6A78]">Daily dispatch schedule, item inspection checklist, and deposit settlement</p>
        </div>
      </div>

      <div className="bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#D4C4ED] flex gap-2 w-fit">
        <button
          onClick={() => setActiveTab('pickups')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'pickups' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78] hover:text-[#18181B]'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Pending Pickups ({pickupList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('returns')}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === 'returns' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78] hover:text-[#18181B]'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Pending Returns ({returnList.length})</span>
        </button>
      </div>

      {activeTab === 'pickups' ? (
        <div className="bg-white rounded-2xl border border-[#D4C4ED] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFE9F6] text-[#4B5563] font-bold uppercase border-b border-[#D4C4ED]">
              <tr>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Pickup Scheduled</th>
                <th className="p-3.5">Fulfillment Method</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {pickupList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#8A8694]">
                    No pending pickups today.
                  </td>
                </tr>
              ) : (
                pickupList.map((o) => (
                  <tr key={o._id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="p-3.5 font-extrabold text-[#7E3AF2]">{o.orderRef}</td>
                    <td className="p-3.5 font-bold text-[#18181B]">{o.customerName}</td>
                    <td className="p-3.5 text-[11px] text-[#6E6A78]">
                      {new Date(o.rentalPeriod?.start).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-semibold text-[#18181B]">{o.deliveryMethod || 'Standard Delivery'}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full">
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleConfirmPickup(o._id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1 mx-auto transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
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
        <div className="bg-white rounded-2xl border border-[#D4C4ED] overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFE9F6] text-[#4B5563] font-bold uppercase border-b border-[#D4C4ED]">
              <tr>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer Name</th>
                <th className="p-3.5">Return Scheduled</th>
                <th className="p-3.5">Deposit Held</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {returnList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#8A8694]">
                    No items pending return right now.
                  </td>
                </tr>
              ) : (
                returnList.map((o) => (
                  <tr key={o._id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="p-3.5 font-extrabold text-[#7E3AF2]">{o.orderRef}</td>
                    <td className="p-3.5 font-bold text-[#18181B]">{o.customerName}</td>
                    <td className="p-3.5 text-[11px] text-[#6E6A78]">
                      {new Date(o.rentalPeriod?.end).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-amber-700">Rs. {o.securityDeposit?.amount || 500}</td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-extrabold rounded-full">
                        {o.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setSelectedReturnOrder(o)}
                        className="px-3 py-1.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white font-bold rounded-lg text-xs flex items-center gap-1 mx-auto transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
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
          <div className="bg-[#FAF7F2] max-w-md w-full p-6 rounded-3xl border border-[#D4C4ED] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-extrabold text-[#18181B]">Return Inspection Checklist</h3>
              <button onClick={() => setSelectedReturnOrder(null)} className="text-[#8A8694]">✕</button>
            </div>

            <form onSubmit={handleConfirmReturn} className="space-y-4 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#D4C4ED]">
                <p className="font-extrabold text-[#7E3AF2]">{selectedReturnOrder.orderRef} - {selectedReturnOrder.customerName}</p>
                <p className="text-[11px] text-[#6E6A78]">Security Deposit Held: <strong>Rs. {selectedReturnOrder.securityDeposit?.amount}</strong></p>
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Item Condition Notes</label>
                <textarea
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  placeholder="Record scratches, missing accessories, or clean condition..."
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <input
                  type="checkbox"
                  checked={damagedItem}
                  onChange={(e) => setDamagedItem(e.target.checked)}
                  className="accent-red-600 w-4 h-4 rounded"
                />
                <span>Item returned damaged (Flag repair workflow & deduct deposit)</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Confirm Return & Calculate Settlement</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
