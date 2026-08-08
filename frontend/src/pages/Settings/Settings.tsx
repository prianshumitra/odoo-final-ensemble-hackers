import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Globe, Save } from 'lucide-react';

export const Settings: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [currency, setCurrency] = useState('INR');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="bg-white rounded-3xl p-8 border border-[#EAE4DB] shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EFE9F6] text-[#7E3AF2] flex items-center justify-center">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#18181B] my-0">Account Settings</h1>
            <p className="text-xs text-[#8A8694]">Preferences and security configuration</p>
          </div>
        </div>

        <div className="space-y-6 pt-2">
          {/* Notifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#18181B] uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#7E3AF2]" />
              Notifications
            </h3>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB] space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-[#18181B]">Email Rental Updates & Reminders</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#7E3AF2] rounded"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-semibold text-[#18181B]">SMS Delivery Alerts</span>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-[#7E3AF2] rounded"
                />
              </label>
            </div>
          </div>

          {/* Regional Settings */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#18181B] uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7E3AF2]" />
              Regional & Currency
            </h3>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB]">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                aria-label="Preferred Currency"
                className="w-full bg-white text-xs font-semibold rounded-xl px-3 py-2 border border-[#E4DFD6] focus:outline-none focus:border-[#7E3AF2]"
              >
                <option value="INR">Indian Rupee (Rs / INR)</option>
                <option value="USD">US Dollar ($ / USD)</option>
                <option value="EUR">Euro (€ / EUR)</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => alert('Settings saved successfully!')}
            className="px-6 py-2.5 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
