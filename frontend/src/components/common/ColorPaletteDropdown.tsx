import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Palette, X } from 'lucide-react';
import { COLOR_SWATCHES } from '../../data/products';

interface ColorPaletteDropdownProps {
  value: string;
  onChange: (colorName: string) => void;
  label?: string;
}

export const ColorPaletteDropdown: React.FC<ColorPaletteDropdownProps> = ({
  value,
  onChange,
  label = 'COLOR PALETTE',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedSwatch = COLOR_SWATCHES.find(
    (s) => s.name.toLowerCase() === value.toLowerCase()
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-2.5 bg-white border rounded-2xl text-xs font-bold transition-all shadow-warm-xs ${
          isOpen || value
            ? 'border-[#0A0A0A] ring-2 ring-[#0A0A0A]/10 text-[#1C1C1C]'
            : 'border-[#E8E4DE] text-[#1C1C1C] hover:border-[#0A0A0A]'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          {selectedSwatch ? (
            <span
              className="w-4 h-4 rounded-md shrink-0 border border-black/10 shadow-2xs"
              style={{ backgroundColor: selectedSwatch.hex }}
            />
          ) : (
            <Palette className="w-4 h-4 text-[#E8B923] shrink-0" />
          )}
          <span className="truncate">{selectedSwatch ? selectedSwatch.name : label}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0 ml-2">
          {value && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-0.5 rounded-full hover:bg-[#F3EFE8] text-[#8A857F] hover:text-[#1C1C1C] transition-colors"
              title="Clear Color Filter"
            >
              <X className="w-3 h-3" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#8A857F] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#0A0A0A]' : ''
            }`}
          />
        </div>
      </button>

      {/* Dropdown Popup Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#FAF8F5] border border-[#E8E4DE] rounded-3xl p-5 shadow-warm-lg space-y-3.5 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-[#E8E4DE] pb-2.5">
            <span className="text-[11px] font-black text-[#1C1C1C] uppercase tracking-widest flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#E8B923]" />
              {label}
            </span>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
                className="text-[10px] font-bold text-[#8A857F] hover:text-[#1C1C1C] underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          {/* 8 Color Swatches 2x4 Grid matching reference image */}
          <div className="grid grid-cols-4 gap-3 p-1">
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = value.toLowerCase() === swatch.name.toLowerCase();
              const isLight =
                swatch.hex === '#F8FAFC' || swatch.hex === '#FFFFFF' || swatch.hex === '#F5EBE0';

              return (
                <button
                  key={swatch.name}
                  type="button"
                  onClick={() => {
                    onChange(isSelected ? '' : swatch.name);
                    setIsOpen(false);
                  }}
                  title={swatch.name}
                  className={`relative w-full aspect-square rounded-2xl flex items-center justify-center transition-all shadow-warm-xs ${
                    isSelected
                      ? 'ring-3 ring-offset-2 ring-[#0A0A0A] scale-105 border-transparent'
                      : 'hover:scale-105 border border-black/10'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-5 h-5 stroke-[2.5] ${
                        isLight ? 'text-[#1C1C1C]' : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
