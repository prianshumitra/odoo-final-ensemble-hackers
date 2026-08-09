import type { Product } from '../types';

// Hardcoded products array removed as per requirements (realtime database sync only)
export const INITIAL_PRODUCTS: Product[] = [];

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
