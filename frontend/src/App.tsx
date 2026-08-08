import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { WishlistDrawer } from './components/common/WishlistDrawer';
import { Home } from './pages/Home/Home';
import { Terms } from './pages/Terms/Terms';
import { About } from './pages/About/About';
import { Contact } from './pages/Contact/Contact';
import { Account } from './pages/Account/Account';
import { Orders } from './pages/Orders/Orders';
import { Settings } from './pages/Settings/Settings';
import type { Product, CartItem } from './types';
import { INITIAL_PRODUCTS } from './data/products';

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: INITIAL_PRODUCTS[0], // Sofa initial item
      quantity: 1,
      selectedColor: 'Slate Blue',
      rentDuration: '6 Month',
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(['prod-[#prod-4]', 'prod-7']);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (
    product: Product,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: 1,
            selectedColor,
            selectedSize,
            rentDuration: product.duration,
          },
        ];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id]
    );
  };

  const wishlistProducts = INITIAL_PRODUCTS.filter((p) =>
    wishlistIds.includes(p.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1B26] selection:bg-[#EFE9F6] selection:text-[#7E3AF2]">
      {/* Reusable Header Navbar */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Main Route Pages */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchQuery={searchQuery}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={handleAddToCart}
            />
          }
        />
        <Route path="/terms" element={<Terms />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>

      {/* Reusable Footer */}
      <Footer />

      {/* Interactive Cart & Wishlist Sliding Drawers */}
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
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
