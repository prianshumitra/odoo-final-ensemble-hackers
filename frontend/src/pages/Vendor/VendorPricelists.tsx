import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import type { Pricelist } from '../../types';
import { pricelistService } from '../../services/api';

export const VendorPricelists: React.FC = () => {
  const [pricelists, setPricelists] = useState<Pricelist[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [applyOn, setApplyOn] = useState<'all' | 'category' | 'product'>('all');
  const [minQty, setMinQty] = useState(1);
  const [priceType, setPriceType] = useState<'discount' | 'fixed'>('discount');
  const [value, setValue] = useState(10);

  const fetchPricelists = async () => {
    try {
      const data = await pricelistService.getPricelists();
      setPricelists(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchPricelists();
  }, []);

  const handleCreatePricelist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      await pricelistService.createPricelist({
        name,
        isDefault,
        rules: [
          {
            applyOn,
            minQty,
            priceType,
            value,
          },
        ],
      });

      setIsModalOpen(false);
      setName('');
      fetchPricelists();
    } catch (err: any) {
      alert('Error creating pricelist');
    }
  };

  const handleDeletePricelist = async (id: string) => {
    if (confirm('Delete this pricelist?')) {
      await pricelistService.deletePricelist(id);
      fetchPricelists();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#18181B]">Pricelists & Volume Rules</h1>
          <p className="text-xs text-[#6E6A78]">Create discount and fixed price rules for rental tiers</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Pricelist</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pricelists.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-[#D4C4ED] text-center text-xs text-[#8A8694]">
            No pricelists configured yet. Default product pricing applies.
          </div>
        ) : (
          pricelists.map((pl) => (
            <div key={pl._id} className="bg-white p-5 rounded-2xl border border-[#D4C4ED] shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[#18181B] text-sm">{pl.name}</h3>
                  {pl.isDefault && (
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Default
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeletePricelist(pl._id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[#8A8694]">Configured Rules:</p>
                {pl.rules?.map((rule, idx) => (
                  <div key={idx} className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#D4C4ED]/60 text-xs flex justify-between">
                    <span>
                      Apply On: <strong>{rule.applyOn.toUpperCase()}</strong> (Min Qty: {rule.minQty})
                    </span>
                    <span className="font-extrabold text-[#7E3AF2]">
                      {rule.priceType === 'discount' ? `${rule.value}% Off` : `Fixed Rs. ${rule.value}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-md w-full p-6 rounded-3xl border border-[#D4C4ED] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-extrabold text-[#18181B]">Create Pricelist Rule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A8694]">✕</button>
            </div>

            <form onSubmit={handleCreatePricelist} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#18181B] mb-1">Pricelist Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Corporate Rate 2026"
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#18181B]">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="accent-[#7E3AF2] w-4 h-4 rounded"
                />
                <span>Set as Default Pricelist</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Apply On</label>
                  <select
                    value={applyOn}
                    onChange={(e) => setApplyOn(e.target.value as any)}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl font-bold"
                  >
                    <option value="all">All Products</option>
                    <option value="category">Specific Category</option>
                    <option value="product">Specific Product</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Min Quantity</label>
                  <input
                    type="number"
                    min={1}
                    value={minQty}
                    onChange={(e) => setMinQty(Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Price Type</label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as any)}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl font-bold"
                  >
                    <option value="discount">Discount (%)</option>
                    <option value="fixed">Fixed Price Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Value (% or Amount)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white font-bold rounded-xl transition-all shadow-md"
              >
                Save Pricelist
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
