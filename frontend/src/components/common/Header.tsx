import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, PlusCircle, Store, UserCheck } from 'lucide-react';
import { ProfileDropdown } from './ProfileDropdown';
import logoImg from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenVendorModal: () => void;
  userRole: 'customer' | 'vendor' | 'admin';
  onSelectRole?: (role: 'customer' | 'vendor' | 'admin') => void;
  onRequireAuth?: (message: string) => void;
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
}) => {
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Products', path: '/' },
    { name: 'Terms & Condition', path: '/terms' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ];

  // Vendor button visibility rule:
  // ONLY show when NOT signed in as a customer (i.e. guest visitor OR vendor partner)
  const isCustomerLoggedIn = isAuthenticated && userRole === 'customer';
  const showVendorButton = !isCustomerLoggedIn;

  return (
    <header className="sticky top-0 z-30 bg-[#EFE9F6]/85 backdrop-blur-xl backdrop-saturate-150 border-b-2 border-[#D4C4ED] shadow-[0_6px_15px_rgba(0,0,0,0.12)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img 
              src={logoImg} 
              alt="EZRent Logo" 
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#18181B] group-hover:text-[#7E3AF2] transition-colors leading-none font-serif">
                EZRent
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#7E3AF2] uppercase mt-0.5">
                Rental Storefront
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search rentals (e.g. Sofa, Gaming Laptop, Sony TV)..."
                className="w-full bg-white/90 text-xs font-semibold text-[#18181B] placeholder-[#8A8694] pl-10 pr-4 py-2.5 rounded-2xl border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2] focus:ring-2 focus:ring-[#7E3AF2]/20 shadow-xs transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8694] hover:text-[#18181B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#3E3A47]">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`transition-colors hover:text-[#7E3AF2] ${
                    isActive ? 'text-[#7E3AF2] font-black underline underline-offset-4' : ''
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Vendor Portal (Conditional), Wishlist, Cart & Auth Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            
            {/* Vendor Mode / Vendor Portal Button (Displayed ONLY when NOT signed in as a customer) */}
            {showVendorButton && (
              <Link
                to={userRole === 'vendor' || userRole === 'admin' ? '/vendor' : '/vendor-signup'}
                className="hidden sm:flex items-center gap-1.5 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm group"
                title={userRole === 'vendor' ? 'Go to Vendor Operations Console' : 'Partner as a Vendor'}
              >
                <Store className="w-4 h-4 text-purple-400 group-hover:text-white transition-colors" />
                <span>{userRole === 'vendor' || userRole === 'admin' ? 'Vendor Console' : 'Vendor Mode'}</span>
              </Link>
            )}

            {(userRole === 'vendor' || userRole === 'admin') && (
              <button
                onClick={onOpenVendorModal}
                className="hidden sm:flex items-center gap-1.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm"
              >
                <PlusCircle className="w-4 h-4 text-white" />
                <span>List Item</span>
              </button>
            )}

            {/* Static Role Indicator Badge */}
            {isAuthenticated && (
              <span className={`hidden md:flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${
                userRole === 'vendor' || userRole === 'admin'
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-[#EFE9F6] text-[#7E3AF2] border-[#D4C4ED]'
              }`}>
                <UserCheck className="w-3.5 h-3.5" />
                <span>{userRole === 'vendor' ? 'Vendor' : userRole === 'admin' ? 'Admin' : 'Customer'}</span>
              </span>
            )}

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

            {/* Rental Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full text-[#3E3A47] hover:bg-white/80 hover:text-[#7E3AF2] transition-colors focus:outline-none"
              title="Rental Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-[#7E3AF2] rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / Profile Button */}
            <div className="relative pl-1 border-l border-[#D4C4ED]/60">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 rounded-2xl bg-white/80 border border-[#D4C4ED] hover:border-[#7E3AF2] transition-all shadow-xs"
                  >
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name || 'User Avatar'}
                        className="w-8 h-8 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-[#7E3AF2] text-white flex items-center justify-center font-extrabold text-xs">
                        {(user?.firstName?.[0] || user?.email?.[0] || 'U').toUpperCase()}
                      </div>
                    )}
                  </button>

                  <ProfileDropdown
                    isOpen={isProfileOpen}
                    onClose={() => setIsProfileOpen(false)}
                    userRole={userRole}
                    onOpenVendorModal={onOpenVendorModal}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="text-xs font-extrabold text-[#7E3AF2] hover:bg-[#EFE9F6] px-3 py-2 rounded-xl border border-[#D4C4ED] transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="text-xs font-extrabold text-white bg-[#18181B] hover:bg-[#7E3AF2] px-3.5 py-2 rounded-xl transition-all shadow-xs"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-[#3E3A47] hover:bg-white/80 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
