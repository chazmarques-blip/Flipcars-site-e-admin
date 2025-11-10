'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Lead, LeadStatus, LeadPriority, LeadNote, LeadActivity } from '@/types/lead';
import { leadService } from '@/lib/api/lead.service';
import {
  LeadStatusBadge,
  LeadNotes,
  LeadTimeline,
  LeadQuickActions,
  LeadAssignment,
  LeadPhotoGallery,
} from '@/components/leads';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  DollarSign,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLeadData();
  }, [leadId]);

  const loadLeadData = async () => {
    try {
      console.log('[LeadDetail] ========== LOADING LEAD ==========');
      console.log('[LeadDetail] Lead ID:', leadId);
      setIsLoading(true);
      setError(null);

      // Fetch lead data (REQUIRED)
      console.log('[LeadDetail] Fetching lead data...');
      const leadData = await leadService.getLeadById(leadId);
      console.log('[LeadDetail] ✅ Lead data loaded:', leadData);
      setLead(leadData);
      
      // Fetch notes (OPTIONAL - may not be implemented yet)
      try {
        console.log('[LeadDetail] Fetching notes...');
        const notesData = await leadService.getLeadNotes(leadId);
        console.log('[LeadDetail] ✅ Notes loaded:', notesData?.length || 0);
        setNotes(notesData);
      } catch (notesError: any) {
        console.warn('[LeadDetail] ⚠️ Could not load notes (endpoint may not exist):', notesError?.response?.status);
        setNotes([]);
      }
      
      // Fetch activities (OPTIONAL - may not be implemented yet)
      try {
        console.log('[LeadDetail] Fetching activities...');
        const activitiesData = await leadService.getLeadActivities(leadId);
        console.log('[LeadDetail] ✅ Activities loaded:', activitiesData?.length || 0);
        setActivities(activitiesData);
      } catch (activitiesError: any) {
        console.warn('[LeadDetail] ⚠️ Could not load activities (endpoint may not exist):', activitiesError?.response?.status);
        setActivities([]);
      }

      console.log('[LeadDetail] ========== SUCCESS ==========');
    } catch (err: any) {
      console.error('[LeadDetail] ========== ERROR ==========');
      console.error('[LeadDetail] Error object:', err);
      console.error('[LeadDetail] Error message:', err?.message);
      console.error('[LeadDetail] Error response:', err?.response);
      console.error('[LeadDetail] Error status:', err?.response?.status);
      console.error('[LeadDetail] Error data:', err?.response?.data);
      setError('Failed to load lead details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;

    try {
      await leadService.updateLeadStatus(leadId, newStatus);
      setLead({ ...lead, status: newStatus });
      
      // Add activity
      const newActivity: LeadActivity = {
        id: Date.now().toString(),
        leadId,
        type: 'status_change',
        description: `Status changed from ${lead.status} to ${newStatus}`,
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        metadata: {
          old_status: lead.status,
          new_status: newStatus,
        },
      };
      setActivities([newActivity, ...activities]);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  const handlePriorityChange = async (newPriority: LeadPriority) => {
    if (!lead) return;

    try {
      await leadService.updateLeadPriority(leadId, newPriority);
      setLead({ ...lead, priority: newPriority });

      // Add activity
      const newActivity: LeadActivity = {
        id: Date.now().toString(),
        leadId,
        type: 'status_change',
        description: `Priority changed from ${lead.priority} to ${newPriority}`,
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        metadata: {
          old_priority: lead.priority,
          new_priority: newPriority,
        },
      };
      setActivities([newActivity, ...activities]);
    } catch (err) {
      console.error('Error updating priority:', err);
      alert('Failed to update priority. Please try again.');
    }
  };

  const handleAddNote = async (content: string) => {
    try {
      const newNote: LeadNote = {
        id: Date.now().toString(),
        leadId,
        content,
        createdBy: 'Current User',
        createdAt: new Date().toISOString(),
      };

      await leadService.addLeadNote(leadId, content);
      setNotes([newNote, ...notes]);

      // Add activity
      const newActivity: LeadActivity = {
        id: (Date.now() + 1).toString(),
        leadId,
        type: 'note_added',
        description: 'Added a new note',
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
      };
      setActivities([newActivity, ...activities]);
    } catch (err) {
      console.error('Error adding note:', err);
      throw err;
    }
  };

  const handleAssign = async (staffId: string) => {
    if (!lead) return;

    try {
      await leadService.assignLead(leadId, staffId);
      setLead({ ...lead, assignedToId: staffId, assignedTo: null });

      // Add activity
      const newActivity: LeadActivity = {
        id: Date.now().toString(),
        leadId,
        type: 'assigned',
        description: `Lead assigned to staff member`,
        performedBy: 'Current User',
        timestamp: new Date().toISOString(),
        metadata: {
          staff_id: staffId,
        },
      };
      setActivities([newActivity, ...activities]);
    } catch (err) {
      console.error('Error assigning lead:', err);
      throw err;
    }
  };

  const handleAction = (actionType: string) => {
    // Handle communication actions (call, email, sms)
    console.log('Action triggered:', actionType);
    alert(`${actionType.toUpperCase()} action triggered! (Mock implementation)`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Lead
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'Lead not found'}
          </p>
          <button
            onClick={() => router.push('/dashboard/leads')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={() => router.push('/dashboard/leads')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leads
          </button>

          {/* Lead Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {lead.name}
                </h1>
                <LeadStatusBadge status={lead.status} />
                <span
                  className={`
                    px-3 py-1 text-sm font-medium rounded-full
                    ${
                      lead.priority === LeadPriority.HIGH
                        ? 'bg-red-100 text-red-800'
                        : lead.priority === LeadPriority.MEDIUM
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }
                  `}
                >
                  {lead.priority} Priority
                </span>
              </div>
              <p className="text-gray-600">
                Reference: <span className="font-mono">{lead.referenceNumber}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Lead Info & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lead.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </div>
                </div>
                {lead.city && lead.state && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-gray-900">
                        {lead.city}, {lead.state} {lead.zipCode}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-gray-900">
                      {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Vehicle Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Make & Model</p>
                  <p className="text-gray-900 font-semibold">
                    {lead.vehicleMake} {lead.vehicleModel}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="text-gray-900 font-semibold">{lead.vehicleYear}</p>
                </div>
                {lead.vehicleMileage && (
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="text-gray-900 font-semibold">
                      {lead.vehicleMileage.toLocaleString()} miles
                    </p>
                  </div>
                )}
                {lead.vehicleCondition && (
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="text-gray-900 font-semibold capitalize">
                      {lead.vehicleCondition}
                    </p>
                  </div>
                )}
                {lead.estimatedValue && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      Estimated Value
                    </p>
                    <p className="text-gray-900 font-bold text-xl">
                      ${lead.estimatedValue.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
              {lead.additionalNotes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Additional Notes</p>
                  <p className="text-gray-700">{lead.additionalNotes}</p>
                </div>
              )}
            </div>

            {/* Damage Photos Gallery */}
            {lead.damagePhotos && lead.damagePhotos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <LeadPhotoGallery
                  photos={lead.damagePhotos}
                  leadId={leadId}
                  readOnly={true}
                />
              </div>
            )}

            {/* Notes Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <LeadNotes
                leadId={leadId}
                notes={notes}
                onAddNote={handleAddNote}
              />
            </div>

            {/* Timeline Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <LeadTimeline activities={activities} />
            </div>
          </div>

          {/* Right Column - Actions & Assignment */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <LeadQuickActions
                leadId={leadId}
                currentStatus={lead.status}
                currentPriority={lead.priority}
                onStatusChange={handleStatusChange}
                onPriorityChange={handlePriorityChange}
                onAction={handleAction}
              />
            </div>

            {/* Assignment */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <LeadAssignment
                leadId={leadId}
                currentAssigneeId={lead.assignedToId || undefined}
                onAssign={handleAssign}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
