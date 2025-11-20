import React from 'react';
import styles from '../Dashboard.module.css';

interface AppointmentsCardProps {
  count: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function AppointmentsCard({ 
  count, 
  subtitle = 'Scheduled today',
  trend = 'neutral'
}: AppointmentsCardProps) {
  const trendEmoji = {
    up: '📈',
    down: '📉',
    neutral: '📅'
  };

  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiLabel}>Today's Appointments</div>
      <div className={styles.kpiValue}>{count}</div>
      <div className={styles.kpiSubtitle}>{subtitle}</div>
      <div className={styles.kpiTrend}>{trendEmoji[trend]}</div>
    </div>
  );
}
