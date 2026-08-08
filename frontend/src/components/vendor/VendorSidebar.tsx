import React from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileText,
  Sliders,
  Tag,
  Calendar,
  Truck,
  FileCode,
  BarChart3,
  Settings,
  Users,
  X,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface VendorSidebarProps {
  unreadCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const VendorSidebar: React.FC<VendorSidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const mainNavItems = [
    { name: 'Dashboard', path: '/vendor', icon: LayoutDashboard, exact: true },
    { name: 'Orders / Quotes', path: '/vendor/orders', icon: ShoppingBag },
    { name: 'Products', path: '/vendor/products', icon: Package },
    { name: 'Customers & Vendors', path: '/vendor/customers', icon: Users },
    { name: 'Invoices', path: '/vendor/invoices', icon: FileText },
    { name: 'Calendar / Schedule', path: '/vendor/calendar', icon: Calendar },
    { name: 'Pickups & Returns', path: '/vendor/pickups-returns', icon: Truck },
    { name: 'Reports & Export', path: '/vendor/reports', icon: BarChart3 },
    { name: 'Settings', path: '/vendor/settings', icon: Settings },
  ];

  const configNavItems = [
    { name: 'Attributes', path: '/vendor/attributes', icon: Sliders },
    { name: 'Pricelists', path: '/vendor/pricelists', icon: Tag },
    { name: 'Quote Templates', path: '/vendor/quotation-templates', icon: FileCode },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#EFE9F6] border-r border-[#D4C4ED] flex flex-col justify-between p-4 transition-transform duration-300 overflow-y-auto lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2 pt-2">
            <Link to="/vendor" className="flex items-center gap-2 group" onClick={onClose}>
              <img src={logoImg} alt="EZRent" className="h-10 w-auto object-contain" />
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider text-[#7E3AF2]">
                  Operations Console
                </span>
                <span className="text-[10px] font-semibold text-[#8A8694]">Vendor Suite</span>
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

          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-extrabold uppercase text-[#8A8694] tracking-wider mb-1">
              Operations
            </p>
            {mainNavItems.map((item) => (
              <RouterNavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#7E3AF2] text-white shadow-sm shadow-[#7E3AF2]/30'
                      : 'text-[#3E3A47] hover:bg-white/80 hover:text-[#7E3AF2]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              </RouterNavLink>
            ))}
          </nav>

          <nav className="space-y-1 pt-2 border-t border-[#D4C4ED]/60">
            <p className="px-3 text-[10px] font-extrabold uppercase text-[#8A8694] tracking-wider mb-1">
              Configuration
            </p>
            {configNavItems.map((item) => (
              <RouterNavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#7E3AF2] text-white shadow-sm shadow-[#7E3AF2]/30'
                      : 'text-[#3E3A47] hover:bg-white/80 hover:text-[#7E3AF2]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
              </RouterNavLink>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
