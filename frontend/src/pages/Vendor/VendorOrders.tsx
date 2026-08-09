import React, { useState, useEffect } from 'react';
import {
  Kanban,
  List,
  Plus,
  Send,
  CheckCircle2,
  XCircle,
  Truck,
  RotateCcw,
  Printer,
  Search,
} from 'lucide-react';
import type { FullRentalOrder, Product } from '../../types';
import { orderService, productService } from '../../services/api';
import { getSocket } from '../../services/socket';

export const VendorOrders: React.FC = () => {
  const [orders, setOrders] = useState<FullRentalOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [selectedOrder, setSelectedOrder] = useState<FullRentalOrder | null>(null);

  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newSelectedProdId, setNewSelectedProdId] = useState('');
  const [newQty, setNewQty] = useState(1);
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newEndDate, setNewEndDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  );
  const [newDeposit, setNewDeposit] = useState(500);

  const fetchOrdersAndProducts = async () => {
    try {
      const fetchedOrders = await orderService.getOrders();
      setOrders(fetchedOrders);
      const fetchedProds = await productService.getProducts({ includeUnpublished: true });
      setProducts(fetchedProds);
    } catch (err) {}
  };

  useEffect(() => {
    fetchOrdersAndProducts();

    const socket = getSocket();
    const handleOrderChange = () => {
      fetchOrdersAndProducts();
    };

    socket.on('order:created', handleOrderChange);
    socket.on('order:updated', handleOrderChange);

    return () => {
      socket.off('order:created', handleOrderChange);
      socket.off('order:updated', handleOrderChange);
    };
  }, []);

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => (p.id || (p as any)._id) === newSelectedProdId) || products[0];
    if (!prod) return;

    try {
      const orderLines = [
        {
          product: prod.id || (prod as any)._id,
          productName: prod.name,
          productImage: prod.image,
          quantity: newQty,
          unit: prod.pricing?.unit || 'Month',
          unitPrice: prod.pricing?.amount || prod.salesPrice || 999,
          amount: (prod.pricing?.amount || prod.salesPrice || 999) * newQty,
        },
      ];

      await orderService.createOrder({
        customerName: newCustomerName || 'Client Customer',
        customerEmail: newCustomerEmail || 'client@example.com',
        rentalPeriod: { start: newStartDate, end: newEndDate },
        lines: orderLines,
        securityDepositAmount: newDeposit,
      });

      setIsNewOrderModalOpen(false);
      fetchOrdersAndProducts();
    } catch (err: any) {
      alert('Error creating quotation: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSendQuotation = async (id: string) => {
    await orderService.sendQuotation(id);
    fetchOrdersAndProducts();
    if (selectedOrder && selectedOrder._id === id) {
      setSelectedOrder({ ...selectedOrder, status: 'quotation_sent' });
    }
  };

  const handleConfirmOrder = async (id: string) => {
    await orderService.confirmOrder(id);
    fetchOrdersAndProducts();
    if (selectedOrder && selectedOrder._id === id) {
      setSelectedOrder({ ...selectedOrder, status: 'confirmed', invoiceStatus: 'invoiced' });
    }
  };

  const handleCancelOrder = async (id: string) => {
    await orderService.cancelOrder(id);
    fetchOrdersAndProducts();
    if (selectedOrder && selectedOrder._id === id) {
      setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
    }
  };

  const handleProcessPickup = async (id: string) => {
    await orderService.processPickup(id);
    fetchOrdersAndProducts();
    if (selectedOrder && selectedOrder._id === id) {
      setSelectedOrder({ ...selectedOrder, status: 'picked_up' });
    }
  };

  const handleProcessReturn = async (id: string) => {
    const res = await orderService.processReturn(id);
    fetchOrdersAndProducts();
    if (selectedOrder && selectedOrder._id === id) {
      setSelectedOrder(res.order);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderRef?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = [
    { key: 'quotation', label: 'Quotation', bg: 'bg-gray-100 text-gray-800' },
    { key: 'quotation_sent', label: 'Quotation Sent', bg: 'bg-blue-100 text-blue-800' },
    { key: 'confirmed', label: 'Sale Order Confirmed', bg: 'bg-purple-100 text-purple-800' },
    { key: 'reserved', label: 'Reserved', bg: 'bg-[#EFE9F6] text-[#7E3AF2]' },
    { key: 'picked_up', label: 'Picked Up', bg: 'bg-emerald-100 text-emerald-800' },
    { key: 'late_pickup', label: 'Late Pickup', bg: 'bg-amber-100 text-amber-800' },
    { key: 'late_return', label: 'Late Return', bg: 'bg-red-100 text-red-800' },
    { key: 'cancelled', label: 'Cancelled', bg: 'bg-gray-200 text-gray-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#18181B]">Rental Orders & Quotations</h1>
          <p className="text-xs text-[#6E6A78]">Manage quotation requests, confirmed sales orders, pickups, and returns</p>
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
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                viewMode === 'kanban' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78]'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="px-4 py-2.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Order / Quotation</span>
          </button>
        </div>
      </div>

      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D4C4ED] flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search order ref or customer name..."
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
          <option value="all">All Statuses</option>
          {statuses.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-[#D4C4ED] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFE9F6] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#D4C4ED]">
                <tr>
                  <th className="p-3.5">Order Ref</th>
                  <th className="p-3.5">Customer</th>
                  <th className="p-3.5">Rental Period</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Invoice Status</th>
                  <th className="p-3.5 text-right">Total Amount</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-xs text-[#8A8694]">
                      No orders found matching filters.
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
                          {order.rentalPeriod?.start ? new Date(order.rentalPeriod.start).toLocaleDateString() : 'N/A'} →{' '}
                          {order.rentalPeriod?.end ? new Date(order.rentalPeriod.end).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${statusObj.bg}`}>
                            {statusObj.label}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              order.invoiceStatus === 'invoiced'
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {order.invoiceStatus === 'invoiced' ? 'Invoiced' : 'Nothing to Invoice'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right font-black text-[#18181B]">
                          Rs. {(order.total || 0).toLocaleString()}
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1 bg-[#EFE9F6] hover:bg-[#7E3AF2] hover:text-white text-[#7E3AF2] font-bold rounded-lg transition-colors text-[11px]"
                          >
                            Manage Flow
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
          {statuses.map((st) => {
            const columnOrders = filteredOrders.filter((o) => o.status === st.key);
            return (
              <div key={st.key} className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D4C4ED] space-y-3 min-w-[260px]">
                <div className="flex justify-between items-center border-b border-[#D4C4ED]/60 pb-2">
                  <h3 className="text-xs font-black text-[#18181B]">{st.label}</h3>
                  <span className="px-2 py-0.5 bg-[#EFE9F6] text-[#7E3AF2] text-[10px] font-extrabold rounded-full">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {columnOrders.map((o) => (
                    <div
                      key={o._id}
                      onClick={() => setSelectedOrder(o)}
                      className="bg-white p-4 rounded-xl border border-[#D4C4ED] shadow-2xs hover:border-[#7E3AF2] cursor-pointer transition-all space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-[#7E3AF2] text-xs">{o.orderRef}</span>
                        <span className="text-xs font-black text-[#18181B]">Rs. {(o.total || 0).toLocaleString()}</span>
                      </div>
                      <p className="text-xs font-bold text-[#18181B] line-clamp-1">{o.customerName}</p>
                      <p className="text-[10px] text-[#8A8694]">
                        {o.lines && o.lines[0] ? o.lines[0].productName : 'Rental Item'} ({o.lines?.length || 1} lines)
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-[#6E6A78] pt-1 border-t border-[#E5E7EB]">
                        <span>{o.rentalPeriod?.start ? new Date(o.rentalPeriod.start).toLocaleDateString() : ''}</span>
                        <span className="font-semibold text-purple-600">{o.invoiceStatus}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-3xl w-full p-6 rounded-3xl border border-[#D4C4ED] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#18181B] flex items-center gap-2">
                  <span>{selectedOrder.orderRef}</span>
                  <span className="text-xs font-bold px-3 py-1 bg-[#EFE9F6] text-[#7E3AF2] rounded-full">
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </h2>
                <p className="text-xs text-[#6E6A78]">Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-[#8A8694] hover:text-[#18181B] rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED] flex flex-wrap gap-2">
              <button
                onClick={() => handleSendQuotation(selectedOrder._id)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Quotation</span>
              </button>

              <button
                onClick={() => handleConfirmOrder(selectedOrder._id)}
                className="px-3.5 py-2 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Order</span>
              </button>

              <button
                onClick={() => handleProcessPickup(selectedOrder._id)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Process Pickup</span>
              </button>

              <button
                onClick={() => handleProcessReturn(selectedOrder._id)}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Process Return & Deduct Fees</span>
              </button>

              <a
                href={orderService.getQuotationPDFUrl(selectedOrder._id)}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 bg-white border border-[#D4C4ED] text-[#18181B] hover:bg-[#EFE9F6] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-[#7E3AF2]" />
                <span>Print PDF</span>
              </a>

              <button
                onClick={() => handleCancelOrder(selectedOrder._id)}
                className="px-3.5 py-2 bg-red-100 text-red-700 hover:bg-red-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancel Order</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
                <h4 className="font-extrabold text-[#7E3AF2] mb-1">Customer Info</h4>
                <p className="font-bold">{selectedOrder.customerName}</p>
                <p className="text-[#6E6A78]">{selectedOrder.customerEmail}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
                <h4 className="font-extrabold text-[#7E3AF2] mb-1">Rental Duration Window</h4>
                <p>Start: {selectedOrder.rentalPeriod?.start ? new Date(selectedOrder.rentalPeriod.start).toLocaleString() : 'N/A'}</p>
                <p>End: {selectedOrder.rentalPeriod?.end ? new Date(selectedOrder.rentalPeriod.end).toLocaleString() : 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#D4C4ED] p-4 space-y-3">
              <h4 className="font-extrabold text-[#18181B] text-xs">Order Lines</h4>
              <div className="divide-y divide-[#E5E7EB]">
                {selectedOrder.lines?.map((line, idx) => (
                  <div key={idx} className="py-2 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-[#18181B]">{line.productName}</p>
                      <p className="text-[10px] text-[#8A8694]">Qty: {line.quantity} | Rate: Rs. {line.unitPrice}</p>
                    </div>
                    <span className="font-extrabold text-[#18181B]">Rs. {line.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#EFE9F6]/60 p-4 rounded-2xl border border-[#D4C4ED] flex justify-between items-center text-xs">
              <div>
                <p className="text-[#6E6A78]">Security Deposit Held: <strong className="text-amber-700">Rs. {selectedOrder.securityDeposit?.amount}</strong> ({selectedOrder.securityDeposit?.status})</p>
                {selectedOrder.lateFeeCalculated ? (
                  <p className="text-red-600 font-bold">Computed Late Fee: Rs. {selectedOrder.lateFeeCalculated}</p>
                ) : null}
              </div>
              <div className="text-right">
                <span className="text-xs text-[#6E6A78]">Total Order Amount</span>
                <p className="text-xl font-black text-[#7E3AF2]">Rs. {(selectedOrder.total || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-lg w-full p-6 rounded-3xl border border-[#D4C4ED] shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-extrabold text-[#18181B]">Create New Quotation / Order</h3>
              <button onClick={() => setIsNewOrderModalOpen(false)} className="text-[#8A8694]">✕</button>
            </div>

            <form onSubmit={handleCreateQuotation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#18181B] mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. Acme Corp / John Doe"
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Customer Email</label>
                <input
                  type="email"
                  required
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Select Product</label>
                <select
                  value={newSelectedProdId}
                  onChange={(e) => setNewSelectedProdId(e.target.value)}
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl font-bold"
                >
                  <option value="">-- Choose Product --</option>
                  {products.map((p) => (
                    <option key={p.id || (p as any)._id} value={p.id || (p as any)._id}>
                      {p.name} - Rs. {p.pricing?.amount || p.salesPrice} / {p.pricing?.unit || 'Month'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={newQty}
                    onChange={(e) => setNewQty(Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Security Deposit Amount</label>
                  <input
                    type="number"
                    value={newDeposit}
                    onChange={(e) => setNewDeposit(Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white font-bold rounded-xl transition-all shadow-md"
              >
                Create Quotation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
