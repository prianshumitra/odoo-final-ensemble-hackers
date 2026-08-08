import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  onSelectProduct?: (product: Product) => void;
  isSignedIn: boolean;
  userRole: 'customer' | 'vendor' | 'admin';
  onRequireAuth: (message: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  isSignedIn,
  userRole,
  onRequireAuth,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colorVariants[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizeVariants?.[0] || ''
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSignedIn) {
      onRequireAuth('Please sign in as a Customer to rent items.');
      return;
    }
    if (userRole !== 'customer') {
      alert('Vendor accounts are for listing products. Please switch to Customer mode to place rental orders.');
      return;
    }
    if (!product.inStock) return;
    onAddToCart(product, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSignedIn) {
      onRequireAuth('Please sign in to save items to your wishlist.');
      return;
    }
    onToggleWishlist(product);
  };

  return (
    <div 
      onClick={() => onSelectProduct?.(product)}
      className="group bg-[#FAF8F5] rounded-3xl p-4 border border-[#E8E4DE] hover:border-[#0A0A0A] shadow-warm-xs hover:shadow-warm-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:scale-[1.01]"
    >
      {/* Top Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#F3EFE8] border border-[#E8E4DE] mb-3 group-hover:shadow-inner flex items-center justify-center p-3">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 ${
            !product.inStock ? 'opacity-50 grayscale' : ''
          }`}
          loading="lazy"
        />

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-[#0A0A0A] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 tracking-wider uppercase">
              Out of stock
            </span>
          </div>
        )}

        {/* Wishlist Floating Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-warm-xs backdrop-blur-md transition-all duration-200 focus:outline-none ${
            isWishlisted
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/90 text-[#1C1C1C] hover:bg-white hover:text-rose-500'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Size variants tag */}
        {product.sizeVariants && product.sizeVariants.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-[#E8E4DE] text-[11px] font-semibold text-[#1C1C1C] flex items-center justify-between shadow-warm-xs">
            <span className="text-[#8A857F] text-[10px] uppercase font-bold">Sizes:</span>
            <div className="flex gap-1 overflow-hidden">
              {product.sizeVariants.slice(0, 4).map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(sz);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                    selectedSize === sz
                      ? 'bg-[#0A0A0A] text-white font-bold'
                      : 'hover:bg-[#F3EFE8] text-[#1C1C1C]'
                  }`}
                >
                  {sz.replace(' inch', '"')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Color Variant Swatches & Brand */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-1.5">
          {product.colorVariants.map((variant) => (
            <button
              key={variant.name}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedColor(variant.name);
              }}
              title={variant.name}
              className={`w-3.5 h-3.5 rounded-full transition-transform border border-black/10 ${
                selectedColor === variant.name
                  ? 'scale-125 ring-2 ring-[#0A0A0A] ring-offset-1'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: variant.hex }}
            />
          ))}
        </div>
        <span className="text-[11px] font-bold text-[#8A857F] uppercase tracking-wide">
          {product.brand}
        </span>
      </div>

      {/* Product Title */}
      <h3 className="text-sm font-black text-[#1C1C1C] line-clamp-2 hover:text-[#8A857F] transition-colors mb-1.5">
        {product.name}
      </h3>

      {/* Rating & Review Count */}
      <div className="flex items-center gap-1 mb-3">
        <div className="flex text-[#E8B923]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating || 4.8)
                  ? 'fill-current text-[#E8B923]'
                  : 'text-[#E8E4DE]'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-[#1C1C1C] ml-1">
          {product.rating || 4.8}
        </span>
        <span className="text-[11px] font-medium text-[#8A857F]">
          ({product.reviewsCount || 42})
        </span>
      </div>

      {/* Bottom Pricing & Add to Cart Action */}
      <div className="pt-2.5 border-t border-[#E8E4DE] flex items-center justify-between mt-auto">
        <div>
          <span className="text-[10px] font-bold text-[#8A857F] block uppercase tracking-wider">
            Rental Rate
          </span>
          <span className="text-base font-black text-[#1C1C1C]">
            Rs. {product.pricing.amount.toLocaleString()}
            <span className="text-xs font-medium text-[#8A857F]">
              {' '}/ per {product.pricing.unit}
            </span>
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-warm-xs ${
            !product.inStock
              ? 'bg-[#E8E4DE] text-[#8A857F] cursor-not-allowed'
              : isAdded
              ? 'bg-emerald-600 text-white'
              : userRole !== 'customer'
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'bg-[#0A0A0A] text-white hover:bg-[#2A2A2A] hover:shadow-warm-md active:scale-95'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
          ) : userRole !== 'customer' ? (
            <span>Vendor View</span>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{product.inStock ? 'Rent' : 'Unavailable'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
