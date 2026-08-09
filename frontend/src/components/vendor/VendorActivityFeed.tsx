import React from 'react';
import { ShoppingBag, CheckCircle, Package, AlertTriangle, Clock } from 'lucide-react';
import type { RentalOrder, Product } from '../../types';

interface VendorActivityFeedProps {
  rentals: RentalOrder[];
  products: Product[];
  onSelectRental?: (rental: RentalOrder) => void;
}

export const VendorActivityFeed: React.FC<VendorActivityFeedProps> = ({
  rentals,
  products,
  onSelectRental,
}) => {
  // Combine rentals and products into a chronological activity feed
  const activities = [
    ...rentals.map((r) => ({
      id: `act-r-${r.id}`,
      title: r.status === 'Pending' ? 'New Rental Request' : `Rental Order ${r.status}`,
      desc: `${r.userName} requested "${r.productName}" for ${r.rentDuration}.`,
      timestamp: r.createdAt ? new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
      icon: r.status === 'Pending' ? Clock : r.status === 'Approved' ? CheckCircle : ShoppingBag,
      iconBg: r.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-[#EFE9F6] text-[#7E3AF2]',
      rentalObj: r,
    })),
    ...products.slice(0, 3).map((p) => ({
      id: `act-p-${p.id}`,
      title: 'Product Inventory Updated',
      desc: `"${p.name}" is listed at Rs. ${p.pricing?.amount || p.pricePerUnit}/${p.pricing?.unit || p.pricingUnit}.`,
      timestamp: 'Today',
      icon: p.inStock ? Package : AlertTriangle,
      iconBg: p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800',
      rentalObj: undefined,
    })),
  ].slice(0, 5);

  return (
    <div className="bg-[#EFE9F6] rounded-3xl p-6 border border-[#D4C4ED] shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[#D4C4ED]/60 pb-3">
        <h3 className="text-base font-extrabold text-[#18181B] tracking-tight">
          Recent Activity
        </h3>
        <span className="text-xs font-semibold text-[#8A8694]">Real-time events</span>
      </div>

      <div className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-xs text-[#8A8694] py-4 text-center">No recent activity yet.</p>
        ) : (
          activities.map((act) => (
            <div
              key={act.id}
              onClick={() => act.rentalObj && onSelectRental?.(act.rentalObj)}
              className={`flex items-start gap-3.5 p-3 rounded-2xl bg-white/80 border border-[#D4C4ED]/60 transition-all ${
                act.rentalObj ? 'hover:border-[#7E3AF2] cursor-pointer hover:shadow-xs' : ''
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${act.iconBg}`}>
                <act.icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#18181B] truncate">{act.title}</h4>
                  <span className="text-[10px] font-semibold text-[#8A8694] shrink-0">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#6E6A78] mt-0.5 line-clamp-1">{act.desc}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
