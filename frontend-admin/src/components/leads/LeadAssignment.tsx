'use client';

import React, { useState } from 'react';
import { User, UserCheck, Users } from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  activeLeads?: number;
}

interface LeadAssignmentProps {
  leadId: string;
  currentAssigneeId?: string;
  onAssign?: (staffId: string) => void;
}

// Mock staff data - in production, this would come from an API
const MOCK_STAFF: StaffMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@flipcars.us',
    role: 'Senior Sales Agent',
    activeLeads: 12,
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@flipcars.us',
    role: 'Sales Agent',
    activeLeads: 8,
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@flipcars.us',
    role: 'Sales Agent',
    activeLeads: 15,
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@flipcars.us',
    role: 'Junior Sales Agent',
    activeLeads: 5,
  },
  {
    id: '5',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@flipcars.us',
    role: 'Senior Sales Agent',
    activeLeads: 18,
  },
];

export const LeadAssignment: React.FC<LeadAssignmentProps> = ({
  leadId,
  currentAssigneeId,
  onAssign,
}) => {
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(
    currentAssigneeId
  );
  const [isAssigning, setIsAssigning] = useState(false);

  const currentAssignee = MOCK_STAFF.find(
    (staff) => staff.id === currentAssigneeId
  );

  const handleAssign = async (staffId: string) => {
    if (isAssigning || staffId === currentAssigneeId) return;

    setIsAssigning(true);
    setSelectedStaffId(staffId);

    try {
      if (onAssign) {
        await onAssign(staffId);
      }
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error assigning lead:', error);
      setSelectedStaffId(currentAssigneeId);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-900">
          Assignment
        </h3>
      </div>

      {/* Current Assignee */}
      {currentAssignee && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-xs">
              {currentAssignee.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-semibold text-gray-900 text-xs truncate">
                  {currentAssignee.name}
                </p>
                <UserCheck className="w-3 h-3 text-blue-600 flex-shrink-0" />
              </div>
              <p className="text-[10px] text-gray-600 truncate">{currentAssignee.role}</p>
              <p className="text-[10px] text-gray-500">
                {currentAssignee.activeLeads} active
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Staff List */}
      <div>
        <h4 className="text-xs font-semibold text-gray-700 mb-1.5">
          {currentAssignee ? 'Reassign to:' : 'Assign to:'}
        </h4>
        <div className="space-y-1.5 max-h-64 overflow-y-auto">
          {MOCK_STAFF.map((staff) => {
            const isSelected = staff.id === selectedStaffId;
            const isCurrent = staff.id === currentAssigneeId;

            return (
              <button
                key={staff.id}
                onClick={() => handleAssign(staff.id)}
                disabled={isAssigning || isCurrent}
                className={`
                  w-full flex items-center gap-2 p-2 rounded-lg border transition-all
                  ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-offset-1'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }
                  ${isCurrent ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  ${isAssigning ? 'opacity-50' : ''}
                `}
              >
                {/* Avatar */}
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white text-xs flex-shrink-0
                  ${
                    isSelected
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }
                `}
                >
                  {staff.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-gray-900 text-xs truncate">{staff.name}</p>
                    {isCurrent && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-medium rounded flex-shrink-0">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-600 truncate">{staff.role}</p>
                  <p className="text-[10px] text-gray-500">
                    {staff.activeLeads} active
                  </p>
                </div>

                {/* Selection Indicator */}
                {isSelected && !isCurrent && (
                  <UserCheck className="w-5 h-5 text-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Message */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Assigning this lead will notify the selected
          staff member via email and update their dashboard.
        </p>
      </div>
    </div>
  );
};
