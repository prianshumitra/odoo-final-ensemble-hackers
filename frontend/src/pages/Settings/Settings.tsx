import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Globe, Save } from 'lucide-react';
import { CustomSelect } from '../../components/common/CustomSelect';

export const Settings: React.FC = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [currency, setCurrency] = useState('INR');

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#C4B2E2] via-[#D4C4ED] to-[#EAE4DB] shadow-md">
        <div className="bg-gradient-to-br from-[#EFE9F6] via-[#FAF7F2] to-[#F5EBE0] p-8 sm:p-12 rounded-[23px] space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#7E3AF2] flex items-center justify-center border border-[#D4C4ED] shadow-xs">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] my-0">Account Settings</h1>
              <p className="text-xs text-[#6E6A78]">Preferences and security configuration</p>
            </div>
          </div>

          <div className="space-y-6 pt-2">
            {/* Notifications */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-[#18181B] uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#7E3AF2]" />
                <span>Notifications</span>
              </h3>
              <div className="p-4 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-3 shadow-xs">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-[#18181B]">Email Rental Updates & Reminders</span>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 accent-[#7E3AF2] rounded"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-bold text-[#18181B]">SMS Delivery Alerts</span>
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
              <h3 className="text-xs font-extrabold text-[#18181B] uppercase tracking-wider flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#7E3AF2]" />
                <span>Regional & Currency</span>
              </h3>
              <div className="p-4 rounded-2xl bg-white/80 border border-[#D4C4ED] shadow-xs">
                <CustomSelect
                  value={currency}
                  onChange={setCurrency}
                  options={[
                    { label: 'Indian Rupee (Rs / INR)', value: 'INR' },
                    { label: 'US Dollar ($ / USD)', value: 'USD' },
                    { label: 'Euro (€ / EUR)', value: 'EUR' },
                  ]}
                />
              </div>
            </div>

            <button
              onClick={() => alert('Settings saved successfully!')}
              className="px-6 py-3 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
