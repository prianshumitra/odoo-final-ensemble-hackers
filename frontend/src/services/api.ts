// @ts-nocheck
import axios from 'axios';
import type { Product, CartItem } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Create Axios Instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token for all requests
export const setAuthHeaders = (user: { id?: string; email?: string; name?: string; role?: string } | null, token?: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth Services
export const authService = {
  async register(data: any) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  async registerVendor(data: any) {
    const res = await api.post('/auth/register-vendor', data);
    return res.data;
  },
  async login(data: any) {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  async adminLogin(data: any) {
    const res = await api.post('/auth/admin-login', data);
    return res.data;
  },
  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },
  async getUsers() {
    const res = await api.get('/auth/users');
    return res.data;
  },
  async updateUserStatus(id: string, data: any) {
    const res = await api.put(`/auth/users/${id}/status`, data);
    return res.data;
  },
  // Stubs
  async checkEmail(email: string) { return { available: true, exists: false }; },
  async forgotPassword(data: any) { return { success: true, message: '' }; },
  async resetPassword(...args: any[]) { return { success: true, message: '' }; },
  async getAdminStats(): Promise<any> { return { customersCount: 0, vendorsCount: 0, pendingVendorsCount: 0, totalUsers: 0 }; },
};

// Products API
export const productService = {
  async getProducts(params?: Record<string, any>): Promise<Product[]> {
    try {
      const response = await api.get('/products', { params });
      if (Array.isArray(response.data)) {
        return response.data.map((p: any) => ({ ...p, id: p._id || p.id }));
      }
      return [];
    } catch (error) {
      console.warn('Products API error:', error);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get(`/products/${id}`);
      return { ...response.data, id: response.data._id || response.data.id };
    } catch (error) {
      return null;
    }
  },

  async getVendorProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/products/vendor/my-products');
      return response.data.map((p: any) => ({ ...p, id: p._id || p.id }));
    } catch (error) {
      return [];
    }
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await api.post('/products', productData);
    return { ...response.data.product, id: response.data.product._id || response.data.product.id };
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return { ...response.data.product, id: response.data.product._id || response.data.product.id };
    } catch (error) {
      return null;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  },
};

// Orders API
export const orderService = {
  async getOrders(params?: Record<string, any>) {
    const res = await api.get('/orders', { params });
    return res.data;
  },
  async getOrderById(id: string) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  async createOrder(orderData: any) {
    const res = await api.post('/orders', orderData);
    return res.data;
  },
  async confirmOrder(id: string) {
    const res = await api.patch(`/orders/${id}/confirm`);
    return res.data;
  },
  async cancelOrder(id: string) {
    const res = await api.patch(`/orders/${id}/cancel`);
    return res.data;
  },
  // Stubs
  getQuotationPDFUrl(id: string) { return `${API_BASE_URL}/orders/${id}/quotation.pdf`; },
  async sendQuotation(id: string) { return { success: true }; },
  async processPickup(id: string) { return { success: true }; },
  async processReturn(id: string): Promise<any> { return { success: true, order: {} as any, lateFeeCalculated: 0, securityDeposit: { refundedAmount: 0 } }; },
};

// Legacy rentalService wrapper — maps to orderService for backward compat
export const rentalService = {
  async createRental(cartItem: CartItem) {
    try {
      const response = await api.post('/orders', {
        lines: [{
          productId: cartItem.product.id || (cartItem.product as any)._id,
          quantity: cartItem.quantity || 1,
        }],
      });
      return response.data;
    } catch (error) {
      console.error('Create rental error:', error);
      throw error;
    }
  },

  async getMyRentals() {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async getVendorRentals() {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async updateRentalStatus(id: string, status: string) {
    try {
      if (status === 'confirmed') {
        const res = await api.patch(`/orders/${id}/confirm`);
        return res.data;
      }
      if (status === 'cancelled') {
        const res = await api.patch(`/orders/${id}/cancel`);
        return res.data;
      }
      return { success: false, message: 'Unknown status' };
    } catch (error) {
      return { success: false, message: 'Failed to update status' };
    }
  },
};

// Stubs for removed services (prevent import errors in frontend components that still reference them)
export const cartService = {
  async getCart(...args: any[]) { return []; },
  async syncCart(...args: any[]) { return []; },
  async clearCart(...args: any[]) {},
};

export const invoiceService = {
  async getInvoices(...args: any[]) { return []; },
  async getInvoiceById(...args: any[]) { return null; },
  async createInvoiceFromOrder(...args: any[]) { return null; },
  async payInvoice(...args: any[]) { return null; },
  getInvoicePDFUrl(...args: any[]) { return ''; },
};

export const attributeService = {
  async getAttributes(...args: any[]) { return []; },
  async createAttribute(...args: any[]) { return null; },
  async updateAttribute(...args: any[]) { return null; },
  async deleteAttribute(...args: any[]) { return null; },
};

export const pricelistService = {
  async getPricelists(...args: any[]) { return []; },
  async createPricelist(...args: any[]) { return null; },
  async updatePricelist(...args: any[]) { return null; },
  async deletePricelist(...args: any[]) { return null; },
};

export const dashboardService = {
  async getKPIs(...args: any[]) { return null; },
  async getScheduler(...args: any[]) { return { bookings: [] }; },
};

export const settingsService = {
  async getSettings(...args: any[]) { return null; },
  async updateSettings(...args: any[]) { return null; },
};

export const quotationTemplateService = {
  async getTemplates(...args: any[]) { return []; },
  async createTemplate(...args: any[]) { return null; },
  async updateTemplate(...args: any[]) { return null; },
  async deleteTemplate(...args: any[]) { return null; },
};

export const reportService = {
  async getReportData(...args: any[]) { return null; },
  getReportCSVUrl(...args: any[]) { return ''; },
};
