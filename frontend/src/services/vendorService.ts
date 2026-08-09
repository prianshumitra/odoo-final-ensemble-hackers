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
      if (status === 'active' || status === 'confirmed') return await orderService.confirmOrder(id);
      if (status === 'completed') return await orderService.completeOrder(id);
      if (status === 'cancelled') return await orderService.cancelOrder(id);
    } catch (err) {
      console.error('Update rental status error:', err);
    }
    return null;
  },

  async getStats(products: Product[], rentals: FullRentalOrder[]): Promise<VendorStats> {
    const totalProducts = products.length;
    
    // Status matching across all order workflows
    const activeRentals = rentals.filter((r) => r.status === 'active' || r.status === 'confirmed' || r.status === 'picked_up').length;
    const overdueRentals = rentals.filter((r) => r.status === 'overdue' || r.status === 'late_return').length;
    const pendingRequests = rentals.filter((r) => r.status === 'pending' || r.status === 'quotation' || r.status === 'quotation_sent').length;

    // Dynamic date calculations
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    
    const rentalsDueToday = rentals.filter((r) => {
      if (r.status !== 'active' && r.status !== 'confirmed' && r.status !== 'picked_up') return false;
      if (!r.rentalEnd) return false;
      const endStr = new Date(r.rentalEnd).toISOString().slice(0, 10);
      return endStr === todayStr;
    }).length;

    const upcomingPickups = rentals.filter((r) => 
      ['pending', 'quotation', 'quotation_sent', 'confirmed', 'reserved'].includes(r.status)
    ).length;

    const next7Days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const upcomingReturns = rentals.filter((r) => {
      if (r.status !== 'active' && r.status !== 'confirmed' && r.status !== 'picked_up') return false;
      if (!r.rentalEnd) return false;
      const end = new Date(r.rentalEnd);
      return end >= now && end <= next7Days;
    }).length;

    const totalRevenue = rentals
      .filter((r) => r.status !== 'cancelled')
      .reduce((sum, r) => sum + (r.total || 0), 0);

    const securityDepositsHeld = rentals
      .filter((r) => ['active', 'confirmed', 'pending', 'picked_up', 'reserved'].includes(r.status))
      .reduce((sum, r) => sum + (r.securityDeposit || Math.round((r.total || 0) * 0.2)), 0);

    const lateFeeCollection = rentals.reduce((sum, r) => sum + (r.lateFee || 0), 0);

    return {
      totalProducts,
      activeRentals,
      rentalsDueToday,
      upcomingPickups,
      upcomingReturns,
      overdueRentals,
      totalRevenue,
      securityDepositsHeld,
      lateFeeCollection,
      pendingRequests,
    };
  },

  getCustomers(rentals: FullRentalOrder[]): RenterCustomer[] {
    const customerMap = new Map<string, RenterCustomer>();

    rentals.forEach((r) => {
      const email = r.customerEmail || 'renter@example.com';
      const name = r.customerName || email.split('@')[0];
      const existing = customerMap.get(email);

      if (existing) {
        existing.totalRentals += 1;
        if (['active', 'confirmed', 'picked_up'].includes(r.status)) existing.activeRentals += 1;
        if (r.status !== 'cancelled') existing.totalSpent += r.total || 0;
        if (r.createdAt && new Date(r.createdAt) > new Date(existing.lastRentalDate)) {
          existing.lastRentalDate = r.createdAt;
        }
      } else {
        customerMap.set(email, {
          email,
          name,
          totalRentals: 1,
          activeRentals: ['active', 'confirmed', 'picked_up'].includes(r.status) ? 1 : 0,
          totalSpent: r.status !== 'cancelled' ? r.total || 0 : 0,
          lastRentalDate: r.createdAt || new Date().toISOString(),
        });
      }
    });

    return Array.from(customerMap.values());
  },

  getNotifications(): NotificationItem[] {
    return [
      { id: 'notif_1', title: 'New Rental Request Received', message: 'A new order has been placed and requires vendor confirmation.', type: 'rental', timestamp: 'Just now', read: false },
      { id: 'notif_2', title: 'Security Deposit Escrow Verified', message: 'Security deposit held in escrow for active order.', type: 'system', timestamp: '1 hour ago', read: true },
    ];
  },
};
