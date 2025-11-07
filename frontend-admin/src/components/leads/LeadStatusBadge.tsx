'use client';

import React from 'react';
import { LeadStatus } from '@/types/lead';
import { 
  Clock, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Archive,
  AlertCircle 
} from 'lucide-react';

interface LeadStatusBadgeProps {
  status: LeadStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_CONFIG = {
  [LeadStatus.NEW]: {
    label: 'New',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: AlertCircle,
  },
  [LeadStatus.CONTACTED]: {
    label: 'Contacted',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Phone,
  },
  [LeadStatus.QUALIFIED]: {
    label: 'Qualified',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    icon: CheckCircle2,
  },
  [LeadStatus.APPOINTMENT_SCHEDULED]: {
    label: 'Appointment',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Calendar,
  },
  [LeadStatus.IN_PROGRESS]: {
    label: 'In Progress',
    color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    icon: Clock,
  },
  [LeadStatus.CONVERTED]: {
    label: 'Converted',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2,
  },
  [LeadStatus.LOST]: {
    label: 'Lost',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
  },
  [LeadStatus.ARCHIVED]: {
    label: 'Archived',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Archive,
  },
};

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

const ICON_SIZE_CLASSES = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export const LeadStatusBadge: React.FC<LeadStatusBadgeProps> = ({ 
  status, 
  showIcon = true,
  size = 'md' 
}) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${config.color}
        ${SIZE_CLASSES[size]}
      `}
    >
      {showIcon && <Icon className={ICON_SIZE_CLASSES[size]} />}
      {config.label}
    </span>
  );
};
