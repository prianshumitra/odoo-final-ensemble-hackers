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
import { getSocket } from '../../services/socket';

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
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState<RentalOrder | null>(null);

  const fetchData = async () => {
    try {
      const [prods, rents] = await Promise.all([
        vendorService.getProducts(),
        vendorService.getRentals(),
      ]);
      setProducts(prods);
      setRentals(rents);
      const computedStats = await vendorService.getStats(prods, rents);
      setStats(computedStats);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const socket = getSocket();
    const handleRealtimeChange = () => fetchData();

    socket.on('order:created', handleRealtimeChange);
    socket.on('order:updated', handleRealtimeChange);
    socket.on('payment:captured', handleRealtimeChange);
    socket.on('payment:refunded', handleRealtimeChange);
    socket.on('product:created', handleRealtimeChange);
    socket.on('product:updated', handleRealtimeChange);
    socket.on('product:deleted', handleRealtimeChange);

    return () => {
      socket.off('order:created', handleRealtimeChange);
      socket.off('order:updated', handleRealtimeChange);
      socket.off('payment:captured', handleRealtimeChange);
      socket.off('payment:refunded', handleRealtimeChange);
      socket.off('product:created', handleRealtimeChange);
      socket.off('product:updated', handleRealtimeChange);
      socket.off('product:deleted', handleRealtimeChange);
    };
  }, []);

  const handleUpdateStatus = async (id: string, status: RentalOrder['status']) => {
    await vendorService.updateRentalStatus(id, status);
    fetchData(); // Full re-fetch from DB to keep all KPIs in sync
  };

  const vendorName = user?.name || user?.firstName || 'Vendor Partner';

  return (
    <div className="space-y-8">
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-[#E8E4DE] rounded-3xl" />
          ))}
        </div>
      )}

      {/* Top Welcome Header */}
      <div className="p-px rounded-3xl bg-linear-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-xs">
        <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-[23px] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-[#E8E4DE]">
          <div>
            <span className="inline-block bg-white text-[#1C1C1C] text-xs font-black px-3 py-1 rounded-full border border-[#E8E4DE] shadow-2xs mb-2">
              EZRent Rental Operations Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
              Welcome back, {vendorName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#8A857F] mt-1 font-medium">
              Manage your rental inventory, incoming orders, customer returns, security deposits, and late fees from one central console.
            </p>
          </div>

          <button
            onClick={onOpenAddProduct}
            className="px-5 py-3 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-xs font-bold rounded-full transition-all shadow-warm-xs flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#E8B923]" />
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
      <div className="bg-[#FAF8F5] rounded-3xl p-6 border border-[#E8E4DE] shadow-warm-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-3">
          <div>
            <h2 className="text-base font-black text-[#1C1C1C] tracking-tight">
              Operational Insights & Fulfillment Priorities
            </h2>
            <p className="text-xs text-[#8A857F] font-bold">Real-time operational status for daily rental managers</p>
          </div>
          <span className="bg-[#0A0A0A] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
            Fulfillment Live
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Rentals Due Today */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8E4DE] space-y-1 shadow-warm-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A857F] uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-[#E8B923]" />
              <span>Due Today</span>
            </div>
            <div className="text-lg font-black text-[#1C1C1C]">{stats.rentalsDueToday}</div>
            <p className="text-[10px] text-amber-800 font-bold">Scheduled returns today</p>
          </div>

          {/* 2. Upcoming Pickups */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8E4DE] space-y-1 shadow-warm-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A857F] uppercase tracking-wider">
              <Truck className="w-3.5 h-3.5 text-[#1C1C1C]" />
              <span>Pickups</span>
            </div>
            <div className="text-lg font-black text-[#1C1C1C]">{stats.upcomingPickups}</div>
            <p className="text-[10px] text-[#1C1C1C] font-bold">Ready for pickup</p>
          </div>

          {/* 3. Upcoming Returns */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8E4DE] space-y-1 shadow-warm-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A857F] uppercase tracking-wider">
              <RotateCcw className="w-3.5 h-3.5 text-[#1C1C1C]" />
              <span>Upcoming Returns</span>
            </div>
            <div className="text-lg font-black text-[#1C1C1C]">{stats.upcomingReturns}</div>
            <p className="text-[10px] text-[#8A857F] font-bold">Expiring in 7 days</p>
          </div>

          {/* 4. Overdue Rentals */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8E4DE] space-y-1 shadow-warm-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A857F] uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Overdue</span>
            </div>
            <div className="text-lg font-black text-emerald-700">{stats.overdueRentals}</div>
            <p className="text-[10px] text-emerald-800 font-bold">Good standing</p>
          </div>

          {/* 5. Security Deposits Held */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8E4DE] space-y-1 shadow-warm-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A857F] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E8B923]" />
              <span>Deposits Held</span>
            </div>
            <div className="text-lg font-black text-[#1C1C1C]">
              Rs. {stats.securityDepositsHeld.toLocaleString()}
            </div>
            <p className="text-[10px] text-[#8A857F] font-bold">Refundable escrow</p>
          </div>

          {/* 6. Late Fee Collection */}
          <div className="p-3.5 rounded-2xl bg-white border border-[#E8E4DE] space-y-1 shadow-warm-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8A857F] uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5 text-[#1C1C1C]" />
              <span>Late Fees</span>
            </div>
            <div className="text-lg font-black text-[#1C1C1C]">
              Rs. {stats.lateFeeCollection}
            </div>
            <p className="text-[10px] text-[#8A857F] font-bold">Fees collected</p>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={onOpenAddProduct}
          className="p-4 bg-[#FAF8F5] hover:bg-white rounded-2xl border border-[#E8E4DE] hover:border-[#0A0A0A] transition-all text-left group shadow-warm-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 text-[#E8B923]" />
          </div>
          <span className="block text-xs font-black text-[#1C1C1C]">Add Product</span>
          <span className="text-[10px] font-bold text-[#8A857F]">List new rental item</span>
        </button>

        <button
          onClick={() => navigate('/vendor/products')}
          className="p-4 bg-[#FAF8F5] hover:bg-white rounded-2xl border border-[#E8E4DE] hover:border-[#0A0A0A] transition-all text-left group shadow-warm-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="block text-xs font-black text-[#1C1C1C]">Manage Products</span>
          <span className="text-[10px] font-bold text-[#8A857F]">{products.length} listed</span>
        </button>

        <button
          onClick={() => navigate('/vendor/orders')}
          className="p-4 bg-[#FAF8F5] hover:bg-white rounded-2xl border border-[#E8E4DE] hover:border-[#0A0A0A] transition-all text-left group shadow-warm-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-4 h-4 text-white" />
          </div>
          <span className="block text-xs font-black text-[#1C1C1C]">View Orders</span>
          <span className="text-[10px] font-bold text-[#8A857F]">{rentals.length} orders</span>
        </button>

        <button
          onClick={() => navigate('/vendor/orders')}
          className="p-4 bg-[#FAF8F5] hover:bg-white rounded-2xl border border-[#E8E4DE] hover:border-[#0A0A0A] transition-all text-left group shadow-warm-xs"
        >
          <div className="w-8 h-8 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="block text-xs font-black text-[#1C1C1C]">Rental Stats</span>
          <span className="text-[10px] font-bold text-[#8A857F]">Review live requests</span>
        </button>
      </div>

      {/* Main Grid: Rental Orders + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Rental Orders (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-[#1C1C1C]">Recent Rental Orders</h2>
              <p className="text-xs font-bold text-[#8A857F]">Review and update incoming rental requests</p>
            </div>

            <button
              onClick={() => navigate('/vendor/orders')}
              className="flex items-center gap-1 text-xs font-bold text-[#0A0A0A] hover:underline"
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
