import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { dashboardService } from '../../services/api';

export const VendorCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchSchedulerData = async () => {
    try {
      const data = await dashboardService.getScheduler(currentDate.getMonth(), currentDate.getFullYear());
      setBookings(data.bookings || []);
    } catch (err) {}
  };

  useEffect(() => {
    fetchSchedulerData();
  }, [currentDate]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const todayStr = new Date().toDateString();

  const tagStyles: Record<string, string> = {
    'Pick up': 'bg-blue-100 text-blue-800 border-blue-200',
    'Late Pick up': 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    'Booked': 'bg-purple-100 text-[#7E3AF2] border-[#D4C4ED]',
    'Late Delivery': 'bg-red-100 text-red-800 border-red-200 font-bold',
    'Available': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#18181B] flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-[#7E3AF2]" />
            <span>Rental Scheduler & Calendar</span>
          </h1>
          <p className="text-xs text-[#6E6A78]">Visual timeline of bookings, pickups, returns, and item availability</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 text-[10px] font-bold">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md border border-blue-200">Pick up</span>
          <span className="px-2 py-1 bg-amber-100 text-amber-900 rounded-md border border-amber-300">Late Pick up</span>
          <span className="px-2 py-1 bg-purple-100 text-[#7E3AF2] rounded-md border border-[#D4C4ED]">Booked</span>
          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md border border-red-200">Late Delivery</span>
          <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md border border-emerald-200">Available</span>
        </div>
      </div>

      {/* Month Navigation Bar */}
      <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D4C4ED] flex justify-between items-center">
        <button
          onClick={handlePrevMonth}
          className="p-2 bg-white rounded-xl border border-[#D4C4ED] hover:bg-[#EFE9F6] text-[#18181B] font-bold transition-all flex items-center gap-1 text-xs"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Month</span>
        </button>

        <h2 className="text-lg font-black text-[#18181B]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <button
          onClick={handleNextMonth}
          className="p-2 bg-white rounded-xl border border-[#D4C4ED] hover:bg-[#EFE9F6] text-[#18181B] font-bold transition-all flex items-center gap-1 text-xs"
        >
          <span>Next Month</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-[#D4C4ED] overflow-hidden shadow-xs">
        {/* Days of Week Header */}
        <div className="grid grid-cols-7 bg-[#EFE9F6] text-center text-xs font-black text-[#4B5563] py-3 border-b border-[#D4C4ED]">
          <div>SUN</div>
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#E5E7EB] min-h-[500px]">
          {/* Empty prefix cells for start of month */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="bg-[#FAF7F2]/50 p-2" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
            const isToday = cellDate.toDateString() === todayStr;

            // Find bookings overlapping this day
            const dayBookings = bookings.filter((b) => {
              const start = new Date(b.startDate);
              const end = new Date(b.endDate);
              return cellDate >= new Date(start.setHours(0,0,0,0)) && cellDate <= new Date(end.setHours(23,59,59,999));
            });

            return (
              <div
                key={dayNum}
                className={`p-2 space-y-1.5 transition-colors ${
                  isToday ? 'bg-[#EFE9F6]/80 ring-2 ring-[#7E3AF2] inset-0 z-10' : 'hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      isToday ? 'bg-[#7E3AF2] text-white' : 'text-[#18181B]'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {isToday && <span className="text-[9px] font-extrabold uppercase text-[#7E3AF2]">Today</span>}
                </div>

                {/* Bookings Chips */}
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {dayBookings.map((b, bIdx) => (
                    <div
                      key={bIdx}
                      className={`p-1.5 rounded-lg text-[10px] border line-clamp-2 ${tagStyles[b.tag] || 'bg-gray-100'}`}
                      title={b.displayLabel}
                    >
                      <span className="font-extrabold">{b.orderRef}:</span> {b.productName} ({b.tag})
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
