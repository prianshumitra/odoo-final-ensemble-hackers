import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, PlusCircle, Store, UserCheck } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import { Show, SignInButton, UserButton, useUser } from '@clerk/react';
import logoImg from '../../assets/logo.png';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenVendorModal: () => void;
  userRole: 'customer' | 'vendor';
  onToggleRole: () => void;
  onSelectRole: (role: 'customer' | 'vendor') => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenVendorModal,
  userRole,
  onToggleRole,
  onSelectRole,
}) => {
  const location = useLocation();
  const { user } = useUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Products', path: '/' },
    { name: 'Terms & Condition', path: '/terms' },
    { name: 'About us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#EFE9F6]/65 backdrop-blur-xl backdrop-saturate-150 border-b border-[#D4C4ED]/60 shadow-[0_4px_20px_rgba(126,58,242,0.05)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-6 shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 group focus:outline-none"
            >
              <img
                src={logoImg}
                alt="Logo"
                className="h-16 sm:h-[72px] w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-sm font-semibold">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`relative py-1 transition-colors duration-200 ${
                      isActive 
                        ? 'text-[#18181B] font-bold' 
                        : 'text-[#6E6A78] hover:text-[#7E3AF2]'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#7E3AF2] rounded-full animate-in fade-in duration-200" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-2 hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search furniture, electronics & gadgets..."
                className="w-full bg-[#FAF7F2] text-[#1E1B26] placeholder-[#8A8694] text-sm rounded-full pl-10 pr-10 py-2.5 border border-[#C4B2E2] focus:outline-none focus:border-[#7E3AF2] focus:ring-2 focus:ring-[#7E3AF2]/20 transition-all shadow-xs"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8694] hover:text-[#18181B] p-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: Vendor Portal, Wishlist, Cart & Auth Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Vendor Only Action: List Item to Rent */}
            {userRole === 'vendor' && (
              <button
                onClick={onOpenVendorModal}
                className="hidden sm:flex items-center gap-1.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm group animate-in fade-in"
                title="List a new product for rent"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>List Item to Rent</span>
              </button>
            )}

            {/* Role Badge (When Signed In) */}
            <Show when="signed-in">
              <button
                onClick={onToggleRole}
                className={`hidden md:flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${
                  userRole === 'vendor'
                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-[#EFE9F6] text-[#7E3AF2] border-[#D4C4ED]'
                }`}
                title="Toggle Customer / Vendor Mode"
              >
                <Store className="w-3.5 h-3.5" />
                <span>{userRole === 'vendor' ? 'Vendor Mode' : 'Customer Mode'}</span>
              </button>
            </Show>

            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full text-[#3E3A47] hover:bg-white/80 hover:text-[#7E3AF2] transition-colors focus:outline-none"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-[#7E3AF2] rounded-full shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-[#3E3A47] hover:bg-white/80 hover:text-[#7E3AF2] transition-colors focus:outline-none"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-[#18181B] rounded-full shadow-sm">
                {cartCount}
              </span>
            </button>

            {/* Auth Section with Clerk */}
            <div className="relative ml-1 flex items-center gap-2">
              <Show when="signed-in">
                <div className="flex items-center gap-2">
                  <UserButton userProfileMode="modal" />
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#3E3A47] hover:text-[#7E3AF2] p-1 rounded-lg"
                  >
                    <span className="hidden sm:inline font-bold truncate max-w-[100px]">
                      {user?.firstName || user?.primaryEmailAddress?.emailAddress?.split('@')[0]}
                    </span>
                  </button>
                </div>
              </Show>

              <Show when="signed-out">
                <div className="flex items-center gap-2">
                  {/* Separate Customer Login */}
                  <SignInButton mode="modal">
                    <button
                      onClick={() => onSelectRole('customer')}
                      className="flex items-center gap-1.5 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
                      title="Sign in to rent items"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Customer Sign In</span>
                    </button>
                  </SignInButton>

                  {/* Separate Vendor Login */}
                  <SignInButton mode="modal">
                    <button
                      onClick={() => onSelectRole('vendor')}
                      className="hidden sm:flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-sm"
                      title="Sign in to list products"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Vendor Login</span>
                    </button>
                  </SignInButton>
                </div>
              </Show>

              {/* Profile Dropdown Menu */}
              <ProfileDropdown 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
                userRole={userRole}
                onToggleRole={onToggleRole}
                onOpenVendorModal={onOpenVendorModal}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#3E3A47] rounded-xl hover:bg-white/80"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 sm:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search items..."
              className="w-full bg-[#FAF7F2] text-[#1E1B26] placeholder-[#8A8694] text-sm rounded-full pl-10 pr-4 py-2 border border-[#C4B2E2] focus:outline-none focus:border-[#7E3AF2]"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE4DB] py-3 space-y-2 animate-in slide-in-from-top-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-semibold rounded-xl ${
                  location.pathname === link.path
                    ? 'bg-[#EFE9F6] text-[#7E3AF2]'
                    : 'text-[#3E3A47] hover:bg-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
