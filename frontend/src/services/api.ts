import axios from 'axios';
import type { Product, CartItem } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const API_BASE_URL = 'http://localhost:5000/api';

// Create Axios Instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to set current user context for requests
export const setAuthHeaders = (user: { id?: string; email?: string; name?: string; role?: string } | null, token?: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }

  if (user) {
    if (user.id) api.defaults.headers.common['x-user-id'] = user.id;
    if (user.email) api.defaults.headers.common['x-user-email'] = user.email;
    if (user.role) api.defaults.headers.common['x-user-role'] = user.role;
    if (user.name) api.defaults.headers.common['x-user-name'] = user.name;
  } else {
    delete api.defaults.headers.common['x-user-id'];
    delete api.defaults.headers.common['x-user-email'];
    delete api.defaults.headers.common['x-user-role'];
    delete api.defaults.headers.common['x-user-name'];
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
  async getAdminStats() {
    const res = await api.get('/auth/admin-stats');
    return res.data;
  },
  async checkEmail(email: string) {
    const res = await api.post('/auth/check-email', { email });
    return res.data;
  },
  async forgotPassword(email: string) {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  async resetPassword(token: string, data: any) {
    const res = await api.post(`/auth/reset-password/${token}`, data);
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
};

// Products API Methods
export const productService = {
  async getProducts(params?: Record<string, any>): Promise<Product[]> {
    try {
      const response = await api.get('/products', { params });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data.map((p: any) => ({ ...p, id: p._id || p.id }));
      }
      return INITIAL_PRODUCTS;
    } catch (error) {
      console.warn('Backend API error, fallback to initial products:', error);
      return INITIAL_PRODUCTS;
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

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const response = await api.post('/products', productData);
    return { ...response.data.product, id: response.data.product._id || response.data.product.id };
  },

  async getVendorProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/products/vendor/my-products');
      return response.data.map((p: any) => ({ ...p, id: p._id || p.id }));
    } catch (error) {
      return [];
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return { ...response.data.product, id: response.data.product._id || response.data.product.id };
    } catch (error) {
      return null;
    }
  },

  async togglePublish(id: string): Promise<any> {
    const res = await api.patch(`/products/${id}/publish`);
    return res.data;
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

// Cart Service
export const cartService = {
  async getCart(): Promise<any[]> {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async syncCart(items: CartItem[]): Promise<any[]> {
    try {
      const formatted = items.map((i) => ({
        productId: i.product.id || (i.product as any)._id,
        productName: i.product.name,
        productImage: i.product.image,
        amount: i.product.pricing?.amount || 0,
        unit: i.product.pricing?.unit || 'Month',
        quantity: i.quantity,
        selectedColor: i.selectedColor || '',
        selectedSize: i.selectedSize || '',
        rentDuration: i.rentDuration || i.product.duration || '6 Month',
      }));

      const response = await api.post('/cart/sync', { items: formatted });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async clearCart(): Promise<void> {
    try {
      await api.delete('/cart');
    } catch (error) {}
  },
};

// Orders / Quotations API
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
  async sendQuotation(id: string) {
    const res = await api.patch(`/orders/${id}/send`);
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
  async processPickup(id: string) {
    const res = await api.post(`/orders/${id}/pickup`);
    return res.data;
  },
  async processReturn(id: string) {
    const res = await api.post(`/orders/${id}/return`);
    return res.data;
  },
  getQuotationPDFUrl(id: string) {
    return `${API_BASE_URL}/orders/${id}/print`;
  },
};

// Invoices API
export const invoiceService = {
  async getInvoices() {
    const res = await api.get('/invoices');
    return res.data;
  },
  async getInvoiceById(id: string) {
    const res = await api.get(`/invoices/${id}`);
    return res.data;
  },
  async createInvoiceFromOrder(orderId: string) {
    const res = await api.post('/invoices', { orderId });
    return res.data;
  },
  async payInvoice(id: string, paymentData: any) {
    const res = await api.patch(`/invoices/${id}/pay`, paymentData);
    return res.data;
  },
  getInvoicePDFUrl(id: string) {
    return `${API_BASE_URL}/invoices/${id}/print`;
  },
};

// Attributes API
export const attributeService = {
  async getAttributes() {
    const res = await api.get('/attributes');
    return res.data;
  },
  async createAttribute(data: any) {
    const res = await api.post('/attributes', data);
    return res.data;
  },
  async updateAttribute(id: string, data: any) {
    const res = await api.put(`/attributes/${id}`, data);
    return res.data;
  },
  async deleteAttribute(id: string) {
    const res = await api.delete(`/attributes/${id}`);
    return res.data;
  },
};

// Pricelists API
export const pricelistService = {
  async getPricelists() {
    const res = await api.get('/pricelists');
    return res.data;
  },
  async createPricelist(data: any) {
    const res = await api.post('/pricelists', data);
    return res.data;
  },
  async updatePricelist(id: string, data: any) {
    const res = await api.put(`/pricelists/${id}`, data);
    return res.data;
  },
  async deletePricelist(id: string) {
    const res = await api.delete(`/pricelists/${id}`);
    return res.data;
  },
};

// Dashboard API
export const dashboardService = {
  async getKPIs() {
    const res = await api.get('/dashboard/kpis');
    return res.data;
  },
  async getScheduler(month?: number, year?: number) {
    const res = await api.get('/dashboard/scheduler', { params: { month, year } });
    return res.data;
  },
};

// Settings API
export const settingsService = {
  async getSettings() {
    const res = await api.get('/settings');
    return res.data;
  },
  async updateSettings(data: any) {
    const res = await api.put('/settings', data);
    return res.data;
  },
};

// Quotation Templates API
export const quotationTemplateService = {
  async getTemplates() {
    const res = await api.get('/quotation-templates');
    return res.data;
  },
  async createTemplate(data: any) {
    const res = await api.post('/quotation-templates', data);
    return res.data;
  },
  async updateTemplate(id: string, data: any) {
    const res = await api.put(`/quotation-templates/${id}`, data);
    return res.data;
  },
  async deleteTemplate(id: string) {
    const res = await api.delete(`/quotation-templates/${id}`);
    return res.data;
  },
};

// Reports API
export const reportService = {
  async getReportData(format?: string) {
    const res = await api.get('/reports', { params: { format } });
    return res.data;
  },
  getReportCSVUrl() {
    return `${API_BASE_URL}/reports?format=csv`;
  },
};

// Legacy rentalService wrapper
export const rentalService = {
  async createRental(cartItem: CartItem) {
    try {
      const response = await api.post('/rentals', {
        productId: cartItem.product.id || (cartItem.product as any)._id,
        productName: cartItem.product.name,
        productImage: cartItem.product.image,
        selectedColor: cartItem.selectedColor,
        selectedSize: cartItem.selectedSize,
        rentDuration: cartItem.rentDuration,
        amount: cartItem.product.pricing?.amount || 0,
        unit: cartItem.product.pricing?.unit || 'Month',
      });
      return response.data;
    } catch (error) {
      return { success: true, message: 'Rental recorded' };
    }
  },

  async getMyRentals() {
    try {
      const response = await api.get('/rentals/my-rentals');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async getVendorRentals() {
    try {
      const response = await api.get('/rentals/vendor');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async updateRentalStatus(id: string, status: string) {
    try {
      const response = await api.put(`/rentals/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return { success: false, message: 'Failed to update status' };
    }
  },
};
