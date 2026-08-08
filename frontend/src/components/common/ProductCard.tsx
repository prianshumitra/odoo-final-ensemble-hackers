import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colorVariants[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizeVariants?.[0] || ''
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    onAddToCart(product, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group bg-[#EFE9F6] rounded-3xl p-4 border border-[#D4C4ED] hover:border-[#7E3AF2] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Top Image Container */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#FAF7F2] mb-3 group-hover:shadow-inner">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !product.inStock ? 'opacity-50 grayscale' : ''
          }`}
          loading="lazy"
        />

        {/* Out of Stock Overlay / Badge */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-[#18181B] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 tracking-wider uppercase">
              Out of stock
            </span>
          </div>
        )}

        {/* Wishlist Floating Button */}
        <button
          onClick={() => onToggleWishlist(product)}
          className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 focus:outline-none ${
            isWishlisted
              ? 'bg-rose-500 text-white scale-110'
              : 'bg-white/80 text-[#3E3A47] hover:bg-white hover:text-rose-500'
          }`}
          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Size variants tag overlay if TV or multi-size product */}
        {product.sizeVariants && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/50 text-[11px] font-semibold text-[#18181B] flex items-center justify-between shadow-sm">
            <span className="text-[#8A8694] text-[10px] uppercase font-bold">Sizes:</span>
            <div className="flex gap-1">
              {product.sizeVariants.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-1.5 py-0.5 rounded ${
                    selectedSize === sz
                      ? 'bg-[#18181B] text-white font-bold'
                      : 'hover:bg-[#EFE9F6] text-[#3E3A47]'
                  }`}
                >
                  {sz.replace(' inch', '"')}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Color Variant Swatches below image (Annotated in Wireframe) */}
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-1.5">
          {product.colorVariants.map((variant) => (
            <button
              key={variant.name}
              onClick={() => setSelectedColor(variant.name)}
              title={variant.name}
              className={`w-3.5 h-3.5 rounded-full transition-transform border border-black/10 ${
                selectedColor === variant.name
                  ? 'scale-125 ring-2 ring-[#7E3AF2] ring-offset-1'
                  : 'hover:scale-110'
              }`}
              style={{ backgroundColor: variant.hex }}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold text-[#8A8694] uppercase tracking-wide">
          {product.brand}
        </span>
      </div>

      {/* Product Title */}
      <h3 className="text-sm font-bold text-[#1E1B26] line-clamp-2 hover:text-[#7E3AF2] transition-colors mb-1.5">
        {product.name}
      </h3>

      {/* Rating & Review Count (Image 1 Aesthetics) */}
      <div className="flex items-center gap-1 mb-3">
        <div className="flex text-[#F59E0B]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(product.rating)
                  ? 'fill-current text-[#F59E0B]'
                  : 'text-[#E4DFD6]'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-bold text-[#18181B] ml-1">
          {product.rating}
        </span>
        <span className="text-[11px] text-[#8A8694]">
          ({product.reviewsCount})
        </span>
      </div>

      {/* Bottom Pricing & Add to Cart Action */}
      <div className="pt-2 border-t border-[#D4C4ED]/60 flex items-center justify-between mt-auto">
        <div>
          <span className="text-xs font-semibold text-[#8A8694] block text-[11px] uppercase">
            Rental Rate
          </span>
          <span className="text-base font-extrabold text-[#18181B]">
            Rs. {product.pricing.amount.toLocaleString()}
            <span className="text-xs font-medium text-[#6E6A78]">
              {' '}/ per {product.pricing.unit}
            </span>
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            !product.inStock
              ? 'bg-[#E4DFD6] text-[#8A8694] cursor-not-allowed'
              : isAdded
              ? 'bg-emerald-600 text-white'
              : 'bg-[#18181B] text-white hover:bg-[#7E3AF2] hover:shadow-md active:scale-95'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added</span>
            </>
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
