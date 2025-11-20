import React from 'react';
import styles from '../Dashboard.module.css';

interface ActionItem {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}

interface BusinessActionsCardProps {
  actions?: ActionItem[];
}

const defaultActions: ActionItem[] = [
  {
    icon: '📞',
    title: 'Follow Up Calls',
    description: 'Contact leads waiting for response',
    onClick: () => console.log('Follow Up Calls clicked')
  },
  {
    icon: '📝',
    title: 'Create Estimate',
    description: 'New estimate for qualified lead',
    onClick: () => console.log('Create Estimate clicked')
  },
  {
    icon: '✅',
    title: 'Approve Pending',
    description: 'Review and approve estimates',
    onClick: () => console.log('Approve Pending clicked')
  },
  {
    icon: '📅',
    title: 'Schedule Jobs',
    description: 'Plan upcoming work calendar',
    onClick: () => console.log('Schedule Jobs clicked')
  },
  {
    icon: '📊',
    title: 'View Reports',
    description: 'Analytics and performance data',
    onClick: () => console.log('View Reports clicked')
  },
  {
    icon: '⚙️',
    title: 'Settings',
    description: 'Configure system preferences',
    onClick: () => console.log('Settings clicked')
  }
];

export default function BusinessActionsCard({ actions = defaultActions }: BusinessActionsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.cardTitle}>Business Actions</div>
          <div className={styles.cardSubtitle}>Quick access to common tasks</div>
        </div>
      </div>
      <div className={styles.cardBody}>
        {actions.map((action, index) => (
          <div
            key={index}
            className={styles.actionButton}
            onClick={action.onClick}
          >
            <div className={styles.actionIcon}>{action.icon}</div>
            <div className={styles.actionContent}>
              <div className={styles.actionTitle}>{action.title}</div>
              <div className={styles.actionDescription}>{action.description}</div>
            </div>
            <div className={styles.actionArrow}>→</div>
          </div>
        ))}
      </div>
    </div>
  );
}
