import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Search } from 'lucide-react';
import { VendorRentalTable } from '../../components/vendor/VendorRentalTable';
import { RentalDetailModal } from '../../components/vendor/RentalDetailModal';
import { vendorService } from '../../services/vendorService';
import type { RentalOrder } from '../../types';

export const VendorRentals: React.FC = () => {
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedRental, setSelectedRental] = useState<RentalOrder | null>(null);

  const loadRentals = async () => {
    const fetched = await vendorService.getRentals();
    setRentals(fetched);
  };

  useEffect(() => {
    loadRentals();
  }, []);

  const handleUpdateStatus = async (id: string, status: RentalOrder['status']) => {
    await vendorService.updateRentalStatus(id, status);
    setRentals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  // Filtered rentals
  const filteredRentals = useMemo(() => {
    return rentals.filter((r) => {
      if (
        searchQuery &&
        !r.productName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !r.id.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (selectedStatus !== 'All' && r.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [rentals, searchQuery, selectedStatus]);

  const statusOptions = ['All', 'Pending', 'Approved', 'Active Subscription', 'Returned & Completed', 'Cancelled'];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#7E3AF2]" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
            Rental Order Management
          </h1>
        </div>
        <p className="text-xs text-[#8A8694] mt-0.5">
          Approve, manage, and monitor all incoming customer rental subscriptions ({rentals.length} total)
        </p>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-[#EFE9F6] rounded-2xl border border-[#D4C4ED] space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order ID, product, or customer..."
              className="w-full bg-white text-xs font-medium rounded-xl pl-9 pr-3 py-2 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2]"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#8A8694] hidden sm:inline-block">Status:</span>
            <div className="bg-white px-3 py-1.5 rounded-xl border border-[#D4C4ED] text-xs font-semibold text-[#18181B] flex-1 sm:flex-none">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent focus:outline-none text-xs font-bold cursor-pointer w-full"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5">
          {statusOptions.map((opt) => {
            const isSelected = selectedStatus === opt;
            return (
              <button
                key={opt}
                onClick={() => setSelectedStatus(opt)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#18181B] text-white shadow-xs'
                    : 'bg-white/80 text-[#3E3A47] hover:bg-white hover:text-[#7E3AF2] border border-[#D4C4ED]'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rentals Table / Mobile list */}
      <VendorRentalTable
        rentals={filteredRentals}
        onSelectRental={(r) => setSelectedRental(r)}
        onUpdateStatus={handleUpdateStatus}
      />

      {/* Rental Detail Modal */}
      <RentalDetailModal
        rental={selectedRental}
        isOpen={!!selectedRental}
        onClose={() => setSelectedRental(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};
