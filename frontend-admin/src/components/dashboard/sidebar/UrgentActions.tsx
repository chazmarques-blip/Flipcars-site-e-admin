import React from 'react';
import styles from '../Dashboard.module.css';

interface UrgentAction {
  id: string;
  icon: string;
  text: string;
  count: number;
  priority: 'high' | 'medium' | 'low';
  actionLabel?: string;
  onAction?: () => void;
}

interface UrgentActionsProps {
  actions: UrgentAction[];
}

const defaultActions: UrgentAction[] = [
  {
    id: '1',
    icon: '📞',
    text: 'Missed Calls',
    count: 3,
    priority: 'high',
    actionLabel: 'Call Back'
  },
  {
    id: '2',
    icon: '📧',
    text: 'Unread Messages',
    count: 7,
    priority: 'medium',
    actionLabel: 'View'
  },
  {
    id: '3',
    icon: '⏰',
    text: 'Overdue Tasks',
    count: 2,
    priority: 'high',
    actionLabel: 'Review'
  },
  {
    id: '4',
    icon: '💰',
    text: 'Pending Approvals',
    count: 5,
    priority: 'medium',
    actionLabel: 'Approve'
  },
  {
    id: '5',
    icon: '📋',
    text: 'Follow-ups Due',
    count: 4,
    priority: 'low',
    actionLabel: 'Schedule'
  }
];

export default function UrgentActions({ 
  actions = defaultActions 
}: UrgentActionsProps) {
  const priorityClass = (priority: string) => {
    return `priority${priority.charAt(0).toUpperCase() + priority.slice(1)}`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Urgent Actions</div>
          <div className={styles.cardSubtitle}>Items requiring attention</div>
        </div>
      </div>
      <div className={styles.cardBody}>
        {actions.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>✅</div>
            <div className={styles.emptyStateText}>All caught up!</div>
          </div>
        ) : (
          actions.map((action) => (
            <div
              key={action.id}
              className={`${styles.urgentItem} ${styles[priorityClass(action.priority)]}`}
            >
              <div className={styles.urgentIcon}>{action.icon}</div>
              <div className={styles.urgentContent}>
                <div className={styles.urgentText}>{action.text}</div>
                <span className={`${styles.urgentCount} ${styles[priorityClass(action.priority)]}`}>
                  {action.count}
                </span>
              </div>
              {action.actionLabel && (
                <button
                  className={styles.urgentActionBtn}
                  onClick={action.onAction}
                >
                  {action.actionLabel}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
