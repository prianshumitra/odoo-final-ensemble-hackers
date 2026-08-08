import React, { useState } from 'react';
import { X, Plus, Store, CheckCircle2 } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import type { Product } from '../../types';
import { productService } from '../../services/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (newProduct: Product) => void;
  userRole?: 'admin' | 'vendor' | 'customer';
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
  userRole = 'vendor',
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'attributes' | 'rental'>('general');

  // General Tab
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('IKEA');
  const [category, setCategory] = useState('Furniture');
  const [type, setType] = useState<'goods' | 'service'>('goods');
  const [salesPrice, setSalesPrice] = useState<number>(1499);
  const [costPrice, setCostPrice] = useState<number>(800);
  const [quantityOnHand, setQuantityOnHand] = useState<number>(10);
  const [unit] = useState<'hour' | 'day' | 'Month' | 'year'>('Month');
  const [duration] = useState<'1 Month' | '6 Month' | '1 Year' | '2 Years' | '3 Years'>('6 Month');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  // Attributes Tab
  const [colorName, setColorName] = useState('Slate Blue');
  const [colorHex, setColorHex] = useState('#3B82F6');
  const [sizeVariant, setSizeVariant] = useState('Standard');

  // Rental Tab
  const [periodicity, setPeriodicity] = useState<'hours' | 'day' | 'night' | 'week'>('day');
  const [windowStart, setWindowStart] = useState('10:00');
  const [windowEnd, setWindowEnd] = useState('19:00');
  const [paddingTimeMinutes, setPaddingTimeMinutes] = useState(120);
  const [lateFeeRatePerUnit, setLateFeeRatePerUnit] = useState(150);
  const [depositType] = useState<'fixed' | 'percent'>('fixed');
  const [depositValue, setDepositValue] = useState(500);

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
      type,
      salesPrice: Number(salesPrice),
      costPrice: Number(costPrice),
      quantityOnHand: Number(quantityOnHand),
      pricing: { amount: Number(salesPrice), unit },
      duration,
      description,
      image: fallbackImg,
      colorVariants: [{ name: colorName, hex: colorHex }],
      sizeVariants: [sizeVariant],
      inStock: quantityOnHand > 0,
      isPublished: userRole === 'admin' ? isPublished : true,
      rental: {
        periodicity,
        windowStart,
        windowEnd,
        paddingTimeMinutes: Number(paddingTimeMinutes),
        lateFeeRatePerUnit: Number(lateFeeRatePerUnit),
        depositType,
        depositValue: Number(depositValue),
      },
    };

    const createdProduct = await productService.createProduct(productPayload);
    onProductAdded(createdProduct);

    setIsSubmitting(false);
    setSuccessMsg('Product configured & listed successfully!');

    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-[#FAF7F2] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#D4C4ED]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D4C4ED]/60 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#18181B]">Product Creation & Configuration Flow</h2>
              <p className="text-xs text-[#8A8694]">Configure product info, attributes, rental periodicity & deposits</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#8A8694] hover:text-[#18181B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#EFE9F6] p-1 rounded-2xl flex gap-1 mb-5 border border-[#D4C4ED]/60">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'general' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78]'
            }`}
          >
            1. General Information
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('attributes')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'attributes' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78]'
            }`}
          >
            2. Attributes & Variants
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rental')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'rental' ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78]'
            }`}
          >
            3. Rental & Deposit Config
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'general' && (
            <div className="space-y-3 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ergonomic Executive Recline Chair"
                  className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#D4C4ED]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Product Type</label>
                  <CustomSelect
                    value={type}
                    onChange={(val) => setType(val as any)}
                    options={[
                      { label: 'Goods', value: 'goods' },
                      { label: 'Service', value: 'service' },
                    ]}
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
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Brand</label>
                  <CustomSelect
                    value={brand}
                    onChange={setBrand}
                    options={['IKEA', 'Sony', 'Apple', 'Dell', 'Herman Miller', 'Canon']}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Sales Price (Rs)</label>
                  <input
                    type="number"
                    required
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(Number(e.target.value))}
                    className="w-full bg-white text-xs font-medium rounded-xl px-3 py-2.5 border border-[#D4C4ED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Cost Price (Rs)</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full bg-white text-xs font-medium rounded-xl px-3 py-2.5 border border-[#D4C4ED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Quantity on Hand</label>
                  <input
                    type="number"
                    value={quantityOnHand}
                    onChange={(e) => setQuantityOnHand(Number(e.target.value))}
                    className="w-full bg-white text-xs font-medium rounded-xl px-3 py-2.5 border border-[#D4C4ED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Image URL</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#D4C4ED]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2 border border-[#D4C4ED]"
                />
              </div>

              {userRole === 'admin' && (
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7E3AF2]">Publish / Unpublish Toggle (Admin Only)</span>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="accent-[#7E3AF2] w-4 h-4 rounded"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'attributes' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Color Variant Name</label>
                  <input
                    type="text"
                    value={colorName}
                    onChange={(e) => setColorName(e.target.value)}
                    className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#D4C4ED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Color Swatch Hex</label>
                  <input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
                    className="w-full h-10 bg-white p-1 border border-[#D4C4ED] rounded-xl cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Size / Dimension Variant</label>
                <input
                  type="text"
                  value={sizeVariant}
                  onChange={(e) => setSizeVariant(e.target.value)}
                  placeholder="e.g. 55-inch / Queen / Standard"
                  className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#D4C4ED]"
                />
              </div>
            </div>
          )}

          {activeTab === 'rental' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Periodicity</label>
                  <CustomSelect
                    value={periodicity}
                    onChange={(val) => setPeriodicity(val as any)}
                    options={[
                      { label: 'Hours', value: 'hours' },
                      { label: 'Day', value: 'day' },
                      { label: 'Night', value: 'night' },
                      { label: 'Weekly', value: 'week' },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Padding Time (Minutes)</label>
                  <input
                    type="number"
                    value={paddingTimeMinutes}
                    onChange={(e) => setPaddingTimeMinutes(Number(e.target.value))}
                    className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#D4C4ED]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Operating Window Start</label>
                  <input
                    type="text"
                    value={windowStart}
                    onChange={(e) => setWindowStart(e.target.value)}
                    placeholder="10:00"
                    className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#D4C4ED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Operating Window End</label>
                  <input
                    type="text"
                    value={windowEnd}
                    onChange={(e) => setWindowEnd(e.target.value)}
                    placeholder="19:00"
                    className="w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#D4C4ED]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-2xl border border-purple-200">
                <div>
                  <label className="block text-xs font-bold text-[#7E3AF2] mb-1">Per-Unit Late Fee Rate (Rs)</label>
                  <input
                    type="number"
                    value={lateFeeRatePerUnit}
                    onChange={(e) => setLateFeeRatePerUnit(Number(e.target.value))}
                    className="w-full bg-white text-xs font-bold rounded-xl px-3 py-2 border border-[#D4C4ED]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7E3AF2] mb-1">Security Deposit (Rs)</label>
                  <input
                    type="number"
                    value={depositValue}
                    onChange={(e) => setDepositValue(Number(e.target.value))}
                    className="w-full bg-white text-xs font-bold rounded-xl px-3 py-2 border border-[#D4C4ED]"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Configuration...' : 'Save & Publish Product'}</span>
            </button>
          </div>

          {successMsg && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-bold pt-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
