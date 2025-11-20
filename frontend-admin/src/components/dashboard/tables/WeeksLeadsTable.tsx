import React from 'react';
import styles from '../Dashboard.module.css';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  source?: string;
  createdAt: Date | string;
}

interface WeeksLeadsTableProps {
  leads: Lead[];
  maxHeight?: string;
}

export default function WeeksLeadsTable({ 
  leads, 
  maxHeight = '400px' 
}: WeeksLeadsTableProps) {
  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      'NEW': 'info',
      'CONTACTED': 'warning',
      'QUALIFIED': 'success',
      'CONVERTED': 'success',
      'LOST': 'danger',
      'ARCHIVED': 'danger'
    };
    const badgeClass = statusMap[status] || 'info';
    return <span className={`${styles.badge} ${styles[badgeClass]}`}>{status}</span>;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Week's Leads</div>
          <div className={styles.cardSubtitle}>{leads.length} leads this week</div>
        </div>
      </div>
      <div className={styles.tableContainer} style={{ maxHeight }}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Source</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 600 }}>{lead.name}</td>
                  <td>
                    {lead.phone && <div>{lead.phone}</div>}
                    {lead.email && <div style={{ fontSize: '11px', color: '#666' }}>{lead.email}</div>}
                  </td>
                  <td>{lead.source || '—'}</td>
                  <td>{getStatusBadge(lead.status)}</td>
                  <td style={{ fontSize: '11px', color: '#666' }}>
                    {formatDate(lead.createdAt)}
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
