import React from 'react';
import { Link } from 'react-router-dom';
import { User, ShoppingBag, Settings, LogOut, ChevronRight } from 'lucide-react';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]" 
        onClick={onClose} 
      />

      {/* Menu Card */}
      <div className="absolute right-0 top-full mt-3 w-64 z-50 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="p-3 border-b border-[#F4EFEA] mb-1">
          <p className="text-xs font-medium text-[#8A8694] uppercase tracking-wider">Signed in as</p>
          <p className="text-sm font-semibold text-[#1E1B26] truncate">alex.wombat@example.com</p>
          <span className="inline-block mt-1 text-[11px] font-medium bg-[#EFE9F6] text-[#7E3AF2] px-2 py-0.5 rounded-full">
            Premium Member
          </span>
        </div>

        <div className="space-y-1">
          <Link
            to="/account"
            onClick={onClose}
            className="flex items-center justify-between w-full px-3 py-2 text-sm text-[#3E3A47] hover:bg-[#FAF7F2] hover:text-[#7E3AF2] rounded-xl transition-colors font-medium group"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-[#8A8694] group-hover:text-[#7E3AF2]" />
              <span>My account / My Profile</span>
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
              <span>My Orders</span>
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
              alert('Signed out successfully');
            }}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};
