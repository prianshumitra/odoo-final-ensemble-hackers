import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { VendorSidebar } from '../../components/vendor/VendorSidebar';
import { Menu, Bell, Store } from 'lucide-react';
import { useUser } from '@clerk/react';
import { ProfileDropdown } from '../../components/common/ProfileDropdown';

interface VendorLayoutProps {
  userRole: 'customer' | 'vendor';
  onToggleRole: () => void;
  onOpenAddProduct: () => void;
}

export const VendorLayout: React.FC<VendorLayoutProps> = ({
  userRole,
  onToggleRole,
  onOpenAddProduct,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleRoleToggle = () => {
    onToggleRole();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B26] flex">
      {/* Sidebar Navigation */}
      <VendorSidebar
        onToggleRole={handleRoleToggle}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar — Glassmorphic Light Purple / Off-white */}
        <header className="sticky top-0 z-30 bg-[#EFE9F6]/75 backdrop-blur-xl backdrop-saturate-150 border-b border-[#D4C4ED]/60 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-[#8A8694] hover:text-[#18181B] bg-[#EFE9F6] rounded-xl lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse hidden sm:inline-block" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#7E3AF2]">
                Vendor Dashboard
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddProduct}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>+ Add Product</span>
            </button>

            <button
              onClick={() => navigate('/vendor/notifications')}
              className="p-2 text-[#8A8694] hover:text-[#7E3AF2] bg-[#EFE9F6] rounded-xl relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#7E3AF2]" />
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#EFE9F6] border border-[#D4C4ED] hover:border-[#7E3AF2] transition-all"
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt="Vendor Avatar"
                    className="w-7 h-7 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-[#7E3AF2] text-white flex items-center justify-center font-extrabold text-xs">
                    {(user?.firstName?.[0] || 'V').toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-[#18181B] hidden md:inline-block pr-1">
                  {user?.firstName || 'Vendor'}
                </span>
              </button>

              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                userRole={userRole}
                onToggleRole={handleRoleToggle}
                onOpenVendorModal={onOpenAddProduct}
              />
            </div>
          </div>
        </header>

        {/* Nested Vendor Route Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
