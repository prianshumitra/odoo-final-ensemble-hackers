import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Bell,
  Settings,
  Store,
  ArrowLeft,
  X,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface VendorSidebarProps {
  onToggleRole: () => void;
  unreadCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  onToggleRole,
  unreadCount = 2,
  isOpen = false,
  onClose,
}) => {
  const navItems = [
    { name: 'Dashboard', path: '/vendor', icon: LayoutDashboard, exact: true },
    { name: 'Products', path: '/vendor/products', icon: Package },
    { name: 'Rentals', path: '/vendor/rentals', icon: ShoppingBag },
    { name: 'Customers', path: '/vendor/customers', icon: Users },
    { name: 'Analytics', path: '/vendor/analytics', icon: BarChart3 },
    { name: 'Notifications', path: '/vendor/notifications', icon: Bell, badge: unreadCount },
    { name: 'Settings', path: '/vendor/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#EFE9F6] border-r border-[#D4C4ED] flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        <div className="space-y-6">
          {/* Header Branding */}
          <div className="flex items-center justify-between px-2 pt-2">
            <Link to="/vendor" className="flex items-center gap-2 group" onClick={onClose}>
              <img src={logoImg} alt="EZ Rent" className="h-12 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7E3AF2]">
                  Vendor Portal
                </span>
                <span className="text-[11px] font-semibold text-[#8A8694]">Business Suite</span>
              </div>
            </Link>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 text-[#8A8694] hover:text-[#18181B] rounded-lg lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#18181B] text-white shadow-md'
                      : 'text-[#3E3A47] hover:bg-white/80 hover:text-[#7E3AF2]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="bg-[#7E3AF2] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Actions — Role Switcher */}
        <div className="pt-4 border-t border-[#D4C4ED]/60 space-y-2">
          <div className="bg-amber-100/70 border border-amber-300 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-amber-800" />
              <span className="text-xs font-bold text-amber-900">Vendor Active</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <button
            onClick={() => {
              onToggleRole();
              onClose?.();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-[#7E3AF2] bg-white/90 hover:bg-white border border-[#D4C4ED] rounded-2xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Customer Mode</span>
          </button>
        </div>
      </aside>
    </>
  );
};
