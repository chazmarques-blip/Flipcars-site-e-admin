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
  Archive,
  TrendingUp,
  Zap
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
      label: 'Contacted',
      icon: Phone,
    },
    {
      status: LeadStatus.QUALIFIED,
      label: 'Qualified',
      icon: CheckCircle2,
    },
    {
      status: LeadStatus.APPOINTMENT_SCHEDULED,
      label: 'Schedule',
      icon: Calendar,
    },
    {
      status: LeadStatus.IN_PROGRESS,
      label: 'In Progress',
      icon: Clock,
    },
    {
      status: LeadStatus.CONVERTED,
      label: 'Converted',
      icon: TrendingUp,
    },
    {
      status: LeadStatus.LOST,
      label: 'Lost',
      icon: XCircle,
    },
  ];

  const COMMUNICATION_ACTIONS = [
    {
      type: 'call',
      label: 'Call',
      icon: Phone,
    },
    {
      type: 'email',
      label: 'Email',
      icon: Mail,
    },
    {
      type: 'sms',
      label: 'SMS',
      icon: MessageSquare,
    },
  ];

  return (
    <div className="bg-black border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Contact */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gold uppercase tracking-wide">
              CONTACT
            </span>
            <div className="flex gap-1">
              {COMMUNICATION_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.type}
                    onClick={() => handleAction(action.type)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-gold hover:bg-gold-dark text-black rounded-md font-medium text-xs transition-all hover:scale-105"
                    title={action.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-800"></div>

          {/* Update Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gold uppercase tracking-wide">
              STATUS
            </span>
            <div className="flex gap-1 flex-wrap">
              {STATUS_ACTIONS.map((action) => {
                const Icon = action.icon;
                const isCurrentStatus = action.status === currentStatus;
                
                return (
                  <button
                    key={action.status}
                    onClick={() => handleStatusChange(action.status)}
                    disabled={isCurrentStatus || isUpdating}
                    className={`
                      flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-all
                      ${isCurrentStatus 
                        ? 'bg-gold border-gold text-black ring-2 ring-gold ring-opacity-50' 
                        : 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 hover:border-gold hover:text-gold'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    title={action.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-800"></div>

          {/* Set Priority */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-gold uppercase tracking-wide">
              PRIORITY
            </span>
            <div className="flex gap-1">
              {[
                { priority: LeadPriority.HIGH, label: 'High', icon: AlertCircle },
                { priority: LeadPriority.MEDIUM, label: 'Medium', icon: Zap },
                { priority: LeadPriority.LOW, label: 'Low', icon: AlertCircle },
              ].map(({ priority, label, icon: Icon }) => {
                const isCurrentPriority = priority === currentPriority;
                
                return (
                  <button
                    key={priority}
                    onClick={() => onPriorityChange && onPriorityChange(priority)}
                    disabled={isCurrentPriority || isUpdating}
                    className={`
                      flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium transition-all
                      ${isCurrentPriority 
                        ? priority === LeadPriority.HIGH
                          ? 'bg-red-600 border-red-600 text-white ring-2 ring-red-500 ring-opacity-50'
                          : priority === LeadPriority.MEDIUM
                          ? 'bg-yellow-600 border-yellow-600 text-white ring-2 ring-yellow-500 ring-opacity-50'
                          : 'bg-green-600 border-green-600 text-white ring-2 ring-green-500 ring-opacity-50'
                        : 'bg-gray-900 border-gray-800 text-gray-300 hover:bg-gray-800 hover:border-gray-700'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                    title={label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Archive */}
          <button
            onClick={() => handleStatusChange(LeadStatus.ARCHIVED)}
            disabled={currentStatus === LeadStatus.ARCHIVED || isUpdating}
            className="flex items-center gap-1 px-2.5 py-1 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-gray-300 rounded-md text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Archive Lead"
          >
            <Archive className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Archive</span>
          </button>
        </div>
      </div>
    </div>
  );
};
