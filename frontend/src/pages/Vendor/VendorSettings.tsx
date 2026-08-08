import React, { useState } from 'react';
import { Settings, Store, Mail, Phone, MapPin, Save, CheckCircle2 } from 'lucide-react';
import { useUser } from '@clerk/react';

export const VendorSettings: React.FC = () => {
  const { user } = useUser();
  const [businessName, setBusinessName] = useState(
    user?.fullName ? `${user.fullName}'s Rental Store` : 'EZRent Partner Store'
  );
  const [email, setEmail] = useState(user?.primaryEmailAddress?.emailAddress || 'vendor@example.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [address, setAddress] = useState('Bangalore Tech Park, Sector 4, KA');
  const [policy, setPolicy] = useState(
    'All rental items are white-glove inspected prior to dispatch. Returns accepted within 48 hours for undamaged goods.'
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#7E3AF2]" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] tracking-tight">
            Vendor Business Settings
          </h1>
        </div>
        <p className="text-xs text-[#8A8694] mt-0.5">
          Manage your storefront details, contact information, and rental terms
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-[#EFE9F6] rounded-3xl border border-[#D4C4ED] p-6 sm:p-8 shadow-sm max-w-3xl">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7E3AF2]">
              Storefront Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">
                Business / Store Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-white text-xs font-medium rounded-xl pl-9 pr-3 py-2.5 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2]"
                />
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">
                  Support Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white text-xs font-medium rounded-xl pl-9 pr-3 py-2.5 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2]"
                  />
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">
                  Contact Phone
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white text-xs font-medium rounded-xl pl-9 pr-3 py-2.5 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2]"
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">
                Warehouse / Dispatch Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-white text-xs font-medium rounded-xl pl-9 pr-3 py-2.5 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2]"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8694]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#18181B] mb-1">
                Rental Terms & Guarantee Policy
              </label>
              <textarea
                rows={3}
                value={policy}
                onChange={(e) => setPolicy(e.target.value)}
                className="w-full bg-white text-xs font-medium rounded-xl px-3 py-2.5 border border-[#D4C4ED] focus:outline-none focus:border-[#7E3AF2]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#18181B] hover:bg-[#7E3AF2] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Settings</span>
            </button>

            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings saved successfully!</span>
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
