import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Store,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  XCircle,
  Lock,
} from 'lucide-react';
import type { CartItem } from '../../types';
import { paymentService, loadRazorpaySdk } from '../../services/paymentService';

interface CheckoutProps {
  cartItems: CartItem[];
  user: any;
  onOrderCompleted: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ cartItems, user, onOrderCompleted }) => {
  const [step, setStep] = useState<'address' | 'payment' | 'confirmation'>('address');

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultEndStr = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(() => cartItems[0]?.startDate || todayStr);
  const [endDate, setEndDate] = useState(() => cartItems[0]?.endDate || defaultEndStr);

  // Address State
  const [deliveryMethod, setDeliveryMethod] = useState<'Standard Delivery' | 'Pick up from Store'>('Standard Delivery');
  const [street, setStreet] = useState('123 Innovation Boulevard, Suite 400');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [zip, setZip] = useState('400001');
  const [country, setCountry] = useState('India');
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [billingStreet, setBillingStreet] = useState('');

  // Payment Status State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cancelledMessage, setCancelledMessage] = useState('');

  // Completed Order & Receipt Info
  const [completedOrderRef, setCompletedOrderRef] = useState('');
  const [completedPaymentId, setCompletedPaymentId] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);

  // Summary Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.pricePerUnit || item.product.pricing?.amount || 0) * item.quantity,
    0
  );
  const deliveryCharge = deliveryMethod === 'Standard Delivery' ? 150 : 0;
  const securityDeposit = 500 * (cartItems.length || 1);
  const taxRate = 10;
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const grandTotal = subtotal + taxAmount + deliveryCharge + securityDeposit;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setCancelledMessage('');
    if (cartItems.length === 0) {
      setErrorMessage('Your rental cart is empty. Please add items before checking out.');
      return;
    }
    setStep('payment');
  };

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setErrorMessage('');
    setCancelledMessage('');

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpaySdk();
      if (!isLoaded) {
        setErrorMessage('Failed to load Razorpay Checkout SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // 2. Format lines payload
      const linesPayload = cartItems.map((item) => ({
        productId: item.product.id || (item.product as any)._id,
        quantity: item.quantity,
      }));

      // 3. Create Razorpay Order on server side
      const orderData = await paymentService.createOrder({
        lines: linesPayload,
        rentalStart: startDate,
        rentalEnd: endDate,
        deliveryMethod,
      });

      const { keyId, razorpayOrderId, amount, currency, orderRef } = orderData;
      setCompletedOrderRef(orderRef || 'RO0001');
      setPaidAmount(orderData.amountINR || grandTotal);

      // 4. Initialize Razorpay Standard Checkout pop-up
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TNVPRdnlqpPFPL',
        amount: amount,
        currency: currency || 'INR',
        name: 'EZRent Equipment Rentals',
        description: `Rental Order ${orderRef}`,
        order_id: razorpayOrderId,
        prefill: {
          name: user?.name || user?.email?.split('@')[0] || 'Customer',
          email: user?.email || 'customer@ezrent.com',
          contact: user?.phone || '9876543210',
        },
        theme: {
          color: '#0A0A0A',
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setLoading(true);
            // 5. Server-side HMAC-SHA256 signature verification
            const verifyRes = await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              setCompletedPaymentId(response.razorpay_payment_id);
              onOrderCompleted();
              setStep('confirmation');
            } else {
              setErrorMessage(verifyRes.message || 'Payment verification failed server-side.');
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            setErrorMessage(err.response?.data?.message || 'Server verification failed.');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setCancelledMessage('Payment modal closed. Your payment was not completed and the rental is unconfirmed.');
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      console.error('Payment order creation error:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Failed to initiate Razorpay order.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#8A857F] mb-8">
        <Link to="/" className="hover:text-[#1C1C1C]">Order</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#8A857F]" />
        <span className={step === 'address' ? 'text-[#1C1C1C] font-black' : ''}>Address & Fulfillment</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#8A857F]" />
        <span className={step === 'payment' ? 'text-[#1C1C1C] font-black' : ''}>Payment Details</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#8A857F]" />
        <span className={step === 'confirmation' ? 'text-[#1C1C1C] font-black' : ''}>Confirmation</span>
      </div>

      {step === 'confirmation' ? (
        <div className="max-w-xl mx-auto bg-[#FAF8F5] p-10 rounded-3xl border border-[#E8E4DE] shadow-warm-lg text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full flex items-center justify-center mx-auto shadow-warm-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>

          <div>
            <h2 className="text-3xl font-black text-[#1C1C1C]">Payment Verified & Rental Confirmed!</h2>
            <p className="text-sm font-bold text-[#8A857F] mt-1">
              Your payment has been captured via Razorpay and your rental reservation is active.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-900 font-bold flex items-center justify-center gap-2 shadow-warm-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
            <span>Razorpay Payment Captured • Server Signature Validated</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E8E4DE] space-y-2 text-xs text-left shadow-warm-xs font-semibold">
            <div className="flex justify-between border-b border-[#E8E4DE] pb-2">
              <span className="text-[#8A857F]">Order Reference:</span>
              <span className="font-black text-[#1C1C1C]">{completedOrderRef}</span>
            </div>
            <div className="flex justify-between border-b border-[#E8E4DE] pb-2">
              <span className="text-[#8A857F]">Razorpay Payment ID:</span>
              <span className="font-mono text-[#0A0A0A] font-bold">{completedPaymentId || 'pay_verified'}</span>
            </div>
            <div className="flex justify-between border-b border-[#E8E4DE] pb-2">
              <span className="text-[#8A857F]">Payment Status:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">CAPTURED</span>
            </div>
            <div className="flex justify-between border-b border-[#E8E4DE] pb-2">
              <span className="text-[#8A857F]">Fulfillment Method:</span>
              <span className="font-bold text-[#1C1C1C]">{deliveryMethod}</span>
            </div>
            <div className="flex justify-between border-b border-[#E8E4DE] pb-2">
              <span className="text-[#8A857F]">Refundable Security Deposit:</span>
              <span className="font-black text-amber-800">Rs. {securityDeposit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-1 font-black text-base text-[#1C1C1C]">
              <span>Total Paid:</span>
              <span className="text-emerald-700">Rs. {paidAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              to="/orders"
              className="px-6 py-3.5 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-xs font-black rounded-full transition-all shadow-warm-xs"
            >
              View Rental Orders
            </Link>
            <Link
              to="/"
              className="px-6 py-3.5 bg-white border border-[#E8E4DE] text-[#1C1C1C] hover:bg-[#FAF8F5] text-xs font-bold rounded-full transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {step === 'address' ? (
              <form onSubmit={handleProceedToPayment} className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#E8E4DE] shadow-warm-md space-y-6">
                <div>
                  <h2 className="text-xl font-black text-[#1C1C1C] flex items-center gap-2 mb-3">
                    <span>Select Rental Period</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-[#E8E4DE]">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Rental Start Date</label>
                      <input
                        type="date"
                        required
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-[#FAF8F5] px-4 py-3 border border-[#E8E4DE] text-xs font-bold rounded-xl focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Rental End Date (Due Date)</label>
                      <input
                        type="date"
                        required
                        min={startDate}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-[#FAF8F5] px-4 py-3 border border-[#E8E4DE] text-xs font-bold rounded-xl focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-black text-[#1C1C1C] flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#0A0A0A]" />
                    <span>Choose Delivery Method</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('Standard Delivery')}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        deliveryMethod === 'Standard Delivery'
                          ? 'border-[#0A0A0A] bg-white text-[#1C1C1C] shadow-warm-xs ring-2 ring-[#0A0A0A]'
                          : 'border-[#E8E4DE] bg-white text-[#8A857F]'
                      }`}
                    >
                      <Truck className="w-5 h-5 mt-0.5 text-[#0A0A0A]" />
                      <div>
                        <p className="text-xs font-black text-[#1C1C1C]">Standard Delivery</p>
                        <p className="text-[11px] font-medium">Doorstep dispatch (Rs. 150)</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('Pick up from Store')}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        deliveryMethod === 'Pick up from Store'
                          ? 'border-[#0A0A0A] bg-white text-[#1C1C1C] shadow-warm-xs ring-2 ring-[#0A0A0A]'
                          : 'border-[#E8E4DE] bg-white text-[#8A857F]'
                      }`}
                    >
                      <Store className="w-5 h-5 mt-0.5 text-[#0A0A0A]" />
                      <div>
                        <p className="text-xs font-black text-[#1C1C1C]">Pick up from Store</p>
                        <p className="text-[11px] text-emerald-700 font-bold">FREE Store Pickup</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-black text-[#1C1C1C] flex items-center gap-2 mb-3">
                    <MapPin className="w-5 h-5 text-[#0A0A0A]" />
                    <span>Delivery Address</span>
                  </h2>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full bg-white px-4 py-3 border border-[#E8E4DE] text-xs font-semibold rounded-2xl focus:outline-none focus:border-[#0A0A0A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1C1C1C] mb-1">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full bg-white px-4 py-3 border border-[#E8E4DE] text-xs font-semibold rounded-2xl focus:outline-none focus:border-[#0A0A0A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1C1C1C] mb-1">State / Province</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full bg-white px-4 py-3 border border-[#E8E4DE] text-xs font-semibold rounded-2xl focus:outline-none focus:border-[#0A0A0A]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Zip / Postal Code</label>
                        <input
                          type="text"
                          required
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          className="w-full bg-white px-4 py-3 border border-[#E8E4DE] text-xs font-semibold rounded-2xl focus:outline-none focus:border-[#0A0A0A]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Country</label>
                        <input
                          type="text"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full bg-white px-4 py-3 border border-[#E8E4DE] text-xs font-semibold rounded-2xl focus:outline-none focus:border-[#0A0A0A]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E4DE]">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1C1C1C]">
                    <input
                      type="checkbox"
                      checked={sameBillingAddress}
                      onChange={(e) => setSameBillingAddress(e.target.checked)}
                      className="accent-[#0A0A0A] w-4 h-4 rounded"
                    />
                    <span>Billing and Delivery address are the same</span>
                  </label>

                  {!sameBillingAddress && (
                    <div className="mt-3 space-y-3 p-4 bg-white rounded-2xl border border-[#E8E4DE]">
                      <h4 className="text-xs font-bold text-[#1C1C1C]">Separate Billing Address</h4>
                      <div>
                        <label className="block text-xs font-bold text-[#1C1C1C] mb-1">Billing Street</label>
                        <input
                          type="text"
                          value={billingStreet}
                          onChange={(e) => setBillingStreet(e.target.value)}
                          className="w-full bg-white px-3 py-2 border border-[#E8E4DE] text-xs rounded-xl"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-xs font-black rounded-full transition-all shadow-warm-md flex items-center justify-center gap-2"
                >
                  <span>Proceed to Payment Review</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="bg-[#FAF8F5] p-8 rounded-3xl border border-[#E8E4DE] shadow-warm-md space-y-6">
                <button
                  type="button"
                  onClick={() => setStep('address')}
                  className="flex items-center gap-1 text-xs font-bold text-[#1C1C1C] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Address & Fulfillment</span>
                </button>

                <div>
                  <h2 className="text-xl font-black text-[#1C1C1C] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#E8B923]" />
                    <span>Razorpay Secure Standard Checkout</span>
                  </h2>
                  <p className="text-xs text-[#8A857F] mt-1 font-medium">
                    Order details & final totals are validated server-side. Click below to launch Razorpay's secure checkout (UPI, Cards, Netbanking, Wallets).
                  </p>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {cancelledMessage && (
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <XCircle className="w-4 h-4 shrink-0 text-amber-600" />
                    <span>{cancelledMessage}</span>
                  </div>
                )}

                <div className="bg-white p-5 rounded-2xl border border-[#E8E4DE] space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-[#E8E4DE] pb-2 font-bold">
                    <span className="text-[#8A857F]">Merchant:</span>
                    <span className="text-[#1C1C1C]">EZRent Equipment Rentals</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-b border-[#E8E4DE] pb-2 font-bold">
                    <span className="text-[#8A857F]">Payment Gate:</span>
                    <span className="text-[#1C1C1C]">Razorpay Standard (HMAC-SHA256 Verified)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#8A857F]">Total Amount to Pay:</span>
                    <span className="text-base font-black text-[#1C1C1C]">Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRazorpayPayment}
                  disabled={loading}
                  className="w-full py-4 bg-[#0A0A0A] hover:bg-[#2A2A2A] disabled:opacity-60 text-white text-xs font-black rounded-full transition-all shadow-warm-md flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#E8B923]" />
                  <span>{loading ? 'Securing Razorpay Order...' : `Pay Rs. ${grandTotal.toLocaleString()} via Razorpay`}</span>
                </button>
              </div>
            )}
          </div>

          <div className="bg-[#FAF8F5] p-6 rounded-3xl border border-[#E8E4DE] shadow-warm-md h-fit space-y-4">
            <h3 className="text-base font-black text-[#1C1C1C] border-b border-[#E8E4DE] pb-3">Order Summary</h3>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs border-b border-[#E8E4DE] pb-3">
                  <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-contain rounded-xl border border-[#E8E4DE] bg-white p-1" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1C1C1C] line-clamp-1">{item.product.name}</h4>
                    <p className="text-[11px] text-[#8A857F]">
                      Qty: {item.quantity} x Rs. {(item.product.pricePerUnit || item.product.pricing?.amount || 0).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-[#1C1C1C] font-bold">{item.rentDuration}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-[#8A857F] font-semibold">
                <span>Rental Subtotal:</span>
                <span className="text-[#1C1C1C]">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#8A857F] font-semibold">
                <span>Estimated Taxes ({taxRate}%):</span>
                <span className="text-[#1C1C1C]">Rs. {taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#8A857F] font-semibold">
                <span>Fulfillment Fee:</span>
                <span className="text-[#1C1C1C]">{deliveryCharge > 0 ? `Rs. ${deliveryCharge}` : 'FREE (Store Pickup)'}</span>
              </div>
              <div className="flex justify-between text-amber-800 font-bold bg-[#E8B923]/15 p-2.5 rounded-xl border border-[#E8B923]/30">
                <span>Refundable Security Deposit:</span>
                <span>Rs. {securityDeposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#1C1C1C] pt-2 border-t border-[#E8E4DE]">
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
