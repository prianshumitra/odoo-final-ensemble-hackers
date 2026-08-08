import React from 'react';
import { Eye, Edit3, Trash2, CheckCircle, XCircle } from 'lucide-react';
import type { Product } from '../../types';

interface VendorProductTableProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
  onToggleStock: (product: Product) => void;
}

export const VendorProductTable: React.FC<VendorProductTableProps> = ({
  products,
  onSelectProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleStock,
}) => {
  if (products.length === 0) {
    return (
      <div className="bg-[#EFE9F6] rounded-3xl p-12 text-center border border-[#D4C4ED] space-y-3">
        <p className="text-base font-extrabold text-[#18181B]">No products found</p>
        <p className="text-xs text-[#8A8694] max-w-sm mx-auto">
          You haven't listed any products yet, or no products match your filter.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#EFE9F6] rounded-3xl border border-[#D4C4ED] shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D4C4ED]/60 bg-[#EFE9F6]/80 text-[11px] font-bold uppercase tracking-wider text-[#8A8694]">
              <th className="py-3.5 px-4">Product</th>
              <th className="py-3.5 px-4">Brand</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Rate</th>
              <th className="py-3.5 px-4">Tenure</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4C4ED]/40 text-xs font-semibold">
            {products.map((prod) => (
              <tr
                key={prod.id}
                className="hover:bg-white/60 transition-colors group cursor-pointer"
                onClick={() => onSelectProduct(prod)}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 object-cover rounded-xl shrink-0 bg-white"
                    />
                    <div className="min-w-0">
                      <span className="block font-bold text-[#18181B] truncate max-w-xs group-hover:text-[#7E3AF2] transition-colors">
                        {prod.name}
                      </span>
                      <span className="text-[10px] text-[#8A8694]">ID: {prod.id.slice(-6)}</span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4 text-[#3E3A47]">{prod.brand}</td>
                <td className="py-3 px-4 text-[#3E3A47]">{prod.category}</td>

                <td className="py-3 px-4 font-extrabold text-[#18181B]">
                  Rs. {prod.pricing.amount.toLocaleString()} / {prod.pricing.unit}
                </td>

                <td className="py-3 px-4 text-[#6E6A78]">{prod.duration}</td>

                <td className="py-3 px-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStock(prod);
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-transform hover:scale-105 ${
                      prod.inStock
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}
                    title="Click to toggle availability"
                  >
                    {prod.inStock ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                        <span>In Stock</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Out of Stock</span>
                      </>
                    )}
                  </button>
                </td>

                <td className="py-3 px-4 text-right">
                  <div
                    className="flex items-center justify-end gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onSelectProduct(prod)}
                      className="p-1.5 text-[#8A8694] hover:text-[#7E3AF2] hover:bg-white rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEditProduct(prod)}
                      className="p-1.5 text-[#8A8694] hover:text-[#7E3AF2] hover:bg-white rounded-lg transition-colors"
                      title="Edit Product"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteProduct(prod)}
                      className="p-1.5 text-[#8A8694] hover:text-rose-600 hover:bg-white rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden divide-y divide-[#D4C4ED]/60">
        {products.map((prod) => (
          <div
            key={prod.id}
            onClick={() => onSelectProduct(prod)}
            className="p-4 space-y-3 hover:bg-white/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <img
                src={prod.image}
                alt={prod.name}
                className="w-14 h-14 object-cover rounded-xl shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-[#18181B] truncate">{prod.name}</h4>
                <p className="text-[11px] text-[#8A8694]">{prod.brand} • {prod.category}</p>
                <p className="text-xs font-extrabold text-[#7E3AF2] mt-0.5">
                  Rs. {prod.pricing.amount.toLocaleString()} / {prod.pricing.unit}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#D4C4ED]/40">
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  prod.inStock ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'
                }`}
              >
                {prod.inStock ? 'In Stock' : 'Out of Stock'}
              </span>

              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onEditProduct(prod)}
                  className="px-2.5 py-1 text-xs font-bold bg-white text-[#7E3AF2] rounded-lg border border-[#D4C4ED]"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteProduct(prod)}
                  className="px-2.5 py-1 text-xs font-bold bg-rose-50 text-rose-600 rounded-lg border border-rose-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
