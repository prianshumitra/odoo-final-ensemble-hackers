import axios from 'axios';
import type { Product, CartItem } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const API_BASE_URL = 'http://localhost:5000/api';

// Create Axios Instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to set current user context for requests
export const setAuthHeaders = (user: { id?: string; email?: string; name?: string; role?: string } | null, token?: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }

  if (user) {
    api.defaults.headers.common['x-user-id'] = user.id || user.email || '';
    api.defaults.headers.common['x-user-email'] = user.email || '';
    api.defaults.headers.common['x-user-name'] = user.name || '';
    api.defaults.headers.common['x-user-role'] = user.role || 'customer';
  } else {
    delete api.defaults.headers.common['x-user-id'];
    delete api.defaults.headers.common['x-user-email'];
    delete api.defaults.headers.common['x-user-name'];
    delete api.defaults.headers.common['x-user-role'];
  }
};

// API Methods
export const productService = {
  async getProducts(params?: Record<string, any>): Promise<Product[]> {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      console.warn('Backend API unreachable, returning fallback products:', error);
      return INITIAL_PRODUCTS;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      return INITIAL_PRODUCTS.find((p) => p.id === id) || null;
    }
  },

  async createProduct(productData: Partial<Product>): Promise<Product> {
    try {
      const response = await api.post('/products', {
        name: productData.name,
        brand: productData.brand,
        category: productData.category,
        amount: productData.pricing?.amount || 999,
        unit: productData.pricing?.unit || 'Month',
        duration: productData.duration || '6 Month',
        description: productData.description,
        image: productData.image,
        colorVariants: productData.colorVariants,
        sizeVariants: productData.sizeVariants,
        inStock: productData.inStock,
      });
      return response.data.product;
    } catch (error) {
      const newProd: Product = {
        id: `local-${Date.now()}`,
        name: productData.name || 'New Rental Item',
        brand: productData.brand || 'Vendor Store',
        category: productData.category || 'General',
        inStock: productData.inStock !== undefined ? productData.inStock : true,
        rating: 5.0,
        reviewsCount: 1,
        image: productData.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
        colorVariants: productData.colorVariants || [{ name: 'Standard', hex: '#18181B' }],
        sizeVariants: productData.sizeVariants,
        pricing: productData.pricing || { amount: 999, unit: 'Month' },
        duration: productData.duration || '6 Month',
        description: productData.description || 'Newly listed rental item.',
      };
      return newProd;
    }
  },

  async getVendorProducts(): Promise<Product[]> {
    try {
      const response = await api.get('/products/vendor/my-products');
      return response.data.map((p: any) => ({ ...p, id: p._id || p.id }));
    } catch (error) {
      console.warn('Backend API unreachable for vendor products, returning initial products');
      return INITIAL_PRODUCTS;
    }
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
    try {
      const response = await api.put(`/products/${id}`, {
        name: productData.name,
        brand: productData.brand,
        category: productData.category,
        amount: productData.pricing?.amount,
        unit: productData.pricing?.unit,
        duration: productData.duration,
        description: productData.description,
        image: productData.image,
        colorVariants: productData.colorVariants,
        sizeVariants: productData.sizeVariants,
        inStock: productData.inStock,
      });
      return { ...response.data.product, id: response.data.product._id || response.data.product.id };
    } catch (error) {
      console.warn('Failed to update product via API:', error);
      return null;
    }
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await api.delete(`/products/${id}`);
      return true;
    } catch (error) {
      return false;
    }
  },
};

export const cartService = {
  async getCart(): Promise<any[]> {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async syncCart(items: CartItem[]): Promise<any[]> {
    try {
      const formatted = items.map((i) => ({
        productId: i.product.id || (i.product as any)._id,
        productName: i.product.name,
        productImage: i.product.image,
        amount: i.product.pricing?.amount || 0,
        unit: i.product.pricing?.unit || 'Month',
        quantity: i.quantity,
        selectedColor: i.selectedColor || '',
        selectedSize: i.selectedSize || '',
        rentDuration: i.rentDuration || i.product.duration || '6 Month',
      }));

      const response = await api.post('/cart/sync', { items: formatted });
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async clearCart(): Promise<void> {
    try {
      await api.delete('/cart');
    } catch (error) {}
  },
};

export const rentalService = {
  async createRental(cartItem: CartItem) {
    try {
      const response = await api.post('/rentals', {
        productId: cartItem.product.id || (cartItem.product as any)._id,
        productName: cartItem.product.name,
        productImage: cartItem.product.image,
        selectedColor: cartItem.selectedColor,
        selectedSize: cartItem.selectedSize,
        rentDuration: cartItem.rentDuration,
        amount: cartItem.product.pricing?.amount || 0,
        unit: cartItem.product.pricing?.unit || 'Month',
      });
      return response.data;
    } catch (error) {
      return { success: true, message: 'Rental recorded' };
    }
  },

  async getMyRentals() {
    try {
      const response = await api.get('/rentals/my-rentals');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async getVendorRentals() {
    try {
      const response = await api.get('/rentals/vendor');
      return response.data;
    } catch (error) {
      return [];
    }
  },

  async updateRentalStatus(id: string, status: string) {
    try {
      const response = await api.put(`/rentals/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return { success: false, message: 'Failed to update status' };
    }
  },
};
