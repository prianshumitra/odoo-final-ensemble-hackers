import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Package } from 'lucide-react';
import { VendorProductTable } from '../../components/vendor/VendorProductTable';
import { CustomSelect } from '../../components/common/CustomSelect';
import { EditProductModal } from '../../components/vendor/EditProductModal';
import { DeleteConfirmModal } from '../../components/vendor/DeleteConfirmModal';
import { ProductDetailModal } from '../../components/common/ProductDetailModal';
import { vendorService } from '../../services/vendorService';
import { getSocket } from '../../services/socket';
import type { Product } from '../../types';

interface VendorProductsProps {
  onOpenAddProduct: () => void;
}

export const VendorProducts: React.FC<VendorProductsProps> = ({ onOpenAddProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All');

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadProducts = async () => {
    const fetched = await vendorService.getProducts();
    setProducts(fetched);
  };

  useEffect(() => {
    loadProducts();

    const socket = getSocket();
    const handleProductChange = () => {
      loadProducts();
    };

    socket.on('product:created', handleProductChange);
    socket.on('product:updated', handleProductChange);
    socket.on('product:deleted', handleProductChange);

    return () => {
      socket.off('product:created', handleProductChange);
      socket.off('product:updated', handleProductChange);
      socket.off('product:deleted', handleProductChange);
    };
  }, []);

  // Filtered product list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedStock === 'in-stock' && !p.inStock) return false;
      if (selectedStock === 'out-of-stock' && p.inStock) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStock]);

  const handleUpdateProduct = async (updated: Product) => {
    await vendorService.updateProduct(updated.id, updated);
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    await vendorService.deleteProduct(deletingProduct.id);
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    setIsDeleting(false);
    setDeletingProduct(null);
  };

  const handleToggleStock = async (prod: Product) => {
    const updated = { ...prod, inStock: !prod.inStock };
    await vendorService.updateProduct(prod.id, updated);
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? updated : p)));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#7E3AF2]" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
              Product Inventory Management
            </h1>
          </div>
          <p className="text-xs text-[#8A8694] mt-0.5">
            Manage, edit, and track availability of your listed rental items ({products.length} total)
          </p>
        </div>

        <button
          onClick={onOpenAddProduct}
          className="px-4 py-2.5 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-[#EFE9F6] rounded-2xl border border-[#D4C4ED] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or brand..."
            className="w-full bg-white text-xs font-medium rounded-xl pl-9 pr-3 py-2 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
        </div>

        {/* Category & Stock Selectors */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CustomSelect
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { label: 'All Categories', value: 'All' },
              { label: 'Furniture', value: 'Furniture' },
              { label: 'Electronics', value: 'Electronics' },
              { label: 'Gaming', value: 'Gaming' },
              { label: 'Cameras', value: 'Cameras' },
            ]}
            className="w-40"
          />

          <CustomSelect
            value={selectedStock}
            onChange={setSelectedStock}
            options={[
              { label: 'All Stock', value: 'All' },
              { label: 'In Stock', value: 'in-stock' },
              { label: 'Out of Stock', value: 'out-of-stock' },
            ]}
            className="w-36"
          />
        </div>
      </div>

      {/* Product Table / Cards */}
      <VendorProductTable
        products={filteredProducts}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onEditProduct={(prod) => setEditingProduct(prod)}
        onDeleteProduct={(prod) => setDeletingProduct(prod)}
        onToggleStock={handleToggleStock}
      />

      {/* Edit Modal */}
      <EditProductModal
        product={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onProductUpdated={handleUpdateProduct}
      />

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product?"
        itemTitle={deletingProduct?.name || ''}
        isDeleting={isDeleting}
      />

      {/* View Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isWishlisted={false}
        onToggleWishlist={() => {}}
        onAddToCart={() => {}}
        isSignedIn={true}
        userRole="vendor"
        onRequireAuth={() => {}}
      />
    </div>
  );
};
