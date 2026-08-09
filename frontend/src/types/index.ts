export interface Product {
  id: string;
  _id?: string;
  name: string;
  category: string;
  description: string;
  image: string;
  pricePerUnit?: number;
  pricingUnit?: 'hour' | 'day' | 'week' | 'month';
  quantityOnHand?: number;
  isPublished?: boolean;
  vendorId?: string;
  vendorName?: string;

  // Legacy compatibility fields (used by existing frontend components)
  brand?: string;
  type?: string;
  inStock?: boolean;
  rating?: number;
  reviewsCount?: number;
  images?: string[];
  salesPrice?: number;
  costPrice?: number;
  colorVariants?: { name: string; hex: string }[];
  sizeVariants?: string[];
  attributes?: Array<{ attribute: string; values: string[] }>;
  pricing?: { amount: number; unit: string };
  duration?: string;
  rental?: any;
  isSystemProduct?: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedBrand: string;
  selectedCategory?: string;
  selectedColor: string;
  selectedDuration: string;
  priceRange: [number, number];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  rentDuration?: string;
  startDate?: string;
  endDate?: string;
}

export interface OrderLine {
  product?: any;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  unit?: string;
  variant?: string;
  selectedColor?: string;
  selectedSize?: string;
  note?: string;
}

export interface FullRentalOrder {
  _id: string;
  orderRef: string;
  customerName: string;
  customerEmail: string;
  vendorId?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'quotation_sent' | 'picked_up' | string;
  lines: OrderLine[];
  total: number;
  createdAt: string;

  // Legacy compatibility (used by existing frontend components)
  invoiceStatus?: string;
  invoiceAddress?: any;
  deliveryAddress?: any;
  deliveryMethod?: string;
  rentalPeriod?: { start: string; end: string };
  note?: string;
  untaxedAmount?: number;
  taxRate?: number;
  taxAmount?: number;
  deliveryCharges?: number;
  securityDeposit?: any;
  pickupDate?: string;
  returnDate?: string;
  actualReturnDate?: string;
  lateFeeCalculated?: number;
}

// Alias for backwards compatibility
export type RentalOrder = any;

export interface Attribute {
  _id: string;
  name: string;
  values: string[];
  displayType: 'radio' | 'pills' | 'checkbox' | 'image';
  extraPricePerValue: Array<{ value: string; extraPrice: number }>;
  showVariantImages: boolean;
}

export interface PricelistRule {
  applyOn: 'all' | 'category' | 'product';
  targetId?: string;
  minQty: number;
  priceType: 'discount' | 'fixed';
  value: number;
}

export interface Pricelist {
  _id: string;
  name: string;
  isDefault: boolean;
  validFrom?: string;
  validTo?: string;
  rules: PricelistRule[];
}

export interface InvoiceLine {
  product?: any;
  productName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  order: string;
  orderRef: string;
  customerName: string;
  customerEmail: string;
  invoiceDate: string;
  dueDate?: string;
  status: 'draft' | 'posted' | 'paid' | 'cancelled';
  lines: InvoiceLine[];
  untaxedAmount: number;
  taxAmount: number;
  total: number;
  pdfUrl?: string;
}

export interface QuotationTemplate {
  _id: string;
  name: string;
  lines: Array<{ description: string; defaultQty: number; defaultPrice: number }>;
  validityDays: number;
  paymentTermsPercent: number;
  headerHtml: string;
  footerHtml: string;
}

export interface SecurityDeposit {
  amount: number;
  status: 'held' | 'refunded' | 'partially_deducted';
  deductedAmount: number;
  refundedAmount: number;
}

export interface Settings {
  _id?: string;
  lateFeeEnabled: boolean;
  defaultLateFeeAmount: number;
  variantsEnabled: boolean;
  pricelistEnabled: boolean;
  gracePeriodMinutes: number;
  maxLateFeeCap: number;
  companyHeader: string;
  companyFooter: string;
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
  quickCounts?: { today: number; late: number; pickup: number };
  last7DaysSales?: { amount: number; percentageChange: number };
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
