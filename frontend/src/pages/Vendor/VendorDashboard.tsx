import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, Clock, Plus, ArrowRight, BarChart3, ShieldCheck, Calendar, Truck, RotateCcw, AlertTriangle } from 'lucide-react';
import { VendorKPICard } from '../../components/vendor/VendorKPICard';
import { VendorActivityFeed } from '../../components/vendor/VendorActivityFeed';
import { VendorRentalTable } from '../../components/vendor/VendorRentalTable';
import { RentalDetailModal } from '../../components/vendor/RentalDetailModal';
import { vendorService } from '../../services/vendorService';
import type { Product, RentalOrder, VendorStats } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface VendorDashboardProps {
  onOpenAddProduct: () => void;
}

export const VendorDashboard: React.FC<VendorDashboardProps> = ({ onOpenAddProduct }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [stats, setStats] = useState<VendorStats>({
    totalProducts: 0,
    activeRentals: 0,
    rentalsDueToday: 0,
    upcomingPickups: 0,
    upcomingReturns: 0,
    overdueRentals: 0,
    totalRevenue: 0,
    securityDepositsHeld: 0,
    lateFeeCollection: 0,
    pendingRequests: 0,
  });
  const [selectedRental, setSelectedRental] = useState<RentalOrder | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const prods = await vendorService.getProducts();
      const rents = await vendorService.getRentals();
      setProducts(prods);
      setRentals(rents);

      const computedStats = await vendorService.getStats(prods, rents);
      setStats(computedStats);
    };

    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: RentalOrder['status']) => {
    await vendorService.updateRentalStatus(id, status);
    setRentals((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const vendorName = user?.name || user?.firstName || 'Vendor Partner';

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#C4B2E2] via-[#D4C4ED] to-[#EAE4DB] shadow-xs">
        <div className="bg-gradient-to-r from-[#EFE9F6] via-[#FAF7F2] to-[#F5EBE0] p-6 sm:p-8 rounded-[23px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-white/80 text-[#7E3AF2] text-xs font-extrabold px-3 py-1 rounded-full border border-[#D4C4ED] mb-2">
              EZ Rent Business Suite
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
              Welcome back, {vendorName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#6E6A78] mt-1">
              Manage your rental products, incoming orders, customers, and revenue from one place.
            </p>
          </div>

          <button
            onClick={onOpenAddProduct}
            className="px-5 py-3 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Product</span>
          </button>
        </div>
      </div>

      {/* Top 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <VendorKPICard
          title="Active Rentals"
          value={stats.activeRentals}
          changeText="+12% active"
          isPositive={true}
          icon={ShoppingBag}
        />
        <VendorKPICard
          title="Revenue from Rentals"
          value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
          changeText="+18% growth"
          isPositive={true}
          icon={DollarSign}
        />
        <VendorKPICard
          title="Security Deposits Held"
          value={`Rs. ${stats.securityDepositsHeld.toLocaleString()}`}
          changeText="Escrow secured"
          isPositive={true}
          icon={ShieldCheck}
        />
        <VendorKPICard
          title="Pending Requests"
          value={stats.pendingRequests}
          changeText="Requires review"
          isPositive={false}
          icon={Clock}
        />
      </div>

      {/* 📋 Comprehensive Operational Insights Bar (All 8 Requirements) */}
      <div className="bg-[#EFE9F6] rounded-3xl p-6 border border-[#D4C4ED] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#D4C4ED]/60 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-[#18181B] tracking-tight">
              Operational Insights & Fulfillment Priorities
            </h2>
            <p className="text-xs text-[#8A8694]">Real-time operational status for daily rental managers</p>
          </div>
          <span className="bg-[#7E3AF2] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Fulfillment Live
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Rentals Due Today */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A8694] uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              <span>Due Today</span>
            </div>
            <div className="text-lg font-extrabold text-[#18181B]">{stats.rentalsDueToday}</div>
            <p className="text-[10px] text-amber-700 font-semibold">Scheduled returns today</p>
          </div>

          {/* 2. Upcoming Pickups */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A8694] uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-sky-600" />
              <span>Pickups</span>
            </div>
            <div className="text-lg font-extrabold text-[#18181B]">{stats.upcomingPickups}</div>
            <p className="text-[10px] text-sky-700 font-semibold">Ready for customer pickup</p>
          </div>

          {/* 3. Upcoming Returns */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A8694] uppercase tracking-wider">
              <RotateCcw className="w-3.5 h-3.5 text-[#7E3AF2]" />
              <span>Upcoming Returns</span>
            </div>
            <div className="text-lg font-extrabold text-[#18181B]">{stats.upcomingReturns}</div>
            <p className="text-[10px] text-[#7E3AF2] font-semibold">Expiring within 7 days</p>
          </div>

          {/* 4. Overdue Rentals */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A8694] uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Overdue</span>
            </div>
            <div className="text-lg font-extrabold text-emerald-600">{stats.overdueRentals}</div>
            <p className="text-[10px] text-emerald-700 font-semibold">0 overdue (Good standing)</p>
          </div>

          {/* 5. Security Deposits Held */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A8694] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7E3AF2]" />
              <span>Deposits Held</span>
            </div>
            <div className="text-lg font-extrabold text-[#7E3AF2]">
              Rs. {stats.securityDepositsHeld.toLocaleString()}
            </div>
            <p className="text-[10px] text-[#8A8694]">Refundable escrow</p>
          </div>

          {/* 6. Late Fee Collection */}
          <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A8694] uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Late Fees</span>
            </div>
            <div className="text-lg font-extrabold text-[#18181B]">
              Rs. {stats.lateFeeCollection}
            </div>
            <p className="text-[10px] text-[#8A8694]">Fees collected</p>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={onOpenAddProduct}
          className="p-4 bg-[#EFE9F6] hover:bg-white rounded-2xl border border-[#D4C4ED] hover:border-[#7E3AF2] transition-all text-left group shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#7E3AF2] text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <span className="block text-xs font-bold text-[#18181B]">Add Product</span>
          <span className="text-[10px] text-[#8A8694]">List new rental item</span>
        </button>

        <button
          onClick={() => navigate('/vendor/products')}
          className="p-4 bg-[#EFE9F6] hover:bg-white rounded-2xl border border-[#D4C4ED] hover:border-[#7E3AF2] transition-all text-left group shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#18181B] text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
            <Package className="w-4 h-4" />
          </div>
          <span className="block text-xs font-bold text-[#18181B]">Manage Products</span>
          <span className="text-[10px] text-[#8A8694]">{products.length} listed</span>
        </button>

        <button
          onClick={() => navigate('/vendor/rentals')}
          className="p-4 bg-[#EFE9F6] hover:bg-white rounded-2xl border border-[#D4C4ED] hover:border-[#7E3AF2] transition-all text-left group shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#18181B] text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="block text-xs font-bold text-[#18181B]">View Rentals</span>
          <span className="text-[10px] text-[#8A8694]">{rentals.length} orders</span>
        </button>

        <button
          onClick={() => navigate('/vendor/analytics')}
          className="p-4 bg-[#EFE9F6] hover:bg-white rounded-2xl border border-[#D4C4ED] hover:border-[#7E3AF2] transition-all text-left group shadow-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#18181B] text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-4 h-4" />
          </div>
          <span className="block text-xs font-bold text-[#18181B]">Analytics</span>
          <span className="text-[10px] text-[#8A8694]">Revenue & performance</span>
        </button>
      </div>

      {/* Main Grid: Rental Orders + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Rental Orders (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-[#18181B]">Recent Rental Orders</h2>
              <p className="text-xs text-[#8A8694]">Review and update incoming rental requests</p>
            </div>

            <button
              onClick={() => navigate('/vendor/rentals')}
              className="flex items-center gap-1 text-xs font-bold text-[#7E3AF2] hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <VendorRentalTable
            rentals={rentals.slice(0, 4)}
            onSelectRental={(r) => setSelectedRental(r)}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>

        {/* Right Column: Recent Activity Feed (1 col) */}
        <div className="space-y-4">
          <VendorActivityFeed
            rentals={rentals}
            products={products}
            onSelectRental={(r) => setSelectedRental(r)}
          />
        </div>
      </div>

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
