import { BUSINESS_HOURS, TIME_SLOTS } from '@/types/estimate';

/**
 * Check if a date is a business day (not Sunday)
 */
export function isBusinessDay(date: Date): boolean {
  const day = date.getDay();
  return day !== 0; // 0 = Sunday
}

/**
 * Get business hours for a specific day
 */
export function getBusinessHours(date: Date): { open: string; close: string } | null {
  const day = date.getDay();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
  const dayName = dayNames[day];
  
  return BUSINESS_HOURS[dayName];
}

/**
 * Generate available time slots for a given date
 */
export function generateTimeSlots(date: Date): string[] {
  const hours = getBusinessHours(date);
  if (!hours) return [];
  
  const slots: string[] = [];
  const [openHour] = hours.open.split(':').map(Number);
  const [closeHour] = hours.close.split(':').map(Number);
  
  for (let hour = openHour; hour < closeHour; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;
    slots.push(time);
  }
  
  return slots;
}

/**
 * Get available dates for the next N days (excluding Sundays)
 * Limited to 15 days maximum
 */
export function getAvailableDates(numberOfDays: number = 15): Date[] {
  const maxDays = Math.min(numberOfDays, 15); // Limit to 15 days
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let currentDate = new Date(today);
  let addedDays = 0;
  
  while (addedDays < maxDays) {
    if (isBusinessDay(currentDate)) {
      dates.push(new Date(currentDate));
      addedDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

/**
 * Get available time slots for a specific date
 * Saturday has shorter hours (9:00 AM - 12:30 PM)
 * Other days: 9-11am, 11am-1pm, 1-3pm, 3-5pm
 */
export function getAvailableTimeSlots(date?: Date): typeof TIME_SLOTS | typeof import('@/types/estimate').SATURDAY_TIME_SLOTS {
  // If date is provided and it's Saturday (day 6), return Saturday slots
  if (date && date.getDay() === 6) {
    const { SATURDAY_TIME_SLOTS } = require('@/types/estimate');
    return SATURDAY_TIME_SLOTS;
  }
  return TIME_SLOTS;
}

/**
 * Format date for display (e.g., "Mon, Nov 6")
 */
export function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date for form input (YYYY-MM-DD)
 */
export function formatDateInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse date string (YYYY-MM-DD) to Date object in local timezone
 * This prevents timezone issues when converting date strings
 */
export function parseDateInput(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Format time for display (e.g., "9:00 AM")
 */
export function formatTimeDisplay(time: string): string {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Get day name from date
 */
export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}
