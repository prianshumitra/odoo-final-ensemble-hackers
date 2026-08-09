import React, { useEffect, useState } from 'react';
import { X, Star, ShoppingBag, Heart, Check, Calendar, ShieldCheck } from 'lucide-react';
import type { Product } from '../../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string, selectedSize?: string, startDate?: string, endDate?: string) => void;
  isSignedIn: boolean;
  userRole: 'customer' | 'vendor' | 'admin';
  onRequireAuth: (message: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onToggleWishlist,
  isWishlisted,
  onAddToCart,
  isSignedIn,
  userRole,
  onRequireAuth,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(
    product?.colorVariants?.[0]?.name || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.sizeVariants?.[0] || 'Standard'
  );
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (!product) {
      return;
    }

    setSelectedColor(product.colorVariants?.[0]?.name || '');
    setSelectedSize(product.sizeVariants?.[0] || 'Standard');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate(new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]);
    setIsAdded(false);
  }, [product]);

  if (!isOpen || !product) return null;

  const depositAmount = product.rental?.depositValue || 500;

  const handleRent = () => {
    if (!isSignedIn) {
      onRequireAuth('Please sign in as a Customer to rent items.');
      return;
    }
    if (userRole !== 'customer') {
      alert('Vendor accounts list items. Please switch to Customer mode to place rental orders.');
      return;
    }
    onAddToCart(product, selectedColor, selectedSize, startDate, endDate);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1000);
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
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="relative bg-[#FAF8F5] rounded-3xl max-w-3xl w-full overflow-hidden shadow-warm-lg z-10 border border-[#E8E4DE] animate-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#8A857F] hover:text-[#1C1C1C] bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-warm-xs transition-colors border border-[#E8E4DE]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative bg-[#F3EFE8] aspect-square md:aspect-auto flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-[#E8E4DE]">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-2xl"
            />
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-[#0A0A0A] text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Product Details & Actions */}
          <div className="p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1C1C1C] uppercase tracking-wider bg-white border border-[#E8E4DE] px-3 py-1 rounded-full shadow-2xs">
                  {product.brand} • {product.category}
                </span>
                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-full transition-colors border ${
                    isWishlisted ? 'text-rose-500 bg-rose-50 border-rose-200' : 'text-[#8A857F] hover:bg-white border-[#E8E4DE]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#1C1C1C] leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-2">
                <div className="flex text-[#E8B923]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4.8) ? 'fill-current text-[#E8B923]' : 'text-[#E8E4DE]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1C1C1C]">{product.rating || 4.8}</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#E8E4DE] space-y-1 shadow-warm-xs">
                <span className="text-xs font-bold text-[#8A857F] uppercase tracking-wider block">
                  Rental Rate
                </span>
                <span className="text-2xl font-black text-[#1C1C1C]">
                  Rs. {(product.pricing?.amount || product.salesPrice || 999).toLocaleString()}
                  <span className="text-sm font-medium text-[#8A857F]">
                    {' '}/ per {product.pricing?.unit || 'Month'}
                  </span>
                </span>
                <p className="text-[11px] text-amber-800 font-bold flex items-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E8B923]" />
                  <span>Refundable Security Deposit: Rs. {depositAmount}</span>
                </p>
                {product.rental && (
                  <div className="pt-2 border-t border-[#E8E4DE] mt-2 grid grid-cols-2 gap-2 text-[11px] text-[#8A857F]">
                    <div>
                      <span className="font-semibold text-[#1C1C1C]">Operating Hours:</span>{' '}
                      {product.rental.windowStart || '10:00'} - {product.rental.windowEnd || '19:00'}
                    </div>
                    <div>
                      <span className="font-semibold text-[#1C1C1C]">Periodicity:</span>{' '}
                      <span className="capitalize">{product.rental.periodicity || 'day'}</span>
                    </div>
                    {product.rental.lateFeeRatePerUnit ? (
                      <div className="col-span-2 text-rose-600 font-medium">
                        Late Fee Rate: Rs. {product.rental.lateFeeRatePerUnit} / unit after return time
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Rental Period Picker */}
              <div className="space-y-2 bg-white p-3 rounded-2xl border border-[#E8E4DE] shadow-warm-xs">
                <label className="block text-xs font-bold text-[#1C1C1C] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0A0A0A]" />
                  <span>Choose Rental Period</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#8A857F] font-bold">Start Date</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] px-2.5 py-1.5 border border-[#E8E4DE] rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8A857F] font-bold">End Date</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] px-2.5 py-1.5 border border-[#E8E4DE] rounded-xl font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Color Swatches */}
              {product.colorVariants && product.colorVariants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
                    Select Color: <span className="font-normal text-[#8A857F]">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {product.colorVariants?.map((variant) => (
                      <button
                        key={variant.name}
                        onClick={() => setSelectedColor(variant.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          selectedColor === variant.name
                            ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white font-bold'
                            : 'border-[#E8E4DE] bg-white text-[#1C1C1C] hover:bg-[#FAF8F5]'
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

              {/* Size Variants */}
              {product.sizeVariants && product.sizeVariants.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
                    Select Size: <span className="font-normal text-[#8A857F]">{selectedSize}</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizeVariants.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                          selectedSize === sz
                            ? 'border-[#0A0A0A] bg-[#0A0A0A] text-white font-bold'
                            : 'border-[#E8E4DE] bg-white text-[#1C1C1C] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={handleRent}
                disabled={!product.inStock}
                className={`w-full py-4 rounded-full text-xs font-black transition-all shadow-warm-md flex items-center justify-center gap-2 ${
                  !product.inStock
                    ? 'bg-[#E8E4DE] text-[#8A857F] cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white active:scale-98'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart with Security Deposit</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart & Select Duration</span>
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
