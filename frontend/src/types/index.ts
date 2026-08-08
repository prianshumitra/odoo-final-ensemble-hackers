export interface Product {
  id: string;
  _id?: string;
  name: string;
  brand: string;
  category: string;
  type?: 'goods' | 'service';
  inStock: boolean;
  isPublished?: boolean;
  isSystemProduct?: boolean;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  salesPrice?: number;
  costPrice?: number;
  quantityOnHand?: number;
  colorVariants: { name: string; hex: string }[];
  sizeVariants?: string[];
  attributes?: Array<{
    attribute: string;
    values: string[];
  }>;
  pricing: {
    amount: number;
    unit: 'hour' | 'day' | 'Month' | 'year';
  };
  duration: '1 Month' | '6 Month' | '1 Year' | '2 Years' | '3 Years';
  rental?: {
    periodicity: 'hours' | 'day' | 'night' | 'week';
    windowStart: string;
    windowEnd: string;
    paddingTimeMinutes: number;
    lateFeeRatePerUnit: number;
    depositType: 'fixed' | 'percent';
    depositValue: number;
  };
  description: string;
  vendorId?: string;
  vendorName?: string;
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
  rentDuration: string;
  startDate?: string;
  endDate?: string;
}

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

export interface OrderLine {
  product?: any;
  productName: string;
  productImage?: string;
  variant?: string;
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  note?: string;
}

export interface SecurityDeposit {
  amount: number;
  status: 'held' | 'refunded' | 'partially_deducted';
  deductedAmount: number;
  refundedAmount: number;
}

export interface FullRentalOrder {
  _id: string;
  orderRef: string;
  customerName: string;
  customerEmail: string;
  vendorId?: string;
  status:
    | 'quotation'
    | 'quotation_sent'
    | 'confirmed'
    | 'reserved'
    | 'picked_up'
    | 'late_pickup'
    | 'late_return'
    | 'cancelled'
    | 'completed';
  invoiceStatus: 'nothing_to_invoice' | 'invoiced';
  invoiceAddress: { street?: string; city?: string; state?: string; zip?: string; country?: string };
  deliveryAddress: { street?: string; city?: string; state?: string; zip?: string; country?: string };
  deliveryMethod?: 'Standard Delivery' | 'Pick up from Store';
  rentalPeriod: { start: string; end: string };
  lines: OrderLine[];
  note?: string;
  untaxedAmount: number;
  taxRate: number;
  taxAmount: number;
  deliveryCharges: number;
  total: number;
  securityDeposit: SecurityDeposit;
  pickupDate?: string;
  returnDate?: string;
  actualReturnDate?: string;
  lateFeeCalculated?: number;
  createdAt: string;
}

// Alias for backwards compatibility
export type RentalOrder = any;

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
