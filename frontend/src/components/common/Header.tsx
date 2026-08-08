import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
}) => {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Products', path: '/' },
    { name: 'Terms & Condition', path: '/terms' },
    { name: 'About us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE4DB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-6 shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-2 group focus:outline-none"
            >
              <div className="flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-[#18181B] text-white font-bold tracking-tight shadow-md group-hover:bg-[#7E3AF2] transition-colors">
                <span className="text-xs uppercase tracking-widest text-[#D4C4ED] group-hover:text-white mr-1.5 font-semibold">BR.F</span>
                <span className="font-extrabold text-sm tracking-wide">Your Logo</span>
              </div>
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
                className="w-full bg-[#FAF7F2] text-[#1E1B26] placeholder-[#A09BA6] text-sm rounded-full pl-10 pr-10 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2] focus:ring-2 focus:ring-[#EFE9F6] transition-all shadow-inner"
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

          {/* Right Actions: Wishlist, Cart & Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Wishlist Icon */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-full text-[#3E3A47] hover:bg-[#EFE9F6] hover:text-[#7E3AF2] transition-colors focus:outline-none"
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
              className="relative p-2.5 rounded-full text-[#3E3A47] hover:bg-[#EFE9F6] hover:text-[#7E3AF2] transition-colors focus:outline-none"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-[#18181B] rounded-full shadow-sm">
                {cartCount}
              </span>
            </button>

            {/* User Profile Avatar with Dropdown */}
            <div className="relative ml-1">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[#EFE9F6] transition-all focus:outline-none ring-2 ring-transparent focus:ring-[#7E3AF2]"
                title="User Profile"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3E3A47] to-[#18181B] flex items-center justify-center text-white text-xs font-bold shadow-md border-2 border-white">
                  AW
                </div>
              </button>

              <ProfileDropdown 
                isOpen={isProfileOpen} 
                onClose={() => setIsProfileOpen(false)} 
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#3E3A47] rounded-xl hover:bg-[#EFE9F6]"
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
              className="w-full bg-[#FAF7F2] text-[#1E1B26] placeholder-[#A09BA6] text-sm rounded-full pl-10 pr-4 py-2 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
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
