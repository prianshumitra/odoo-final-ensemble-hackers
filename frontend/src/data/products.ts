import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Modern 3-Seater Comfort Sofa',
    brand: 'IKEA',
    category: 'Furniture',
    inStock: true,
    rating: 4.8,
    reviewsCount: 42,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Slate Blue', hex: '#3B82F6' },
      { name: 'Mustard Yellow', hex: '#EAB308' },
      { name: 'Warm Beige', hex: '#D4C4ED' }
    ],
    pricing: {
      amount: 4999,
      unit: 'Month'
    },
    duration: '6 Month',
    description: 'Ultra-comfortable ergonomic living room sofa with stain-resistant fabric.'
  },
  {
    id: 'prod-2',
    name: 'Minimalist Oak Office Desk',
    brand: 'Herman Miller',
    category: 'Furniture',
    inStock: false,
    rating: 4.6,
    reviewsCount: 18,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Natural Oak', hex: '#D4A373' },
      { name: 'Walnut', hex: '#582F0E' }
    ],
    pricing: {
      amount: 299,
      unit: 'hour'
    },
    duration: '1 Month',
    description: 'Sleek wooden desk with built-in cable management and solid steel frame.'
  },
  {
    id: 'prod-3',
    name: 'Executive Mahogany Study Desk',
    brand: 'IKEA',
    category: 'Furniture',
    inStock: true,
    rating: 4.9,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Dark Mahogany', hex: '#334155' },
      { name: 'Matte Black', hex: '#18181B' }
    ],
    pricing: {
      amount: 1899,
      unit: 'Month'
    },
    duration: '1 Year',
    description: 'Premium executive desk with drawers and luxurious wood finish.'
  },
  {
    id: 'prod-4',
    name: 'Ultra-HD Smart OLED Television',
    brand: 'Sony',
    category: 'Electronics',
    inStock: true,
    rating: 4.9,
    reviewsCount: 95,
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Midnight Black', hex: '#18181B' },
      { name: 'Silver Steel', hex: '#94A3B8' }
    ],
    sizeVariants: ['36 inch', '42 inch', '55 inch'],
    pricing: {
      amount: 199,
      unit: 'day'
    },
    duration: '1 Month',
    description: 'Immersive OLED display with 120Hz refresh rate and Dolby Atmos sound.'
  },
  {
    id: 'prod-5',
    name: 'Pro Studio Workstation Desktop PC',
    brand: 'Dell',
    category: 'Electronics',
    inStock: true,
    rating: 4.7,
    reviewsCount: 24,
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Graphite Grey', hex: '#475569' },
      { name: 'Ice White', hex: '#F8FAFC' }
    ],
    pricing: {
      amount: 350,
      unit: 'day'
    },
    duration: '6 Month',
    description: 'High-performance workstation with dual monitors and GPU computing power.'
  },
  {
    id: 'prod-6',
    name: 'Pro Gaming & Creative Laptop',
    brand: 'Apple',
    category: 'Electronics',
    inStock: true,
    rating: 4.9,
    reviewsCount: 112,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Space Grey', hex: '#334155' },
      { name: 'Silver', hex: '#CBD5E1' }
    ],
    pricing: {
      amount: 450,
      unit: 'day'
    },
    duration: '1 Month',
    description: 'Ultra-portable powerhouse laptop with M3 Max processor and Retina screen.'
  },
  {
    id: 'prod-7',
    name: 'PlayStation 5 Console + Controller',
    brand: 'Sony',
    category: 'Gaming',
    inStock: true,
    rating: 4.95,
    reviewsCount: 210,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Glacier White', hex: '#F8FAFC' },
      { name: 'Midnight Black', hex: '#18181B' }
    ],
    pricing: {
      amount: 120,
      unit: 'hour'
    },
    duration: '1 Month',
    description: 'Next-gen gaming experience with DualSense haptic feedback controllers.'
  },
  {
    id: 'prod-8',
    name: 'Upholstered Luxury King Bed Frame',
    brand: 'IKEA',
    category: 'Furniture',
    inStock: true,
    rating: 4.85,
    reviewsCount: 56,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Soft Cream', hex: '#F5EBE0' },
      { name: 'Slate Grey', hex: '#64748B' }
    ],
    pricing: {
      amount: 3499,
      unit: 'Month'
    },
    duration: '1 Year',
    description: 'Plush tufted headboard king bed with ergonomic wooden slat support.'
  },
  {
    id: 'prod-9',
    name: 'Hi-Fi Studio Reference Speakers',
    brand: 'Sony',
    category: 'Electronics',
    inStock: true,
    rating: 4.75,
    reviewsCount: 39,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Matte Black', hex: '#18181B' },
      { name: 'Warm Amber Wood', hex: '#D97706' }
    ],
    pricing: {
      amount: 150,
      unit: 'day'
    },
    duration: '6 Month',
    description: 'Crisp studio monitor speakers with rich bass response and Bluetooth 5.2.'
  },
  {
    id: 'prod-10',
    name: 'Classic Vintage Rangefinder Camera',
    brand: 'Canon',
    category: 'Cameras',
    inStock: true,
    rating: 4.9,
    reviewsCount: 67,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    colorVariants: [
      { name: 'Silver & Black', hex: '#475569' }
    ],
    pricing: {
      amount: 90,
      unit: 'hour'
    },
    duration: '1 Month',
    description: 'Full-frame vintage style digital camera with prime 35mm f/1.4 lens.'
  }
];

export const BRANDS = ['All Brands', 'Sony', 'IKEA', 'Apple', 'Dell', 'Herman Miller', 'Canon'];

export const DURATION_OPTIONS = ['All Duration', '1 Month', '6 Month', '1 Year', '2 Years', '3 Years'];

export const COLOR_SWATCHES = [
  { name: 'Slate Blue', hex: '#3B82F6' },
  { name: 'Mustard', hex: '#EAB308' },
  { name: 'Purple Accent', hex: '#8B5CF6' },
  { name: 'Teal', hex: '#0D9488' },
  { name: 'Dark Charcoal', hex: '#334155' },
  { name: 'Black', hex: '#18181B' },
  { name: 'Cream / White', hex: '#F8FAFC' },
  { name: 'Coral / Amber', hex: '#F97316' }
];
