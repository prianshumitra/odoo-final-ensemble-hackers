import React from 'react';
import { Mail, MapPin, Phone, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Account: React.FC = () => {
  const { user } = useAuth();

  const name = user?.name || 'Subscriber User';
  const email = user?.email || 'user@example.com';
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const address = user?.address
    ? [user.address.street, user.address.city, user.address.state, user.address.zip, user.address.country]
        .filter(Boolean)
        .join(', ')
    : '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="p-[1px] rounded-3xl bg-gradient-to-r from-[#C4B2E2] via-[#D4C4ED] to-[#EAE4DB] shadow-md">
        <div className="bg-gradient-to-br from-[#EFE9F6] via-[#FAF7F2] to-[#F5EBE0] p-8 sm:p-12 rounded-[23px] space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#D4C4ED]/60">
            <div className="w-20 h-20 rounded-full bg-[#7E3AF2] text-white flex items-center justify-center text-xl font-extrabold border-4 border-white shadow-md">
              {user?.profileImageUrl ? (
                <img src={user.profileImageUrl} alt={name} className="w-full h-full rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#18181B] my-0">{name}</h1>
              <p className="text-xs text-[#6E6A78]">Verified Account • EZRent Member</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-[#7E3AF2] text-white px-3 py-0.5 rounded-full shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{user?.role === 'vendor' ? 'Verified Vendor' : user?.role === 'admin' ? 'Administrator' : 'Verified Subscriber'}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#8A8694] uppercase">
                <UserCheck className="w-3.5 h-3.5 text-[#7E3AF2]" />
                <span>Full Name</span>
              </div>
              <p className="text-sm font-bold text-[#18181B]">{name}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#8A8694] uppercase">
                <Mail className="w-3.5 h-3.5 text-[#7E3AF2]" />
                <span>Email Address</span>
              </div>
              <p className="text-sm font-bold text-[#18181B]">{email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#8A8694] uppercase">
                <Phone className="w-3.5 h-3.5 text-[#7E3AF2]" />
                <span>Phone Number</span>
              </div>
              <p className="text-sm font-bold text-[#18181B]">{user?.phone || 'Not added yet'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-[#D4C4ED] space-y-1 shadow-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#8A8694] uppercase">
                <MapPin className="w-3.5 h-3.5 text-[#7E3AF2]" />
                <span>Primary Address</span>
              </div>
              <p className="text-sm font-bold text-[#18181B]">{address || 'Not added yet'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
