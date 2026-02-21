'use client';

import React from 'react';
import { LeadActivity } from '@/types/lead';
import { 
  Clock, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  FileText
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface LeadTimelineProps {
  activities: LeadActivity[];
}

const ACTIVITY_CONFIG = {
  status_change: {
    icon: CheckCircle2,
    color: 'bg-blue-100 text-blue-600',
    borderColor: 'border-blue-200',
  },
  note_added: {
    icon: MessageSquare,
    color: 'bg-purple-100 text-purple-600',
    borderColor: 'border-purple-200',
  },
  email_sent: {
    icon: Mail,
    color: 'bg-green-100 text-green-600',
    borderColor: 'border-green-200',
  },
  call_made: {
    icon: Phone,
    color: 'bg-yellow-100 text-yellow-600',
    borderColor: 'border-yellow-200',
  },
  appointment_scheduled: {
    icon: Calendar,
    color: 'bg-indigo-100 text-indigo-600',
    borderColor: 'border-indigo-200',
  },
  document_uploaded: {
    icon: FileText,
    color: 'bg-cyan-100 text-cyan-600',
    borderColor: 'border-cyan-200',
  },
  assigned: {
    icon: User,
    color: 'bg-orange-100 text-orange-600',
    borderColor: 'border-orange-200',
  },
  default: {
    icon: AlertCircle,
    color: 'bg-gray-100 text-gray-600',
    borderColor: 'border-gray-200',
  },
};

export const LeadTimeline: React.FC<LeadTimelineProps> = ({ activities }) => {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900">Timeline</h3>
        <span className="text-xs text-gray-500">({activities.length})</span>
      </div>

      {/* Timeline */}
      <div className="relative space-y-3 pl-6 max-h-64 overflow-y-auto">
        {/* Vertical Line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200" />

        {activities.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs">No activities yet.</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.default;
            const Icon = config.icon;

            return (
              <div key={activity.id} className="relative">
                {/* Icon Circle */}
                <div
                  className={`
                    absolute -left-6 w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${config.color} ${config.borderColor}
                  `}
                >
                  <Icon className="w-3 h-3" />
                </div>

                {/* Content Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold text-gray-900">
                        {activity.description}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-0.5">
                        by {activity.performedBy}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { 
                          addSuffix: true 
                        })}
                      </p>
                    </div>
                  </div>

                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-gray-100">
                      <div className="grid grid-cols-1 gap-1 text-[10px]">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-gray-500 capitalize">
                              {key.replace(/_/g, ' ')}:
                            </span>{' '}
                            <span className="text-gray-700 font-medium">
                              {String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
