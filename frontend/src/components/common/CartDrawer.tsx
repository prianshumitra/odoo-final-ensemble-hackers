import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Bookmark } from 'lucide-react';
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
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.pricing?.amount || item.product.salesPrice || 999) * item.quantity,
    0
  );

  const securityDeposit = 500 * cartItems.length;
  const discountAmount = couponApplied ? (subtotal * discountPercent) / 100 : 0;
  const runningTotal = subtotal - discountAmount + securityDeposit;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponApplied(true);
    setDiscountPercent(10);
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] border-l border-[#D4C4ED] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-5 border-b border-[#D4C4ED]/60 flex items-center justify-between bg-[#EFE9F6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#7E3AF2]" />
              <h2 className="text-lg font-bold text-[#18181B]">Rental Cart & Summary</h2>
              <span className="bg-[#7E3AF2] text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#8A8694] hover:text-[#18181B] hover:bg-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#8A8694] space-y-3">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#7E3AF2] shadow-xs">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-bold text-[#18181B]">Your cart is empty</p>
                <p className="text-xs">Browse our rental products to get started!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#D4C4ED] shadow-xs space-y-2"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl shrink-0 border border-[#D4C4ED]/60"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#18181B] truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] text-[#8A8694]">
                        Color: {item.selectedColor || 'Default'} • Size: {item.selectedSize || 'Standard'}
                      </p>
                      <p className="text-xs font-extrabold text-[#7E3AF2] mt-0.5">
                        Rs. {(item.product.pricing?.amount || 999).toLocaleString()} / {item.product.pricing?.unit || 'Month'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                    <div className="flex items-center bg-[#FAF7F2] border border-[#D4C4ED] rounded-lg text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-0.5 font-bold hover:bg-[#EFE9F6]"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-0.5 font-bold hover:bg-[#EFE9F6]"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => alert('Saved for later')}
                        className="text-[#7E3AF2] font-semibold hover:underline flex items-center gap-0.5 text-[11px]"
                      >
                        <Bookmark className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-0.5 text-[11px]"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Field & Totals */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-[#D4C4ED] bg-[#FAF7F2] space-y-3">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. xxxx10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-white pl-8 pr-3 py-2 text-xs border border-[#D4C4ED] rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                  />
                  <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8694]" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-[#7E3AF2] text-white text-xs font-bold rounded-xl hover:bg-[#6C2BD9]"
                >
                  Apply
                </button>
              </form>

              {couponApplied && (
                <p className="text-[11px] text-emerald-600 font-bold">Coupon Applied: 10% Off Rental Charges!</p>
              )}

              <div className="space-y-1.5 text-xs pt-1 border-t border-[#D4C4ED]/60">
                <div className="flex justify-between text-[#6E6A78]">
                  <span>Rental Subtotal:</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-amber-700 font-bold bg-amber-50 p-1.5 rounded-lg border border-amber-200 text-[11px]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Refundable Security Deposit:
                  </span>
                  <span>Rs. {securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#18181B] pt-1">
                  <span>Running Total:</span>
                  <span className="text-[#7E3AF2]">Rs. {runningTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-white border border-[#D4C4ED] text-[#18181B] text-xs font-bold rounded-xl hover:bg-[#EFE9F6]"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
