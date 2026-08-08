import React from 'react';
import { X, ShoppingBag, Store, Lock } from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionMessage?: string;
  onSelectRole?: (role: 'customer' | 'vendor') => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  actionMessage = 'Please sign in to continue.',
  onSelectRole,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#EAE4DB] animate-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8A8694] hover:text-[#18181B] bg-[#FAF7F2] hover:bg-[#EFE9F6] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center font-bold shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[#18181B]">Sign In Required</h3>
            <p className="text-xs text-[#6E6A78] mt-1">{actionMessage}</p>
          </div>
        </div>

        {/* Dual Login Options: Customer vs Vendor */}
        <div className="space-y-3">
          {/* Customer Login Option */}
          <SignInButton mode="modal">
            <button
              onClick={() => onSelectRole?.('customer')}
              className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-[#EFE9F6] hover:border-[#7E3AF2] bg-[#FAF7F2] hover:bg-[#EFE9F6]/40 transition-all text-left group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#18181B] text-white flex items-center justify-center font-bold group-hover:bg-[#7E3AF2] transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#18181B]">Customer Sign In</h4>
                  <p className="text-xs text-[#8A8694]">Rent items, save cart & track orders</p>
                </div>
              </div>
            </button>
          </SignInButton>

          {/* Vendor Login Option */}
          <SignInButton mode="modal">
            <button
              onClick={() => onSelectRole?.('vendor')}
              className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-amber-200 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100/50 transition-all text-left group shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold group-hover:bg-amber-700 transition-colors">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#18181B]">Vendor Sign In</h4>
                  <p className="text-xs text-[#8A8694]">List rental products & manage listings</p>
                </div>
              </div>
            </button>
          </SignInButton>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#F4EFEA] text-center">
          <p className="text-[11px] text-[#8A8694]">
            Don't have an account?{' '}
            <SignUpButton mode="modal">
              <span className="text-[#7E3AF2] font-bold hover:underline cursor-pointer">
                Create an account
              </span>
            </SignUpButton>
          </p>
        </div>
      </div>
    </div>
  );
};
