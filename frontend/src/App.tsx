import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { ProductDetailModal } from './components/common/ProductDetailModal';
import { AddProductModal } from './components/vendor/AddProductModal';
import { AuthPromptModal } from './components/common/AuthPromptModal';
import { SplashScreen } from './components/common/SplashScreen';
import { Home } from './pages/Home/Home';
import { Landing } from './pages/Landing/Landing';
import { Terms } from './pages/Terms/Terms';
import { About } from './pages/About/About';
import { Contact } from './pages/Contact/Contact';
import { Account } from './pages/Account/Account';
import { Orders } from './pages/Orders/Orders';
import { Settings } from './pages/Settings/Settings';
import { Login } from './pages/Login/Login';
import { SignUp } from './pages/SignUp/SignUp';
import { VendorSignUp } from './pages/VendorSignUp/VendorSignUp';
import { ForgotPassword } from './pages/ForgotPassword/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword/ResetPassword';
import { Checkout } from './pages/Checkout/Checkout';
import { AdminLogin } from './pages/AdminLogin/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard/AdminDashboard';
import { VendorLayout } from './pages/Vendor/VendorLayout';
import { VendorDashboard } from './pages/Vendor/VendorDashboard';
import { VendorOrders } from './pages/Vendor/VendorOrders';
import { VendorProducts } from './pages/Vendor/VendorProducts';
import { VendorInvoices } from './pages/Vendor/VendorInvoices';
import { VendorAttributes } from './pages/Vendor/VendorAttributes';
import { VendorPricelists } from './pages/Vendor/VendorPricelists';
import { VendorCalendar } from './pages/Vendor/VendorCalendar';
import { VendorPickupsReturns } from './pages/Vendor/VendorPickupsReturns';
import { VendorQuotationTemplates } from './pages/Vendor/VendorQuotationTemplates';
import { VendorCustomers } from './pages/Vendor/VendorCustomers';
import { VendorReports } from './pages/Vendor/VendorReports';
import { VendorNotifications } from './pages/Vendor/VendorNotifications';
import { VendorSettings } from './pages/Vendor/VendorSettings';
import type { CartItem, Product } from './types';
import { productService } from './services/api';
import { getSocket } from './services/socket';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function VendorRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isVendorApproved } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: '/vendor' }} />;
  }

  if (!isVendorApproved) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-transparent text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#18181B]">Vendor Access Restricted</h1>
        <p className="text-xs text-[#6E6A78] max-w-md">
          {user?.role === 'vendor' && user.status === 'pending'
            ? 'Your vendor account is pending admin approval. You can sign in, but the vendor console stays locked until approval.'
            : 'Customer accounts cannot access the Vendor Operations Console.'}
        </p>
        <a
          href="/"
          className="px-6 py-2.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white font-bold text-xs rounded-xl transition-all shadow-md"
        >
          Return to Customer Storefront
        </a>
      </div>
    );
  }

  return <>{children}</>;
}

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('ezrent_splash_shown');
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('ezrent_splash_shown', 'true');
    setShowSplash(false);
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [authPromptMsg, setAuthPromptMsg] = useState('Please sign in to continue.');

  const userRole = user?.role || 'customer';

  const handleRequireAuth = (message: string) => {
    setAuthPromptMsg(message);
    setIsAuthPromptOpen(true);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch {
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const socket = getSocket();

    const onProductCreated = (newProduct: Product) => {
      setProducts((prev) => [newProduct, ...prev]);
    };

    const onProductUpdated = (updatedProd: Product) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === updatedProd.id || p._id === updatedProd._id ? updatedProd : p))
      );
    };

    const onProductDeleted = (deletedId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== deletedId && p._id !== deletedId));
    };

    socket.on('product:created', onProductCreated);
    socket.on('product:updated', onProductUpdated);
    socket.on('product:deleted', onProductDeleted);

    return () => {
      socket.off('product:created', onProductCreated);
      socket.off('product:updated', onProductUpdated);
      socket.off('product:deleted', onProductDeleted);
    };
  }, []);

  const handleAddToCart = (
    product: Product,
    selectedColor?: string,
    selectedSize?: string,
    startDate?: string,
    endDate?: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        if (selectedColor) updated[existingIndex].selectedColor = selectedColor;
        if (selectedSize) updated[existingIndex].selectedSize = selectedSize;
        if (startDate) updated[existingIndex].startDate = startDate;
        if (endDate) updated[existingIndex].endDate = endDate;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedColor: selectedColor || product.colorVariants?.[0]?.name || 'Standard',
          selectedSize: selectedSize || product.sizeVariants?.[0] || 'Standard',
          rentDuration: product.duration || '6 Month',
          startDate,
          endDate,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-transparent font-sans antialiased text-[#1E1B26]">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/vendor-signup" element={<VendorSignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/vendor/*"
          element={
            <VendorRouteGuard>
              <VendorLayout
                userRole={userRole}
                onOpenAddProduct={() => setIsVendorModalOpen(true)}
              />
            </VendorRouteGuard>
          }
        >
          <Route index element={<VendorDashboard onOpenAddProduct={() => setIsVendorModalOpen(true)} />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="products" element={<VendorProducts onOpenAddProduct={() => setIsVendorModalOpen(true)} />} />
          <Route path="invoices" element={<VendorInvoices />} />
          <Route path="attributes" element={<VendorAttributes />} />
          <Route path="pricelists" element={<VendorPricelists />} />
          <Route path="calendar" element={<VendorCalendar />} />
          <Route path="pickups-returns" element={<VendorPickupsReturns />} />
          <Route path="quotation-templates" element={<VendorQuotationTemplates />} />
          <Route path="customers" element={<VendorCustomers />} />
          <Route path="reports" element={<VendorReports />} />
          <Route path="notifications" element={<VendorNotifications />} />
          <Route path="settings" element={<VendorSettings />} />
        </Route>
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col bg-transparent text-[#1E1B26] selection:bg-[#EFE9F6] selection:text-[#7E3AF2]">
              <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                wishlistCount={wishlistIds.length}
                onOpenCart={() => setIsCartOpen(true)}
                onOpenWishlist={() => setIsWishlistOpen(true)}
                onOpenVendorModal={() => setIsVendorModalOpen(true)}
                userRole={userRole}
                onRequireAuth={handleRequireAuth}
              />

              <main className="flex-1 flex flex-col">
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
                        onSelectProduct={setSelectedProduct}
                        isSignedIn={isAuthenticated}
                        userRole={userRole}
                        onRequireAuth={handleRequireAuth}
                      />
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <Home
                        products={products}
                        searchQuery={searchQuery}
                        wishlistIds={wishlistIds}
                        onToggleWishlist={handleToggleWishlist}
                        onAddToCart={handleAddToCart}
                        onSelectProduct={setSelectedProduct}
                        isSignedIn={isAuthenticated}
                        userRole={userRole}
                        onRequireAuth={handleRequireAuth}
                      />
                    }
                  />
                  <Route path="/landing" element={<Landing />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <Orders />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout
                          cartItems={cartItems}
                          user={user}
                          onOrderCompleted={() => setCartItems([])}
                        />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>

              <Footer />

              <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={(productId) =>
                  setCartItems((prev) => prev.filter((item) => item.product.id !== productId))
                }
              />

              <WishlistDrawer
                isOpen={isWishlistOpen}
                onClose={() => setIsWishlistOpen(false)}
                wishlistItems={wishlistedProducts}
                onRemoveFromWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />

              <ProductDetailModal
                product={selectedProduct}
                isOpen={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
                isSignedIn={isAuthenticated}
                userRole={userRole}
                onRequireAuth={handleRequireAuth}
              />

              <AddProductModal
                isOpen={isVendorModalOpen}
                onClose={() => setIsVendorModalOpen(false)}
                onProductAdded={(newProd) => {
                  setProducts((prev) => [newProd, ...prev]);
                }}
                userRole={userRole}
              />

              <AuthPromptModal
                isOpen={isAuthPromptOpen}
                onClose={() => setIsAuthPromptOpen(false)}
                actionMessage={authPromptMsg}
              />

              {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
