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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900">
          Lead Assignment
        </h3>
      </div>

      {/* Current Assignee */}
      {currentAssignee && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              {currentAssignee.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-900">
                  {currentAssignee.name}
                </p>
                <UserCheck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">{currentAssignee.role}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {currentAssignee.activeLeads} active leads
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Staff List */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          {currentAssignee ? 'Reassign to:' : 'Assign to:'}
        </h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {MOCK_STAFF.map((staff) => {
            const isSelected = staff.id === selectedStaffId;
            const isCurrent = staff.id === currentAssigneeId;

            return (
              <button
                key={staff.id}
                onClick={() => handleAssign(staff.id)}
                disabled={isAssigning || isCurrent}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg border transition-all
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
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white
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
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{staff.name}</p>
                    {isCurrent && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{staff.role}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {staff.activeLeads} active leads
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
