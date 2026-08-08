import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Mail, Store, CheckCircle2, ShieldCheck, Building } from 'lucide-react';
import { authService, orderService } from '../../services/api';
import type { FullRentalOrder } from '../../types';

export const VendorCustomers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customers' | 'vendors'>('customers');
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<FullRentalOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const fetchedUsers = await authService.getUsers();
      setUsers(fetchedUsers || []);
    } catch (err) {
      setUsers([]);
    }

    try {
      const fetchedOrders = await orderService.getOrders();
      setOrders(fetchedOrders || []);
    } catch (err) {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveVendor = async (id: string, status: 'active' | 'rejected') => {
    try {
      await authService.updateUserStatus(id, { status });
      alert(`Vendor status updated to ${status.toUpperCase()}`);
      loadData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const customerList = useMemo(() => {
    const custs = users.filter((u) => u.role === 'customer' || !u.role);
    if (!searchQuery) return custs;
    return custs.filter(
      (c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const vendorList = useMemo(() => {
    const vends = users.filter((u) => u.role === 'vendor' || u.role === 'admin');
    if (!searchQuery) return vends;
    return vends.filter(
      (v) =>
        v.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-[#7E3AF2]" />
            <h1 className="text-xl sm:text-2xl font-black text-[#18181B]">
              Users, Customers & Vendors Directory
            </h1>
          </div>
          <p className="text-xs text-[#6E6A78] mt-0.5">
            View registered renters, approved vendor partners, and pending vendor registration applications
          </p>
        </div>

        {/* Tab Selector */}
        <div className="bg-[#EFE9F6] p-1.5 rounded-2xl border border-[#D4C4ED] flex gap-2">
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'customers' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers ({customerList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === 'vendors' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78]'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Vendors & Admins ({vendorList.length})</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#D4C4ED] flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${activeTab} by name, email, or company...`}
            className="w-full bg-white text-xs font-semibold pl-9 pr-4 py-2.5 border border-[#D4C4ED] rounded-xl focus:outline-none focus:border-[#7E3AF2]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
        </div>
      </div>

      {/* Content Tab 1: Customers */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl border border-[#D4C4ED] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFE9F6] text-[#4B5563] font-bold uppercase border-b border-[#D4C4ED]">
                <tr>
                  <th className="p-3.5">Customer Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Total Orders Placed</th>
                  <th className="p-3.5">Total Amount Spent</th>
                  <th className="p-3.5">Registered Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-[#8A8694]">
                      Loading directory from database...
                    </td>
                  </tr>
                ) : customerList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-xs text-[#8A8694]">
                      No customer accounts found.
                    </td>
                  </tr>
                ) : (
                  customerList.map((cust) => {
                    const custOrders = orders.filter((o) => o.customerEmail === cust.email);
                    const totalSpent = custOrders.reduce((sum, o) => sum + (o.total || 0), 0);
                    return (
                      <tr key={cust._id || cust.email} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="p-3.5 font-extrabold text-[#18181B] flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-[#7E3AF2] text-white flex items-center justify-center font-bold text-xs">
                            {(cust.name?.[0] || 'C').toUpperCase()}
                          </div>
                          <span>{cust.name}</span>
                        </td>
                        <td className="p-3.5 text-[#6E6A78] font-medium">{cust.email}</td>
                        <td className="p-3.5 font-bold text-[#18181B]">{custOrders.length} rentals</td>
                        <td className="p-3.5 font-extrabold text-[#7E3AF2]">Rs. {totalSpent.toLocaleString()}</td>
                        <td className="p-3.5">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                            ACTIVE CUSTOMER
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content Tab 2: Vendors & Admins */}
      {activeTab === 'vendors' && (
        <div className="bg-white rounded-2xl border border-[#D4C4ED] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFE9F6] text-[#4B5563] font-bold uppercase border-b border-[#D4C4ED]">
                <tr>
                  <th className="p-3.5">Vendor / Admin</th>
                  <th className="p-3.5">Company Name</th>
                  <th className="p-3.5">GST IN</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Application Status</th>
                  <th className="p-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-xs text-[#8A8694]">
                      Loading vendors from database...
                    </td>
                  </tr>
                ) : vendorList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-xs text-[#8A8694]">
                      No vendor partner accounts found.
                    </td>
                  </tr>
                ) : (
                  vendorList.map((v) => (
                    <tr key={v._id || v.email} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="p-3.5">
                        <p className="font-extrabold text-[#18181B]">{v.name}</p>
                        <p className="text-[10px] text-[#8A8694] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#7E3AF2]" />
                          <span>{v.email}</span>
                        </p>
                      </td>
                      <td className="p-3.5 font-bold text-[#18181B]">
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-amber-700" />
                          <span>{v.companyName || 'N/A'}</span>
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] font-bold text-[#6E6A78]">
                        {v.gstNo || '27AAAAA0000A1Z5'}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            v.role === 'admin'
                              ? 'bg-purple-200 text-purple-900 border border-purple-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {v.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                            v.status === 'active' || !v.status
                              ? 'bg-emerald-100 text-emerald-800'
                              : v.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {(v.status || 'ACTIVE').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        {v.status === 'pending' ? (
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => handleApproveVendor(v._id, 'active')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 shadow-xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleApproveVendor(v._id, 'rejected')}
                              className="px-2.5 py-1 bg-red-100 text-red-700 hover:bg-red-200 font-bold rounded-lg text-[10px]"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-center gap-0.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Verified</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
