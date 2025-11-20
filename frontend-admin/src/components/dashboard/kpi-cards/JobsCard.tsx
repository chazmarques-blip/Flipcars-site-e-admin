import React from 'react';
import styles from '../Dashboard.module.css';

interface JobsCardProps {
  count: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function JobsCard({ 
  count, 
  subtitle = 'Currently active',
  trend = 'neutral'
}: JobsCardProps) {
  const trendEmoji = {
    up: '📈',
    down: '📉',
    neutral: '🔧'
  };

  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiLabel}>Jobs In Progress</div>
      <div className={styles.kpiValue}>{count}</div>
      <div className={styles.kpiSubtitle}>{subtitle}</div>
      <div className={styles.kpiTrend}>{trendEmoji[trend]}</div>
    </div>
  );
}
