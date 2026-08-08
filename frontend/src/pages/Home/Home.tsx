import React, { useState, useMemo } from 'react';
import { Sidebar } from '../../components/common/Sidebar';
import { ProductCard } from '../../components/common/ProductCard';
import { Pagination } from '../../components/common/Pagination';
import type { Product, FilterState } from '../../types';
import { SlidersHorizontal, ArrowUpDown, PackageX, Sparkles } from 'lucide-react';

interface HomeProps {
  products: Product[];
  searchQuery: string;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, selectedColor?: string, selectedSize?: string) => void;
  onSelectProduct: (product: Product) => void;
  isSignedIn: boolean;
  userRole: 'customer' | 'vendor';
  onRequireAuth: (message: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  products,
  searchQuery,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  isSignedIn,
  userRole,
  onRequireAuth,
}) => {
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedBrand: 'All Brands',
    selectedColor: '',
    selectedDuration: 'All Duration',
    priceRange: [0, 10000],
  });

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Handle filter changes
  const handleFilterChange = (updatedFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      selectedBrand: 'All Brands',
      selectedColor: '',
      selectedDuration: 'All Duration',
      priceRange: [0, 10000],
    });
    setCurrentPage(1);
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Search Query (Global or header)
      const q = (searchQuery || filters.searchQuery).toLowerCase();
      if (q && !prod.name.toLowerCase().includes(q) && !prod.brand.toLowerCase().includes(q) && !prod.category.toLowerCase().includes(q)) {
        return false;
      }
      // 2. Brand
      if (filters.selectedBrand !== 'All Brands' && prod.brand !== filters.selectedBrand) {
        return false;
      }
      // 3. Color
      if (filters.selectedColor) {
        const matchesColor = prod.colorVariants.some(
          (c) => c.name.toLowerCase().includes(filters.selectedColor.toLowerCase())
        );
        if (!matchesColor) return false;
      }
      // 4. Duration
      if (filters.selectedDuration !== 'All Duration' && prod.duration !== filters.selectedDuration) {
        return false;
      }
      // 5. Price
      if (prod.pricing.amount > filters.priceRange[1]) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.pricing.amount - b.pricing.amount;
      if (sortBy === 'price-high') return b.pricing.amount - a.pricing.amount;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [searchQuery, filters, sortBy, products]);

  // Paginated slices
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
      {/* Top Banner Tagline with Light Purple to Off-White Gradient Border */}
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#C4B2E2] via-[#D4C4ED] to-[#EAE4DB] shadow-xs">
        <div className="bg-gradient-to-r from-[#EFE9F6] via-[#FAF7F2] to-[#F5EBE0] p-6 sm:p-8 rounded-[23px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-xs text-[#7E3AF2] text-xs font-bold px-3 py-1 rounded-full border border-[#D4C4ED]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Flexible Rentals</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#18181B] tracking-tight">
              Rent Furniture, Electronics & Tech on Your Terms
            </h1>
            <p className="text-sm text-[#6E6A78] max-w-xl">
              Choose from flexible monthly, daily, or hourly plans with zero upfront commitment and free delivery.
            </p>
          </div>

          <div className="flex items-center gap-3 z-10 shrink-0">
            <div className="bg-gradient-to-br from-[#E2D5F7] to-[#FAF7F2] px-4 py-3 rounded-2xl border border-[#C4B2E2] shadow-xs text-center">
              <span className="block text-xl font-extrabold text-[#18181B]">100%</span>
              <span className="text-[11px] font-semibold text-[#6E6A78] uppercase">Inspected</span>
            </div>
            <div className="bg-gradient-to-br from-[#E2D5F7] to-[#FAF7F2] px-4 py-3 rounded-2xl border border-[#C4B2E2] shadow-xs text-center">
              <span className="block text-xl font-extrabold text-[#7E3AF2]">Free</span>
              <span className="text-[11px] font-semibold text-[#6E6A78] uppercase">Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section (Sidebar + Product Grid) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar Filter */}
        <Sidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />

        {/* Right Main Product Area */}
        <main className="flex-1 w-full space-y-6">
          {/* Header Controls Bar */}
          <div className="bg-[#EFE9F6] rounded-2xl p-4 border border-[#D4C4ED] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-[#6E6A78]">
              <SlidersHorizontal className="w-4 h-4 text-[#7E3AF2]" />
              <span>
                Showing <strong className="text-[#18181B] font-bold">{filteredProducts.length}</strong> available products
              </span>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-[#8A8694]" />
              <span className="text-xs font-semibold text-[#8A8694] uppercase shrink-0">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="bg-white/90 text-[#1E1B26] text-xs font-semibold rounded-xl px-3 py-2 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2] cursor-pointer shadow-xs"
              >
                <option value="featured">Featured Items</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated ★</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-[#EAE4DB] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center mx-auto">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#18181B]">No Products Found</h3>
              <p className="text-sm text-[#8A8694] max-w-md mx-auto">
                No items match your selected brand, color, or price filters. Try resetting filters to see all available inventory.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {/*{paginatedProducts.map((product) => (*/}
              {/*  <ProductCard*/}
              {/*    key={product.id}*/}
              {/*    product={product}*/}
              {/*    isWishlisted={wishlistIds.includes(product.id)}*/}
              {/*    onToggleWishlist={onToggleWishlist}*/}
              {/*    onAddToCart={onAddToCart}*/}
              {/*    onSelectProduct={onSelectProduct}*/}
              {/*    isSignedIn={isSignedIn}*/}
              {/*    userRole={userRole}*/}
              {/*    onRequireAuth={onRequireAuth}*/}
              {/*  />*/}
              {/*))}*/}
              {}
            </div>
          )}

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      </div>
    </div>
  );
};
//home