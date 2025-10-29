'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Calendar,
  DollarSign,
  Car,
  FileText,
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
import { CustomerForm } from '@/components/forms/CustomerForm';
import { Customer, CustomerStatus, CustomerType } from '@/types/customer';
import { customerService } from '@/lib/api/customer.service';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCustomer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchCustomer = async () => {
    setIsLoading(true);
    try {
      const data = await customerService.getCustomerById(params.id);
      setCustomer(data);
    } catch {
      toast.error('Failed to load customer');
      router.push('/dashboard/customers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await customerService.deleteCustomer(params.id);
      toast.success('Customer deleted successfully');
      router.push('/dashboard/customers');
    } catch {
      toast.error('Failed to delete customer');
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getStatusBadge = (status: CustomerStatus) => {
    const variants: Record<CustomerStatus, 'success' | 'warning' | 'danger'> = {
      [CustomerStatus.ACTIVE]: 'success',
      [CustomerStatus.INACTIVE]: 'warning',
      [CustomerStatus.BLOCKED]: 'danger',
    };

    return <Badge variant={variants[status]}>{status.toUpperCase()}</Badge>;
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

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Customer not found</p>
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
            <h1 className="text-3xl font-heading font-bold text-gray-900">Edit Customer</h1>
            <p className="text-gray-600 mt-1">{customer.referenceNumber}</p>
          </div>
        </div>

        <CustomerForm
          customer={customer}
          onSuccess={(updatedCustomer) => {
            setCustomer(updatedCustomer);
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
                {customer.name}
              </h1>
              {getStatusBadge(customer.status)}
              <Badge variant="default">
                {customer.type === CustomerType.BUSINESS ? (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    <span>Business</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>Individual</span>
                  </div>
                )}
              </Badge>
            </div>
            <p className="text-gray-600 mt-1 font-mono">{customer.referenceNumber}</p>
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader title="Contact Information" />
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    <a
                      href={`mailto:${customer.email}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {customer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Phone</p>
                    <a
                      href={`tel:${customer.phone}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {customer.phone}
                    </a>
                  </div>
                </div>

                {customer.preferredContactMethod && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Preferred Contact</p>
                      <p className="font-medium capitalize">{customer.preferredContactMethod}</p>
                    </div>
                  </div>
                )}

                {customer.languagePreference && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Language</p>
                      <p className="font-medium">{customer.languagePreference}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          {(customer.address || customer.city || customer.state || customer.zipCode) && (
            <Card>
              <CardHeader title="Address Information" />
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    {customer.address && <p className="font-medium">{customer.address}</p>}
                    {(customer.city || customer.state || customer.zipCode) && (
                      <p className="text-gray-600">
                        {customer.city}
                        {customer.city && customer.state && ', '}
                        {customer.state} {customer.zipCode}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Business Information */}
          {customer.type === CustomerType.BUSINESS && (customer.businessName || customer.taxId) && (
            <Card>
              <CardHeader title="Business Information" />
              <CardContent>
                <div className="space-y-4">
                  {customer.businessName && (
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Business Name</p>
                        <p className="font-medium">{customer.businessName}</p>
                      </div>
                    </div>
                  )}

                  {customer.taxId && (
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">Tax ID / EIN</p>
                        <p className="font-medium font-mono">{customer.taxId}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistics */}
          <Card>
            <CardHeader title="Customer Statistics" />
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <Car className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{customer.totalLeads}</p>
                  <p className="text-sm text-gray-600">Total Leads</p>
                </div>

                <div className="text-center p-4 bg-secondary-50 rounded-lg">
                  <FileText className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{customer.totalClaims}</p>
                  <p className="text-sm text-gray-600">Total Claims</p>
                </div>

                <div className="text-center p-4 bg-accent-50 rounded-lg">
                  <DollarSign className="w-6 h-6 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(customer.totalRevenue)}
                  </p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
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
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<Car className="w-4 h-4" />}
                  onClick={() => router.push(`/dashboard/leads/new?customerId=${customer.id}`)}
                >
                  Create Lead
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<FileText className="w-4 h-4" />}
                  onClick={() => router.push(`/dashboard/claims/new?customerId=${customer.id}`)}
                >
                  Create Claim
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<Mail className="w-4 h-4" />}
                  onClick={() => window.open(`mailto:${customer.email}`, '_blank')}
                >
                  Send Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  leftIcon={<Phone className="w-4 h-4" />}
                  onClick={() => window.open(`tel:${customer.phone}`, '_blank')}
                >
                  Call Customer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader title="Customer Information" />
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Status</p>
                  {getStatusBadge(customer.status)}
                </div>

                <div>
                  <p className="text-gray-600 mb-1">Type</p>
                  <Badge variant="default">
                    {customer.type === CustomerType.BUSINESS ? 'Business' : 'Individual'}
                  </Badge>
                </div>

                {customer.assignedTo && (
                  <div>
                    <p className="text-gray-600 mb-1">Assigned To</p>
                    <p className="font-medium">{customer.assignedTo.name}</p>
                    <p className="text-gray-500 text-xs">{customer.assignedTo.email}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-600 mb-1">Created</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{format(new Date(customer.createdAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(customer.createdAt), { addSuffix: true })}
                  </p>
                </div>

                {customer.lastContactedAt && (
                  <div>
                    <p className="text-gray-600 mb-1">Last Contacted</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{format(new Date(customer.lastContactedAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(customer.lastContactedAt), { addSuffix: true })}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-gray-600 mb-1">Last Updated</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{format(new Date(customer.updatedAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(customer.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Delete Customer"
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
              Delete Customer
            </Button>
          </>
        }
      >
        <div className="py-4">
          <p className="text-gray-600">
            Are you sure you want to delete this customer? This action cannot be undone and will
            also remove all associated leads and claims.
          </p>
          <div className="mt-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-sm text-danger-900 font-medium">
              ⚠️ Warning: This will permanently delete:
            </p>
            <ul className="mt-2 text-sm text-danger-800 space-y-1 list-disc list-inside">
              <li>{customer.totalLeads} lead{customer.totalLeads !== 1 ? 's' : ''}</li>
              <li>{customer.totalClaims} claim{customer.totalClaims !== 1 ? 's' : ''}</li>
              <li>All customer history and data</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
