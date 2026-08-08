import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartItem } from '../../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.pricing.amount * item.quantity,
    0
  );

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
              <ShoppingBag className="w-5 h-5 text-[#7E3AF2]" />
              <h2 className="text-lg font-bold text-[#18181B]">Rental Cart</h2>
              <span className="bg-[#EFE9F6] text-[#7E3AF2] text-xs font-bold px-2.5 py-0.5 rounded-full">
                {cartItems.length} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#8A8694] hover:text-[#18181B] hover:bg-[#EFE9F6] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#8A8694] space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] flex items-center justify-center text-[#C4BBB0]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-[#18181B]">Your cart is empty</p>
                <p className="text-xs">Select items from our catalog to start renting today!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 rounded-2xl bg-[#EFE9F6]/80 hover:bg-[#EFE9F6] border border-[#D4C4ED] shadow-xs relative transition-all group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0 border border-[#D4C4ED]/60"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#18181B] truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-[#8A8694] mt-0.5">
                      Color: {item.selectedColor || 'Default'}
                      {item.selectedSize ? ` • Size: ${item.selectedSize}` : ''}
                    </p>
                    <p className="text-xs font-extrabold text-[#7E3AF2] mt-1">
                      Rs. {item.product.pricing.amount.toLocaleString()} / {item.product.pricing.unit}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center bg-white border border-[#E4DFD6] rounded-lg">
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="px-2 py-0.5 text-xs text-[#18181B] hover:bg-[#EFE9F6] font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-[#18181B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            onUpdateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 py-0.5 text-xs text-[#18181B] hover:bg-[#EFE9F6] font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 p-1 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[#EAE4DB] bg-[#FAF7F2] space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#8A8694] font-medium">Estimated Monthly Subtotal</span>
                <span className="text-lg font-extrabold text-[#18181B]">
                  Rs. {totalAmount.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => alert('Proceeding to checkout...')}
                className="w-full py-3.5 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
