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
