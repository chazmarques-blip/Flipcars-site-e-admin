import React from 'react';
import styles from '../Dashboard.module.css';

interface PendingCardProps {
  amount: number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export default function PendingCard({ 
  amount, 
  subtitle = 'Awaiting review',
  trend = 'neutral'
}: PendingCardProps) {
  const trendEmoji = {
    up: '📈',
    down: '📉',
    neutral: '⏳'
  };

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiLabel}>Pending</div>
      <div className={styles.kpiValue}>{formatCurrency(amount)}</div>
      <div className={styles.kpiSubtitle}>{subtitle}</div>
      <div className={styles.kpiTrend}>{trendEmoji[trend]}</div>
    </div>
  );
}
