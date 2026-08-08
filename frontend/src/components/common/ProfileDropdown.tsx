import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Settings, LogOut, ChevronRight, Store } from 'lucide-react';
import { useUser, useClerk } from '@clerk/react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'customer' | 'vendor';
  onToggleRole: () => void;
  onOpenVendorModal: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  userRole,
  onToggleRole,
  onOpenVendorModal,
}) => {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!isOpen) return null;

  const email = user?.primaryEmailAddress?.emailAddress || 'alex.wombat@example.com';
  const name = user?.fullName || email.split('@')[0];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]" 
        onClick={onClose} 
      />

      {/* Menu Card */}
      <div className="absolute right-0 top-full mt-3 w-72 z-50 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="p-3 border-b border-[#F4EFEA] mb-1">
          <p className="text-xs font-medium text-[#8A8694] uppercase tracking-wider">Signed in as</p>
          <p className="text-sm font-bold text-[#1E1B26] truncate">{name}</p>
          <p className="text-xs text-[#6E6A78] truncate">{email}</p>
          
          <div className="mt-2 flex items-center justify-between">
            <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
              userRole === 'vendor' ? 'bg-amber-100 text-amber-800' : 'bg-[#EFE9F6] text-[#7E3AF2]'
            }`}>
              {userRole === 'vendor' ? '🏪 Vendor Mode' : '🛒 Customer Mode'}
            </span>
            <button
              onClick={onToggleRole}
              className="text-xs text-[#7E3AF2] hover:underline font-semibold"
            >
              Switch to {userRole === 'vendor' ? 'Customer' : 'Vendor'}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          {userRole === 'vendor' && (
            <button
              onClick={() => {
                onClose();
                onOpenVendorModal();
              }}
              className="flex items-center justify-between w-full px-3 py-2 text-sm text-[#7E3AF2] bg-[#EFE9F6]/50 hover:bg-[#EFE9F6] rounded-xl transition-colors font-bold group"
            >
              <div className="flex items-center gap-2.5">
                <Store className="w-4 h-4 text-[#7E3AF2]" />
                <span>+ List New Product</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#7E3AF2]" />
            </button>
          )}

          <Link
            to="/account"
            onClick={onClose}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-[#3E3A47] hover:bg-[#FAF7F2] hover:text-[#7E3AF2] rounded-xl transition-colors font-medium group"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#8A8694] group-hover:text-[#7E3AF2]" />
              <span>My account / Profile</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#C4BBB0] group-hover:text-[#7E3AF2]" />
          </Link>

          <Link
            to="/orders"
            onClick={onClose}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-[#3E3A47] hover:bg-[#FAF7F2] hover:text-[#7E3AF2] rounded-xl transition-colors font-medium group"
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4 text-[#8A8694] group-hover:text-[#7E3AF2]" />
              <span>My Orders / Rentals</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#C4BBB0] group-hover:text-[#7E3AF2]" />
          </Link>

          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-[#3E3A47] hover:bg-[#FAF7F2] hover:text-[#7E3AF2] rounded-xl transition-colors font-medium group"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-[#8A8694] group-hover:text-[#7E3AF2]" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#C4BBB0] group-hover:text-[#7E3AF2]" />
          </Link>
        </div>

        <div className="mt-1 pt-1 border-t border-[#F4EFEA]">
          <button
            onClick={() => {
              onClose();
              if (signOut) signOut();
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};
