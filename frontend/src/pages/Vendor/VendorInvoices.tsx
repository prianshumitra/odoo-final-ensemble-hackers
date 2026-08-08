import React, { useState, useEffect } from 'react';
import { Printer, DollarSign, Search } from 'lucide-react';
import type { Invoice } from '../../types';
import { invoiceService } from '../../services/api';

export const VendorInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getInvoices();
      setInvoices(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePayInvoice = async (id: string) => {
    await invoiceService.payInvoice(id, { paymentMethod: 'card', last4: '4242' });
    fetchInvoices();
  };

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.orderRef?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#18181B]">Invoices Management</h1>
          <p className="text-xs text-[#6E6A78]">View and record payments for customer invoices</p>
        </div>
      </div>

      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D4C4ED] flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search invoice number, order ref, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white pl-9 pr-4 py-2 text-xs border border-[#D4C4ED] rounded-xl focus:outline-none focus:border-[#7E3AF2]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#D4C4ED] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EFE9F6] text-[#4B5563] font-bold uppercase tracking-wider border-b border-[#D4C4ED]">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Order Ref</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Invoice Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#8A8694]">
                    No invoices recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv._id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="p-3.5 font-extrabold text-[#7E3AF2]">{inv.invoiceNumber}</td>
                    <td className="p-3.5 font-bold text-[#18181B]">{inv.orderRef}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-[#18181B]">{inv.customerName}</p>
                      <p className="text-[10px] text-[#8A8694]">{inv.customerEmail}</p>
                    </td>
                    <td className="p-3.5 text-[11px] text-[#6E6A78]">
                      {new Date(inv.invoiceDate).toLocaleDateString()}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'posted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-black text-[#18181B]">
                      Rs. {(inv.total || 0).toLocaleString()}
                    </td>
                    <td className="p-3.5 text-center flex justify-center gap-2">
                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => handlePayInvoice(inv._id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 transition-colors"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>Record Payment</span>
                        </button>
                      )}
                      <a
                        href={invoiceService.getInvoicePDFUrl(inv._id)}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 bg-[#EFE9F6] text-[#7E3AF2] font-bold rounded-lg text-[10px] flex items-center gap-1 hover:bg-[#7E3AF2] hover:text-white transition-colors"
                      >
                        <Printer className="w-3 h-3" />
                        <span>PDF</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
