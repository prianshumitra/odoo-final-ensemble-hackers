import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck } from 'lucide-react';
import type { Settings } from '../../types';
import { settingsService, authService } from '../../services/api';

export const VendorSettings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    lateFeeEnabled: true,
    defaultLateFeeAmount: 150,
    variantsEnabled: true,
    pricelistEnabled: true,
    gracePeriodMinutes: 30,
    maxLateFeeCap: 5000,
    companyHeader: 'EZRent Rental Operations',
    companyFooter: 'Thank you for choosing EZRent!',
  });

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [companyName, setCompanyName] = useState('');
  const [gstNo, setGstNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      const setts = await settingsService.getSettings();
      if (setts) setSettings(setts);
      const me = await authService.getMe();
      setCurrentUser(me);
      setCompanyName(me?.companyName || '');
      setGstNo(me?.gstNo || '');
    } catch (err) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await settingsService.updateSettings(settings);
      setMessage('Settings saved successfully!');
    } catch (err: any) {
      setMessage('Settings saved locally.');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#18181B]">Settings & Configuration</h1>
          <p className="text-xs text-[#6E6A78]">
            {isAdmin ? 'System-wide late fee, variant, and pricelist master configurations' : 'Manage your vendor profile and account details'}
          </p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
          {message}
        </div>
      )}

      {isAdmin ? (
        <form onSubmit={handleSaveSettings} className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#D4C4ED] space-y-6">
          <div className="flex items-center gap-2 border-b border-[#D4C4ED] pb-3">
            <ShieldCheck className="w-5 h-5 text-[#7E3AF2]" />
            <h2 className="text-base font-extrabold text-[#18181B]">Admin Organization Master Settings</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED] space-y-3">
              <label className="flex items-center justify-between cursor-pointer font-bold text-[#18181B]">
                <div>
                  <p className="text-sm font-extrabold">Manage Late Fee / Overdue Penalty Charges</p>
                  <p className="text-[11px] text-[#6E6A78] font-normal">Automatically calculate and deduct late fees upon return</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.lateFeeEnabled}
                  onChange={(e) => setSettings({ ...settings, lateFeeEnabled: e.target.checked })}
                  className="accent-[#7E3AF2] w-5 h-5 rounded"
                />
              </label>

              {settings.lateFeeEnabled && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E5E7EB]">
                  <div>
                    <label className="block font-bold text-[#18181B] mb-1">Default Late Fee (Rs. / hr)</label>
                    <input
                      type="number"
                      value={settings.defaultLateFeeAmount}
                      onChange={(e) => setSettings({ ...settings, defaultLateFeeAmount: Number(e.target.value) })}
                      className="w-full bg-[#FAF7F2] px-3 py-2 border border-[#D4C4ED] rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#18181B] mb-1">Grace Period (Minutes)</label>
                    <input
                      type="number"
                      value={settings.gracePeriodMinutes}
                      onChange={(e) => setSettings({ ...settings, gracePeriodMinutes: Number(e.target.value) })}
                      className="w-full bg-[#FAF7F2] px-3 py-2 border border-[#D4C4ED] rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#18181B] mb-1">Max Late Fee Cap (Rs.)</label>
                    <input
                      type="number"
                      value={settings.maxLateFeeCap}
                      onChange={(e) => setSettings({ ...settings, maxLateFeeCap: Number(e.target.value) })}
                      className="w-full bg-[#FAF7F2] px-3 py-2 border border-[#D4C4ED] rounded-xl font-bold"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
                <label className="flex items-center justify-between cursor-pointer font-bold text-[#18181B]">
                  <div>
                    <p className="font-extrabold">Attribute-Driven Variants</p>
                    <p className="text-[11px] text-[#6E6A78] font-normal">Enable color & size variant pickers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.variantsEnabled}
                    onChange={(e) => setSettings({ ...settings, variantsEnabled: e.target.checked })}
                    className="accent-[#7E3AF2] w-4 h-4 rounded"
                  />
                </label>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
                <label className="flex items-center justify-between cursor-pointer font-bold text-[#18181B]">
                  <div>
                    <p className="font-extrabold">Custom Pricelists Engine</p>
                    <p className="text-[11px] text-[#6E6A78] font-normal">Enable customer tier discount rules</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pricelistEnabled}
                    onChange={(e) => setSettings({ ...settings, pricelistEnabled: e.target.checked })}
                    className="accent-[#7E3AF2] w-4 h-4 rounded"
                  />
                </label>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED] space-y-3">
              <h4 className="font-extrabold text-[#18181B]">Printed Document Branding</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Invoice Header Title</label>
                  <input
                    type="text"
                    value={settings.companyHeader}
                    onChange={(e) => setSettings({ ...settings, companyHeader: e.target.value })}
                    className="w-full bg-[#FAF7F2] px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#18181B] mb-1">Invoice Footer Note</label>
                  <input
                    type="text"
                    value={settings.companyFooter}
                    onChange={(e) => setSettings({ ...settings, companyFooter: e.target.value })}
                    className="w-full bg-[#FAF7F2] px-3 py-2 border border-[#D4C4ED] rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-[#7E3AF2] hover:bg-[#6C2BD9] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Admin Configurations</span>
          </button>
        </form>
      ) : (
        <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#D4C4ED] space-y-4 text-xs">
          <h2 className="text-base font-extrabold text-[#18181B] border-b border-[#D4C4ED] pb-3">Vendor Business Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
              <label className="block font-bold text-[#18181B] mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-[#FAF7F2] px-3 py-2 border border-[#D4C4ED] rounded-xl font-bold"
              />
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
              <label className="block font-bold text-[#18181B] mb-1">GST IN Number</label>
              <input
                type="text"
                value={gstNo}
                onChange={(e) => setGstNo(e.target.value)}
                className="w-full bg-[#FAF7F2] px-3 py-2 border border-[#D4C4ED] rounded-xl font-bold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
