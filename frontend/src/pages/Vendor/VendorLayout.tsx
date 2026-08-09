import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { VendorSidebar } from '../../components/vendor/VendorSidebar';
import { AddProductModal } from '../../components/vendor/AddProductModal';
import { Menu, Bell, Store } from 'lucide-react';
import { ProfileDropdown } from '../../components/common/ProfileDropdown';
import { useAuth } from '../../context/AuthContext';

interface VendorLayoutProps {
  userRole: 'customer' | 'vendor' | 'admin';
  onOpenAddProduct: () => void;
}

export const VendorLayout: React.FC<VendorLayoutProps> = ({
  userRole,
  onOpenAddProduct,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1C1C1C] flex">
      {/* Sidebar Navigation */}
      <VendorSidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[#E8E4DE] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-warm-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 text-[#8A857F] hover:text-[#1C1C1C] bg-[#FAF8F5] rounded-xl lg:hidden border border-[#E8E4DE]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E8B923] animate-pulse hidden sm:inline-block" />
              <span className="text-xs font-black uppercase tracking-wider text-[#1C1C1C]">
                Rental Operations Console
              </span>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddProductOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-xs font-bold rounded-full shadow-warm-xs transition-colors"
            >
              <Store className="w-3.5 h-3.5 text-[#E8B923]" />
              <span>+ Add Product</span>
            </button>

            <button
              onClick={() => navigate('/vendor/orders')}
              className="p-2 text-[#8A857F] hover:text-[#1C1C1C] bg-[#FAF8F5] border border-[#E8E4DE] rounded-full relative transition-colors"
              title="Orders & Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E8B923]" />
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E8E4DE] hover:border-[#0A0A0A] transition-all shadow-warm-xs"
              >
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Vendor Avatar"
                    className="w-7 h-7 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center font-black text-xs">
                    {(user?.firstName?.[0] || user?.name?.[0] || 'V').toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-bold text-[#1C1C1C] hidden md:inline-block pr-1">
                  {user?.firstName || user?.name || 'Vendor'}
                </span>
              </button>

              <ProfileDropdown
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                userRole={userRole}
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

      {/* Add Product Modal - mounted inside vendor layout */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onProductAdded={() => setIsAddProductOpen(false)}
        userRole={userRole}
      />
    </div>
  );
};
