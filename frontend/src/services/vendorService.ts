import { productService, rentalService } from './api';
import type { Product, RentalOrder, VendorStats, NotificationItem, RenterCustomer } from '../types';

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

  async getRentals(): Promise<RentalOrder[]> {
    const rentals = await rentalService.getVendorRentals();
    if (!rentals || rentals.length === 0) {
      return getFallbackRentals();
    }
    return rentals.map((r: any) => ({
      ...r,
      id: r._id || r.id,
    }));
  },

  async updateRentalStatus(id: string, status: RentalOrder['status']) {
    return await rentalService.updateRentalStatus(id, status);
  },

  async getStats(products: Product[], rentals: RentalOrder[]): Promise<VendorStats> {
    const totalProducts = products.length;
    const activeRentals = rentals.filter((r) => r.status === 'Active Subscription' || r.status === 'Approved').length;
    const pendingRequests = rentals.filter((r) => r.status === 'Pending').length;
    const totalRevenue = rentals
      .filter((r) => r.status !== 'Cancelled' && r.status !== 'Rejected')
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      totalProducts,
      activeRentals,
      totalRevenue,
      pendingRequests,
    };
  },

  getCustomers(rentals: RentalOrder[]): RenterCustomer[] {
    const customerMap = new Map<string, RenterCustomer>();

    rentals.forEach((r) => {
      const email = r.userEmail || 'customer@example.com';
      const name = r.userName || email.split('@')[0];
      const existing = customerMap.get(email);

      if (existing) {
        existing.totalRentals += 1;
        if (r.status === 'Active Subscription' || r.status === 'Approved') {
          existing.activeRentals += 1;
        }
        if (r.status !== 'Cancelled' && r.status !== 'Rejected') {
          existing.totalSpent += r.amount;
        }
        if (new Date(r.createdAt) > new Date(existing.lastRentalDate)) {
          existing.lastRentalDate = r.createdAt;
        }
      } else {
        customerMap.set(email, {
          email,
          name,
          totalRentals: 1,
          activeRentals: r.status === 'Active Subscription' || r.status === 'Approved' ? 1 : 0,
          totalSpent: r.status !== 'Cancelled' && r.status !== 'Rejected' ? r.amount : 0,
          lastRentalDate: r.createdAt,
        });
      }
    });

    if (customerMap.size === 0) {
      return [
        {
          email: 'alex.wombat@example.com',
          name: 'Alex Wombat',
          totalRentals: 3,
          activeRentals: 2,
          totalSpent: 12497,
          lastRentalDate: new Date().toISOString(),
        },
        {
          email: 'sarah.tech@example.com',
          name: 'Sarah Connor',
          totalRentals: 2,
          activeRentals: 1,
          totalSpent: 8999,
          lastRentalDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          email: 'mike.design@example.com',
          name: 'Mike Ross',
          totalRentals: 1,
          activeRentals: 0,
          totalSpent: 2499,
          lastRentalDate: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ];
    }

    return Array.from(customerMap.values());
  },

  getNotifications(): NotificationItem[] {
    return [
      {
        id: 'notif-1',
        title: 'New Rental Order',
        message: 'Alex Wombat requested a 6-Month subscription for Modern 3-Seater Comfort Sofa.',
        type: 'rental',
        timestamp: '10 mins ago',
        read: false,
      },
      {
        id: 'notif-2',
        title: 'Inventory Alert',
        message: 'Minimalist Oak Office Desk is currently out of stock.',
        type: 'product',
        timestamp: '1 hour ago',
        read: false,
      },
      {
        id: 'notif-3',
        title: 'Rental Completed',
        message: 'Rental #R-9042 has been returned & verified.',
        type: 'rental',
        timestamp: '3 hours ago',
        read: true,
      },
      {
        id: 'notif-4',
        title: 'System Update',
        message: 'Vendor payout system is running smoothly.',
        type: 'system',
        timestamp: '1 day ago',
        read: true,
      },
    ];
  },
};

function getFallbackRentals(): RentalOrder[] {
  return [
    {
      id: 'rent-101',
      userEmail: 'alex.wombat@example.com',
      userName: 'Alex Wombat',
      productId: 'prod-1',
      productName: 'Modern 3-Seater Comfort Sofa',
      productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      selectedColor: 'Slate Blue',
      selectedSize: 'Standard',
      rentDuration: '6 Month',
      amount: 4999,
      unit: 'Month',
      status: 'Active Subscription',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'rent-102',
      userEmail: 'sarah.tech@example.com',
      userName: 'Sarah Connor',
      productId: 'prod-3',
      productName: 'Executive Mahogany Study Desk',
      productImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      selectedColor: 'Dark Mahogany',
      selectedSize: 'Large',
      rentDuration: '1 Year',
      amount: 1899,
      unit: 'Month',
      status: 'Pending',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'rent-103',
      userEmail: 'mike.design@example.com',
      userName: 'Mike Ross',
      productId: 'prod-2',
      productName: 'Minimalist Oak Office Desk',
      productImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      selectedColor: 'Natural Oak',
      selectedSize: 'Medium',
      rentDuration: '1 Month',
      amount: 299,
      unit: 'hour',
      status: 'Approved',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ];
}
