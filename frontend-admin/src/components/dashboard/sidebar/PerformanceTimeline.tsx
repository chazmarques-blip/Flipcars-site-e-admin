import React, { useState } from 'react';
import styles from '../Dashboard.module.css';

interface TimelineData {
  label: string;
  leads: number;
  estimates: number;
}

interface PerformanceTimelineProps {
  data: TimelineData[];
  period?: 'week' | 'month' | 'year';
  onPeriodChange?: (period: 'week' | 'month' | 'year') => void;
}

const defaultData: TimelineData[] = [
  { label: 'Mon', leads: 12, estimates: 8 },
  { label: 'Tue', leads: 15, estimates: 10 },
  { label: 'Wed', leads: 9, estimates: 6 },
  { label: 'Thu', leads: 18, estimates: 12 },
  { label: 'Fri', leads: 14, estimates: 9 },
  { label: 'Sat', leads: 6, estimates: 4 },
  { label: 'Sun', leads: 4, estimates: 2 }
];

export default function PerformanceTimeline({ 
  data = defaultData,
  period = 'week',
  onPeriodChange
}: PerformanceTimelineProps) {
  const [activePeriod, setActivePeriod] = useState(period);

  const maxValue = Math.max(
    ...data.flatMap(d => [d.leads, d.estimates])
  );

  const handlePeriodChange = (newPeriod: 'week' | 'month' | 'year') => {
    setActivePeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  const getBarHeight = (value: number): string => {
    return `${(value / maxValue) * 100}%`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Performance Timeline</div>
          <div className={styles.cardSubtitle}>Leads & Estimates tracking</div>
        </div>
      </div>
      <div className={styles.cardBody}>
        {/* Period Tabs */}
        <div className={styles.timelineTabs}>
          <button
            className={`${styles.timelineTab} ${activePeriod === 'week' ? styles.active : ''}`}
            onClick={() => handlePeriodChange('week')}
          >
            Week
          </button>
          <button
            className={`${styles.timelineTab} ${activePeriod === 'month' ? styles.active : ''}`}
            onClick={() => handlePeriodChange('month')}
          >
            Month
          </button>
          <button
            className={`${styles.timelineTab} ${activePeriod === 'year' ? styles.active : ''}`}
            onClick={() => handlePeriodChange('year')}
          >
            Year
          </button>
        </div>

        {/* Timeline Chart */}
        <div className={styles.timelineChart}>
          {data.map((item, index) => (
            <div key={index} className={styles.timelineColumn}>
              <div className={styles.timelineBars}>
                {/* Leads Bar */}
                <div
                  className={styles.timelineBar}
                  style={{
                    height: getBarHeight(item.leads),
                    background: 'linear-gradient(180deg, #93c5fd 0%, #60a5fa 100%)'
                  }}
                  title={`Leads: ${item.leads}`}
                />
                {/* Estimates Bar */}
                <div
                  className={styles.timelineBar}
                  style={{
                    height: getBarHeight(item.estimates),
                    background: 'linear-gradient(180deg, #D4AF37 0%, #B8941F 100%)'
                  }}
                  title={`Estimates: ${item.estimates}`}
                />
              </div>
              <div className={styles.timelineLabel}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          justifyContent: 'center', 
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #e0e0e0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#666' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '2px',
              background: 'linear-gradient(180deg, #93c5fd 0%, #60a5fa 100%)'
            }} />
            Leads
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#666' }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '2px',
              background: 'linear-gradient(180deg, #D4AF37 0%, #B8941F 100%)'
            }} />
            Estimates
          </div>
        </div>
      </div>
    </div>
  );
}
