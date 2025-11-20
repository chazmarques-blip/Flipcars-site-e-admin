import React from 'react';
import styles from '../Dashboard.module.css';

interface Estimate {
  id: string;
  customerName: string;
  vehicleInfo: string;
  amount: number;
  status: string;
  createdAt: Date | string;
}

interface EstimatesTableProps {
  estimates: Estimate[];
  maxHeight?: string;
}

export default function EstimatesTable({ 
  estimates, 
  maxHeight = '300px' 
}: EstimatesTableProps) {
  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      'APPROVED': { bg: '#10B981', text: 'white', label: '✅ Approved' },
      'PENDING': { bg: '#F59E0B', text: 'white', label: '⏳ Pending' },
      'REJECTED': { bg: '#EF4444', text: 'white', label: '❌ Rejected' },
      'DRAFT': { bg: '#6B7280', text: 'white', label: '📝 Draft' }
    };
    
    const config = statusConfig[status] || statusConfig['DRAFT'];
    
    return (
      <span style={{
        background: config.bg,
        color: config.text,
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {config.label}
      </span>
    );
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>💰 Estimates in Progress</div>
          <div className={styles.cardSubtitle}>{estimates.length} estimates awaiting action</div>
        </div>
      </div>
      <div className={styles.tableContainer} style={{ maxHeight }}>
        <table className={styles.tableEstimates}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th>REFERENCE</th>
              <th>CUSTOMER</th>
              <th>VEHICLE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th style={{ width: '120px' }}>CREATED/UPDATED</th>
              <th style={{ width: '80px' }}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {estimates.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No estimates found
                </td>
              </tr>
            ) : (
              estimates.map((estimate, index) => (
                <tr key={estimate.id}>
                  <td>
                    <span className={styles.estimateIndex}>{index + 1}</span>
                  </td>
                  <td>
                    <span className={styles.estimateRef}>EST-{estimate.id.slice(-4)}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#1a1a1a' }}>
                    {estimate.customerName}
                  </td>
                  <td style={{ color: '#666', fontSize: '12px' }}>
                    {estimate.vehicleInfo}
                  </td>
                  <td>
                    <span style={{ 
                      fontWeight: 700, 
                      color: '#D4AF37',
                      fontSize: '14px'
                    }}>
                      {formatCurrency(estimate.amount)}
                    </span>
                  </td>
                  <td>
                    {getStatusBadge(estimate.status)}
                  </td>
                  <td style={{ fontSize: '11px', color: '#666' }}>
                    <div>Created {formatDate(estimate.createdAt)}</div>
                    <div style={{ marginTop: '2px', fontSize: '10px', color: '#999' }}>
                      Approved 1 day ago
                    </div>
                  </td>
                  <td>
                    <button className={styles.btnDetails}>Details</button>
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
