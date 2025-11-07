'use client';

import React, { useState } from 'react';
import { LeadStatus, LeadPriority } from '@/types/lead';
import { 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Archive
} from 'lucide-react';

interface LeadQuickActionsProps {
  leadId: string;
  currentStatus: LeadStatus;
  currentPriority: LeadPriority;
  onStatusChange?: (newStatus: LeadStatus) => void;
  onPriorityChange?: (newPriority: LeadPriority) => void;
  onAction?: (actionType: string) => void;
}

export const LeadQuickActions: React.FC<LeadQuickActionsProps> = ({
  leadId,
  currentStatus,
  currentPriority,
  onStatusChange,
  onPriorityChange,
  onAction,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (isUpdating || newStatus === currentStatus) return;
    
    setIsUpdating(true);
    try {
      if (onStatusChange) {
        await onStatusChange(newStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAction = (actionType: string) => {
    if (onAction) {
      onAction(actionType);
    }
  };

  const STATUS_ACTIONS = [
    {
      status: LeadStatus.CONTACTED,
      label: 'Mark Contacted',
      icon: Phone,
      color: 'bg-purple-50 text-purple-600 hover:bg-purple-100 border-purple-200',
    },
    {
      status: LeadStatus.QUALIFIED,
      label: 'Mark Qualified',
      icon: CheckCircle2,
      color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-indigo-200',
    },
    {
      status: LeadStatus.APPOINTMENT_SCHEDULED,
      label: 'Schedule Appointment',
      icon: Calendar,
      color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-yellow-200',
    },
    {
      status: LeadStatus.IN_PROGRESS,
      label: 'In Progress',
      icon: Clock,
      color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100 border-cyan-200',
    },
    {
      status: LeadStatus.CONVERTED,
      label: 'Mark Converted',
      icon: CheckCircle2,
      color: 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200',
    },
    {
      status: LeadStatus.LOST,
      label: 'Mark Lost',
      icon: XCircle,
      color: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200',
    },
  ];

  const COMMUNICATION_ACTIONS = [
    {
      type: 'call',
      label: 'Call',
      icon: Phone,
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      type: 'email',
      label: 'Email',
      icon: Mail,
      color: 'bg-green-600 hover:bg-green-700 text-white',
    },
    {
      type: 'sms',
      label: 'SMS',
      icon: MessageSquare,
      color: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Communication Actions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Quick Contact
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {COMMUNICATION_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.type}
                onClick={() => handleAction(action.type)}
                className={`
                  flex items-center justify-center gap-2 px-4 py-2 rounded-lg
                  font-medium transition-colors
                  ${action.color}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Change Actions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Update Status
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_ACTIONS.map((action) => {
            const Icon = action.icon;
            const isCurrentStatus = action.status === currentStatus;
            
            return (
              <button
                key={action.status}
                onClick={() => handleStatusChange(action.status)}
                disabled={isCurrentStatus || isUpdating}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border
                  text-sm font-medium transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isCurrentStatus ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
                  ${action.color}
                `}
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Priority Actions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Set Priority
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {[
            { 
              priority: LeadPriority.HIGH, 
              label: 'High', 
              color: 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' 
            },
            { 
              priority: LeadPriority.MEDIUM, 
              label: 'Medium', 
              color: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100 border-yellow-200' 
            },
            { 
              priority: LeadPriority.LOW, 
              label: 'Low', 
              color: 'bg-green-50 text-green-600 hover:bg-green-100 border-green-200' 
            },
          ].map(({ priority, label, color }) => {
            const isCurrentPriority = priority === currentPriority;
            
            return (
              <button
                key={priority}
                onClick={() => onPriorityChange && onPriorityChange(priority)}
                disabled={isCurrentPriority || isUpdating}
                className={`
                  flex items-center justify-center gap-2 px-3 py-2 rounded-lg border
                  text-sm font-medium transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isCurrentPriority ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
                  ${color}
                `}
              >
                <AlertCircle className="w-4 h-4" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Archive Action */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => handleStatusChange(LeadStatus.ARCHIVED)}
          disabled={currentStatus === LeadStatus.ARCHIVED || isUpdating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Archive className="w-4 h-4" />
          Archive Lead
        </button>
      </div>
    </div>
  );
};
