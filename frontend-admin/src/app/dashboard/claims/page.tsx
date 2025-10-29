'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, AlertTriangle } from 'lucide-react';
import {
  Button,
  Badge,
  DataTable,
  SearchBar,
  FilterPanel,
  FilterSelect,
  Column,
} from '@/components/ui';
import { Claim, ClaimStatus, ClaimPriority, DamageType, ClaimFilters } from '@/types/claim';
import { claimService } from '@/lib/api/claim.service';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function ClaimsPage() {
  const router = useRouter();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  
  const [filters, setFilters] = useState<ClaimFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, searchQuery]);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const response = await claimService.getClaims(currentPage, pageSize, {
        ...filters,
        search: searchQuery || undefined,
      });
      
      setClaims(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.total);
    } catch (error) {
      toast.error('Failed to load claims');
      console.error('Error fetching claims:', error);
    } finally {
      setIsLoading(false);
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

    return (
      <Badge variant={variants[status]}>
        {status.replace(/_/g, ' ').toUpperCase()}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: ClaimPriority) => {
    const variants: Record<ClaimPriority, 'success' | 'warning' | 'danger' | 'primary'> = {
      [ClaimPriority.LOW]: 'success',
      [ClaimPriority.MEDIUM]: 'warning',
      [ClaimPriority.HIGH]: 'danger',
      [ClaimPriority.URGENT]: 'primary',
    };

    return (
      <Badge variant={variants[priority]} dot>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns: Column<Claim>[] = [
    {
      key: 'claimNumber',
      label: 'Claim #',
      sortable: true,
      render: (claim) => (
        <span className="font-mono text-sm font-medium text-primary">
          {claim.claimNumber}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (claim) => (
        <div>
          {claim.customer ? (
            <>
              <div className="font-medium text-gray-900">{claim.customer.name}</div>
              <div className="text-xs text-gray-500">{claim.customer.email}</div>
            </>
          ) : (
            <span className="text-gray-400">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      render: (claim) => (
        <div className="text-sm">
          {claim.vehicleMake || claim.vehicleModel ? (
            <>
              <div className="font-medium text-gray-900">
                {claim.vehicleMake} {claim.vehicleModel}
              </div>
              <div className="text-xs text-gray-500">
                {claim.vehicleYear} {claim.vehiclePlate && `• ${claim.vehiclePlate}`}
              </div>
            </>
          ) : (
            <span className="text-gray-400">Not specified</span>
          )}
        </div>
      ),
    },
    {
      key: 'damageType',
      label: 'Damage Type',
      sortable: true,
      render: (claim) => (
        <span className="text-sm text-gray-700 capitalize">
          {claim.damageType.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (claim) => getStatusBadge(claim.status),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (claim) => getPriorityBadge(claim.priority),
    },
    {
      key: 'estimatedAmount',
      label: 'Amount',
      sortable: true,
      render: (claim) => (
        <div className="text-sm">
          {claim.estimatedAmount ? (
            <div className="space-y-0.5">
              <div className="font-medium text-gray-900">
                {formatCurrency(claim.estimatedAmount)}
              </div>
              {claim.approvedAmount && (
                <div className="text-xs text-success">
                  Approved: {formatCurrency(claim.approvedAmount)}
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400">Not estimated</span>
          )}
        </div>
      ),
    },
    {
      key: 'aiRiskScore',
      label: 'AI Risk',
      sortable: true,
      render: (claim) =>
        claim.aiRiskScore !== undefined ? (
          <div className="flex items-center gap-2">
            {claim.aiRiskScore >= 70 && (
              <AlertTriangle className="w-4 h-4 text-danger" />
            )}
            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
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
            <span className="text-sm font-medium text-gray-900">
              {claim.aiRiskScore}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Not analyzed</span>
        ),
    },
    {
      key: 'incidentDate',
      label: 'Incident Date',
      sortable: true,
      render: (claim) => (
        <div className="text-sm">
          <div className="text-gray-900">
            {format(new Date(claim.incidentDate), 'MMM dd, yyyy')}
          </div>
          <div className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(claim.incidentDate), { addSuffix: true })}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (claim) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/claims/${claim.id}`);
          }}
          leftIcon={<Eye className="w-4 h-4" />}
        >
          View
        </Button>
      ),
    },
  ];

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== ''
  ).length;

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Claims</h1>
          <p className="text-gray-600 mt-1">Manage insurance claims and damage reports</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/claims/new')}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          New Claim
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by claim number, customer, or vehicle..."
          className="flex-1"
        />
        <FilterPanel
          activeFiltersCount={activeFiltersCount}
          onClear={handleClearFilters}
        >
          <FilterSelect
            label="Status"
            value={filters.status || ''}
            onChange={(value) =>
              setFilters({ ...filters, status: value as ClaimStatus || undefined })
            }
            options={[
              { value: ClaimStatus.DRAFT, label: 'Draft' },
              { value: ClaimStatus.SUBMITTED, label: 'Submitted' },
              { value: ClaimStatus.UNDER_REVIEW, label: 'Under Review' },
              { value: ClaimStatus.APPROVED, label: 'Approved' },
              { value: ClaimStatus.REJECTED, label: 'Rejected' },
              { value: ClaimStatus.IN_REPAIR, label: 'In Repair' },
              { value: ClaimStatus.COMPLETED, label: 'Completed' },
              { value: ClaimStatus.CANCELLED, label: 'Cancelled' },
            ]}
            placeholder="All statuses"
          />

          <FilterSelect
            label="Priority"
            value={filters.priority || ''}
            onChange={(value) =>
              setFilters({ ...filters, priority: value as ClaimPriority || undefined })
            }
            options={[
              { value: ClaimPriority.LOW, label: 'Low' },
              { value: ClaimPriority.MEDIUM, label: 'Medium' },
              { value: ClaimPriority.HIGH, label: 'High' },
              { value: ClaimPriority.URGENT, label: 'Urgent' },
            ]}
            placeholder="All priorities"
          />

          <FilterSelect
            label="Damage Type"
            value={filters.damageType || ''}
            onChange={(value) =>
              setFilters({ ...filters, damageType: value as DamageType || undefined })
            }
            options={[
              { value: DamageType.COLLISION, label: 'Collision' },
              { value: DamageType.THEFT, label: 'Theft' },
              { value: DamageType.VANDALISM, label: 'Vandalism' },
              { value: DamageType.NATURAL_DISASTER, label: 'Natural Disaster' },
              { value: DamageType.FIRE, label: 'Fire' },
              { value: DamageType.GLASS_DAMAGE, label: 'Glass Damage' },
              { value: DamageType.MECHANICAL, label: 'Mechanical' },
              { value: DamageType.OTHER, label: 'Other' },
            ]}
            placeholder="All types"
          />
        </FilterPanel>
      </div>

      {/* Data Table */}
      <DataTable
        data={claims}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        emptyMessage="No claims found. Create your first claim to get started!"
        onRowClick={(claim) => router.push(`/dashboard/claims/${claim.id}`)}
      />
    </div>
  );
}
