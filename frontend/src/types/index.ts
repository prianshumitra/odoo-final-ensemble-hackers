export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  colorVariants: { name: string; hex: string }[];
  sizeVariants?: string[];
  pricing: {
    amount: number;
    unit: 'hour' | 'day' | 'Month' | 'year';
  };
  duration: '1 Month' | '6 Month' | '1 Year' | '2 Years' | '3 Years';
  description: string;
}

export interface FilterState {
  searchQuery: string;
  selectedBrand: string;
  selectedColor: string;
  selectedDuration: string;
  priceRange: [number, number];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  rentDuration: string;
}

export interface RentalOrder {
  id: string;
  _id?: string;
  userEmail: string;
  userName: string;
  productId: string;
  productName: string;
  productImage: string;
  selectedColor?: string;
  selectedSize?: string;
  rentDuration: string;
  amount: number;
  unit: string;
  status: 'Pending' | 'Approved' | 'Active Subscription' | 'Returned & Completed' | 'Cancelled' | 'Rejected';
  createdAt: string;
}

export interface VendorStats {
  totalProducts: number;
  activeRentals: number;
  rentalsDueToday: number;
  upcomingPickups: number;
  upcomingReturns: number;
  overdueRentals: number;
  totalRevenue: number;
  securityDepositsHeld: number;
  lateFeeCollection: number;
  pendingRequests: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'rental' | 'product' | 'system';
  timestamp: string;
  read: boolean;
}

export interface RenterCustomer {
  email: string;
  name: string;
  totalRentals: number;
  activeRentals: number;
  totalSpent: number;
  lastRentalDate: string;
}
