import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, DollarSign, Package, ShoppingBag, PieChart } from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import type { Product, VendorStats } from '../../types';

export const VendorAnalytics: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    const load = async () => {
      const prods = await vendorService.getProducts();
      const rents = await vendorService.getRentals();
      setProducts(prods);

      const st = await vendorService.getStats(prods, rents);
      setStats(st);
    };
    load();
  }, []);

  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;
  const utilizationRate =
    products.length > 0 ? Math.round((stats.activeRentals / products.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#7E3AF2]" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
            Business Analytics & Revenue
          </h1>
        </div>
        <p className="text-xs text-[#8A8694] mt-0.5">
          Real-time performance metrics, product utilization, and income insights
        </p>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#EFE9F6] rounded-3xl p-6 border border-[#D4C4ED] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A8694]">
              Total Earned
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] mt-1">
              Rs. {stats.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% this month</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#7E3AF2] text-white flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#EFE9F6] rounded-3xl p-6 border border-[#D4C4ED] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A8694]">
              Inventory Utilization
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] mt-1">
              {utilizationRate}%
            </div>
            <span className="text-xs text-[#6E6A78] mt-1 block">Active rentals / Listed stock</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#18181B] text-white flex items-center justify-center font-bold">
            <PieChart className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#EFE9F6] rounded-3xl p-6 border border-[#D4C4ED] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#8A8694]">
              Active Subscriptions
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#18181B] mt-1">
              {stats.activeRentals}
            </div>
            <span className="text-xs text-emerald-600 font-bold mt-1 block">Generating recurring revenue</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Stock Breakdown */}
        <div className="bg-[#EFE9F6] rounded-3xl p-6 border border-[#D4C4ED] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4C4ED]/60 pb-3">
            <h3 className="text-base font-extrabold text-[#18181B]">Inventory Status</h3>
            <Package className="w-4 h-4 text-[#7E3AF2]" />
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D4C4ED] flex items-center justify-between">
              <span className="text-xs font-bold text-[#18181B]">In Stock & Available</span>
              <span className="text-sm font-extrabold text-emerald-600">{inStockCount} items</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D4C4ED] flex items-center justify-between">
              <span className="text-xs font-bold text-[#18181B]">Rented Out / Active</span>
              <span className="text-sm font-extrabold text-[#7E3AF2]">{stats.activeRentals} orders</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-[#D4C4ED] flex items-center justify-between">
              <span className="text-xs font-bold text-[#18181B]">Out of Stock / Unavailable</span>
              <span className="text-sm font-extrabold text-rose-600">{outOfStockCount} items</span>
            </div>
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="bg-[#EFE9F6] rounded-3xl p-6 border border-[#D4C4ED] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#D4C4ED]/60 pb-3">
            <h3 className="text-base font-extrabold text-[#18181B]">Top Performing Catalog</h3>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="space-y-3">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="p-3 rounded-2xl bg-white/80 border border-[#D4C4ED] flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-xl shrink-0"
                  />
                  <div>
                    <span className="block font-bold text-[#18181B] truncate max-w-[180px]">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-[#8A8694]">{p.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-extrabold text-[#7E3AF2]">
                    Rs. {(p.pricePerUnit || p.pricing?.amount || 0).toLocaleString()}/{p.pricingUnit || p.pricing?.unit || 'Month'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">★ {p.rating} rating</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
