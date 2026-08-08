import React from 'react';
import { Filter, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { BRANDS, DURATION_OPTIONS, COLOR_SWATCHES } from '../../data/products';
import type { FilterState } from '../../types';

interface SidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onResetFilters: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <aside className="w-full lg:w-72 bg-[#EFE9F6] rounded-3xl p-6 border border-[#D4C4ED] shadow-sm space-y-7 shrink-0 self-start sticky top-24">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-[#D4C4ED]/60 pb-4">
        <div className="flex items-center gap-2 text-[#18181B] font-bold text-base">
          <Filter className="w-4 h-4 text-[#7E3AF2]" />
          <span>Filter Products</span>
        </div>
        <button
          onClick={onResetFilters}
          className="flex items-center gap-1 text-xs font-semibold text-[#8A8694] hover:text-[#7E3AF2] transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. Brand Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-[#18181B] uppercase tracking-wider">
          Brand
        </label>
        <div className="relative">
          <select
            value={filters.selectedBrand}
            onChange={(e) => onFilterChange({ selectedBrand: e.target.value })}
            aria-label="Select Brand"
            className="w-full appearance-none bg-white/90 text-[#1E1B26] text-sm font-medium rounded-xl px-4 py-2.5 pr-10 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2] focus:ring-2 focus:ring-[#7E3AF2]/20 transition-all cursor-pointer shadow-xs"
          >
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694] pointer-events-none" />
        </div>
      </div>

      {/* 2. Color Swatches Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-[#18181B] uppercase tracking-wider">
            Color Palette
          </label>
          {filters.selectedColor && (
            <button
              onClick={() => onFilterChange({ selectedColor: '' })}
              className="text-[11px] font-semibold text-[#7E3AF2] hover:underline"
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
                className={`relative w-full aspect-square rounded-xl flex items-center justify-center transition-all shadow-inner ${
                  isSelected
                    ? 'ring-2 ring-offset-2 ring-[#7E3AF2] scale-105'
                    : 'hover:scale-105 border border-[#E4DFD6]'
                }`}
                style={{ backgroundColor: swatch.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-4 h-4 ${
                      swatch.hex === '#F8FAFC' || swatch.hex === '#F5EBE0'
                        ? 'text-[#18181B]'
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
        <label className="block text-xs font-bold text-[#18181B] uppercase tracking-wider">
          Rental Duration
        </label>
        <div className="relative">
          <select
            value={filters.selectedDuration}
            onChange={(e) => onFilterChange({ selectedDuration: e.target.value })}
            aria-label="Select Rental Duration"
            className="w-full appearance-none bg-white/90 text-[#1E1B26] text-sm font-medium rounded-xl px-4 py-2.5 pr-10 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2] focus:ring-2 focus:ring-[#7E3AF2]/20 transition-all cursor-pointer shadow-xs"
          >
            {DURATION_OPTIONS.map((duration) => (
              <option key={duration} value={duration}>
                {duration}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694] pointer-events-none" />
        </div>
      </div>

      {/* 4. Price Range Filter */}
      {(() => {
        const pricePercent = Math.min(100, Math.max(0, (filters.priceRange[1] / 10000) * 100));
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#18181B] uppercase tracking-wider">
                Price Range
              </label>
              <span className="text-xs font-bold text-[#7E3AF2] bg-white/80 px-2 py-0.5 rounded-md border border-[#D4C4ED]">
                Up to Rs. {filters.priceRange[1].toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={100}
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFilterChange({
                  priceRange: [filters.priceRange[0], Number(e.target.value)],
                })
              }
              style={{
                background: `linear-gradient(to right, #7E3AF2 0%, #7E3AF2 ${pricePercent}%, #D4C4ED ${pricePercent}%, #D4C4ED 100%)`,
              }}
              className="w-full h-2.5 rounded-lg cursor-pointer transition-all border border-[#C4B2E2]/60 shadow-inner"
            />
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#8A8694]">
              <span>Rs. 0</span>
              <span>Rs. 10,000+</span>
            </div>
          </div>
        );
      })()}

      {/* Filter Quick Badges Summary */}
      {(filters.selectedBrand !== 'All Brands' ||
        filters.selectedColor ||
        filters.selectedDuration !== 'All Duration' ||
        filters.priceRange[1] < 10000) && (
        <div className="pt-3 border-t border-[#F4EFEA] space-y-2">
          <span className="text-[11px] font-bold text-[#8A8694] uppercase">
            Active Filters:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {filters.selectedBrand !== 'All Brands' && (
              <span className="inline-flex items-center gap-1 bg-[#EFE9F6] text-[#7E3AF2] text-xs font-semibold px-2.5 py-1 rounded-full">
                Brand: {filters.selectedBrand}
              </span>
            )}
            {filters.selectedColor && (
              <span className="inline-flex items-center gap-1 bg-[#EFE9F6] text-[#7E3AF2] text-xs font-semibold px-2.5 py-1 rounded-full">
                Color: {filters.selectedColor}
              </span>
            )}
            {filters.selectedDuration !== 'All Duration' && (
              <span className="inline-flex items-center gap-1 bg-[#EFE9F6] text-[#7E3AF2] text-xs font-semibold px-2.5 py-1 rounded-full">
                Duration: {filters.selectedDuration}
              </span>
            )}
            {filters.priceRange[1] < 10000 && (
              <span className="inline-flex items-center gap-1 bg-[#EFE9F6] text-[#7E3AF2] text-xs font-semibold px-2.5 py-1 rounded-full">
                Max: Rs. {filters.priceRange[1]}
              </span>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
