'use client';

import { Download, Settings } from 'lucide-react';

export interface CalendarLegendProps {
  onExport?: () => void;
  onSettings?: () => void;
}

export function CalendarLegend({ onExport, onSettings }: CalendarLegendProps) {
  return (
    <div className="bg-white rounded-[6px] p-[6px_10px] border border-[#e0e0e0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-[5px] flex items-center justify-between flex-wrap gap-3">
      {/* Legend Items */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="text-[9px] font-semibold text-[#666] mr-1">Legend:</div>
        
        {/* Appointment */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] border border-[#22c55e]"></span>
          <span className="text-[9px] text-[#666]">Appointment</span>
        </div>

        {/* Payment Due */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#fbbf24] border border-[#f59e0b]"></span>
          <span className="text-[9px] text-[#666]">Payment Due</span>
        </div>

        {/* Overdue */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#f87171] border border-[#dc2626]"></span>
          <span className="text-[9px] text-[#666]">Overdue</span>
        </div>

        {/* Reminder */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#60a5fa] border border-[#3b82f6]"></span>
          <span className="text-[9px] text-[#666]">Reminder</span>
        </div>

        {/* Completed */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#d1d5db] border border-[#9ca3af]"></span>
          <span className="text-[9px] text-[#666]">Completed</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-2.5 py-1 border border-[#e0e0e0] rounded-[4px] bg-white hover:border-[#D4AF37] hover:bg-[#fffbf0] transition-all text-[10px] text-[#666] hover:text-[#D4AF37] font-medium"
        >
          <Download className="w-3 h-3" />
          <span>Export</span>
        </button>
        <button
          onClick={onSettings}
          className="flex items-center gap-1.5 px-2.5 py-1 border border-[#e0e0e0] rounded-[4px] bg-white hover:border-[#D4AF37] hover:bg-[#fffbf0] transition-all text-[10px] text-[#666] hover:text-[#D4AF37] font-medium"
        >
          <Settings className="w-3 h-3" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
