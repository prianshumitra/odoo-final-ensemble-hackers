import React, { useState, useEffect } from 'react';
import {
  Kanban,
  List,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Search,
  AlertTriangle,
} from 'lucide-react';
import type { FullRentalOrder } from '../../types';
import { orderService } from '../../services/api';
import { getSocket } from '../../services/socket';

export const VendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<FullRentalOrder[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedOrder, setSelectedOrder] = useState<FullRentalOrder | null>(null);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await orderService.getOrders();
      setOrders(fetchedOrders);
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

  const handleApproveOrder = async (id: string) => {
    try {
      await orderService.confirmOrder(id);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, status: 'active' });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleCompleteOrder = async (id: string) => {
    try {
      await orderService.completeOrder(id);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, status: 'completed' });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleCancelOrder = async (id: string) => {
    try {
      await orderService.cancelOrder(id);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
      }
    } catch (err: any) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderRef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = [
    { key: 'pending', label: 'Pending Approval', bg: 'bg-amber-100 text-amber-900 border border-amber-300' },
    { key: 'active', label: 'Active Rental', bg: 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold' },
    { key: 'overdue', label: 'Overdue (2%/day Fee)', bg: 'bg-rose-100 text-rose-900 border border-rose-400 font-black animate-pulse' },
    { key: 'completed', label: 'Completed & Returned', bg: 'bg-blue-100 text-blue-900 border border-blue-300' },
    { key: 'cancelled', label: 'Cancelled', bg: 'bg-gray-100 text-gray-700 border border-gray-300' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#18181B]">Rental Requests & Orders</h1>
          <p className="text-xs text-[#6E6A78]">Approve incoming customer rental requests, manage active rentals, and record returns</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-[#EFE9F6] p-1 rounded-xl flex items-center border border-[#D4C4ED]">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'list' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78]'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'kanban' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78]'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban Board</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D4C4ED] flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by order ref, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-9 pr-4 py-2 text-xs border border-[#D4C4ED] rounded-xl focus:outline-none focus:border-[#7E3AF2]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white px-3 py-2 border border-[#D4C4ED] text-xs font-bold rounded-xl focus:outline-none focus:border-[#7E3AF2] w-full sm:w-auto"
        >
          <option value="all">All Statuses ({orders.length})</option>
          {statuses.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* View Mode: List or Kanban */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-[#D4C4ED] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFE9F6] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#D4C4ED]">
                <tr>
                  <th className="p-3.5">Ref</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Rental Window</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Order Amount</th>
                  <th className="p-3.5 text-right">Late Fee (2%/day)</th>
                  <th className="p-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-[#8A8694]">
                      No rental orders found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const statusObj = statuses.find((s) => s.key === order.status) || {
                      label: order.status,
                      bg: 'bg-gray-100 text-gray-800',
                    };
                    return (
                      <tr key={order._id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="p-3.5 font-extrabold text-[#7E3AF2]">{order.orderRef}</td>
                        <td className="p-3.5">
                          <p className="font-bold text-[#18181B]">{order.customerName}</p>
                          <p className="text-[10px] text-[#8A8694]">{order.customerEmail}</p>
                        </td>
                        <td className="p-3.5 text-[11px] text-[#6E6A78]">
                          <div>Start: {order.rentalStart ? new Date(order.rentalStart).toLocaleDateString() : 'N/A'}</div>
                          <div>Due: <strong className="text-[#18181B]">{order.rentalEnd ? new Date(order.rentalEnd).toLocaleDateString() : 'N/A'}</strong></div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] ${statusObj.bg}`}>
                            {statusObj.label}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-black text-[#18181B]">
                          Rs. {(order.total || 0).toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right font-bold text-rose-600">
                          {order.lateFee ? `+ Rs. ${order.lateFee.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white font-bold rounded-lg transition-colors text-[11px]"
                          >
                            Manage Order
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {statuses.map((st) => {
            const columnOrders = filteredOrders.filter((o) => o.status === st.key);
            return (
              <div key={st.key} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D4C4ED] space-y-3 min-w-60">
                <div className="flex justify-between items-center border-b border-[#D4C4ED]/60 pb-2">
                  <h3 className="text-xs font-black text-[#18181B]">{st.label}</h3>
                  <span className="px-2 py-0.5 bg-[#EFE9F6] text-[#7E3AF2] text-[10px] font-extrabold rounded-full">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-150 overflow-y-auto">
                  {columnOrders.map((o) => (
                    <div
                      key={o._id}
                      onClick={() => setSelectedOrder(o)}
                      className="bg-white p-3.5 rounded-xl border border-[#D4C4ED] shadow-2xs hover:border-[#7E3AF2] cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-[#7E3AF2] text-xs">{o.orderRef}</span>
                        <span className="text-xs font-black text-[#18181B]">Rs. {(o.total || 0).toLocaleString()}</span>
                      </div>
                      <p className="text-xs font-bold text-[#18181B] line-clamp-1">{o.customerName}</p>
                      <p className="text-[10px] text-[#8A8694]">
                        {o.lines && o.lines[0] ? o.lines[0].productName : 'Rental Item'} ({o.lines?.length || 1} items)
                      </p>
                      {o.lateFee ? (
                        <p className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">
                          Late Fee: +Rs. {o.lateFee}
                        </p>
                      ) : null}
                      <div className="text-[10px] text-[#6E6A78] pt-1 border-t border-[#E5E7EB]">
                        Due: {o.rentalEnd ? new Date(o.rentalEnd).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Order Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-2xl w-full p-6 rounded-3xl border border-[#D4C4ED] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#18181B] flex items-center gap-2">
                  <span>{selectedOrder.orderRef}</span>
                  <span className="text-xs font-bold px-3 py-1 bg-[#EFE9F6] text-[#7E3AF2] rounded-full uppercase">
                    {selectedOrder.status}
                  </span>
                </h2>
                <p className="text-xs text-[#6E6A78]">Requested on: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-[#8A8694] hover:text-[#18181B] rounded-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Action Buttons based on order status */}
            <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED] flex flex-wrap gap-3">
              {selectedOrder.status === 'pending' && (
                <button
                  onClick={() => handleApproveOrder(selectedOrder._id)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Rental Request (Start Timer)</span>
                </button>
              )}

              {(selectedOrder.status === 'active' || selectedOrder.status === 'overdue') && (
                <button
                  onClick={() => handleCompleteOrder(selectedOrder._id)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-xl flex items-center gap-2 transition-all shadow-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Mark as Returned & Complete (Restore Stock)</span>
                </button>
              )}

              {selectedOrder.status !== 'completed' && selectedOrder.status !== 'cancelled' && (
                <button
                  onClick={() => handleCancelOrder(selectedOrder._id)}
                  className="px-4 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Cancel Order</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
                <h4 className="font-extrabold text-[#7E3AF2] mb-1">Renter Details</h4>
                <p className="font-bold text-[#18181B]">{selectedOrder.customerName}</p>
                <p className="text-[#6E6A78]">{selectedOrder.customerEmail}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
                <h4 className="font-extrabold text-[#7E3AF2] mb-1">Rental Timeline</h4>
                <p>Start: <strong>{selectedOrder.rentalStart ? new Date(selectedOrder.rentalStart).toLocaleDateString() : 'N/A'}</strong></p>
                <p>Due: <strong>{selectedOrder.rentalEnd ? new Date(selectedOrder.rentalEnd).toLocaleDateString() : 'N/A'}</strong></p>
              </div>
            </div>

            {/* Overdue Warning & Late Fee Calculation Display */}
            {selectedOrder.lateFee ? (
              <div className="bg-rose-50 border border-rose-300 p-4 rounded-2xl text-rose-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-black text-rose-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Rental Overdue - 2% Per Day Late Fee Applied</span>
                </div>
                <p className="text-[11px]">
                  Late Fee Accrued: <strong className="text-rose-900 text-sm">Rs. {selectedOrder.lateFee.toLocaleString()}</strong>
                </p>
              </div>
            ) : null}

            <div className="bg-white rounded-2xl border border-[#D4C4ED] p-4 space-y-3">
              <h4 className="font-extrabold text-[#18181B] text-xs">Rented Items</h4>
              <div className="divide-y divide-[#E5E7EB]">
                {selectedOrder.lines?.map((line, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#18181B]">{line.productName}</p>
                      <p className="text-[10px] text-[#8A8694]">Qty: {line.quantity} | Rate: Rs. {line.unitPrice}</p>
                    </div>
                    <span className="font-extrabold text-[#18181B]">Rs. {line.amount?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#EFE9F6] p-4 rounded-2xl border border-[#D4C4ED] flex justify-between items-center text-xs">
              <div>
                <span className="text-[#6E6A78] font-bold">Total Rental Charge</span>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-[#7E3AF2]">
                  Rs. {((selectedOrder.total || 0) + (selectedOrder.lateFee || 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
