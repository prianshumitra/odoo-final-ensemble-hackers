import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { QuotationTemplate } from '../../types';
import { quotationTemplateService } from '../../services/api';

export const VendorQuotationTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<QuotationTemplate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [validityDays, setValidityDays] = useState(30);
  const [paymentTermsPercent, setPaymentTermsPercent] = useState(100);
  const [headerHtml, setHeaderHtml] = useState('Welcome to EZRent Official Quotation');
  const [footerHtml, setFooterHtml] = useState('Terms: All rentals require security deposit settlement upon return.');

  const fetchTemplates = async () => {
    try {
      const data = await quotationTemplateService.getTemplates();
      setTemplates(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      await quotationTemplateService.createTemplate({
        name,
        validityDays,
        paymentTermsPercent,
        headerHtml,
        footerHtml,
      });

      setIsModalOpen(false);
      setName('');
      fetchTemplates();
    } catch (err: any) {
      alert('Error creating quotation template');
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (confirm('Delete this template?')) {
      await quotationTemplateService.deleteTemplate(id);
      fetchTemplates();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#18181B]">Quotation Templates & Headers</h1>
          <p className="text-xs text-[#6E6A78]">Manage reusable quote structures, payment terms, and printed header/footer text</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation Template</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-[#D4C4ED] text-center text-xs text-[#8A8694]">
            No quotation templates created yet. Click "+ New Quotation Template" to add one.
          </div>
        ) : (
          templates.map((tpl) => (
            <div key={tpl._id} className="bg-white p-5 rounded-2xl border border-[#D4C4ED] shadow-xs space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-[#18181B] text-sm">{tpl.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-[#EFE9F6] text-[#7E3AF2] rounded-full">
                    Validity: {tpl.validityDays} Days | Terms: {tpl.paymentTermsPercent}%
                  </span>
                </div>
                <button onClick={() => handleDeleteTemplate(tpl._id)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#D4C4ED]/60 space-y-1 text-xs">
                <p className="font-bold text-[#18181B]">Header Preview:</p>
                <p className="text-[11px] text-[#6E6A78] line-clamp-2">{tpl.headerHtml}</p>
                <p className="font-bold text-[#18181B] pt-1">Footer Preview:</p>
                <p className="text-[11px] text-[#6E6A78] line-clamp-2">{tpl.footerHtml}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF7F2] max-w-md w-full p-6 rounded-3xl border border-[#D4C4ED] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-extrabold text-[#18181B]">Add Quotation Template</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A8694]">✕</button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#18181B] mb-1">Template Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Home Furniture Rental Package"
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Validity (Days)</label>
                  <input
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Payment Terms (%)</label>
                  <input
                    type="number"
                    value={paymentTermsPercent}
                    onChange={(e) => setPaymentTermsPercent(Number(e.target.value))}
                    className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Header Banner Text</label>
                <textarea
                  rows={2}
                  value={headerHtml}
                  onChange={(e) => setHeaderHtml(e.target.value)}
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-[#18181B] mb-1">Footer Terms & Policy Text</label>
                <textarea
                  rows={2}
                  value={footerHtml}
                  onChange={(e) => setFooterHtml(e.target.value)}
                  className="w-full bg-white px-3 py-2 border border-[#D4C4ED] rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white font-bold rounded-xl transition-all shadow-md"
              >
                Save Template
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
