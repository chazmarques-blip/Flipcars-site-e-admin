import React from 'react';
import styles from '../Dashboard.module.css';

interface Lead {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  vehicleInfo?: string;
  status: string;
  preferredContactMethod?: string;
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
      month: '2-digit', 
      day: '2-digit'
    });
  };

  const formatReference = (id: string, date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const idNum = id.split('-').pop() || '0001';
    return `${year}-${month}${day}-${idNum}`;
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      'NEW': '#3B82F6',
      'CONTACTED': '#F59E0B',
      'QUALIFIED': '#10B981',
      'ESTIMATE_SENT': '#8B5CF6',
      'APPROVED': '#10B981',
      'IN_PROGRESS': '#3B82F6',
      'COMPLETED': '#10B981',
      'ARCHIVED': '#6B7280'
    };
    const color = statusColors[status] || '#6B7280';
    return (
      <span style={{
        background: color,
        color: 'white',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase'
      }}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const getAIScore = (index: number) => {
    const scores = [85, 92, 78, 88, 95, 70, 82, 90, 86, 91];
    return scores[index % scores.length];
  };

  const getContactIcon = (method?: string) => {
    if (method === 'PHONE') return '📞';
    if (method === 'EMAIL') return '📧';
    return '💬';
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>📋 Week's Leads</div>
          <div className={styles.cardSubtitle}>Most recent submissions in the past 7 days</div>
        </div>
        <a href="/dashboard/leads" className={styles.viewAllLink}>View All</a>
      </div>
      <div className={styles.tableContainer} style={{ maxHeight }}>
        <table className={styles.tableLeads}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>#</th>
              <th style={{ minWidth: '120px' }}>REFERENCE</th>
              <th style={{ minWidth: '150px' }}>CUSTOMER</th>
              <th style={{ minWidth: '130px' }}>CONTACT</th>
              <th style={{ width: '50px', textAlign: 'center' }}>PREF</th>
              <th style={{ minWidth: '180px' }}>VEHICLE</th>
              <th style={{ minWidth: '100px' }}>SERVICE</th>
              <th style={{ minWidth: '100px' }}>WHO PAY</th>
              <th style={{ minWidth: '120px' }}>COMPANY</th>
              <th style={{ width: '70px' }}>AI SCORE</th>
              <th style={{ width: '50px', textAlign: 'center' }}>PHOTOS</th>
              <th style={{ width: '80px' }}>DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No leads found
                </td>
              </tr>
            ) : (
              leads.slice(0, 50).map((lead, index) => {
                const fullName = `${lead.firstName || ''} ${lead.lastName || ''}`.trim();
                const aiScore = getAIScore(index);
                
                return (
                  <tr key={lead.id}>
                    <td>
                      <span className={styles.leadIndex}>{leads.length - index}</span>
                    </td>
                    <td>
                      <span className={styles.leadRef}>
                        {formatReference(lead.id, lead.createdAt)}
                      </span>
                    </td>
                    <td>
                      <span className={styles.leadCustomer}>{fullName}</span>
                    </td>
                    <td>
                      <span className={styles.leadPhone}>{lead.phone || lead.email || '—'}</span>
                    </td>
                    <td style={{ textAlign: 'center', fontSize: '16px' }}>
                      {getContactIcon(lead.preferredContactMethod)}
                    </td>
                    <td>
                      <span className={styles.leadVehicle}>
                        {lead.vehicleInfo || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={styles.badgeService}>Bodyshop</span>
                    </td>
                    <td>
                      <span className={styles.badgeWhopay}>Insurance</span>
                    </td>
                    <td>
                      <span className={styles.leadCompany}>Progressive</span>
                    </td>
                    <td>
                      <div className={styles.aiScoreContainer}>
                        <div className={styles.aiScoreBar}>
                          <div 
                            className={styles.aiScoreBarFill} 
                            style={{ width: `${aiScore}%` }}
                          />
                        </div>
                        <span className={styles.aiScoreText}>{aiScore}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={styles.photosIcon}>👁️</span>
                    </td>
                    <td>
                      <button className={styles.btnDetails}>Details</button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
