import React from 'react';
import styles from '../Dashboard.module.css';

interface OverdueCardProps {
  count: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function OverdueCard({ 
  count, 
  subtitle = 'Need attention',
  trend = 'down'
}: OverdueCardProps) {
  const trendEmoji = {
    up: '⚠️',
    down: '✅',
    neutral: '⏰'
  };

  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiLabel}>Overdue</div>
      <div className={styles.kpiValue}>{count}</div>
      <div className={styles.kpiSubtitle}>{subtitle}</div>
      <div className={styles.kpiTrend}>{trendEmoji[trend]}</div>
    </div>
  );
}
