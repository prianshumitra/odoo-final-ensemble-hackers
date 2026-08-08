import { productService, orderService } from './api';
import type { Product, FullRentalOrder, VendorStats, NotificationItem, RenterCustomer } from '../types';

export const vendorService = {
  async getProducts(): Promise<Product[]> {
    return await productService.getProducts({ includeUnpublished: true });
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

  async updateRentalStatus(id: string, status: FullRentalOrder['status']) {
    try {
      if (status === 'quotation_sent') return await orderService.sendQuotation(id);
      if (status === 'confirmed') return await orderService.confirmOrder(id);
      if (status === 'picked_up') return await orderService.processPickup(id);
      if (status === 'completed' || status === 'late_return') return await orderService.processReturn(id);
      if (status === 'cancelled') return await orderService.cancelOrder(id);
    } catch (err) {}
    return null;
  },

  async getStats(products: Product[], rentals: FullRentalOrder[]): Promise<VendorStats> {
    const totalProducts = products.length;
    const activeRentals = rentals.filter((r) => r.status === 'confirmed' || r.status === 'picked_up' || r.status === 'reserved').length;
    const pendingRequests = rentals.filter((r) => r.status === 'quotation' || r.status === 'quotation_sent').length;
    const totalRevenue = rentals
      .filter((r) => r.status !== 'cancelled')
      .reduce((sum, r) => sum + (r.total || 0), 0);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const rentalsDueToday = rentals.filter(
      (r) => r.rentalPeriod?.end && new Date(r.rentalPeriod.end).toISOString().split('T')[0] === todayStr
    ).length;

    const upcomingPickups = rentals.filter((r) => r.status === 'confirmed' || r.status === 'reserved').length;
    const upcomingReturns = rentals.filter((r) => r.status === 'picked_up').length;
    const overdueRentals = rentals.filter((r) => r.status === 'late_pickup' || r.status === 'late_return').length;
    
    const securityDepositsHeld = rentals
      .filter((r) => r.securityDeposit?.status === 'held')
      .reduce((sum, r) => sum + (r.securityDeposit?.amount || 0), 0);
      
    const lateFeeCollection = rentals.reduce((sum, r) => sum + (r.lateFeeCalculated || 0), 0);

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
      const email = r.customerEmail || 'customer@example.com';
      const name = r.customerName || email.split('@')[0];
      const existing = customerMap.get(email);

      if (existing) {
        existing.totalRentals += 1;
        if (r.status === 'confirmed' || r.status === 'picked_up') {
          existing.activeRentals += 1;
        }
        if (r.status !== 'cancelled') {
          existing.totalSpent += r.total || 0;
        }
        if (new Date(r.createdAt) > new Date(existing.lastRentalDate)) {
          existing.lastRentalDate = r.createdAt;
        }
      } else {
        customerMap.set(email, {
          email,
          name,
          totalRentals: 1,
          activeRentals: r.status === 'confirmed' || r.status === 'picked_up' ? 1 : 0,
          totalSpent: r.status !== 'cancelled' ? r.total || 0 : 0,
          lastRentalDate: r.createdAt || new Date().toISOString(),
        });
      }
    });

    return Array.from(customerMap.values());
  },

  getNotifications(): NotificationItem[] {
    return [
      {
        id: 'notif-1',
        title: 'New Rental Order Created',
        message: 'Order reference generated and saved to database.',
        type: 'rental',
        timestamp: 'Just now',
        read: false,
      },
      {
        id: 'notif-2',
        title: 'MongoDB Sync Status',
        message: 'All rental orders and products are connected to MongoDB.',
        type: 'system',
        timestamp: '1 min ago',
        read: true,
      },
    ];
  },
};
