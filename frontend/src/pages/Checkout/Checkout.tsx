import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Store, CreditCard, ShieldCheck, MapPin, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react';
import type { CartItem } from '../../types';
import { orderService } from '../../services/api';

interface CheckoutProps {
  cartItems: CartItem[];
  user: any;
  onOrderCompleted: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cartItems, user, onOrderCompleted }) => {
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');

  // Address State
  const [deliveryMethod, setDeliveryMethod] = useState<'Standard Delivery' | 'Pick up from Store'>('Standard Delivery');
  const [street, setStreet] = useState('123 Innovation Boulevard, Suite 400');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [zip, setZip] = useState('400001');
  const [country, setCountry] = useState('India');
  const [sameBillingAddress, setSameBillingAddress] = useState(true);

  // Billing Address (if different)
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity] = useState('Mumbai');

  // Payment State
  const [payMethod, setPayMethod] = useState<'card' | 'saved_card'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('***');
  const [savePaymentDetails, setSavePaymentDetails] = useState(true);

  // Completed Order info
  const [completedOrderRef, setCompletedOrderRef] = useState('');
  const [loading, setLoading] = useState(false);

  // Summary Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.pricing?.amount || 0) * item.quantity,
    0
  );
  const deliveryCharge = deliveryMethod === 'Standard Delivery' ? 150 : 0;
  const securityDeposit = 500 * (cartItems.length || 1);
  const taxRate = 10;
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount + deliveryCharge + securityDeposit;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderLines = cartItems.map((item) => ({
        product: item.product.id || (item.product as any)._id,
        productName: item.product.name,
        productImage: item.product.image,
        variant: `${item.selectedColor || 'Default'} / ${item.selectedSize || 'Standard'}`,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        quantity: item.quantity,
        unit: item.product.pricing?.unit || 'Month',
        unitPrice: item.product.pricing?.amount || 0,
        amount: (item.product.pricing?.amount || 0) * item.quantity,
      }));

      const res = await orderService.createOrder({
        customerName: user?.fullName || user?.name || 'Valued Customer',
        customerEmail: user?.primaryEmailAddress?.emailAddress || user?.email || 'customer@example.com',
        deliveryMethod,
        invoiceAddress: sameBillingAddress
          ? { street, city, state, zip, country }
          : { street: billingStreet || street, city: billingCity || city, state, zip, country },
        deliveryAddress: { street, city, state, zip, country },
        lines: orderLines,
        taxRate,
        securityDepositAmount: securityDeposit,
      });

      if (res._id) {
        await orderService.confirmOrder(res._id);
        setCompletedOrderRef(res.orderRef || 'SO0010');
      } else {
        setCompletedOrderRef('SO0010');
      }

      onOrderCompleted();
      setStep('confirmation');
    } catch (err: any) {
      alert('Error creating order: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#6E6A78] mb-8">
        <Link to="/" className="hover:text-[#7E3AF2]">Order</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className={step === 'address' ? 'text-[#7E3AF2]' : ''}>Address & Fulfillment</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className={step === 'payment' ? 'text-[#7E3AF2]' : ''}>Payment Details</span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className={step === 'confirmation' ? 'text-[#7E3AF2]' : ''}>Confirmation</span>
      </div>

      {step === 'confirmation' ? (
        <div className="max-w-xl mx-auto bg-[#FAF7F2] p-10 rounded-3xl border border-[#D4C4ED] shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-[#18181B]">Thank You For Your Order!</h2>
            <p className="text-sm font-semibold text-[#7E3AF2] mt-1">Your Payment has been successfully processed</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]/60 space-y-2 text-xs text-left">
            <div className="flex justify-between border-b pb-2">
              <span className="text-[#6E6A78]">Order Reference:</span>
              <span className="font-extrabold text-[#18181B]">{completedOrderRef}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-[#6E6A78]">Delivery Method:</span>
              <span className="font-bold">{deliveryMethod}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-[#6E6A78]">Security Deposit Held:</span>
              <span className="font-bold text-amber-600">Rs. {securityDeposit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-sm text-[#7E3AF2]">
              <span>Total Paid:</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              to="/orders"
              className="px-6 py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              View My Orders & Download Invoice
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-white border border-[#D4C4ED] text-[#18181B] hover:bg-[#EFE9F6] text-xs font-bold rounded-xl transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 'address' ? (
              <form onSubmit={handleProceedToPayment} className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#D4C4ED] shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#18181B] flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#7E3AF2]" />
                    <span>Choose Delivery Method</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('Standard Delivery')}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        deliveryMethod === 'Standard Delivery'
                          ? 'border-[#7E3AF2] bg-[#EFE9F6]/80 text-[#7E3AF2] ring-2 ring-[#7E3AF2]'
                          : 'border-[#D4C4ED] bg-white text-[#6E6A78]'
                      }`}
                    >
                      <Truck className="w-5 h-5 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-[#18181B]">Standard Delivery</p>
                        <p className="text-[11px]">Doorstep dispatch (Rs. 150)</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('Pick up from Store')}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        deliveryMethod === 'Pick up from Store'
                          ? 'border-[#7E3AF2] bg-[#EFE9F6]/80 text-[#7E3AF2] ring-2 ring-[#7E3AF2]'
                          : 'border-[#D4C4ED] bg-white text-[#6E6A78]'
                      }`}
                    >
                      <Store className="w-5 h-5 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-[#18181B]">Pick up from Store</p>
                        <p className="text-[11px] text-emerald-600 font-bold">FREE Store Pickup</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-extrabold text-[#18181B] flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-[#7E3AF2]" />
                    <span>Delivery Address</span>
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-white px-4 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#18181B] mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-white px-4 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#18181B] mb-1">State / Province</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-white px-4 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#18181B] mb-1">Zip / Postal Code</label>
                        <input
                          type="text"
                          required
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full bg-white px-4 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#18181B] mb-1">Country</label>
                        <input
                          type="text"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-white px-4 py-2.5 border border-[#D4C4ED] text-xs font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#D4C4ED]/60">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#18181B]">
                    <input
                      type="checkbox"
                      checked={sameBillingAddress}
                      onChange={(e) => setSameBillingAddress(e.target.checked)}
                      className="accent-[#7E3AF2] w-4 h-4 rounded"
                    />
                    <span>Billing and Delivery address are the same</span>
                  </label>

                  {!sameBillingAddress && (
                    <div className="mt-3 space-y-3 p-4 bg-white rounded-2xl border border-[#D4C4ED]">
                      <h4 className="text-xs font-bold text-[#7E3AF2]">Separate Billing Address</h4>
                      <div>
                        <label className="block text-xs font-bold text-[#18181B] mb-1">Billing Street</label>
                        <input
                          type="text"
                          value={billingStreet}
                          onChange={(e) => setBillingStreet(e.target.value)}
                          className="w-full bg-white px-3 py-2 border border-[#D4C4ED] text-xs rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handlePayNow} className="bg-[#FAF7F2] p-8 rounded-3xl border border-[#D4C4ED] shadow-xl space-y-6">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="flex items-center gap-1 text-xs font-bold text-[#7E3AF2] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address & Fulfillment</span>
                </button>

                <div>
                  <h2 className="text-xl font-extrabold text-[#18181B] flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#7E3AF2]" />
                    <span>Payment Options</span>
                  </h2>

                  <div className="flex gap-4 mt-3">
                    <button
                      type="button"
                      onClick={() => setPayMethod('card')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                        payMethod === 'card' ? 'bg-[#7E3AF2] text-white border-[#7E3AF2]' : 'bg-white text-[#6E6A78]'
                      }`}
                    >
                      Credit / Debit Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayMethod('saved_card')}
                      className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                        payMethod === 'saved_card' ? 'bg-[#7E3AF2] text-white border-[#7E3AF2]' : 'bg-white text-[#6E6A78]'
                      }`}
                    >
                      Pay with Saved Card
                    </button>
                  </div>
                </div>

                <div className="space-y-3 bg-white p-5 rounded-2xl border border-[#D4C4ED]">
                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white px-4 py-2.5 border border-[#D4C4ED] text-xs font-mono font-medium rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                      placeholder="XXXX XXXX XXXX XXXX"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1">Expiry Date (MM/YY)</label>
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full bg-white px-4 py-2.5 border border-[#D4C4ED] text-xs font-mono rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#18181B] mb-1">CVV / CVC</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white px-4 py-2.5 border border-[#D4C4ED] text-xs font-mono rounded-xl focus:outline-none focus:border-[#7E3AF2]"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#18181B] pt-2">
                    <input
                      type="checkbox"
                      checked={savePaymentDetails}
                      onChange={(e) => setSavePaymentDetails(e.target.checked)}
                      className="accent-[#7E3AF2] w-4 h-4 rounded"
                    />
                    <span>Save my payment details for express checkout</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-2xl transition-all shadow-lg shadow-[#7E3AF2]/30 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{loading ? 'Processing Payment & Creating Order...' : `Pay Now (Rs. ${grandTotal.toLocaleString()})`}</span>
                </button>
              </form>
            )}
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#D4C4ED] shadow-xl h-fit space-y-4">
            <h3 className="text-base font-extrabold text-[#18181B] border-b pb-3">Order Summary</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs border-b pb-3">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded-xl border border-[#D4C4ED]" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#18181B] line-clamp-1">{item.product.name}</h4>
                    <p className="text-[11px] text-[#6E6A78]">
                      Qty: {item.quantity} x Rs. {(item.product.pricing?.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#7E3AF2] font-semibold">{item.rentDuration}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-[#6E6A78]">
                <span>Rental Subtotal:</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6E6A78]">
                <span>Estimated Taxes ({taxRate}%):</span>
                <span>Rs. {taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6E6A78]">
                <span>Fulfillment Fee:</span>
                <span>{deliveryCharge > 0 ? `Rs. ${deliveryCharge}` : 'FREE (Store Pickup)'}</span>
              </div>
              <div className="flex justify-between text-amber-600 font-bold bg-amber-50 p-2 rounded-xl border border-amber-200">
                <span>Refundable Security Deposit:</span>
                <span>Rs. {securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#7E3AF2] pt-2 border-t border-[#D4C4ED]">
                <span>Grand Total:</span>
                <span>Rs. {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
