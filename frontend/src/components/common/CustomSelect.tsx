import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (string | Option)[];
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  icon,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Normalize options to { label, value }
  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value) || {
    label: value || placeholder,
    value: value,
  };

  // Close on outside click
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
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-white text-[#18181B] text-xs font-bold rounded-xl px-3.5 py-2.5 border transition-all cursor-pointer shadow-xs ${
          isOpen
            ? 'border-[#7E3AF2] ring-2 ring-[#7E3AF2]/20 bg-[#EFE9F6]/40'
            : 'border-[#D4C4ED] hover:border-[#7E3AF2] hover:bg-[#FAF7F2]'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {icon}
          <span className="truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#8A8694] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#7E3AF2]' : ''
          }`}
        />
      </button>

      {/* Floating Menu List */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-[#FAF7F2] rounded-2xl border border-[#D4C4ED] shadow-xl p-1.5 max-h-60 overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden animate-in fade-in slide-in-from-top-2 duration-150 space-y-0.5">
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors ${
                  isSelected
                    ? 'bg-[#7E3AF2] text-white shadow-xs'
                    : 'text-[#3E3A47] hover:bg-[#EFE9F6] hover:text-[#7E3AF2]'
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
