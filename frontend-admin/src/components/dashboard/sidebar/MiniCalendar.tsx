import React, { useState } from 'react';
import styles from '../Dashboard.module.css';

interface Appointment {
  id: string;
  name: string;
  time: string;
  icon: string;
  details?: string;
}

interface MiniCalendarProps {
  appointments: Appointment[];
  selectedDate?: Date;
  onDateChange?: (date: Date) => void;
}

export default function MiniCalendar({ 
  appointments,
  selectedDate = new Date(),
  onDateChange
}: MiniCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className={`${styles.calendarDay} ${styles.inactive}`}>
          {' '}
        </div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <div
          key={day}
          className={`${styles.calendarDay} ${styles.active} ${isToday(day) ? styles.today : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        {/* Calendar Header */}
        <div className={styles.calendarHeader}>
          <div className={styles.calendarMonth}>
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <div className={styles.calendarNav}>
            <button className={styles.calendarNavBtn} onClick={handlePrevMonth}>
              ◀
            </button>
            <button className={styles.calendarNavBtn} onClick={handleNextMonth}>
              ▶
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className={styles.calendarGrid}>
          {/* Day headers */}
          {dayNames.map((day) => (
            <div key={day} className={`${styles.calendarDay} ${styles.header}`}>
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {renderCalendarDays()}
        </div>

        {/* Today's Appointments */}
        {appointments.length > 0 && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '12px', color: '#666' }}>
              Today's Appointments ({appointments.length})
            </div>
            {appointments.map((appointment) => (
              <div key={appointment.id} className={styles.appointmentItem}>
                <div className={styles.appointmentIcon}>{appointment.icon}</div>
                <div className={styles.appointmentContent}>
                  <div className={styles.appointmentName}>{appointment.name}</div>
                  <div className={styles.appointmentDetails}>
                    <span className={styles.appointmentTime}>{appointment.time}</span>
                    {appointment.details}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
