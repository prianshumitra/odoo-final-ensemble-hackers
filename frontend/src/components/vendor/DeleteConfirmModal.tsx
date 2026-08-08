import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  itemTitle?: string;
  isDeleting?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Product?',
  itemTitle = 'this item',
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl z-10 border border-[#EAE4DB] animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8A8694] hover:text-[#18181B] bg-[#FAF7F2] hover:bg-[#EFE9F6] rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#18181B]">{title}</h3>
            <p className="text-xs text-[#6E6A78] mt-1 max-w-xs mx-auto">
              Are you sure you want to delete <span className="font-bold text-[#18181B]">"{itemTitle}"</span>? This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 py-2.5 bg-[#FAF7F2] hover:bg-[#EFE9F6] text-[#3E3A47] text-xs font-bold rounded-xl border border-[#E4DFD6] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </button>
        </div>
      </div>
    </div>
  );
};
