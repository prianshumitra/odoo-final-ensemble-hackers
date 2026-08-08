import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import type { Attribute } from '../../types';
import { attributeService } from '../../services/api';

export const VendorAttributes: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [valuesStr, setValuesStr] = useState('');
  const [displayType, setDisplayType] = useState<'radio' | 'pills' | 'checkbox' | 'image'>('pills');
  const [showVariantImages, setShowVariantImages] = useState(false);

  const fetchAttributes = async () => {
    try {
      const data = await attributeService.getAttributes();
      setAttributes(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleCreateAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = valuesStr
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    if (!name || values.length === 0) {
      alert('Attribute name and values are required');
      return;
    }

    try {
      await attributeService.createAttribute({
        name,
        values,
        displayType,
        showVariantImages,
      });

      setIsModalOpen(false);
      setName('');
      setValuesStr('');
      fetchAttributes();
    } catch (err: any) {
      alert('Error creating attribute');
    }
  };

  const handleDeleteAttribute = async (id: string) => {
    if (confirm('Delete this attribute?')) {
      await attributeService.deleteAttribute(id);
      fetchAttributes();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#18181B]">Product Attributes & Variants</h1>
          <p className="text-xs text-[#6E6A78]">Define size, color, brand, and option attributes for variants</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Attribute</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {attributes.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-[#D4C4ED] text-center text-xs text-[#8A8694]">
            No custom attributes created yet. Click "+ Add Attribute" to create one.
          </div>
        ) : (
          attributes.map((attr) => (
            <div key={attr._id} className="bg-white p-5 rounded-2xl border border-[#D4C4ED] shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-[#18181B] text-sm">{attr.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EFE9F6] text-[#7E3AF2] rounded-full uppercase">
                    Display: {attr.displayType}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteAttribute(attr._id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#8A8694] mb-1">Values:</p>
                <div className="flex flex-wrap gap-1.5">
                  {attr.values?.map((val, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-[#FAF7F2] border border-[#D4C4ED] text-[#18181B] text-xs font-semibold rounded-lg">
                      {val}
                    </span>
                  ))}
                </div>
              </div>

              {attr.showVariantImages && (
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  <span>Variant Images Enabled</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-md w-full p-6 rounded-3xl border border-[#D4C4ED] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-extrabold text-[#18181B]">Add New Attribute</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A8694]">✕</button>
            </div>

            <form onSubmit={handleCreateAttribute} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#18181B] mb-1">Attribute Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Size, Color, Capacity"
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">
                  Attribute Values <span className="text-[#8A8694] font-normal">(Comma separated)</span>
                </label>
                <input
                  type="text"
                  required
                  value={valuesStr}
                  onChange={(e) => setValuesStr(e.target.value)}
                  placeholder="Red, Green, Blue or Small, Medium, Large"
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Display Type</label>
                <select
                  value={displayType}
                  onChange={(e) => setDisplayType(e.target.value as any)}
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl font-bold"
                >
                  <option value="pills">Pills (Buttons)</option>
                  <option value="radio">Radio Buttons</option>
                  <option value="checkbox">Check Box</option>
                  <option value="image">Image Swatches</option>
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#18181B]">
                <input
                  type="checkbox"
                  checked={showVariantImages}
                  onChange={(e) => setShowVariantImages(e.target.checked)}
                  className="accent-[#7E3AF2] w-4 h-4 rounded"
                />
                <span>Show variant images toggle</span>
              </label>

              <button
                type="submit"
                className="w-full py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white font-bold rounded-xl transition-all shadow-md"
              >
                Save Attribute
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
