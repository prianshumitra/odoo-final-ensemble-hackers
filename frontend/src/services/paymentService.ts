import { api } from './api';
import type { Payment, VendorPaymentsResponse } from '../types';

export const loadRazorpaySdk = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const paymentService = {
  async createOrder(orderPayload: {
    lines: Array<{ productId: string; quantity: number }>;
    rentalStart?: string;
    rentalEnd?: string;
    deliveryMethod?: string;
  }) {
    const res = await api.post('/payments/create-order', orderPayload);
    return res.data;
  },

  async verifyPayment(verificationPayload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const res = await api.post('/payments/verify', verificationPayload);
    return res.data;
  },

  async getVendorPayments(): Promise<VendorPaymentsResponse> {
    const res = await api.get('/payments/vendor');
    return res.data;
  },

  async getUserPayments(): Promise<Payment[]> {
    const res = await api.get('/payments/my-payments');
    return res.data;
  },

  async processRefund(paymentId: string, amount?: number) {
    const res = await api.post(`/payments/${paymentId}/refund`, { amount });
    return res.data;
  },
};
