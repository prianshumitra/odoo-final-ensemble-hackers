import React, { useState, useEffect } from 'react';
import { DollarSign, Clock, RotateCcw, CheckCircle2, Search, CreditCard, ShieldAlert } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import type { Payment, VendorPaymentsResponse } from '../../types';

export const VendorPayments: React.FC = () => {
  const [data, setData] = useState<VendorPaymentsResponse>({
    stats: {
      totalRevenue: 0,
      pendingRevenue: 0,
      refundedAmount: 0,
      completedPaidCount: 0,
      totalTransactions: 0,
    },
    payments: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getVendorPayments();
      setData(res || { stats: { totalRevenue: 0, pendingRevenue: 0, refundedAmount: 0, completedPaidCount: 0, totalTransactions: 0 }, payments: [] });
    } catch (err) {
      console.error('Failed to fetch vendor payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefund = async (paymentId: string) => {
    if (!window.confirm('Are you sure you want to process a full refund for this payment?')) return;
    try {
      setRefundingId(paymentId);
      await paymentService.processRefund(paymentId);
      await fetchPayments();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Refund failed');
    } finally {
      setRefundingId(null);
    }
  };

  const filteredPayments = data.payments.filter((p: Payment) => {
    const q = searchQuery.toLowerCase();
    const customer = typeof p.user === 'object' ? p.user?.name || p.user?.email || '' : '';
    const ref = typeof p.rentalOrder === 'object' ? p.rentalOrder?.orderRef || '' : '';
    return (
      p.razorpayOrderId.toLowerCase().includes(q) ||
      (p.razorpayPaymentId && p.razorpayPaymentId.toLowerCase().includes(q)) ||
      customer.toLowerCase().includes(q) ||
      ref.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#7E3AF2]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
              Payments & Revenue Console
            </h1>
          </div>
          <p className="text-xs text-[#8A8694] mt-0.5">
            Track verified Razorpay transactions, captured payouts, and issue authorized refunds
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#EFE9F6] p-5 rounded-2xl border border-[#D4C4ED] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A8694]">Captured Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#18181B]">Rs. {data.stats.totalRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-emerald-700 font-bold">✓ {data.stats.completedPaidCount} Verified Paid Rentals</span>
        </div>

        <div className="bg-[#EFE9F6] p-5 rounded-2xl border border-[#D4C4ED] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A8694]">Pending Checkout</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#18181B]">Rs. {data.stats.pendingRevenue.toLocaleString()}</p>
          <span className="text-[11px] text-amber-700 font-bold">Awaiting Razorpay Capture</span>
        </div>

        <div className="bg-[#EFE9F6] p-5 rounded-2xl border border-[#D4C4ED] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A8694]">Refunded Amount</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#18181B]">Rs. {data.stats.refundedAmount.toLocaleString()}</p>
          <span className="text-[11px] text-rose-700 font-bold">Processed Refunds</span>
        </div>

        <div className="bg-[#EFE9F6] p-5 rounded-2xl border border-[#D4C4ED] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#8A8694]">Total Transactions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#7E3AF2] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#18181B]">{data.stats.totalTransactions}</p>
          <span className="text-[11px] text-[#7E3AF2] font-bold">Razorpay Payment Attempts</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-[#EFE9F6] rounded-2xl border border-[#D4C4ED] flex items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Payment ID, Order Ref, Customer..."
            className="w-full bg-white text-xs font-medium rounded-xl pl-9 pr-3 py-2 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#EFE9F6] rounded-3xl border border-[#D4C4ED] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-[#8A8694]">Loading payment transactions...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-[#8A8694] mx-auto" />
            <p className="text-sm font-bold text-[#18181B]">No payment transactions found</p>
            <p className="text-xs text-[#8A8694]">Completed payments from customers will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#D4C4ED]/60 bg-[#EFE9F6]/80 text-[11px] font-bold uppercase tracking-wider text-[#8A8694]">
                  <th className="py-3.5 px-4">Payment ID / Order Ref</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4C4ED]/40 text-xs font-semibold">
                {filteredPayments.map((p) => {
                  const customerName = typeof p.user === 'object' ? p.user?.name || p.user?.email : 'Customer';
                  const orderRef = typeof p.rentalOrder === 'object' ? p.rentalOrder?.orderRef : 'RO0000';
                  const isCaptured = p.status === 'CAPTURED';
                  const isRefunded = p.status === 'REFUNDED';

                  return (
                    <tr key={p._id} className="hover:bg-white/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#18181B]">{orderRef}</div>
                        <div className="text-[10px] font-mono text-[#8A8694]">{p.razorpayPaymentId || p.razorpayOrderId}</div>
                      </td>
                      <td className="py-3.5 px-4 text-[#18181B] font-bold">{customerName}</td>
                      <td className="py-3.5 px-4 font-black text-[#18181B]">Rs. {p.amount.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isCaptured
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isRefunded
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#8A8694]">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="py-3.5 px-4 text-right">
                        {isCaptured ? (
                          <button
                            onClick={() => handleRefund(p._id)}
                            disabled={refundingId === p._id}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-lg transition-colors"
                          >
                            {refundingId === p._id ? 'Refunding...' : 'Issue Refund'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#8A8694] font-medium">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
