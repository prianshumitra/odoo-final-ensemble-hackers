import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, Package, ShoppingBag, ShieldAlert } from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import type { NotificationItem } from '../../types';

export const VendorNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    vendorService.getNotifications()
  );

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'rental':
        return <ShoppingBag className="w-4 h-4 text-[#7E3AF2]" />;
      case 'product':
        return <Package className="w-4 h-4 text-amber-600" />;
      case 'system':
        return <ShieldAlert className="w-4 h-4 text-sky-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#7E3AF2]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#7E3AF2]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
              Vendor Notifications
            </h1>
          </div>
          <p className="text-xs text-[#8A8694] mt-0.5">
            Real-time alerts for rental requests, stock status, and system notices
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="px-3.5 py-2 bg-white text-[#7E3AF2] hover:bg-[#EFE9F6] border border-[#D4C4ED] text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-[#EFE9F6] rounded-3xl border border-[#D4C4ED] p-4 sm:p-6 space-y-3 shadow-sm">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-[#8A8694] text-xs">
            You're all caught up! No new notifications.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                notif.read
                  ? 'bg-white/60 border-[#D4C4ED]/40 text-[#6E6A78]'
                  : 'bg-white border-[#7E3AF2] shadow-xs text-[#18181B]'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-[#EFE9F6] shrink-0">{getIcon(notif.type)}</div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#18181B]">{notif.title}</h4>
                  <span className="text-[10px] font-semibold text-[#8A8694] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-[#6E6A78] mt-1">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
