import React, { useState, useEffect, useMemo } from 'react';
import { Users, Search, Mail, ChevronRight } from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import type { RenterCustomer, RentalOrder } from '../../types';

export const VendorCustomers: React.FC = () => {
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<RenterCustomer | null>(null);

  useEffect(() => {
    const load = async () => {
      const fetched = await vendorService.getRentals();
      setRentals(fetched);
    };
    load();
  }, []);

  const customers = useMemo(() => {
    const list = vendorService.getCustomers(rentals);
    if (!searchQuery) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rentals, searchQuery]);

  const customerRentals = useMemo(() => {
    if (!selectedCustomer) return [];
    return rentals.filter((r) => r.userEmail === selectedCustomer.email);
  }, [rentals, selectedCustomer]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#7E3AF2]" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
            Customer Directory
          </h1>
        </div>
        <p className="text-xs text-[#8A8694] mt-0.5">
          Customers who have rented your products ({customers.length} total)
        </p>
      </div>

      {/* Search */}
      <div className="p-4 bg-[#EFE9F6] rounded-2xl border border-[#D4C4ED] shadow-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer name or email..."
            className="w-full bg-white text-xs font-medium rounded-xl pl-9 pr-3 py-2 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customers.length === 0 ? (
          <div className="col-span-full bg-[#EFE9F6] rounded-3xl p-12 text-center border border-[#D4C4ED]">
            <p className="text-sm font-bold text-[#18181B]">No customers found</p>
          </div>
        ) : (
          customers.map((cust) => (
            <div
              key={cust.email}
              onClick={() => setSelectedCustomer(cust)}
              className="bg-[#EFE9F6] rounded-3xl p-5 border border-[#D4C4ED] hover:border-[#7E3AF2] shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#18181B] text-white flex items-center justify-center font-extrabold text-sm group-hover:bg-[#7E3AF2] transition-colors">
                    {cust.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-[#18181B] truncate">{cust.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#8A8694]">
                      <Mail className="w-3 h-3 text-[#7E3AF2]" />
                      <span className="truncate max-w-[160px]">{cust.email}</span>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#8A8694] group-hover:text-[#7E3AF2] transition-colors" />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#D4C4ED]/60 text-center">
                <div className="bg-white/80 p-2 rounded-xl border border-[#D4C4ED]/40">
                  <span className="block text-[10px] font-bold text-[#8A8694] uppercase">Orders</span>
                  <span className="text-xs font-extrabold text-[#18181B]">{cust.totalRentals}</span>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-[#D4C4ED]/40">
                  <span className="block text-[10px] font-bold text-[#8A8694] uppercase">Active</span>
                  <span className="text-xs font-extrabold text-emerald-600">{cust.activeRentals}</span>
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-[#D4C4ED]/40">
                  <span className="block text-[10px] font-bold text-[#8A8694] uppercase">Spent</span>
                  <span className="text-xs font-extrabold text-[#7E3AF2]">
                    Rs. {cust.totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedCustomer(null)}
          />

          <div className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl z-10 border border-[#EAE4DB] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#7E3AF2] text-white flex items-center justify-center font-extrabold text-sm">
                  {selectedCustomer.name[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18181B]">{selectedCustomer.name}</h3>
                  <p className="text-xs text-[#8A8694]">{selectedCustomer.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 text-[#8A8694] hover:text-[#18181B] bg-[#FAF7F2] rounded-full"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8694]">
                Rental History with You ({customerRentals.length})
              </h4>

              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {customerRentals.map((r) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={r.productImage}
                        alt={r.productName}
                        className="w-10 h-10 object-cover rounded-xl shrink-0"
                      />
                      <div>
                        <span className="block font-bold text-[#18181B]">{r.productName}</span>
                        <span className="text-[10px] text-[#8A8694]">{r.rentDuration}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block font-extrabold text-[#7E3AF2]">
                        Rs. {r.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-bold text-[#6E6A78]">{r.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
