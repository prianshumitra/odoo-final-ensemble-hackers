import React, { useMemo } from 'react';
import {
  ShoppingBag,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  Tag,
  Key,
  Store,
  Laptop,
  Tv,
  Clock,
  Heart,
  Zap,
  RotateCcw,
  Sliders,
  Calendar,
  Award,
  Box,
  Layers,
  Smile,
  Compass,
  Gift,
  Briefcase,
  Camera,
  Headphones,
  Radio,
  Watch,
  PenTool,
  Sun,
  Moon,
  Feather,
  CheckCircle2,
} from 'lucide-react';

const iconPool = [
  ShoppingBag,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  Tag,
  Key,
  Store,
  Laptop,
  Tv,
  Clock,
  Heart,
  Zap,
  RotateCcw,
  Sliders,
  Calendar,
  Award,
  Box,
  Layers,
  Smile,
  Compass,
  Gift,
  Briefcase,
  Camera,
  Headphones,
  Radio,
  Watch,
  PenTool,
  Sun,
  Moon,
  Feather,
  CheckCircle2,
];

const rotations = [
  'rotate-0',
  'rotate-12',
  '-rotate-12',
  'rotate-45',
  '-rotate-45',
  'rotate-90',
  '-rotate-90',
  'rotate-[30deg]',
  '-rotate-[30deg]',
];

export const AuthBackgroundDoodle: React.FC = () => {
  const gridItems = useMemo(() => {
    return Array.from({ length: 120 }).map((_, index) => {
      const IconComponent = iconPool[index % iconPool.length];
      const rotation = rotations[index % rotations.length];
      const isAmber = index % 5 === 0;
      const isLarge = index % 7 === 0;

      return {
        id: index,
        IconComponent,
        rotation,
        colorClass: isAmber ? 'text-[#E8B923]/25 font-bold animate-pulse' : 'text-[#1C1C1C]/[0.08]',
        sizeClass: isLarge ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-5 h-5 sm:w-6 sm:h-6',
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0 p-4 sm:p-8">
      <div className="w-full h-full grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-6 sm:gap-10 items-center justify-items-center opacity-90">
        {gridItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-center transition-transform hover:scale-125 ${item.rotation} ${item.colorClass}`}
          >
            <item.IconComponent className={`${item.sizeClass} stroke-[1.75]`} />
          </div>
        ))}
      </div>
    </div>
  );
};
