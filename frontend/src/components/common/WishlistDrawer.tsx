import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import type { Product } from '../../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#D4C4ED] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-6 border-b border-[#D4C4ED]/60 flex items-center justify-between bg-[#EFE9F6]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-lg font-bold text-[#18181B]">My Wishlist</h2>
              <span className="bg-rose-50 text-rose-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                {wishlistItems.length} saved
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#8A8694] hover:text-[#18181B] hover:bg-[#EFE9F6] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Wishlist Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#8A8694] space-y-3">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-400">
                  <Heart className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-[#18181B]">Your wishlist is empty</p>
                <p className="text-xs">Save items you love to keep track of your favorites!</p>
              </div>
            ) : (
              wishlistItems.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-4 rounded-2xl bg-[#EFE9F6]/80 hover:bg-[#EFE9F6] border border-[#D4C4ED] shadow-xs relative transition-all group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0 border border-[#D4C4ED]/60"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#18181B] truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#8A8694] mt-0.5">{product.brand}</p>
                    <p className="text-xs font-extrabold text-[#7E3AF2] mt-1">
                      Rs. {(product.pricePerUnit || product.pricing?.amount || 0).toLocaleString()} / {product.pricingUnit || product.pricing?.unit || 'Month'}
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                        }}
                        disabled={!product.inStock}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                          product.inStock
                            ? 'bg-[#18181B] hover:bg-[#7E3AF2] text-white active:scale-95'
                            : 'bg-[#D4C4ED]/50 text-[#8A8694] cursor-not-allowed'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{product.inStock ? 'Rent Now' : 'Out of Stock'}</span>
                      </button>

                      <button
                        onClick={() => onRemoveFromWishlist(product)}
                        className="text-[#8A8694] hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
