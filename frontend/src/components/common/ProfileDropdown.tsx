import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LogOut, Settings, ShoppingBag, Store, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'customer' | 'vendor' | 'admin';
  onOpenVendorModal: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  userRole,
  onOpenVendorModal,
}) => {
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const email = user?.email || 'user@example.com';
  const name = user?.name || email.split('@')[0];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />

      <div
        ref={dropdownRef}
        className="absolute right-0 top-full mt-3 w-72 z-50 rounded-3xl bg-[#FAF7F2] p-2.5 shadow-2xl border border-[#D4C4ED] animate-in fade-in slide-in-from-top-2 duration-150 space-y-1"
      >
        <div className="p-3.5 rounded-2xl bg-[#EFE9F6] border border-[#D4C4ED]/60 mb-2">
          <p className="text-[10px] font-extrabold text-[#8A8694] uppercase tracking-wider">Signed in as</p>
          <p className="text-sm font-extrabold text-[#18181B] truncate mt-0.5">{name}</p>
          <p className="text-xs text-[#6E6A78] truncate font-medium">{email}</p>

          <div className="mt-2.5 pt-2 border-t border-[#D4C4ED]/40 flex items-center justify-between">
            <span
              className={`inline-block text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                userRole === 'vendor' || userRole === 'admin'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-[#7E3AF2] text-white border-[#7E3AF2]'
              }`}
            >
              {userRole === 'vendor'
                ? 'Registered Vendor'
                : userRole === 'admin'
                ? 'Administrator'
                : 'Registered Customer'}
            </span>
          </div>
        </div>

        <div className="space-y-0.5">
          {(userRole === 'vendor' || userRole === 'admin') && (
            <>
              <Link
                to="/vendor"
                onClick={onClose}
                className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs text-[#7E3AF2] bg-[#EFE9F6]/60 hover:bg-[#EFE9F6] rounded-xl transition-all font-bold group border border-[#D4C4ED]/50"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-[#7E3AF2]" />
                  <span>Vendor Operations Console</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#7E3AF2]" />
              </Link>

              <button
                onClick={() => {
                  onClose();
                  onOpenVendorModal();
                }}
                className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs text-[#18181B] hover:bg-[#EFE9F6] hover:text-[#7E3AF2] rounded-xl transition-all font-bold group"
              >
                <div className="flex items-center gap-2.5">
                  <Store className="w-4 h-4 text-[#8A8694] group-hover:text-[#7E3AF2]" />
                  <span>+ List New Product</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-[#8A8694] group-hover:text-[#7E3AF2]" />
              </button>
            </>
          )}

          {userRole === 'customer' && (
            <Link
              to="/orders"
              onClick={onClose}
              className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs text-[#18181B] hover:bg-[#EFE9F6] hover:text-[#7E3AF2] rounded-xl transition-colors font-bold group"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#8A8694] group-hover:text-[#7E3AF2]" />
                <span>My Orders / Rentals</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#8A8694] group-hover:text-[#7E3AF2]" />
            </Link>
          )}

          <Link
            to="/account"
            onClick={onClose}
            className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs text-[#18181B] hover:bg-[#EFE9F6] hover:text-[#7E3AF2] rounded-xl transition-colors font-bold group"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#8A8694] group-hover:text-[#7E3AF2]" />
              <span>My account / Profile</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#8A8694] group-hover:text-[#7E3AF2]" />
          </Link>

          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs text-[#18181B] hover:bg-[#EFE9F6] hover:text-[#7E3AF2] rounded-xl transition-colors font-bold group"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-[#8A8694] group-hover:text-[#7E3AF2]" />
              <span>Settings</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#8A8694] group-hover:text-[#7E3AF2]" />
          </Link>
        </div>

        <div className="pt-1 border-t border-[#D4C4ED]/60">
          <button
            onClick={() => {
              onClose();
              signOut();
            }}
            className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-extrabold"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};
