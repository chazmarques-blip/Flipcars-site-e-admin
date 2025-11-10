'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye } from 'lucide-react';
import {
  Button,
  Badge,
  DataTable,
  SearchBar,
  FilterPanel,
  FilterSelect,
  FilterCheckbox,
  Column,
} from '@/components/ui';
import { Lead, LeadStatus, LeadPriority, LeadFilters } from '@/types/lead';
import { leadService } from '@/lib/api/lead.service';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { ExportButton } from '@/components/export';
import { ExportColumn } from '@/types/export';
import { LeadStatusBadge } from '@/components/leads';

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  
  const [filters, setFilters] = useState<LeadFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, searchQuery]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      console.log('[LeadsPage] Fetching leads - Page:', currentPage, 'PageSize:', pageSize);
      const response = await leadService.getLeads(currentPage, pageSize, {
        ...filters,
        search: searchQuery || undefined,
      });
      
      console.log('[LeadsPage] Response received:', response);
      console.log('[LeadsPage] Response keys:', Object.keys(response));
      
      // Backend returns 'pagination' not 'meta'
      const paginationData = response.meta || response.pagination || {};
      console.log('[LeadsPage] Pagination data:', paginationData);
      
      setLeads(response.data);
      setTotalPages(paginationData.totalPages || paginationData.pages || 1);
      setTotalItems(paginationData.total || paginationData.count || response.data.length);
      
      console.log('[LeadsPage] ✅ Leads loaded:', response.data.length);
    } catch (error) {
      console.error('[LeadsPage] ❌ Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    return <LeadStatusBadge status={status} size="sm" />;
  };

  const getPriorityBadge = (priority: LeadPriority) => {
    const variants: Record<LeadPriority, 'success' | 'warning' | 'danger'> = {
      [LeadPriority.LOW]: 'success',
      [LeadPriority.MEDIUM]: 'warning',
      [LeadPriority.HIGH]: 'danger',
    };

    return (
      <Badge variant={variants[priority]} dot>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const columns: Column<Lead>[] = [
    {
      key: 'referenceNumber',
      label: 'Reference',
      sortable: true,
      render: (lead) => (
        <span className="font-mono text-sm font-medium text-primary">
          {lead.referenceNumber}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      render: (lead) => (
        <div>
          <div className="font-medium text-gray-900">{lead.name}</div>
          <div className="text-xs text-gray-500">{lead.email}</div>
        </div>
      ),
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      render: (lead) => (
        <div className="text-sm">
          {lead.vehicleMake || lead.vehicleModel || lead.vehicleYear ? (
            <>
              <div className="font-medium text-gray-900">
                {lead.vehicleMake} {lead.vehicleModel}
              </div>
              <div className="text-xs text-gray-500">{lead.vehicleYear}</div>
            </>
          ) : (
            <span className="text-gray-400">Not specified</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (lead) => getStatusBadge(lead.status),
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      render: (lead) => getPriorityBadge(lead.priority),
    },
    {
      key: 'aiQualificationScore',
      label: 'AI Score',
      sortable: true,
      render: (lead) =>
        lead.aiQualificationScore ? (
          <div className="flex items-center gap-2">
            <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${lead.aiQualificationScore}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">
              {lead.aiQualificationScore}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Not qualified</span>
        ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (lead) => (
        <span className="text-sm text-gray-600">
          {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (lead) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/leads/${lead.id}`);
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

  // Export columns configuration
  const exportColumns: ExportColumn[] = [
    { key: 'referenceNumber', label: 'Reference' },
    { key: 'name', label: 'Customer Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'vehicleMake', label: 'Vehicle Make' },
    { key: 'vehicleModel', label: 'Vehicle Model' },
    { key: 'vehicleYear', label: 'Vehicle Year' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { 
      key: 'aiQualificationScore', 
      label: 'AI Score',
      format: (value) => value ? `${value}%` : 'N/A'
    },
    { 
      key: 'createdAt', 
      label: 'Created At',
      format: (value) => new Date(value as string).toLocaleDateString()
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-1">Manage and track your leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <ExportButton
            data={leads}
            columns={exportColumns}
            filename="leads"
            title="Leads Export"
            description="Export of all leads matching current filters"
            variant="secondary"
          />
          <Button
            onClick={() => router.push('/dashboard/leads/new')}
            leftIcon={<Plus className="w-5 h-5" />}
          >
            New Lead
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, phone, or reference..."
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
              setFilters({ ...filters, status: value as LeadStatus || undefined })
            }
            options={[
              { value: LeadStatus.NEW, label: 'New' },
              { value: LeadStatus.CONTACTED, label: 'Contacted' },
              { value: LeadStatus.QUALIFIED, label: 'Qualified' },
              { value: LeadStatus.PROPOSAL_SENT, label: 'Proposal Sent' },
              { value: LeadStatus.NEGOTIATING, label: 'Negotiating' },
              { value: LeadStatus.WON, label: 'Won' },
              { value: LeadStatus.LOST, label: 'Lost' },
            ]}
            placeholder="All statuses"
          />

          <FilterSelect
            label="Priority"
            value={filters.priority || ''}
            onChange={(value) =>
              setFilters({ ...filters, priority: value as LeadPriority || undefined })
            }
            options={[
              { value: LeadPriority.LOW, label: 'Low' },
              { value: LeadPriority.MEDIUM, label: 'Medium' },
              { value: LeadPriority.HIGH, label: 'High' },
            ]}
            placeholder="All priorities"
          />

          <FilterCheckbox
            label="Has Insurance"
            checked={filters.hasInsurance || false}
            onChange={(checked) =>
              setFilters({ ...filters, hasInsurance: checked ? true : undefined })
            }
          />
        </FilterPanel>
      </div>

      {/* Data Table */}
      <DataTable
        data={leads}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        emptyMessage="No leads found. Create your first lead to get started!"
        onRowClick={(lead) => router.push(`/dashboard/leads/${lead.id}`)}
      />
    </div>
  );
}
