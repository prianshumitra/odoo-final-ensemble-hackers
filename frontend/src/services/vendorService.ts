import { productService, orderService } from './api';
import type { Product, FullRentalOrder, VendorStats, NotificationItem, RenterCustomer } from '../types';

export const vendorService = {
  async getProducts(): Promise<Product[]> {
    return await productService.getVendorProducts();
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    return await productService.createProduct(productData);
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    return await productService.updateProduct(id, productData);
  },

  async deleteProduct(id: string): Promise<boolean> {
    return await productService.deleteProduct(id);
  },

  async getRentals(): Promise<FullRentalOrder[]> {
    try {
      const orders = await orderService.getOrders();
      return orders.map((o: any) => ({
        ...o,
        id: o._id || o.id,
      }));
    } catch (err) {
      return [];
    }
  },

  async updateRentalStatus(id: string, status: string) {
    try {
      if (status === 'confirmed') return await orderService.confirmOrder(id);
      if (status === 'cancelled') return await orderService.cancelOrder(id);
    } catch (err) {
      console.error('Update rental status error:', err);
    }
    return null;
  },

  async getStats(products: Product[], rentals: FullRentalOrder[]): Promise<VendorStats> {
    const totalProducts = products.length;
    const activeRentals = rentals.filter((r) => r.status === 'confirmed').length;
    const pendingRequests = rentals.filter((r) => r.status === 'pending').length;
    const totalRevenue = rentals
      .filter((r) => r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.total || 0), 0);

    return {
      totalProducts,
      activeRentals,
      rentalsDueToday: 0,
      upcomingPickups: 0,
      upcomingReturns: 0,
      overdueRentals: 0,
      totalRevenue,
      securityDepositsHeld: 0,
      lateFeeCollection: 0,
      pendingRequests,
    };
  },

  getCustomers(rentals: FullRentalOrder[]): RenterCustomer[] {
    const customerMap = new Map<string, RenterCustomer>();

    rentals.forEach((r) => {
      const email = r.customerEmail || 'customer@example.com';
      const name = r.customerName || email.split('@')[0];
      const existing = customerMap.get(email);

      if (existing) {
        existing.totalRentals += 1;
        if (r.status === 'confirmed') existing.activeRentals += 1;
        if (r.status !== 'cancelled') existing.totalSpent += r.total || 0;
        if (new Date(r.createdAt) > new Date(existing.lastRentalDate)) {
          existing.lastRentalDate = r.createdAt;
        }
      } else {
        customerMap.set(email, {
          email,
          name,
          totalRentals: 1,
          activeRentals: r.status === 'confirmed' ? 1 : 0,
          totalSpent: r.status !== 'cancelled' ? r.total || 0 : 0,
          lastRentalDate: r.createdAt || new Date().toISOString(),
        });
      }
    });

    return Array.from(customerMap.values());
  },

  getNotifications(): NotificationItem[] {
    return [];
  },
};
