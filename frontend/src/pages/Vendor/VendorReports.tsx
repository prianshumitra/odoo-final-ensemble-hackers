import React, { useState, useEffect } from 'react';
import { BarChart3, FileSpreadsheet } from 'lucide-react';
import { reportService } from '../../services/api';

export const VendorReports: React.FC = () => {
  const [reportData, setReportData] = useState<any>(null);

  const fetchReport = async () => {
    try {
      const data = await reportService.getReportData();
      setReportData(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExportCSV = () => {
    window.open(reportService.getReportCSVUrl(), '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-[#18181B]">Rental Performance Reports</h1>
          <p className="text-xs text-[#6E6A78]">Detailed analytics, order summaries, and financial reports</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export to CSV / Excel</span>
        </button>
      </div>

      <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#D4C4ED] space-y-4">
        <h2 className="text-base font-extrabold text-[#18181B] flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#7E3AF2]" />
          <span>Report Overview ({reportData?.role?.toUpperCase() || 'GENERAL'})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
            <p className="text-[#6E6A78]">Total Processed Orders</p>
            <p className="text-2xl font-black text-[#18181B] mt-1">{reportData?.totalOrders || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
            <p className="text-[#6E6A78]">Report Generation Date</p>
            <p className="text-base font-extrabold text-[#7E3AF2] mt-1">{new Date().toLocaleDateString()}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#D4C4ED]">
            <p className="text-[#6E6A78]">Export Formats Available</p>
            <p className="text-xs font-bold text-emerald-700 mt-2">CSV, Excel (.csv/.xlsx), JSON</p>
          </div>
        </div>

        {reportData?.orders && (
          <div className="bg-white rounded-2xl border border-[#D4C4ED] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFE9F6] text-[#4B5563] font-bold uppercase border-b border-[#D4C4ED]">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Security Deposit</th>
                  <th className="p-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {reportData.orders.map((o: any) => (
                  <tr key={o._id} className="hover:bg-[#FAF7F2]">
                    <td className="p-3 font-extrabold text-[#7E3AF2]">{o.orderRef}</td>
                    <td className="p-3 font-bold">{o.customerName}</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-[10px] font-bold rounded-full">{o.status}</span></td>
                    <td className="p-3 font-bold text-amber-700">Rs. {o.securityDeposit?.amount || 0}</td>
                    <td className="p-3 text-right font-black">Rs. {(o.total || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
