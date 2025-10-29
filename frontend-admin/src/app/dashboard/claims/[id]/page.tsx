'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Car,
  AlertCircle,
  DollarSign,
  Shield,
  FileText,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Sparkles,
} from 'lucide-react';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardContent,
  Modal,
  Spinner,
} from '@/components/ui';
import { ClaimForm } from '@/components/forms/ClaimForm';
import { Claim, ClaimStatus, ClaimPriority } from '@/types/claim';
import { claimService } from '@/lib/api/claim.service';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function ClaimDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [claim, setClaim] = useState<Claim | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchClaim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchClaim = async () => {
    setIsLoading(true);
    try {
      const data = await claimService.getClaimById(params.id);
      setClaim(data);
    } catch {
      toast.error('Failed to load claim');
      router.push('/dashboard/claims');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await claimService.deleteClaim(params.id);
      toast.success('Claim deleted successfully');
      router.push('/dashboard/claims');
    } catch {
      toast.error('Failed to delete claim');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const updatedClaim = await claimService.analyzeClaim(params.id);
      setClaim(updatedClaim);
      toast.success('AI analysis completed successfully!');
    } catch {
      toast.error('Failed to analyze claim');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApprove = async () => {
    if (!claim?.estimatedAmount) {
      toast.error('Please set an estimated amount first');
      return;
    }
    try {
      const updatedClaim = await claimService.approveClaim(params.id, claim.estimatedAmount);
      setClaim(updatedClaim);
      toast.success('Claim approved successfully!');
    } catch {
      toast.error('Failed to approve claim');
    }
  };

  const handleReject = async () => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    
    try {
      const updatedClaim = await claimService.rejectClaim(params.id, reason);
      setClaim(updatedClaim);
      toast.success('Claim rejected');
    } catch {
      toast.error('Failed to reject claim');
    }
  };

  const getStatusBadge = (status: ClaimStatus) => {
    const variants: Record<ClaimStatus, 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'> = {
      [ClaimStatus.DRAFT]: 'default',
      [ClaimStatus.SUBMITTED]: 'primary',
      [ClaimStatus.UNDER_REVIEW]: 'secondary',
      [ClaimStatus.APPROVED]: 'success',
      [ClaimStatus.REJECTED]: 'danger',
      [ClaimStatus.IN_REPAIR]: 'warning',
      [ClaimStatus.COMPLETED]: 'success',
      [ClaimStatus.CANCELLED]: 'danger',
    };

    return <Badge variant={variants[status]}>{status.replace(/_/g, ' ').toUpperCase()}</Badge>;
  };

  const getPriorityBadge = (priority: ClaimPriority) => {
    const variants: Record<ClaimPriority, 'success' | 'warning' | 'danger' | 'primary'> = {
      [ClaimPriority.LOW]: 'success',
      [ClaimPriority.MEDIUM]: 'warning',
      [ClaimPriority.HIGH]: 'danger',
      [ClaimPriority.URGENT]: 'primary',
    };

    return <Badge variant={variants[priority]} dot>{priority.toUpperCase()}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Claim not found</p>
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
            <h1 className="text-3xl font-heading font-bold text-gray-900">Edit Claim</h1>
            <p className="text-gray-600 mt-1">{claim.claimNumber}</p>
          </div>
        </div>

        <ClaimForm
          claim={claim}
          onSuccess={(updatedClaim) => {
            setClaim(updatedClaim);
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
                Claim {claim.claimNumber}
              </h1>
              {getStatusBadge(claim.status)}
              {getPriorityBadge(claim.priority)}
            </div>
            <p className="text-gray-600 mt-1">
              Filed {formatDistanceToNow(new Date(claim.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleAnalyze}
            isLoading={isAnalyzing}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            AI Analysis
          </Button>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          {claim.customer && (
            <Card>
              <CardHeader title="Customer Information" />
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{claim.customer.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <a
                        href={`mailto:${claim.customer.email}`}
                        className="text-primary hover:underline"
                      >
                        {claim.customer.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <a
                        href={`tel:${claim.customer.phone}`}
                        className="text-primary hover:underline"
                      >
                        {claim.customer.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vehicle Information */}
          <Card>
            <CardHeader title="Vehicle Information" />
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {(claim.vehicleMake || claim.vehicleModel) && (
                  <div>
                    <p className="text-sm text-gray-600">Make & Model</p>
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">
                        {claim.vehicleMake} {claim.vehicleModel}
                      </p>
                    </div>
                  </div>
                )}
                {claim.vehicleYear && (
                  <div>
                    <p className="text-sm text-gray-600">Year</p>
                    <p className="font-medium">{claim.vehicleYear}</p>
                  </div>
                )}
                {claim.vehiclePlate && (
                  <div>
                    <p className="text-sm text-gray-600">License Plate</p>
                    <p className="font-medium font-mono">{claim.vehiclePlate}</p>
                  </div>
                )}
                {claim.vehicleVin && (
                  <div>
                    <p className="text-sm text-gray-600">VIN</p>
                    <p className="font-medium font-mono text-xs">{claim.vehicleVin}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Incident Details */}
          <Card>
            <CardHeader title="Incident Details" />
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Incident Date</p>
                    </div>
                    <p className="font-medium">
                      {format(new Date(claim.incidentDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Damage Type</p>
                    <Badge variant="default" className="capitalize">
                      {claim.damageType.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>

                {claim.incidentLocation && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Location</p>
                    </div>
                    <p className="text-gray-900">{claim.incidentLocation}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-2">Incident Description</p>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {claim.incidentDescription}
                  </p>
                </div>

                {claim.damageDescription && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Damage Description</p>
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {claim.damageDescription}
                    </p>
                  </div>
                )}

                {claim.policeReportNumber && (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-600">Police Report Number</p>
                    </div>
                    <p className="font-medium font-mono">{claim.policeReportNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader title="Financial Information" />
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {claim.estimatedAmount ? formatCurrency(claim.estimatedAmount) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Estimated</p>
                </div>

                <div className="text-center p-4 bg-success-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {claim.approvedAmount ? formatCurrency(claim.approvedAmount) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Approved</p>
                </div>

                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {claim.paidAmount ? formatCurrency(claim.paidAmount) : 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">Paid</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          {(claim.insuranceCompany || claim.insurancePolicyNumber || claim.insuranceClaimNumber) && (
            <Card>
              <CardHeader title="Insurance Information" />
              <CardContent>
                <div className="space-y-3">
                  {claim.insuranceCompany && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <p className="text-sm text-gray-600">Insurance Company</p>
                      </div>
                      <p className="font-medium">{claim.insuranceCompany}</p>
                    </div>
                  )}
                  {claim.insurancePolicyNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Policy Number</p>
                      <p className="font-medium font-mono">{claim.insurancePolicyNumber}</p>
                    </div>
                  )}
                  {claim.insuranceClaimNumber && (
                    <div>
                      <p className="text-sm text-gray-600">Insurance Claim Number</p>
                      <p className="font-medium font-mono">{claim.insuranceClaimNumber}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Analysis */}
          {claim.aiRiskScore !== undefined && (
            <Card>
              <CardHeader title="AI Risk Analysis" />
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Risk Score</p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            claim.aiRiskScore >= 70
                              ? 'bg-danger'
                              : claim.aiRiskScore >= 40
                              ? 'bg-warning'
                              : 'bg-success'
                          }`}
                          style={{ width: `${claim.aiRiskScore}%` }}
                        />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">
                        {claim.aiRiskScore}
                      </span>
                    </div>
                  </div>

                  {claim.aiRiskNotes && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">AI Notes</p>
                      <p className="text-gray-900">{claim.aiRiskNotes}</p>
                    </div>
                  )}

                  {claim.aiFraudIndicators && claim.aiFraudIndicators.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Fraud Indicators</p>
                      <div className="space-y-2">
                        {claim.aiFraudIndicators.map((indicator, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2 p-2 bg-danger-50 border border-danger-200 rounded"
                          >
                            <AlertCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-danger-900">{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          <Card>
            <CardHeader
              title="Documents"
              subtitle={`${claim.documentCount} file${claim.documentCount !== 1 ? 's' : ''} uploaded`}
            />
            <CardContent>
              <div className="space-y-3">
                {claim.documents.length > 0 ? (
                  claim.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.fileName}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(doc.fileUrl, '_blank')}
                          leftIcon={<Download className="w-4 h-4" />}
                        >
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No documents uploaded yet</p>
                  </div>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  leftIcon={<Upload className="w-4 h-4" />}
                  onClick={() => toast('Document upload feature coming soon!')}
                >
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <div className="space-y-2">
                {claim.status === ClaimStatus.SUBMITTED && (
                  <>
                    <Button
                      variant="success"
                      className="w-full justify-start"
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={handleApprove}
                    >
                      Approve Claim
                    </Button>
                    <Button
                      variant="danger"
                      className="w-full justify-start"
                      leftIcon={<XCircle className="w-4 h-4" />}
                      onClick={handleReject}
                    >
                      Reject Claim
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<Sparkles className="w-4 h-4" />}
                  onClick={handleAnalyze}
                  isLoading={isAnalyzing}
                >
                  Run AI Analysis
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Claim Information */}
          <Card>
            <CardHeader title="Claim Information" />
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Status</p>
                  {getStatusBadge(claim.status)}
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Priority</p>
                  {getPriorityBadge(claim.priority)}
                </div>

                {claim.assignedTo && (
                  <div>
                    <p className="text-gray-600 mb-1">Assigned To</p>
                    <p className="font-medium">{claim.assignedTo.name}</p>
                    <p className="text-gray-500 text-xs">{claim.assignedTo.email}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-600 mb-1">Created</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{format(new Date(claim.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(claim.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {claim.submittedAt && (
                  <div>
                    <p className="text-gray-600 mb-1">Submitted</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(claim.submittedAt), { addSuffix: true })}
                    </p>
                  </div>
                )}

                {claim.approvedAt && (
                  <div>
                    <p className="text-gray-600 mb-1">Approved</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(claim.approvedAt), { addSuffix: true })}
                    </p>
                  </div>
                )}

                {claim.completedAt && (
                  <div>
                    <p className="text-gray-600 mb-1">Completed</p>
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(claim.completedAt), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Delete Claim"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Claim
            </Button>
          </>
        }
      >
        <div className="py-4">
          <p className="text-gray-600">
            Are you sure you want to delete this claim? This action cannot be undone and will
            remove all associated documents and history.
          </p>
          <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-sm text-danger-900 font-medium">
              ⚠️ Warning: This will permanently delete:
            </p>
            <ul className="mt-2 text-sm text-danger-800 space-y-1 list-disc list-inside">
              <li>Claim record and all details</li>
              <li>{claim.documentCount} document{claim.documentCount !== 1 ? 's' : ''}</li>
              <li>All AI analysis results</li>
              <li>Complete claim history</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
