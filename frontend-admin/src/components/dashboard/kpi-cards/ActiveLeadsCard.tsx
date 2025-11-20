import React from 'react';
import styles from '../Dashboard.module.css';

interface ActiveLeadsCardProps {
  count: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function ActiveLeadsCard({ 
  count, 
  subtitle = 'Active in pipeline',
  trend = 'neutral'
}: ActiveLeadsCardProps) {
  const trendEmoji = {
    up: '📈',
    down: '📉',
    neutral: '📊'
  };

  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiLabel}>Active Leads</div>
      <div className={styles.kpiValue}>{count}</div>
      <div className={styles.kpiSubtitle}>{subtitle}</div>
      <div className={styles.kpiTrend}>{trendEmoji[trend]}</div>
    </div>
  );
}
