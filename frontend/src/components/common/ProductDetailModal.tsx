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
    product?.colorVariants[0]?.name || ''
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

    setSelectedColor(product.colorVariants[0]?.name || '');
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

      <div className="relative bg-[#FAF7F2] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl z-10 border border-[#D4C4ED] animate-in zoom-in-95 duration-200 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-[#8A8694] hover:text-[#18181B] bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
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

          {/* Product Details & Actions */}
          <div className="p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7E3AF2] uppercase tracking-wider bg-[#EFE9F6] px-3 py-1 rounded-full">
                  {product.brand} • {product.category}
                </span>
                <button
                  onClick={handleWishlist}
                  className={`p-2 rounded-full transition-colors ${
                    isWishlisted ? 'text-rose-500 bg-rose-50' : 'text-[#8A8694] hover:bg-[#EFE9F6]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-[#18181B] leading-snug">
                {product.name}
              </h2>

              <div className="flex items-center gap-2">
                <div className="flex text-[#F59E0B]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 4.8) ? 'fill-current text-[#F59E0B]' : 'text-[#E4DFD6]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#18181B]">{product.rating || 4.8}</span>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#EAE4DB] space-y-1">
                <span className="text-xs font-semibold text-[#8A8694] uppercase block">
                  Rental Rate
                </span>
                <span className="text-2xl font-extrabold text-[#18181B]">
                  Rs. {(product.pricing?.amount || product.salesPrice || 999).toLocaleString()}
                  <span className="text-sm font-medium text-[#6E6A78]">
                    {' '}/ per {product.pricing?.unit || 'Month'}
                  </span>
                </span>
                <p className="text-[11px] text-amber-700 font-bold flex items-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Refundable Security Deposit: Rs. {depositAmount}</span>
                </p>
                {product.rental && (
                  <div className="pt-2 border-t border-[#EAE4DB] mt-2 grid grid-cols-2 gap-2 text-[11px] text-[#6E6A78]">
                    <div>
                      <span className="font-semibold text-[#18181B]">Operating Hours:</span>{' '}
                      {product.rental.windowStart || '10:00'} - {product.rental.windowEnd || '19:00'}
                    </div>
                    <div>
                      <span className="font-semibold text-[#18181B]">Periodicity:</span>{' '}
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
              <div className="space-y-2 bg-white p-3 rounded-2xl border border-[#D4C4ED]">
                <label className="block text-xs font-bold text-[#18181B] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#7E3AF2]" />
                  <span>Choose Rental Period</span>
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-[#6E6A78]">Start Date</span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#FAF7F2] px-2 py-1.5 border border-[#D4C4ED] rounded-xl font-medium"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6E6A78]">End Date</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#FAF7F2] px-2 py-1.5 border border-[#D4C4ED] rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Color Swatches */}
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

              {/* Size Variants */}
              {product.sizeVariants && product.sizeVariants.length > 0 && (
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
                            ? 'border-[#7E3AF2] bg-[#EFE9F6] text-[#7E3AF2] font-bold ring-1 ring-[#7E3AF2]'
                            : 'border-[#E4DFD6] hover:bg-[#FAF7F2]'
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
                className={`w-full py-3.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
                  !product.inStock
                    ? 'bg-[#E4DFD6] text-[#8A8694] cursor-not-allowed'
                    : isAdded
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#18181B] hover:bg-[#7E3AF2] text-white'
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
