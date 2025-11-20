import React from 'react';
import styles from '../Dashboard.module.css';

interface Estimate {
  id: string;
  customerName: string;
  vehicleInfo?: string;
  amount: number;
  status: string;
  createdAt: Date | string;
}

interface EstimatesTableProps {
  estimates: Estimate[];
  maxHeight?: string;
  limit?: number;
}

export default function EstimatesTable({ 
  estimates, 
  maxHeight = '300px',
  limit = 7
}: EstimatesTableProps) {
  const displayEstimates = limit ? estimates.slice(0, limit) : estimates;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'DRAFT': 'info',
      'PENDING': 'pending',
      'APPROVED': 'approved',
      'REJECTED': 'danger',
      'EXPIRED': 'danger'
    };
    const badgeClass = statusMap[status] || 'info';
    return <span className={`${styles.badge} ${styles[badgeClass]}`}>{status}</span>;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Estimates</div>
          <div className={styles.cardSubtitle}>
            {displayEstimates.length} of {estimates.length} estimates
          </div>
        </div>
      </div>
      <div className={styles.tableContainer} style={{ maxHeight }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {displayEstimates.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No estimates found
                </td>
              </tr>
            ) : (
              displayEstimates.map((estimate) => (
                <tr key={estimate.id}>
                  <td style={{ fontWeight: 600 }}>{estimate.customerName}</td>
                  <td style={{ fontSize: '11px', color: '#666' }}>
                    {estimate.vehicleInfo || '—'}
                  </td>
                  <td style={{ fontWeight: 600, color: '#D4AF37' }}>
                    {formatCurrency(estimate.amount)}
                  </td>
                  <td>{getStatusBadge(estimate.status)}</td>
                  <td style={{ fontSize: '11px', color: '#666' }}>
                    {formatDate(estimate.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
