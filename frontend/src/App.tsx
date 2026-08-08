import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { ProductDetailModal } from './components/common/ProductDetailModal';
import { AddProductModal } from './components/vendor/AddProductModal';
import { AuthPromptModal } from './components/common/AuthPromptModal';
import { Home } from './pages/Home/Home';
import { Terms } from './pages/Terms/Terms';
import { About } from './pages/About/About';
import { Contact } from './pages/Contact/Contact';
import { Account } from './pages/Account/Account';
import { Orders } from './pages/Orders/Orders';
import { Settings } from './pages/Settings/Settings';
import { Login } from './pages/Login/Login';
import { SignUp } from './pages/SignUp/SignUp';

// Vendor Pages Imports
import { VendorLayout } from './pages/Vendor/VendorLayout';
import { VendorDashboard } from './pages/Vendor/VendorDashboard';
import { VendorProducts } from './pages/Vendor/VendorProducts';
import { VendorRentals } from './pages/Vendor/VendorRentals';
import { VendorCustomers } from './pages/Vendor/VendorCustomers';
import { VendorAnalytics } from './pages/Vendor/VendorAnalytics';
import { VendorNotifications } from './pages/Vendor/VendorNotifications';
import { VendorSettings } from './pages/Vendor/VendorSettings';

import type { Product, CartItem } from './types';
import { INITIAL_PRODUCTS } from './data/products';
import { productService, rentalService, cartService, setAuthHeaders } from './services/api';
import { getSocket, joinUserRoom } from './services/socket';
import { useUser, useAuth } from '@clerk/react';

function AppContent() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRole, setUserRole] = useState<'customer' | 'vendor'>('customer');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  
  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Auth Prompt Modal state
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [authPromptMsg, setAuthPromptMsg] = useState('Please sign in to continue.');

  const handleRequireAuth = (message: string) => {
    setAuthPromptMsg(message);
    setIsAuthPromptOpen(true);
  };

  // Select role for sign-in
  const handleSelectRole = (role: 'customer' | 'vendor') => {
    setUserRole(role);
    setIsAuthPromptOpen(false);
    if (user) {
      user.update({ unsafeMetadata: { ...user.unsafeMetadata, role } }).catch(() => {});
    }
  };

  // 1. Sync Clerk Auth Context & Metadata with API service
  useEffect(() => {
    const syncAuth = async () => {
      let token: string | null = null;
      try {
        if (getToken) {
          token = await getToken();
        }
      } catch (err) {}

      if (user) {
        // Read stored role from Clerk metadata if available
        const clerkRole = (user.unsafeMetadata?.role || user.publicMetadata?.role) as 'customer' | 'vendor' | undefined;
        const effectiveRole = clerkRole || userRole;

        if (clerkRole && clerkRole !== userRole) {
          setUserRole(clerkRole);
        }

        const userEmail = user.primaryEmailAddress?.emailAddress || '';
        const userContext = {
          id: user.id,
          email: userEmail,
          name: user.fullName || user.firstName || userEmail.split('@')[0],
          role: effectiveRole,
        };
        setAuthHeaders(userContext, token);
        joinUserRoom(user.id);
      } else {
        setAuthHeaders(null, null);
      }
    };

    syncAuth();
  }, [user, userRole, getToken]);

  // 2. Fetch products from MongoDB Backend
  const loadProducts = useCallback(async () => {
    const fetched = await productService.getProducts();
    if (fetched && fetched.length > 0) {
      const formatted = fetched.map((p: any) => ({
        ...p,
        id: p._id || p.id,
      }));
      setProducts(formatted);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // 3. Sync User Cart from/to MongoDB Backend
  useEffect(() => {
    const fetchUserCart = async () => {
      if (user) {
        const serverCart = await cartService.getCart();
        if (serverCart && serverCart.length > 0) {
          const formattedCart: CartItem[] = serverCart.map((item: any) => ({
            product: {
              id: item.productId,
              name: item.productName,
              brand: 'Rental Store',
              category: 'Furniture',
              inStock: true,
              rating: 4.8,
              reviewsCount: 12,
              image: item.productImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
              colorVariants: [{ name: item.selectedColor || 'Standard', hex: '#18181B' }],
              pricing: { amount: item.amount || 999, unit: item.unit || 'Month' },
              duration: item.rentDuration || '6 Month',
              description: 'Rental item from marketplace catalog.',
            },
            quantity: item.quantity,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
            rentDuration: item.rentDuration,
          }));
          setCartItems(formattedCart);
        }
      } else {
        setCartItems([]);
      }
    };
    fetchUserCart();
  }, [user]);

  // 4. Socket.io Real-time Listeners for Products and Cart
  useEffect(() => {
    const socket = getSocket();

    const handleRealtimeProductCreated = (newProduct: any) => {
      console.log('⚡ Realtime Event Received: product:created', newProduct);
      const formatted: Product = {
        ...newProduct,
        id: newProduct._id || newProduct.id,
      };
      setProducts((prev) => {
        if (prev.some((p) => p.id === formatted.id)) return prev;
        return [formatted, ...prev];
      });
    };

    const handleRealtimeProductDeleted = (deletedId: string) => {
      console.log('⚡ Realtime Event Received: product:deleted', deletedId);
      setProducts((prev) => prev.filter((p) => p.id !== deletedId));
    };

    socket.on('product:created', handleRealtimeProductCreated);
    socket.on('product:deleted', handleRealtimeProductDeleted);

    return () => {
      socket.off('product:created', handleRealtimeProductCreated);
      socket.off('product:deleted', handleRealtimeProductDeleted);
    };
  }, []);

  // 5. Vendor adds product (Optimistic + socket confirmation)
  const handleProductAdded = (newProduct: Product) => {
    const formatted = {
      ...newProduct,
      id: (newProduct as any)._id || newProduct.id,
    };
    setProducts((prev) => {
      if (prev.some((p) => p.id === formatted.id)) return prev;
      return [formatted, ...prev];
    });
  };

  // 6. Cart Operations
  const handleAddToCart = (
    product: Product,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    if (!user) {
      handleRequireAuth('Please sign in as a Customer to rent items or add to cart.');
      return;
    }

    if (userRole === 'vendor') {
      alert('Vendor accounts are for listing products. Please switch to Customer mode to place rental orders.');
      return;
    }

    setCartItems((prev) => {
      let updatedCart: CartItem[];
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        updatedCart = [...prev];
        updatedCart[existingIndex].quantity += 1;
      } else {
        const newItem: CartItem = {
          product,
          quantity: 1,
          selectedColor,
          selectedSize,
          rentDuration: product.duration,
        };
        rentalService.createRental(newItem);
        updatedCart = [...prev, newItem];
      }
      cartService.syncCart(updatedCart);
      return updatedCart;
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (!user) {
      handleRequireAuth('Please sign in to update your cart.');
      return;
    }

    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      cartService.syncCart(updated);
      return updated;
    });
  };

  const handleRemoveCartItem = (productId: string) => {
    if (!user) return;
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.product.id !== productId);
      cartService.syncCart(updated);
      return updated;
    });
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    if (!user) {
      handleRequireAuth('Please sign in to add items to your wishlist.');
      return;
    }
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const wishlistProducts = products.filter((p) =>
    wishlistIds.includes(p.id)
  );
  const navigate = useNavigate();

  const handleToggleRole = () => {
    const nextRole = userRole === 'customer' ? 'vendor' : 'customer';
    setUserRole(nextRole);
    if (user) {
      user.update({ unsafeMetadata: { ...user.unsafeMetadata, role: nextRole } }).catch(() => {});
    }
    if (nextRole === 'vendor') {
      navigate('/vendor');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <Routes>
        {/* Vendor Dashboard Routes */}
        <Route
          path="/vendor"
          element={
            <VendorLayout
              userRole={userRole}
              onToggleRole={handleToggleRole}
              onOpenAddProduct={() => setIsVendorModalOpen(true)}
            />
          }
        >
          <Route index element={<VendorDashboard onOpenAddProduct={() => setIsVendorModalOpen(true)} />} />
          <Route path="products" element={<VendorProducts onOpenAddProduct={() => setIsVendorModalOpen(true)} />} />
          <Route path="rentals" element={<VendorRentals />} />
          <Route path="customers" element={<VendorCustomers />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="notifications" element={<VendorNotifications />} />
          <Route path="settings" element={<VendorSettings />} />
        </Route>

        {/* Customer Marketplace Routes */}
        <Route
          path="/*"
          element={
            <div className="min-h-screen flex flex-col bg-transparent text-[#1E1B26] selection:bg-[#EFE9F6] selection:text-[#7E3AF2]">
              <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
                wishlistCount={wishlistIds.length}
                onOpenCart={() => {
                  if (!user) {
                    handleRequireAuth('Please sign in to view your cart.');
                  } else {
                    setIsCartOpen(true);
                  }
                }}
                onOpenWishlist={() => {
                  if (!user) {
                    handleRequireAuth('Please sign in to view your wishlist.');
                  } else {
                    setIsWishlistOpen(true);
                  }
                }}
                onOpenVendorModal={() => {
                  if (!user) {
                    handleRequireAuth('Please sign in as a Vendor to list products.');
                  } else if (userRole !== 'vendor') {
                    handleToggleRole();
                  } else {
                    setIsVendorModalOpen(true);
                  }
                }}
                userRole={userRole}
                onToggleRole={handleToggleRole}
                onSelectRole={handleSelectRole}
              />

              <Routes>
                <Route
                  path="/"
                  element={
                    <Home
                      products={products}
                      searchQuery={searchQuery}
                      wishlistIds={wishlistIds}
                      onToggleWishlist={handleToggleWishlist}
                      onAddToCart={handleAddToCart}
                      onSelectProduct={(product) => setSelectedProduct(product)}
                      isSignedIn={!!user}
                      userRole={userRole}
                      onRequireAuth={handleRequireAuth}
                    />
                  }
                />
                <Route path="/terms" element={<Terms />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/account" element={<Account />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login onSelectRole={handleSelectRole} />} />
                <Route path="/signup" element={<SignUp onSelectRole={handleSelectRole} />} />
              </Routes>

              <Footer />

              <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
              />

              <WishlistDrawer
                isOpen={isWishlistOpen}
                onClose={() => setIsWishlistOpen(false)}
                wishlistItems={wishlistProducts}
                onRemoveFromWishlist={handleToggleWishlist}
                onAddToCart={(product) => {
                  handleAddToCart(product);
                  setIsWishlistOpen(false);
                  setIsCartOpen(true);
                }}
              />

              <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                isSignedIn={!!user}
                userRole={userRole}
                onRequireAuth={handleRequireAuth}
              />
            </div>
          }
        />
      </Routes>

      {/* Global Vendor List New Rental Product Modal */}
      <AddProductModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        onProductAdded={handleProductAdded}
      />

      {/* Global Sign In Required Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        actionMessage={authPromptMsg}
        onSelectRole={handleSelectRole}
      />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
