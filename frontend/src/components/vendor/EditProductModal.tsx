import React, { useState, useEffect } from 'react';
import { X, Edit3, Image, CheckCircle2 } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import type { Product } from '../../types';

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (updatedProduct: Product) => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onProductUpdated,
}) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('IKEA');
  const [category, setCategory] = useState('Furniture');
  const [amount, setAmount] = useState<number>(1499);
  const [unit, setUnit] = useState<'hour' | 'day' | 'Month' | 'year'>('Month');
  const [duration, setDuration] = useState<'1 Month' | '6 Month' | '1 Year' | '2 Years' | '3 Years'>('6 Month');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [colorName, setColorName] = useState('Slate Blue');
  const [colorHex, setColorHex] = useState('#3B82F6');
  const [inStock, setInStock] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setBrand(product.brand || 'IKEA');
      setCategory(product.category || 'Furniture');
      setAmount(product.pricing?.amount || 999);
      setUnit(product.pricing?.unit || 'Month');
      setDuration(product.duration || '6 Month');
      setDescription(product.description || '');
      setImage(product.image || '');
      setColorName(product.colorVariants?.[0]?.name || 'Standard');
      setColorHex(product.colorVariants?.[0]?.hex || '#18181B');
      setInStock(product.inStock !== undefined ? product.inStock : true);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedPayload: Product = {
      ...product,
      name,
      brand,
      category,
      pricing: { amount: Number(amount), unit },
      duration,
      description,
      image: image.trim() || product.image,
      colorVariants: [{ name: colorName, hex: colorHex }],
      inStock,
    };

    onProductUpdated(updatedPayload);
    setIsSubmitting(false);
    setSuccessMsg('Product updated successfully!');

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-[#FAF7F2] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#D4C4ED] animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#D4C4ED]/60 pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center font-bold">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#18181B]">Edit Product Details</h2>
              <p className="text-xs text-[#8A8694]">Update pricing, stock, or info for "{product.name}"</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#8A8694] hover:text-[#18181B] hover:bg-[#EFE9F6] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Product Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Brand</label>
              <CustomSelect
                value={brand}
                onChange={setBrand}
                options={['IKEA', 'Sony', 'Apple', 'Dell', 'Herman Miller', 'Canon']}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Category</label>
              <CustomSelect
                value={category}
                onChange={setCategory}
                options={['Furniture', 'Electronics', 'Gaming', 'Cameras']}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Rent Amount (Rs)</label>
              <input
                type="number"
                required
                min={10}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Pricing Unit</label>
              <CustomSelect
                value={unit}
                onChange={(val) => setUnit(val as any)}
                options={[
                  { label: 'per hour', value: 'hour' },
                  { label: 'per day', value: 'day' },
                  { label: 'per Month', value: 'Month' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Stock Availability</label>
              <CustomSelect
                value={inStock ? 'true' : 'false'}
                onChange={(val) => setInStock(val === 'true')}
                options={[
                  { label: 'In Stock', value: 'true' },
                  { label: 'Out of Stock', value: 'false' },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Color Variant</label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Color Hex</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-[#E4DFD6] p-0.5 cursor-pointer bg-white"
                />
                <input
                  type="text"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  className="flex-1 bg-[#FAF7F2] text-xs font-medium rounded-xl px-3 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Image URL</label>
            <div className="relative">
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl pl-9 pr-3 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
              />
              <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#18181B] mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
            </button>
          </div>

          {successMsg && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold pt-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
