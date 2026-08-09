import { productService, orderService } from './api';
import { paymentService } from './paymentService';
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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 86400000);
    const next7Days = new Date(now.getTime() + 7 * 86400000);

    // Status matching covering all order lifecycle values from both branches
    const activeRentals = rentals.filter((r) =>
      r.status === 'active' || r.status === 'confirmed' || (r.status as string) === 'picked_up'
    ).length;
    const overdueRentals = rentals.filter((r) =>
      r.status === 'overdue' || (r.status as string) === 'late_return'
    ).length;
    const pendingRequests = rentals.filter((r) =>
      r.status === 'pending' || (r.status as string) === 'quotation' || (r.status as string) === 'quotation_sent'
    ).length;

    // Rentals due today: active orders whose rentalEnd is today
    const rentalsDueToday = rentals.filter((r) => {
      if (r.status !== 'active' && r.status !== 'confirmed' && (r.status as string) !== 'picked_up') return false;
      if (!r.rentalEnd) return false;
      const end = new Date(r.rentalEnd);
      return end >= todayStart && end < todayEnd;
    }).length;

    // Upcoming pickups: pending orders starting within next 7 days
    const upcomingPickups = rentals.filter((r) => {
      if (r.status !== 'pending' && r.status !== 'active') return false;
      const start = new Date(r.rentalStart);
      return start >= now && start <= next7Days;
    }).length;

    // Upcoming returns: active orders expiring within 7 days
    const upcomingReturns = rentals.filter((r) => {
      if (r.status !== 'active') return false;
      if (!r.rentalEnd) return false;
      const end = new Date(r.rentalEnd);
      return end >= now && end <= next7Days;
    }).length;

    // Security deposit: 500 per active/overdue order line
    const securityDepositsHeld = rentals
      .filter((r) => r.status === 'active' || r.status === 'overdue' || r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.securityDeposit || 500 * (r.lines?.length || 1)), 0);

    const lateFeeCollection = rentals.reduce((sum, r) => sum + (r.lateFee || 0), 0);

    // Revenue: try from Razorpay Payments API first, fall back to order totals
    let totalRevenue = 0;
    try {
      const paymentsData = await paymentService.getVendorPayments();
      totalRevenue = paymentsData.stats.totalRevenue;
    } catch {
      // Fallback: sum from active/completed/confirmed order totals
      totalRevenue = rentals
        .filter((r) =>
          r.status === 'active' ||
          r.status === 'overdue' ||
          r.status === 'completed' ||
          r.status === 'confirmed'
        )
        .reduce((sum, r) => sum + (r.total || 0), 0);
    }

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

      const isActive = r.status === 'active' || r.status === 'confirmed' || (r.status as string) === 'picked_up';

      if (existing) {
        existing.totalRentals += 1;
        if (isActive) existing.activeRentals += 1;
        if (r.status !== 'cancelled') existing.totalSpent += r.total || 0;
        if (r.createdAt && new Date(r.createdAt) > new Date(existing.lastRentalDate)) {
          existing.lastRentalDate = r.createdAt;
        }
      } else {
        customerMap.set(email, {
          email,
          name,
          totalRentals: 1,
          activeRentals: isActive ? 1 : 0,
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
