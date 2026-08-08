import React from 'react';

export const Account: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 flex-1">
      <div className="bg-white rounded-3xl p-8 border border-[#EAE4DB] shadow-sm space-y-6">
        
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#F4EFEA]">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#3E3A47] to-[#18181B] flex items-center justify-center text-white text-xl font-bold border-4 border-white shadow-md">
            AW
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-xl font-extrabold text-[#18181B] my-0">Alex Wombat</h1>
            <p className="text-xs text-[#8A8694]">Member since January 2025 • Premium Subscriber</p>
            <span className="inline-block text-[11px] font-semibold bg-[#EFE9F6] text-[#7E3AF2] px-2.5 py-0.5 rounded-full">
              Verified ID ✓
            </span>
          </div>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB] space-y-1">
            <span className="text-[11px] font-bold text-[#8A8694] uppercase">Full Name</span>
            <p className="text-sm font-bold text-[#18181B]">Alex Wombat</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB] space-y-1">
            <span className="text-[11px] font-bold text-[#8A8694] uppercase">Email Address</span>
            <p className="text-sm font-bold text-[#18181B]">alex.wombat@example.com</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB] space-y-1">
            <span className="text-[11px] font-bold text-[#8A8694] uppercase">Phone Number</span>
            <p className="text-sm font-bold text-[#18181B]">+1 (555) 019-2831</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE4DB] space-y-1">
            <span className="text-[11px] font-bold text-[#8A8694] uppercase">Primary Address</span>
            <p className="text-sm font-bold text-[#18181B]">742 Evergreen Terrace, Suite 100</p>
          </div>
        </div>
      </div>
    </div>
  );
};
