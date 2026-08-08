import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 mb-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          currentPage === 1
            ? 'text-[#C4BBB0] bg-white border border-[#EAE4DB] cursor-not-allowed'
            : 'text-[#18181B] bg-white border border-[#EAE4DB] hover:bg-[#EFE9F6] hover:text-[#7E3AF2] hover:border-[#7E3AF2] shadow-sm'
        }`}
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Page Numbers */}
      {[...Array(totalPages)].map((_, idx) => {
        const pageNum = idx + 1;
        const isActive = currentPage === pageNum;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-10 h-10 rounded-full text-sm font-bold transition-all shadow-sm ${
              isActive
                ? 'bg-[#18181B] text-white ring-2 ring-offset-1 ring-[#18181B]'
                : 'bg-white text-[#3E3A47] border border-[#EAE4DB] hover:bg-[#EFE9F6] hover:text-[#7E3AF2]'
            }`}
          >
            {pageNum}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          currentPage === totalPages
            ? 'text-[#C4BBB0] bg-white border border-[#EAE4DB] cursor-not-allowed'
            : 'text-[#18181B] bg-white border border-[#EAE4DB] hover:bg-[#EFE9F6] hover:text-[#7E3AF2] hover:border-[#7E3AF2] shadow-sm'
        }`}
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
