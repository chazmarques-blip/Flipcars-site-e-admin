import React from 'react';
import styles from '../Dashboard.module.css';

interface FunnelStage {
  label: string;
  count: number;
  percentage: number;
  type: 'leads' | 'estimates' | 'approved' | 'jobs';
}

interface ConversionFunnelCardProps {
  stages: FunnelStage[];
}

export default function ConversionFunnelCard({ stages }: ConversionFunnelCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Conversion Funnel</div>
          <div className={styles.cardSubtitle}>Pipeline progression overview</div>
        </div>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.funnelContainer}>
          {stages.map((stage, index) => (
            <div key={index} className={styles.funnelStage}>
              <div className={styles.funnelLabel}>{stage.label}</div>
              <div 
                className={`${styles.funnelBar} ${styles[stage.type]}`}
                style={{ width: `${stage.percentage}%` }}
              >
                <span>{stage.count}</span>
                <span>{stage.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
