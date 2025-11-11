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

  // Determine service type from lead data
  const getServiceType = (lead: Lead): 'Bodyshop' | 'Mechanic' => {
    // Check if it's a body shop lead (has insurance)
    if (lead.hasInsurance || lead.insuranceProvider) {
      return 'Bodyshop';
    }
    // Otherwise it's mechanic (warranty/personal)
    return 'Mechanic';
  };

  const getServiceBadge = (lead: Lead) => {
    const serviceType = getServiceType(lead);
    return (
      <span className={`inline-flex items-center px-1.5 py-0 text-[10px] font-semibold rounded ${
        serviceType === 'Bodyshop' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
      }`}>
        {serviceType}
      </span>
    );
  };

  // Determine who pays from lead data
  const getWhoPays = (lead: Lead): 'Personal' | 'Insurance' | 'Warranty' => {
    // Check insurance first
    if (lead.hasInsurance || lead.insuranceProvider) {
      return 'Insurance';
    }
    // Check warranty (warranty company in notes or source)
    // TODO: Add warrantyCompany field to Lead entity
    if (lead.notes && (lead.notes.toLowerCase().includes('warranty') || lead.notes.toLowerCase().includes('carchex') || lead.notes.toLowerCase().includes('carshield'))) {
      return 'Warranty';
    }
    // Default to personal
    return 'Personal';
  };

  const getWhoPaysBadge = (lead: Lead) => {
    const whoPays = getWhoPays(lead);
    return (
      <span className={`inline-flex items-center px-1.5 py-0 text-[10px] font-semibold rounded ${
        whoPays === 'Insurance' ? 'bg-emerald-100 text-emerald-700' :
        whoPays === 'Warranty' ? 'bg-amber-100 text-amber-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {whoPays}
      </span>
    );
  };

  const columns: Column<Lead>[] = [
    {
      key: 'index',
      label: '#',
      render: (_lead, index) => (
        <span className="text-xs font-medium text-gray-500">
          {(currentPage - 1) * pageSize + index + 1}
        </span>
      ),
    },
    {
      key: 'referenceNumber',
      label: 'Reference',
      sortable: true,
      render: (lead) => {
        // Format: YYYY-MMDD-XXX from FLIP-YYYYMMDD-XXXX
        const ref = lead.referenceNumber;
        let formatted = ref;
        if (ref && ref.startsWith('FLIP-')) {
          const parts = ref.replace('FLIP-', '').split('-');
          if (parts.length >= 2) {
            const date = parts[0]; // YYYYMMDD
            const num = parts[1] || '001'; // XXXX
            // Convert YYYYMMDD to YYYY-MMDD
            const year = date.substring(0, 4);
            const monthDay = date.substring(4);
            formatted = `${year}-${monthDay}-${num.padStart(3, '0')}`;
          }
        }
        return (
          <span className="font-mono text-xs font-medium text-primary">
            {formatted}
          </span>
        );
      },
    },
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      render: (lead) => (
        <div className="text-xs">
          <span className="font-medium text-gray-900">{lead.name}</span>
          {lead.phone && (
            <span className="text-gray-500 ml-2">• {lead.phone}</span>
          )}
        </div>
      ),
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      render: (lead) => (
        <div className="text-xs">
          {lead.vehicleMake || lead.vehicleModel || lead.vehicleYear ? (
            <span className="font-medium text-gray-900">
              {lead.vehicleMake} {lead.vehicleModel}
              {lead.vehicleYear && (
                <span className="text-gray-500 ml-2">{lead.vehicleYear}</span>
              )}
            </span>
          ) : (
            <span className="text-gray-400">Not specified</span>
          )}
        </div>
      ),
    },
    {
      key: 'service',
      label: 'Service',
      sortable: false,
      render: (lead) => getServiceBadge(lead),
    },
    {
      key: 'whoPays',
      label: 'Who Pay',
      sortable: false,
      render: (lead) => getWhoPaysBadge(lead),
    },
    {
      key: 'aiQualificationScore',
      label: 'AI Score',
      sortable: true,
      render: (lead) =>
        lead.aiQualificationScore ? (
          <div className="flex items-center gap-1">
            <div className="w-8 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${lead.aiQualificationScore}%` }}
              />
            </div>
            <span className="text-[10px] font-semibold text-gray-700 tabular-nums">
              {lead.aiQualificationScore}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-[10px]">—</span>
        ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (lead) => {
        // Format: YYYY-MM-DD
        const date = new Date(lead.createdAt);
        const formatted = date.toISOString().split('T')[0];
        return (
          <span className="text-xs text-gray-600 font-mono">
            {formatted}
          </span>
        );
      },
    },
    {
      key: 'details',
      label: 'Details',
      render: (lead) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/leads/${lead.id}`);
          }}
          className="text-[10px] text-blue-600 hover:text-blue-800 font-medium underline"
          title="View details"
        >
          Details
        </button>
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

}
