'use client';

import React from 'react';

interface CalendarFiltersProps {
  onFilterChange?: (filters: any) => void;
}

export function CalendarFilters({ onFilterChange }: CalendarFiltersProps) {
  return (
    <div className="bg-white rounded-[6px] p-[6px_10px] border border-[#e0e0e0] shadow-[0_1px_2px_rgba(0,0,0,0.04)] mb-[5px] flex flex-wrap items-center gap-3">
      {/* Type Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-[#666]">Type:</span>
        <select 
          className="text-[11px] px-2 py-1 border border-[#e0e0e0] rounded-[4px] bg-white hover:border-[#D4AF37] focus:border-[#D4AF37] focus:outline-none transition-colors"
          onChange={(e) => onFilterChange?.({ type: e.target.value })}
        >
          <option value="all">All Events</option>
          <option value="appointment">Appointments</option>
          <option value="payment">Payments</option>
          <option value="reminder">Reminders</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-[#666]">Status:</span>
        <select 
          className="text-[11px] px-2 py-1 border border-[#e0e0e0] rounded-[4px] bg-white hover:border-[#D4AF37] focus:border-[#D4AF37] focus:outline-none transition-colors"
          onChange={(e) => onFilterChange?.({ status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Date Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-[#666]">Date:</span>
        <select 
          className="text-[11px] px-2 py-1 border border-[#e0e0e0] rounded-[4px] bg-white hover:border-[#D4AF37] focus:border-[#D4AF37] focus:outline-none transition-colors"
          onChange={(e) => onFilterChange?.({ date: e.target.value })}
        >
          <option value="month">This Month</option>
          <option value="week">This Week</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search customers, VIN..."
        className="text-[11px] px-3 py-1 border border-[#e0e0e0] rounded-[4px] bg-white hover:border-[#D4AF37] focus:border-[#D4AF37] focus:outline-none transition-colors flex-1 min-w-[200px]"
        onChange={(e) => onFilterChange?.({ search: e.target.value })}
      />
    </div>
  );
}
