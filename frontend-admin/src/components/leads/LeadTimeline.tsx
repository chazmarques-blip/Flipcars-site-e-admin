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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
        <span className="text-sm text-gray-500">({activities.length})</span>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6 pl-8">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No activities yet. Actions will appear here.</p>
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
                    absolute -left-8 w-8 h-8 rounded-full border-2 flex items-center justify-center
                    ${config.color} ${config.borderColor}
                  `}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {/* Content Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {activity.description}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        by {activity.performedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.timestamp), { 
                          addSuffix: true 
                        })}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>

                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-2 text-xs">
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
