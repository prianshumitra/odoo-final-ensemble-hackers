import React from 'react';
import { Package } from 'lucide-react';

export const Orders: React.FC = () => {
  const mockOrders = [
    {
      id: 'ORD-98241',
      date: 'Aug 02, 2026',
      status: 'Active Subscription',
      items: ['Modern 3-Seater Comfort Sofa', 'Ultra-HD Smart OLED Television'],
      monthlyTotal: 5198,
      nextBilling: 'Sep 02, 2026',
    },
    {
      id: 'ORD-87120',
      date: 'May 15, 2026',
      status: 'Returned & Completed',
      items: ['Pro Gaming & Creative Laptop'],
      monthlyTotal: 450,
      nextBilling: 'Completed',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#C4B2E2] via-[#D4C4ED] to-[#EAE4DB] shadow-md">
        <div className="bg-gradient-to-br from-[#EFE9F6] via-[#FAF7F2] to-[#F5EBE0] p-8 sm:p-12 rounded-[23px] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#7E3AF2] flex items-center justify-center border border-[#D4C4ED] shadow-xs">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] my-0">My Rental Orders</h1>
              <p className="text-xs text-[#6E6A78]">Manage active subscriptions and past rentals</p>
            </div>
          </div>

          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 rounded-2xl bg-white/80 border border-[#D4C4ED] shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#D4C4ED]/60 pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#18181B]">{order.id}</span>
                    <span className="text-[11px] text-[#8A8694] ml-2">• Ordered on {order.date}</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    order.status.includes('Active')
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-xs font-semibold text-[#18181B]">
                      • {item}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-2 text-[#6E6A78]">
                  <span>Next Billing: <strong className="text-[#18181B]">{order.nextBilling}</strong></span>
                  <span className="font-extrabold text-sm text-[#7E3AF2]">Rs. {order.monthlyTotal.toLocaleString()} / mo</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
