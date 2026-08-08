import React, { useState, useEffect } from 'react';
import { X, Plus, Store, CheckCircle2, ImagePlus, Trash2, AlertCircle } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import type { Product } from '../../types';
import { productService } from '../../services/api';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: (newProduct: Product) => void;
  userRole?: 'admin' | 'vendor' | 'customer';
}

const CATEGORIES = ['Furniture', 'Electronics', 'Gaming', 'Cameras', 'Appliances', 'Sports', 'Tools', 'Vehicles', 'Other'];
const BRANDS = ['IKEA', 'Sony', 'Apple', 'Dell', 'HP', 'Herman Miller', 'Canon', 'Nikon', 'Samsung', 'LG', 'Generic'];
const UNITS = [
  { label: 'Per Hour', value: 'hour' },
  { label: 'Per Day', value: 'day' },
  { label: 'Per Month', value: 'Month' },
  { label: 'Per Year', value: 'year' },
];
const DURATIONS = ['1 Month', '6 Month', '1 Year', '2 Years', '3 Years'];
const PERIODICITIES = [
  { label: 'Hours', value: 'hours' },
  { label: 'Day', value: 'day' },
  { label: 'Night', value: 'night' },
  { label: 'Weekly', value: 'week' },
];

const defaultForm = () => ({
  name: '',
  brand: 'Generic',
  category: 'Furniture',
  type: 'goods' as 'goods' | 'service',
  salesPrice: 1499,
  costPrice: 800,
  quantityOnHand: 10,
  unit: 'Month' as 'hour' | 'day' | 'Month' | 'year',
  duration: '6 Month' as '1 Month' | '6 Month' | '1 Year' | '2 Years' | '3 Years',
  description: '',
  imageUrls: [''] as string[], // multi-image list
  isPublished: true,
  // Attributes
  colorName: 'Slate Blue',
  colorHex: '#3B82F6',
  sizeVariant: 'Standard',
  // Rental
  periodicity: 'day' as 'hours' | 'day' | 'night' | 'week',
  windowStart: '10:00',
  windowEnd: '19:00',
  paddingTimeMinutes: 120,
  lateFeeRatePerUnit: 150,
  depositType: 'fixed' as 'fixed' | 'percent',
  depositValue: 500,
});

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onProductAdded,
  userRole = 'vendor',
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'attributes' | 'rental'>('general');
  const [form, setForm] = useState(defaultForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setForm(defaultForm());
      setActiveTab('general');
      setSuccessMsg('');
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const set = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  // Image list helpers
  const addImageUrl = () => {
    if (form.imageUrls.length < 5) {
      setForm((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }));
    }
  };
  const updateImageUrl = (index: number, value: string) => {
    const updated = [...form.imageUrls];
    updated[index] = value;
    setForm((prev) => ({ ...prev, imageUrls: updated }));
  };
  const removeImageUrl = (index: number) => {
    const updated = form.imageUrls.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, imageUrls: updated.length > 0 ? updated : [''] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const validImages = form.imageUrls.filter((u) => u.trim() !== '');
    const fallbackImg =
      validImages[0] ||
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80';

    const productPayload: Partial<Product> = {
      name: form.name,
      brand: form.brand,
      category: form.category,
      type: form.type,
      salesPrice: Number(form.salesPrice),
      costPrice: Number(form.costPrice),
      quantityOnHand: Number(form.quantityOnHand),
      pricing: { amount: Number(form.salesPrice), unit: form.unit },
      duration: form.duration,
      description: form.description || form.name,
      image: fallbackImg,
      images: validImages.length > 0 ? validImages : [fallbackImg],
      colorVariants: [{ name: form.colorName, hex: form.colorHex }],
      sizeVariants: form.sizeVariant ? [form.sizeVariant] : [],
      inStock: form.quantityOnHand > 0,
      isPublished: userRole === 'admin' ? form.isPublished : true,
      rental: {
        periodicity: form.periodicity,
        windowStart: form.windowStart,
        windowEnd: form.windowEnd,
        paddingTimeMinutes: Number(form.paddingTimeMinutes),
        lateFeeRatePerUnit: Number(form.lateFeeRatePerUnit),
        depositType: form.depositType,
        depositValue: Number(form.depositValue),
      },
    };

    try {
      const createdProduct = await productService.createProduct(productPayload);
      onProductAdded(createdProduct);
      setSuccessMsg('Product configured & listed successfully!');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to create product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = 'w-full bg-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2] transition-colors';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative bg-[#FAF7F2] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 border border-[#D4C4ED]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D4C4ED]/60 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#18181B]">Add New Product</h2>
              <p className="text-xs text-[#8A8694]">Configure info, variants, rental rules & deposit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-[#8A8694] hover:text-[#18181B] rounded-xl hover:bg-[#EFE9F6] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#EFE9F6] p-1 rounded-2xl flex gap-1 mb-5 border border-[#D4C4ED]/60">
          {(['general', 'attributes', 'rental'] as const).map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab ? 'bg-[#7E3AF2] text-white shadow-sm' : 'text-[#6E6A78] hover:text-[#18181B]'
              }`}
            >
              {i + 1}. {tab === 'general' ? 'General Info' : tab === 'attributes' ? 'Variants' : 'Rental Rules'}
            </button>
          ))}
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl p-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ── General Tab ── */}
          {activeTab === 'general' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Ergonomic Executive Recliner Chair"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Product Type</label>
                  <CustomSelect value={form.type} onChange={(v) => set('type', v)} options={[{ label: 'Goods', value: 'goods' }, { label: 'Service', value: 'service' }]} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Category *</label>
                  <CustomSelect value={form.category} onChange={(v) => set('category', v)} options={CATEGORIES} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Brand</label>
                  <CustomSelect value={form.brand} onChange={(v) => set('brand', v)} options={BRANDS} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Sales Price (Rs) *</label>
                  <input type="number" required min={1} value={form.salesPrice} onChange={(e) => set('salesPrice', Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Cost Price (Rs)</label>
                  <input type="number" min={0} value={form.costPrice} onChange={(e) => set('costPrice', Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Qty on Hand</label>
                  <input type="number" min={0} value={form.quantityOnHand} onChange={(e) => set('quantityOnHand', Number(e.target.value))} className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Rental Unit</label>
                  <CustomSelect value={form.unit} onChange={(v) => set('unit', v)} options={UNITS} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Max Duration</label>
                  <CustomSelect value={form.duration} onChange={(v) => set('duration', v)} options={DURATIONS} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Description *</label>
                <textarea rows={2} required value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Brief description of the product..." className={inputCls} />
              </div>

              {/* ── Multi-image section ── */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#18181B]">
                    Product Images <span className="text-[#8A8694] font-normal">(first = primary, up to 5)</span>
                  </label>
                  {form.imageUrls.length < 5 && (
                    <button type="button" onClick={addImageUrl} className="flex items-center gap-1 text-[10px] font-bold text-[#7E3AF2] hover:underline">
                      <ImagePlus className="w-3.5 h-3.5" />
                      Add Image
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {form.imageUrls.map((url, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#8A8694] w-5 shrink-0">{i + 1}.</span>
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(i, e.target.value)}
                        placeholder={i === 0 ? 'Primary image URL (required)' : 'Additional image URL (optional)'}
                        className={`flex-1 ${inputCls}`}
                      />
                      {/* Preview thumbnail */}
                      {url.trim() && (
                        <img src={url} alt="" className="w-8 h-8 rounded-lg object-cover border border-[#D4C4ED]" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
                      )}
                      {form.imageUrls.length > 1 && (
                        <button type="button" onClick={() => removeImageUrl(i)} className="p-1 text-rose-400 hover:text-rose-600 shrink-0">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {userRole === 'admin' && (
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#7E3AF2]">Publish Immediately (Admin Only)</span>
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => set('isPublished', e.target.checked)} className="accent-[#7E3AF2] w-4 h-4 rounded" />
                </div>
              )}
            </div>
          )}

          {/* ── Attributes Tab ── */}
          {activeTab === 'attributes' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Color Variant Name</label>
                  <input type="text" value={form.colorName} onChange={(e) => set('colorName', e.target.value)} className={inputCls} placeholder="e.g. Slate Blue" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Color Shade Selection</label>
                  <input
                    type="color"
                    value={form.colorHex}
                    onChange={(e) => set('colorHex', e.target.value)}
                    className="w-full h-10 bg-white p-1 border border-[#D4C4ED] rounded-xl cursor-pointer"
                  />
                </div>
              </div>
              {/* Color preview */}
              {form.colorName && (
                <div className="flex items-center gap-2 bg-white border border-[#D4C4ED] rounded-xl px-3 py-2">
                  <span className="w-5 h-5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: form.colorHex }} />
                  <span className="text-xs font-bold text-[#18181B]">{form.colorName}</span>
                  <span className="text-[10px] text-[#8A8694] ml-auto">{form.colorHex}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Size / Dimension Variant</label>
                <input type="text" value={form.sizeVariant} onChange={(e) => set('sizeVariant', e.target.value)} placeholder="e.g. 55-inch / Queen / Standard" className={inputCls} />
              </div>
            </div>
          )}

          {/* ── Rental Tab ── */}
          {activeTab === 'rental' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Periodicity</label>
                  <CustomSelect value={form.periodicity} onChange={(v) => set('periodicity', v)} options={PERIODICITIES} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Padding Between Rentals (min)</label>
                  <input type="number" min={0} value={form.paddingTimeMinutes} onChange={(e) => set('paddingTimeMinutes', Number(e.target.value))} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Operating Window — Start</label>
                  <input type="time" value={form.windowStart} onChange={(e) => set('windowStart', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Operating Window — End</label>
                  <input type="time" value={form.windowEnd} onChange={(e) => set('windowEnd', e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-2xl border border-purple-200">
                <div>
                  <label className="block text-xs font-bold text-[#7E3AF2] mb-1">Late Fee Rate / Unit (Rs)</label>
                  <input type="number" min={0} value={form.lateFeeRatePerUnit} onChange={(e) => set('lateFeeRatePerUnit', Number(e.target.value))} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#7E3AF2] mb-1">Security Deposit (Rs)</label>
                  <input type="number" min={0} value={form.depositValue} onChange={(e) => set('depositValue', Number(e.target.value))} className={inputCls} />
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-semibold">
                ⏰ Customers will see the rental window <strong>{form.windowStart} – {form.windowEnd}</strong> and a refundable deposit of <strong>Rs. {form.depositValue}</strong>.
              </div>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] disabled:opacity-60 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving to Database...' : 'Save & Publish Product'}</span>
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
