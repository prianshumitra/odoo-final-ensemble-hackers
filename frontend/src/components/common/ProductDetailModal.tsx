import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check } from 'lucide-react';
import type { Product } from '../../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  isSignedIn: boolean;
  userRole: 'customer' | 'vendor';
  onRequireAuth: (message: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  isSignedIn,
  userRole,
  onRequireAuth,
}) => {
  if (!isOpen || !product) return null;

  const [selectedColor, setSelectedColor] = useState<string>(
    product.colorVariants[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizeVariants?.[0] || ''
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleRent = () => {
    if (!isSignedIn) {
      onRequireAuth('Please sign in as a Customer to rent items.');
      return;
    }
    if (userRole === 'vendor') {
      alert('Vendor accounts list items. Please switch to Customer mode to place rental orders.');
      return;
    }
    onAddToCart(product, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleWishlist = () => {
    if (!isSignedIn) {
      onRequireAuth('Please sign in to save items to your wishlist.');
      return;
    }
    onToggleWishlist(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FAF7F2] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 border border-[#D4C4ED] animate-in zoom-in-95 duration-200 my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#8A8694] hover:text-[#18181B] bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Product Image */}
          <div className="relative bg-[#FAF7F2] aspect-square md:aspect-auto flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#EAE4DB]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl shadow-sm"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-[#18181B] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              {/* Brand & Category */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7E3AF2] uppercase tracking-wider bg-[#EFE9F6] px-3 py-1 rounded-full">
                  {product.brand} • {product.category}
                </span>
                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-full transition-colors ${
                    isWishlisted ? 'text-rose-500 bg-rose-50' : 'text-[#8A8694] hover:bg-[#EFE9F6]'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] leading-snug">
                {product.name}
              </h2>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-current text-[#F59E0B]'
                          : 'text-[#E4DFD6]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#18181B]">{product.rating}</span>
                <span className="text-xs text-[#8A8694]">({product.reviewsCount} customer reviews)</span>
              </div>

              {/* Pricing Display */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE4DB]">
                <span className="text-xs font-semibold text-[#8A8694] uppercase block">
                  Rental Rate
                </span>
                <span className="text-2xl font-extrabold text-[#18181B]">
                  Rs. {product.pricing.amount.toLocaleString()}
                  <span className="text-sm font-medium text-[#6E6A78]">
                    {' '}/ per {product.pricing.unit}
                  </span>
                </span>
                <p className="text-[11px] text-[#8A8694] mt-1">
                  Tenure: <strong>{product.duration}</strong> • Free maintenance included
                </p>
              </div>

              {/* Color Variants Selection */}
              {product.colorVariants && product.colorVariants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#18181B] uppercase tracking-wider">
                    Select Color: <span className="font-normal text-[#7E3AF2]">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colorVariants.map((variant) => (
                      <button
                        key={variant.name}
                        onClick={() => setSelectedColor(variant.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          selectedColor === variant.name
                            ? 'border-[#7E3AF2] bg-[#EFE9F6] text-[#7E3AF2] font-bold ring-1 ring-[#7E3AF2]'
                            : 'border-[#E4DFD6] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10"
                          style={{ backgroundColor: variant.hex }}
                        />
                        <span>{variant.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Variants Selection */}
              {product.sizeVariants && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#18181B] uppercase tracking-wider">
                    Select Size: <span className="font-normal text-[#7E3AF2]">{selectedSize}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.sizeVariants.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          selectedSize === sz
                            ? 'border-[#7E3AF2] bg-[#EFE9F6] text-[#7E3AF2] font-bold'
                            : 'border-[#E4DFD6] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#18181B] uppercase tracking-wider">Description</h4>
                <p className="text-xs text-[#6E6A78] leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#F4EFEA] space-y-3">
              <button
                onClick={handleRent}
                disabled={!product.inStock}
                className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  !product.inStock
                    ? 'bg-[#E4DFD6] text-[#8A8694] cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : userRole === 'vendor'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-[#18181B] hover:bg-[#7E3AF2] text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Item Added to Rental Cart</span>
                  </>
                ) : userRole === 'vendor' ? (
                  <span>Vendor Inventory View (Read Only)</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Rent This Item Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
