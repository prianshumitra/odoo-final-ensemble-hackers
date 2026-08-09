import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sidebar } from '../../components/common/Sidebar';
import { ProductCard } from '../../components/common/ProductCard';
import { Pagination } from '../../components/common/Pagination';
import { CustomSelect } from '../../components/common/CustomSelect';
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
  userRole: 'customer' | 'vendor' | 'admin';
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
  const [searchParams] = useSearchParams();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: searchParams.get('search') || '',
    selectedBrand: searchParams.get('brand') || searchParams.get('category') || 'All Brands',
    selectedColor: searchParams.get('color') || '',
    selectedDuration: 'All Duration',
    priceRange: [0, 10000],
  });

  useEffect(() => {
    const brandParam = searchParams.get('brand') || searchParams.get('category');
    const searchParam = searchParams.get('search');
    if (brandParam || searchParam) {
      setFilters((prev) => ({
        ...prev,
        selectedBrand: brandParam || prev.selectedBrand,
        searchQuery: searchParam || prev.searchQuery,
      }));
    }
  }, [searchParams]);

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
      if (q && !prod.name.toLowerCase().includes(q) && !(prod.brand && prod.brand.toLowerCase().includes(q)) && !(prod.category && prod.category.toLowerCase().includes(q))) {
        return false;
      }
      // 2. Brand
      if (filters.selectedBrand !== 'All Brands' && prod.brand !== filters.selectedBrand) {
        return false;
      }
      // 3. Color
      if (filters.selectedColor) {
        const matchesColor = prod.colorVariants?.some(
          (c) => c.name.toLowerCase().includes(filters.selectedColor.toLowerCase())
        );
        if (!matchesColor) return false;
      }
      // 4. Duration
      if (filters.selectedDuration !== 'All Duration' && prod.duration !== filters.selectedDuration) {
        return false;
      }
      // 5. Price
      const price = prod.pricePerUnit || prod.pricing?.amount || 0;
      if (price > filters.priceRange[1]) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.pricePerUnit || a.pricing?.amount || 0;
      const priceB = b.pricePerUnit || b.pricing?.amount || 0;
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return ratingB - ratingA;
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
    <div className="bg-[#F7F4EF] min-h-screen text-[#1C1C1C] flex flex-col flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        {/* Top Banner Tagline */}
        <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#E8E4DE] via-[#F3EFE8] to-[#E8E4DE] shadow-warm-xs">
          <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-[23px] relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#E8E4DE]">
            <div className="space-y-2 z-10 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-white text-[#1C1C1C] text-xs font-black px-3 py-1 rounded-full border border-[#E8E4DE] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#E8B923]" />
                <span>EZRent Premium Equipment Rentals</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1C1C1C] tracking-tight">
                Rent Furniture, Electronics & Sportswear on Your Terms
              </h1>
              <p className="text-sm text-[#8A857F] max-w-xl font-medium">
                Flexible monthly, daily, or hourly rental plans with verified security deposit management and store pickup options.
              </p>
            </div>

            <div className="flex items-center gap-3 z-10 shrink-0">
              <div className="bg-white px-4 py-3 rounded-2xl border border-[#E8E4DE] shadow-warm-xs text-center">
                <span className="block text-xl font-black text-[#1C1C1C]">100%</span>
                <span className="text-[10px] font-bold text-[#8A857F] uppercase tracking-wider">Sanitized</span>
              </div>
              <div className="bg-white px-4 py-3 rounded-2xl border border-[#E8E4DE] shadow-warm-xs text-center">
                <span className="block text-xl font-black text-[#0A0A0A]">Store</span>
                <span className="text-[10px] font-bold text-[#8A857F] uppercase tracking-wider">Pickup</span>
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
            <div className="bg-[#FAF8F5] rounded-2xl p-4 border border-[#E8E4DE] shadow-warm-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-[#8A857F]">
                <SlidersHorizontal className="w-4 h-4 text-[#1C1C1C]" />
                <span>
                  Showing <strong className="text-[#1C1C1C] font-black">{filteredProducts.length}</strong> available items
                </span>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <ArrowUpDown className="w-4 h-4 text-[#8A857F]" />
                <span className="text-xs font-bold text-[#8A857F] uppercase tracking-wider shrink-0">Sort by:</span>
                <CustomSelect
                  value={sortBy}
                  onChange={(val) => setSortBy(val as any)}
                  options={[
                    { label: 'Featured Items', value: 'featured' },
                    { label: 'Price: Low to High', value: 'price-low' },
                    { label: 'Price: High to Low', value: 'price-high' },
                    { label: 'Highest Rated ★', value: 'rating' },
                  ]}
                  className="w-44"
                />
              </div>
            </div>

            {/* Product Grid */}
            {paginatedProducts.length === 0 ? (
              <div className="bg-[#FAF8F5] rounded-3xl p-12 border border-[#E8E4DE] text-center space-y-4 shadow-warm-xs">
                <div className="w-16 h-16 rounded-full bg-[#F3EFE8] text-[#1C1C1C] flex items-center justify-center mx-auto">
                  <PackageX className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black text-[#1C1C1C]">No Products Found</h3>
                <p className="text-sm font-bold text-[#8A857F] max-w-md mx-auto">
                  No items match your selected brand, color, or price filters. Try resetting filters to see all available inventory.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-[#0A0A0A] hover:bg-[#2A2A2A] text-white text-xs font-bold rounded-full transition-colors shadow-warm-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistIds.includes(product.id)}
                    onToggleWishlist={onToggleWishlist}
                    onAddToCart={onAddToCart}
                    onSelectProduct={onSelectProduct}
                    isSignedIn={isSignedIn}
                    userRole={userRole}
                    onRequireAuth={onRequireAuth}
                  />
                ))}
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
    </div>
  );
};
