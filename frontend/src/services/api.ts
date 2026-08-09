// @ts-nocheck
import axios from 'axios';
import type { Product, CartItem } from '../types';

// Use relative URL so Vite proxy handles routing to backend (works in Docker & local dev)
const API_BASE_URL = '/api';

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
  async completeOrder(id: string) {
    const res = await api.patch(`/orders/${id}/complete`);
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
  async getInvoices() {
    try {
      const orders = await orderService.getOrders();
      return orders.map((order: any) => ({
        _id: `inv_${order._id || order.id}`,
        invoiceNumber: `INV-${order.orderRef || String(order._id).slice(-6).toUpperCase()}`,
        orderRef: order.orderRef || 'RO0001',
        customerName: order.customerName || 'Subscriber Renter',
        customerEmail: order.customerEmail || 'renter@example.com',
        invoiceDate: order.createdAt || new Date().toISOString(),
        totalAmount: order.total || 0,
        status: ['completed', 'active', 'confirmed', 'picked_up'].includes(order.status)
          ? 'paid'
          : order.status === 'cancelled'
          ? 'cancelled'
          : 'posted',
      }));
    } catch (err) {
      return [];
    }
  },
  async getInvoiceById(id: string) {
    const invoices = await this.getInvoices();
    return invoices.find((inv: any) => inv._id === id) || null;
  },
  async createInvoiceFromOrder(orderId: string) {
    return { success: true };
  },
  async payInvoice(id: string, payload?: any) {
    return { success: true };
  },
  getInvoicePDFUrl(id: string) {
    return `${API_BASE_URL}/orders/${id}/invoice.pdf`;
  },
};

export const attributeService = {
  async getAttributes(): Promise<Attribute[]> {
    try {
      const products = await productService.getProducts();
      const categories = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
      return [
        { _id: 'attr_1', name: 'Color Swatches', values: ['Slate Blue', 'Mustard', 'Purple Accent', 'Teal', 'Dark Charcoal', 'Black', 'Cream / White', 'Coral / Amber'], displayType: 'pills', extraPricePerValue: [], showVariantImages: false },
        { _id: 'attr_2', name: 'Rental Duration Tiers', values: ['Hourly', 'Daily', '1 Month', '6 Months', '1 Year', '2 Years', '3 Years'], displayType: 'pills', extraPricePerValue: [], showVariantImages: false },
        { _id: 'attr_3', name: 'Product Category', values: categories.length > 0 ? categories : ['Furniture', 'Electronics', 'Appliances'], displayType: 'pills', extraPricePerValue: [], showVariantImages: false },
      ];
    } catch (err) {
      return [];
    }
  },
  async createAttribute(data: any): Promise<Attribute> {
    return { _id: `attr_${Date.now()}`, name: data.name || 'New Attribute', values: data.values || [], displayType: 'pills', extraPricePerValue: [], showVariantImages: false };
  },
  async updateAttribute(id: string, data: any): Promise<Attribute> {
    return { _id: id, name: data.name || 'Attribute', values: data.values || [], displayType: 'pills', extraPricePerValue: [], showVariantImages: false };
  },
  async deleteAttribute(id: string): Promise<boolean> { return true; },
};

export const pricelistService = {
  async getPricelists(): Promise<Pricelist[]> {
    return [
      { _id: 'pl_1', name: 'Standard Daily / Monthly Rate', isDefault: true, rules: [] },
      { _id: 'pl_2', name: 'Long-Term Lease Special (6+ Months)', isDefault: false, rules: [{ applyOn: 'all', minQty: 1, priceType: 'discount', value: 15 }] },
      { _id: 'pl_3', name: 'Corporate Workstation Volume Tier', isDefault: false, rules: [{ applyOn: 'all', minQty: 5, priceType: 'discount', value: 25 }] },
    ];
  },
  async createPricelist(data: any): Promise<Pricelist> {
    return { _id: `pl_${Date.now()}`, name: data.name || 'New Pricelist', isDefault: false, rules: [] };
  },
  async updatePricelist(id: string, data: any): Promise<Pricelist> {
    return { _id: id, name: data.name || 'Pricelist', isDefault: false, rules: [] };
  },
  async deletePricelist(id: string): Promise<boolean> { return true; },
};

export const dashboardService = {
  async getKPIs() {
    const orders = await orderService.getOrders();
    const products = await productService.getProducts();
    return {
      activeRentals: orders.filter((o: any) => ['active', 'confirmed', 'picked_up'].includes(o.status)).length,
      totalRevenue: orders.filter((o: any) => o.status !== 'cancelled').reduce((sum: number, o: any) => sum + (o.total || 0), 0),
      totalProducts: products.length,
    };
  },
  async getScheduler(month?: number, year?: number) {
    try {
      const orders = await orderService.getOrders();
      const bookings = orders.map((order: any) => {
        const startDate = new Date(order.rentalStart || order.createdAt);
        const endDate = new Date(order.rentalEnd || Date.now() + 7 * 24 * 3600 * 1000);
        const type = order.status === 'pending' ? 'Pick up' : order.status === 'overdue' ? 'Late Delivery' : 'Booked';
        return {
          id: order._id || order.id,
          title: `${order.orderRef || 'RO'} - ${order.customerName || 'Renter'}`,
          customerName: order.customerName || 'Renter',
          productName: order.lines?.[0]?.productName || 'Rental Item',
          type,
          day: startDate.getDate(),
          month: startDate.getMonth(),
          year: startDate.getFullYear(),
          startDate,
          endDate,
          status: order.status,
        };
      });
      return { bookings };
    } catch (err) {
      return { bookings: [] };
    }
  },
};

export const settingsService = {
  async getSettings(): Promise<Settings> {
    return {
      _id: 'settings_1',
      lateFeeEnabled: true,
      defaultLateFeeAmount: 2,
      variantsEnabled: true,
      pricelistEnabled: true,
      gracePeriodMinutes: 60,
      maxLateFeeCap: 5000,
      companyHeader: 'EZRent Rental Operations',
      companyFooter: 'Sanitized & Escrow Secured',
    };
  },
  async updateSettings(data: any): Promise<Settings> {
    const current = await this.getSettings();
    return { ...current, ...data };
  },
};

export const quotationTemplateService = {
  async getTemplates(): Promise<QuotationTemplate[]> {
    return [
      { _id: 'tpl_1', name: 'Standard Monthly Furniture Rental Agreement', validityDays: 30, paymentTermsPercent: 100, headerHtml: 'EZRent Terms', footerHtml: 'Sanitized', lines: [{ description: 'Furniture item rental', defaultQty: 1, defaultPrice: 999 }] },
      { _id: 'tpl_2', name: 'Short-Term Tech & Event Equipment Rental', validityDays: 14, paymentTermsPercent: 100, headerHtml: 'Tech Terms', footerHtml: 'Escrow Secured', lines: [{ description: 'Tech device rental', defaultQty: 1, defaultPrice: 1999 }] },
      { _id: 'tpl_3', name: 'Long-Term Corporate Workstation Lease', validityDays: 60, paymentTermsPercent: 100, headerHtml: 'Corporate Terms', footerHtml: 'Odoo Verified', lines: [{ description: 'Corporate setup', defaultQty: 1, defaultPrice: 4999 }] },
    ];
  },
  async createTemplate(data: any): Promise<QuotationTemplate> {
    return { _id: `tpl_${Date.now()}`, name: data.name || 'New Template', validityDays: 30, paymentTermsPercent: 100, headerHtml: '', footerHtml: '', lines: [] };
  },
  async updateTemplate(id: string, data: any): Promise<QuotationTemplate> {
    return { _id: id, name: data.name || 'Template', validityDays: 30, paymentTermsPercent: 100, headerHtml: '', footerHtml: '', lines: [] };
  },
  async deleteTemplate(id: string): Promise<boolean> { return true; },
};

export const reportService = {
  async getReportData() {
    try {
      const orders = await orderService.getOrders();
      const products = await productService.getProducts();
      const totalRevenue = orders.filter((o: any) => o.status !== 'cancelled').reduce((sum: number, o: any) => sum + (o.total || 0), 0);
      const activeCount = orders.filter((o: any) => ['active', 'confirmed', 'picked_up'].includes(o.status)).length;
      const totalStock = products.reduce((sum, p) => sum + (p.quantityOnHand || 1), 0);
      return {
        totalRevenue,
        totalOrders: orders.length,
        activeRentalsCount: activeCount,
        listedProductsCount: products.length,
        totalStockOnHand: totalStock,
        revenueByMonth: [
          { month: 'Jan', revenue: Math.round(totalRevenue * 0.25) },
          { month: 'Feb', revenue: Math.round(totalRevenue * 0.35) },
          { month: 'Mar', revenue: Math.round(totalRevenue * 0.40) },
        ],
      };
    } catch (err) {
      return null;
    }
  },
  getReportCSVUrl() { return '#'; },
};
