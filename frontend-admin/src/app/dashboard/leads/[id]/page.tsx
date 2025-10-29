'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, UserPlus, Award, Clock } from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
  Modal,
  ModalFooter,
  Spinner,
} from '@/components/ui';
import { LeadForm } from '@/components/forms/LeadForm';
import { Lead, LeadStatus, LeadPriority } from '@/types/lead';
import { leadService } from '@/lib/api/lead.service';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function LeadDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchLead = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getLeadById(params.id);
      setLead(data);
    } catch {
      toast.error('Failed to load lead');
      router.push('/dashboard/leads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await leadService.deleteLead(params.id);
      toast.success('Lead deleted successfully');
      router.push('/dashboard/leads');
    } catch {
      toast.error('Failed to delete lead');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    const variants: Record<LeadStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'> = {
      [LeadStatus.NEW]: 'primary',
      [LeadStatus.CONTACTED]: 'secondary',
      [LeadStatus.QUALIFIED]: 'success',
      [LeadStatus.PROPOSAL_SENT]: 'warning',
      [LeadStatus.NEGOTIATING]: 'warning',
      [LeadStatus.WON]: 'success',
      [LeadStatus.LOST]: 'danger',
    };

    return <Badge variant={variants[status]}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  const getPriorityBadge = (priority: LeadPriority) => {
    const variants: Record<LeadPriority, 'success' | 'warning' | 'danger'> = {
      [LeadPriority.LOW]: 'success',
      [LeadPriority.MEDIUM]: 'warning',
      [LeadPriority.HIGH]: 'danger',
    };

    return <Badge variant={variants[priority]} dot>{priority.toUpperCase()}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead not found</p>
      </div>
    );
  }

  if (isEditMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setIsEditMode(false)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">Edit Lead</h1>
            <p className="text-gray-600 mt-1">{lead.referenceNumber}</p>
          </div>
        </div>

        <LeadForm
          lead={lead}
          onSuccess={(updatedLead) => {
            setLead(updatedLead);
            setIsEditMode(false);
          }}
          onCancel={() => setIsEditMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                {lead.name}
              </h1>
              {getStatusBadge(lead.status)}
              {getPriorityBadge(lead.priority)}
            </div>
            <p className="text-gray-600 mt-1 font-mono">{lead.referenceNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditMode(true)} leftIcon={<Edit className="w-4 h-4" />}>
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader title="Customer Information" />
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{lead.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${lead.email}`} className="text-primary hover:text-primary-600">
                      {lead.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`tel:${lead.phone}`} className="text-primary hover:text-primary-600">
                      {lead.phone}
                    </a>
                  </dd>
                </div>
                {lead.source && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Source</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.source}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader title="Vehicle Information" />
            <CardContent>
              {lead.vehicleMake || lead.vehicleModel || lead.vehicleYear ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lead.vehicleMake && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Make</dt>
                      <dd className="mt-1 text-sm text-gray-900">{lead.vehicleMake}</dd>
                    </div>
                  )}
                  {lead.vehicleModel && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Model</dt>
                      <dd className="mt-1 text-sm text-gray-900">{lead.vehicleModel}</dd>
                    </div>
                  )}
                  {lead.vehicleYear && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Year</dt>
                      <dd className="mt-1 text-sm text-gray-900">{lead.vehicleYear}</dd>
                    </div>
                  )}
                  {lead.vehiclePlate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">License Plate</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{lead.vehiclePlate}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-gray-500">No vehicle information provided</p>
              )}
            </CardContent>
          </Card>

          {/* Accident Information */}
          <Card>
            <CardHeader title="Accident Information" />
            <CardContent>
              <dl className="space-y-4">
                {lead.accidentDate && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {format(new Date(lead.accidentDate), 'PPP')}
                    </dd>
                  </div>
                )}
                {lead.accidentDescription && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                      {lead.accidentDescription}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader title="Insurance Information" />
            <CardContent>
              {lead.hasInsurance ? (
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Coverage</dt>
                    <dd className="mt-1">
                      <Badge variant="success">Insured</Badge>
                    </dd>
                  </div>
                  {lead.insuranceCompany && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Company</dt>
                      <dd className="mt-1 text-sm text-gray-900">{lead.insuranceCompany}</dd>
                    </div>
                  )}
                  {lead.insurancePolicyNumber && (
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">
                        {lead.insurancePolicyNumber}
                      </dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="text-sm text-gray-500">
                  <Badge variant="warning">No Insurance</Badge>
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="space-y-2">
                <Button fullWidth variant="outline" leftIcon={<UserPlus className="w-4 h-4" />}>
                  Assign Agent
                </Button>
                <Button fullWidth variant="outline" leftIcon={<Award className="w-4 h-4" />}>
                  Qualify Lead
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lead Stats */}
          <Card>
            <CardHeader title="Lead Information" />
            <CardContent>
              <dl className="space-y-3">
                {lead.aiQualificationScore && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500 mb-2">AI Qualification Score</dt>
                    <dd>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${lead.aiQualificationScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {lead.aiQualificationScore}
                        </span>
                      </div>
                    </dd>
                  </div>
                )}

                {lead.assignedTo && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
                    <dd className="mt-1 text-sm text-gray-900">{lead.assignedTo.name}</dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDistanceToNow(new Date(lead.updatedAt), { addSuffix: true })}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Lead"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete this lead? This action cannot be undone.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <strong>Reference:</strong> {lead.referenceNumber}
              <br />
              <strong>Customer:</strong> {lead.name}
            </p>
          </div>
        </div>

        <ModalFooter
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          cancelText="Cancel"
          confirmText="Delete Lead"
          isLoading={isDeleting}
        />
      </Modal>
    </div>
  );
}
