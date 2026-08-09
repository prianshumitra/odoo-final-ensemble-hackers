import React, { useMemo } from 'react';
import { Filter, RotateCcw, Check } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { DURATION_OPTIONS, COLOR_SWATCHES } from '../../data/products';
import type { FilterState, Product } from '../../types';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  products?: Product[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  products = [],
}) => {
  const dynamicBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand && p.brand.trim()) brandsSet.add(p.brand.trim());
    });
    return ['All Brands', ...Array.from(brandsSet)];
  }, [products]);

  return (
    <aside className="w-full lg:w-72 bg-[#FAF8F5] rounded-3xl p-6 border border-[#E8E4DE] shadow-warm-xs space-y-7 shrink-0 self-start sticky top-24">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-4">
        <div className="flex items-center gap-2 text-[#1C1C1C] font-black text-base tracking-tight">
          <Filter className="w-4 h-4 text-[#0A0A0A]" />
          <span>Filter Products</span>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs font-bold text-[#8A857F] hover:text-[#0A0A0A] transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Brand Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
          Brand
        </label>
        <CustomSelect
          value={filters.selectedBrand}
          onChange={(val) => onFilterChange({ selectedBrand: val })}
          options={dynamicBrands}
          placeholder="All Brands"
        />
      </div>

      {/* 2. Color Swatches Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
            Color Palette
          </label>
          {filters.selectedColor && (
            <button
              onClick={() => onFilterChange({ selectedColor: '' })}
              className="text-[11px] font-bold text-[#0A0A0A] underline hover:opacity-80"
            >
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2.5 pt-1">
          {COLOR_SWATCHES.map((swatch) => {
            const isSelected = filters.selectedColor === swatch.name;
            return (
              <button
                key={swatch.name}
                onClick={() =>
                  onFilterChange({
                    selectedColor: isSelected ? '' : swatch.name,
                  })
                }
                title={swatch.name}
                className={`relative w-full aspect-square rounded-xl flex items-center justify-center transition-all shadow-2xs ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-[#0A0A0A] scale-105 border-transparent'
                    : 'hover:scale-105 border border-[#E8E4DE]'
                }`}
                style={{ backgroundColor: swatch.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-4 h-4 ${
                      swatch.hex === '#F8FAFC' || swatch.hex === '#F5EBE0'
                        ? 'text-[#1C1C1C]'
                        : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Duration Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
          Rental Duration
        </label>
        <CustomSelect
          value={filters.selectedDuration}
          onChange={(val) => onFilterChange({ selectedDuration: val })}
          options={DURATION_OPTIONS}
          placeholder="All Durations"
        />
      </div>

      {/* 4. Price Range Filter */}
      {(() => {
        const maxCatalogPrice = Math.max(50000, ...products.map((p) => p.pricePerUnit || p.pricing?.amount || 0));
        const pricePercent = Math.min(100, Math.max(0, (filters.priceRange[1] / maxCatalogPrice) * 100));
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#1C1C1C] uppercase tracking-wider">
                Price Range
              </label>
              <span className="text-xs font-bold text-[#1C1C1C] bg-white px-2.5 py-1 rounded-full border border-[#E8E4DE] shadow-warm-xs">
                Up to Rs. {filters.priceRange[1].toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={maxCatalogPrice}
              step={250}
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFilterChange({
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              style={{
                background: `linear-gradient(to right, #0A0A0A 0%, #0A0A0A ${pricePercent}%, #E8E4DE ${pricePercent}%, #E8E4DE 100%)`,
              }}
              className="w-full h-2.5 rounded-lg cursor-pointer transition-all border border-[#E8E4DE] shadow-inner"
            />
            <div className="flex items-center justify-between text-[11px] font-bold text-[#8A857F]">
              <span>Rs. 0</span>
              <span>Rs. {maxCatalogPrice.toLocaleString()}+</span>
            </div>
          </div>
        );
      })()}

      {/* Filter Quick Badges Summary */}
      {(filters.selectedBrand !== 'All Brands' ||
        filters.selectedColor ||
        filters.selectedDuration !== 'All Duration' ||
        filters.priceRange[1] < 10000) && (
        <div className="pt-3 border-t border-[#E8E4DE] space-y-2">
          <span className="text-[11px] font-bold text-[#8A857F] uppercase tracking-wider">
            Active Filters:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {filters.selectedBrand !== 'All Brands' && (
              <span className="inline-flex items-center gap-1 bg-[#0A0A0A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Brand: {filters.selectedBrand}
              </span>
            )}
            {filters.selectedColor && (
              <span className="inline-flex items-center gap-1 bg-[#0A0A0A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Color: {filters.selectedColor}
              </span>
            )}
            {filters.selectedDuration !== 'All Duration' && (
              <span className="inline-flex items-center gap-1 bg-[#0A0A0A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Duration: {filters.selectedDuration}
              </span>
            )}
            {filters.priceRange[1] < 10000 && (
              <span className="inline-flex items-center gap-1 bg-[#0A0A0A] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                Max: Rs. {filters.priceRange[1]}
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
