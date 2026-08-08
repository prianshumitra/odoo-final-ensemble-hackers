import React, { useState } from 'react';
import { X, Plus, Store, Image, CheckCircle2 } from 'lucide-react';
import type { Product } from '../../types';
import { productService } from '../../services/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (newProduct: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fallbackImg = image.trim() || 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80';

    const productPayload: Partial<Product> = {
      name,
      brand,
      category,
      pricing: { amount: Number(amount), unit },
      duration,
      description,
      image: fallbackImg,
      colorVariants: [{ name: colorName, hex: colorHex }],
      inStock: true,
      rating: 5.0,
      reviewsCount: 1,
    };

    const createdProduct = await productService.createProduct(productPayload);
    onProductAdded(createdProduct);

    setIsSubmitting(false);
    setSuccessMsg('Product listed successfully for rental!');

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
      // Reset form
      setName('');
      setDescription('');
      setImage('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#EAE4DB] animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-4 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#18181B]">List New Rental Item</h2>
              <p className="text-xs text-[#8A8694]">Vendor Portal • Add products to the catalog</p>
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
              placeholder="e.g. Ergonomic Leather Recline Chair"
              className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Brand</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
              >
                <option value="IKEA">IKEA</option>
                <option value="Sony">Sony</option>
                <option value="Apple">Apple</option>
                <option value="Dell">Dell</option>
                <option value="Herman Miller">Herman Miller</option>
                <option value="Canon">Canon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
              >
                <option value="Furniture">Furniture</option>
                <option value="Electronics">Electronics</option>
                <option value="Gaming">Gaming</option>
                <option value="Cameras">Cameras</option>
              </select>
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
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
              >
                <option value="hour">per hour</option>
                <option value="day">per day</option>
                <option value="Month">per Month</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Tenure Plan</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value as any)}
                className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
              >
                <option value="1 Month">1 Month</option>
                <option value="6 Month">6 Month</option>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Color Variant Name</label>
              <input
                type="text"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="e.g. Slate Blue"
                className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">Color Swatch Hex</label>
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
                placeholder="https://images.unsplash.com/..."
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
              placeholder="Describe item condition, features, dimensions..."
              className="w-full bg-[#FAF7F2] text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Listing Item...' : 'Publish Item for Rent'}</span>
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
