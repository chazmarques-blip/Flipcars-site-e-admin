'use client';

// VERSION: 2024-11-30-03:00 - Service colors and categories updated
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, X, Phone, MessageCircle, MessageSquare, Trash2 } from 'lucide-react';
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
  const [viewedLeads, setViewedLeads] = useState<Set<string>>(new Set());
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [deletePopoverOpen, setDeletePopoverOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number } | null>(null);

  // Load viewed leads from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('viewedLeads');
    if (stored) {
      try {
        setViewedLeads(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error('Error loading viewed leads:', e);
      }
    }
  }, []);

  // Mark lead as viewed and save to localStorage
  const markLeadAsViewed = (leadId: string) => {
    const newViewed = new Set(viewedLeads);
    newViewed.add(leadId);
    setViewedLeads(newViewed);
    localStorage.setItem('viewedLeads', JSON.stringify(Array.from(newViewed)));
  };

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
    // Use the explicit serviceType field if available
    if (lead.serviceType) {
      return lead.serviceType === 'bodyshop' ? 'Bodyshop' : 'Mechanic';
    }
    // Fallback: Check if it's a body shop lead (has insurance)
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
        serviceType === 'Bodyshop' 
          ? 'bg-[#D4AF37] text-white' // Gold for Bodyshop
          : 'bg-gray-800 text-white'   // Black for Mechanic
      }`}>
        {serviceType}
      </span>
    );
  };

  // Determine who pays from lead data
  const getWhoPays = (lead: Lead): 'Self-Pay' | 'Insurance' | 'Warranty' => {
    // Check explicit warrantyCompany field first
    if (lead.warrantyCompany) {
      if (lead.warrantyCompany === 'Private (Self-Pay)' || lead.warrantyCompany.toLowerCase().includes('self-pay')) {
        return 'Self-Pay';
      }
      // If warrantyCompany exists and is not Self-Pay, it's a warranty
      return 'Warranty';
    }
    
    // Check insurance
    if (lead.hasInsurance || lead.insuranceProvider) {
      return 'Insurance';
    }
    
    // Fallback: Check warranty in notes
    if (lead.notes && (lead.notes.toLowerCase().includes('warranty') || lead.notes.toLowerCase().includes('carchex') || lead.notes.toLowerCase().includes('carshield'))) {
      return 'Warranty';
    }
    
    // Default to Self-Pay
    return 'Self-Pay';
  };

  const getWhoPaysBadge = (lead: Lead) => {
    const whoPays = getWhoPays(lead);
    return (
      <span className={`inline-flex items-center px-1.5 py-0 text-[10px] font-semibold rounded border ${
        whoPays === 'Insurance' ? 'bg-white text-gray-900 border-gray-300' :
        whoPays === 'Warranty' ? 'bg-amber-50 text-amber-900 border-amber-200' :
        'bg-gray-100 text-gray-700 border-gray-200'
      }`}>
        {whoPays}
      </span>
    );
  };

  // Helper function to capitalize first letter
  const capitalizeFirst = (str: string | undefined): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Open photo modal
  const openPhotoModal = (photos: string[]) => {
    setSelectedPhotos(photos);
    setPhotoModalOpen(true);
  };

  // Handle delete lead - open popover next to trash icon
  const handleDeleteClick = (lead: Lead, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // Get button position
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Position popover to the left of the button
    setPopoverPosition({
      top: rect.top + window.scrollY,
      left: rect.left - 320, // 300px popover width + 20px gap
    });
    
    setLeadToDelete(lead);
    setDeletePopoverOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return;
    
    setIsDeleting(true);
    try {
      await leadService.deleteLead(leadToDelete.id);
      toast.success('Lead deleted successfully');
      setDeletePopoverOpen(false);
      setLeadToDelete(null);
      setPopoverPosition(null);
      // Refresh the leads list
      fetchLeads();
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      const errorMessage = error?.response?.data?.message || 'Failed to delete lead';
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeletePopoverOpen(false);
    setLeadToDelete(null);
    setPopoverPosition(null);
  };

  const columns: Column<Lead>[] = [
    {
      key: 'index',
      label: '#',
      render: (_lead, index) => {
        // Reverse numbering: newest lead is #1
        const reversedNumber = totalItems - ((currentPage - 1) * pageSize) - (index || 0);
        return (
          <span className="text-xs font-medium text-gray-500">
            {reversedNumber}
          </span>
        );
      },
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
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Contact',
      render: (lead) => (
        <div className="text-xs">
          <span className="font-mono text-gray-700">{lead.phone}</span>
        </div>
      ),
    },
    {
      key: 'contactPreferences',
      label: 'Preferred Contact',
      render: (lead) => {
        const prefs = lead.contactPreferences;
        
        // DEBUG: Log contact preferences
        console.log('[LeadsPage] Lead ID:', lead.id?.substring(0, 8), 'contactPreferences:', prefs);
        
        if (!prefs || (!prefs.phoneCall && !prefs.whatsapp && !prefs.textMessage)) {
          return <span className="text-xs text-gray-400">—</span>;
        }
        
        return (
          <div className="flex items-center gap-1">
            {prefs.phoneCall && (
              <div 
                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/10 text-gold border border-gold/20"
                title="Phone Call"
              >
                <Phone className="w-3 h-3" />
              </div>
            )}
            {prefs.whatsapp && (
              <div 
                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-white border border-gray-700"
                title="WhatsApp"
              >
                <MessageCircle className="w-3 h-3" />
              </div>
            )}
            {prefs.textMessage && (
              <div 
                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-700 border border-gray-300"
                title="Text Message"
              >
                <MessageSquare className="w-3 h-3" />
              </div>
            )}
          </div>
        );
      },
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
      key: 'company',
      label: 'Company',
      render: (lead) => {
        const whoPays = getWhoPays(lead);
        
        // RULE 1: If Insurance → show insurance company or "Other"
        if (whoPays === 'Insurance') {
          const company = lead.insuranceProvider || lead.insuranceCompany;
          if (company && company.toLowerCase() !== 'other') {
            return (
              <div className="text-xs">
                <span className="text-gray-700">{capitalizeFirst(company)}</span>
              </div>
            );
          }
          return <div className="text-xs"><span className="text-gray-700">Other</span></div>;
        }
        
        // RULE 2: If Warranty → show warranty company or "Other"
        if (whoPays === 'Warranty') {
          const company = lead.warrantyCompany;
          if (company && company !== 'Private (Self-Pay)' && company.toLowerCase() !== 'other') {
            return (
              <div className="text-xs">
                <span className="text-gray-700">{company}</span>
              </div>
            );
          }
          return <div className="text-xs"><span className="text-gray-700">Other</span></div>;
        }
        
        // RULE 3: If Self-Pay → show "Self-Pay"
        if (whoPays === 'Self-Pay') {
          return (
            <div className="text-xs">
              <span className="text-gray-700">Self-Pay</span>
            </div>
          );
        }
        
        return (
          <div className="text-xs">
            <span className="text-gray-400">—</span>
          </div>
        );
      },
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
      key: 'photos',
      label: 'Photos',
      render: (lead) => (
        <div className="flex justify-center">
          {lead.damagePhotos && lead.damagePhotos.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openPhotoModal(lead.damagePhotos || []);
              }}
              className="inline-flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-100 transition-colors"
              title={`View ${lead.damagePhotos.length} photo(s)`}
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          ) : (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      ),
    },
    {
      key: 'details',
      label: 'Details',
      render: (lead) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            markLeadAsViewed(lead.id);
            router.push(`/dashboard/leads/${lead.id}`);
          }}
          className="text-[10px] text-gray-700 hover:text-gray-900 font-medium underline"
          title="View details"
        >
          Details
        </button>
      ),
    },
    {
      key: 'delete',
      label: 'Delete',
      render: (lead) => (
        <button
          onClick={(e) => handleDeleteClick(lead, e)}
          className="inline-flex items-center justify-center w-7 h-7 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Delete lead"
        >
          <Trash2 className="w-4 h-4" />
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
    <div className="space-y-4 lg:space-y-6">
      {/* Header - Mobile optimized */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-gray-900">Leads</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">Manage and track your leads</p>
        </div>
        <div className="flex items-center gap-2 lg:space-x-3">
          <ExportButton
            data={leads}
            columns={exportColumns}
            filename="leads"
            title="Leads Export"
            description="Export of all leads matching current filters"
            variant="secondary"
            className="text-xs lg:text-sm"
          />
          <Button
            onClick={() => router.push('/dashboard/leads/new')}
            leftIcon={<Plus className="w-4 h-4 lg:w-5 lg:h-5" />}
            className="text-xs lg:text-sm"
          >
            <span className="hidden sm:inline">New Lead</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters - Mobile optimized */}
      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by name, email, phone..."
          className="flex-1 text-sm"
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

      {/* Mobile Cards View (< lg) */}
      <div className="lg:hidden space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-sm">No leads found. Create your first lead to get started!</p>
          </div>
        ) : (
          leads.map((lead, index) => {
            const isViewed = viewedLeads.has(lead.id);
            const reversedNumber = totalItems - ((currentPage - 1) * pageSize) - index;
            
            return (
              <div
                key={lead.id}
                onClick={() => {
                  markLeadAsViewed(lead.id);
                  router.push(`/dashboard/leads/${lead.id}`);
                }}
                className={`bg-white border border-gray-200 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                  !isViewed ? 'bg-amber-50/30' : ''
                }`}
              >
                {/* Top Row: # + Reference + Delete */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-gray-500">#{reversedNumber}</span>
                    <span className="font-mono text-xs font-medium text-gold">
                      {(() => {
                        const ref = lead.referenceNumber;
                        if (ref && ref.startsWith('FLIP-')) {
                          const parts = ref.replace('FLIP-', '').split('-');
                          if (parts.length >= 2) {
                            const date = parts[0];
                            const num = parts[1] || '001';
                            const year = date.substring(0, 4);
                            const monthDay = date.substring(4);
                            return `${year}-${monthDay}-${num.padStart(3, '0')}`;
                          }
                        }
                        return ref;
                      })()}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteClick(lead, e)}
                    className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Customer Name */}
                <div className="mb-2">
                  <span className="text-sm font-semibold text-gray-900">{lead.name}</span>
                </div>

                {/* Contact + Preferences */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-gray-700">{lead.phone}</span>
                  {lead.contactPreferences && (lead.contactPreferences.phoneCall || lead.contactPreferences.whatsapp || lead.contactPreferences.textMessage) && (
                    <div className="flex items-center gap-1">
                      {lead.contactPreferences.phoneCall && (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gold/10 text-gold border border-gold/20" title="Phone Call">
                          <Phone className="w-3 h-3" />
                        </div>
                      )}
                      {lead.contactPreferences.whatsapp && (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-800 text-white border border-gray-700" title="WhatsApp">
                          <MessageCircle className="w-3 h-3" />
                        </div>
                      )}
                      {lead.contactPreferences.textMessage && (
                        <div className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-700 border border-gray-300" title="Text Message">
                          <MessageSquare className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Vehicle */}
                <div className="mb-2">
                  {lead.vehicleMake || lead.vehicleModel || lead.vehicleYear ? (
                    <span className="text-xs text-gray-700">
                      {lead.vehicleMake} {lead.vehicleModel}
                      {lead.vehicleYear && <span className="text-gray-500 ml-1">({lead.vehicleYear})</span>}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Vehicle not specified</span>
                  )}
                </div>

                {/* Badges Row: Service + Who Pays */}
                <div className="flex items-center gap-2 mb-2">
                  {getServiceBadge(lead)}
                  {getWhoPaysBadge(lead)}
                </div>

                {/* Bottom Row: AI Score + Photos + Details */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {/* AI Score */}
                    {lead.aiQualificationScore ? (
                      <div className="flex items-center gap-1">
                        <div className="w-8 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gold"
                            style={{ width: `${lead.aiQualificationScore}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-gray-700 tabular-nums">
                          {lead.aiQualificationScore}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400">No score</span>
                    )}

                    {/* Photos */}
                    {lead.damagePhotos && lead.damagePhotos.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPhotoModal(lead.damagePhotos || []);
                        }}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors"
                        title={`View ${lead.damagePhotos.length} photo(s)`}
                      >
                        <Eye className="w-3.5 h-3.5 text-gray-600" />
                      </button>
                    )}
                  </div>

                  {/* Details Link */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markLeadAsViewed(lead.id);
                      router.push(`/dashboard/leads/${lead.id}`);
                    }}
                    className="text-[10px] text-gray-700 hover:text-gray-900 font-medium underline"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Mobile Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between py-3 px-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-xs text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Desktop Data Table (≥ lg) */}
      <div className="hidden lg:block">
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
          onRowClick={(lead) => {
            markLeadAsViewed(lead.id);
            router.push(`/dashboard/leads/${lead.id}`);
          }}
          getRowClassName={(lead) => {
            // Light golden background for unviewed leads
            return !viewedLeads.has(lead.id) ? 'bg-amber-50/30' : '';
          }}
        />
      </div>

      {/* Photo Modal */}
      {photoModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" 
          onClick={() => setPhotoModalOpen(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPhotoModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
            
            {/* Photos grid */}
            <div className="p-6 overflow-y-auto max-h-[85vh]">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Lead Photos ({selectedPhotos.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedPhotos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`Damage photo ${idx + 1}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popover - Small and positioned next to trash icon */}
      {deletePopoverOpen && leadToDelete && popoverPosition && (
        <>
          {/* Backdrop - click to close */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={handleDeleteCancel}
          />
          
          {/* Popover */}
          <div 
            className="fixed z-50 w-[300px] bg-white rounded-lg shadow-2xl border border-gray-200"
            style={{
              top: `${popoverPosition.top}px`,
              left: `${popoverPosition.left}px`,
            }}
          >
            {/* Compact content */}
            <div className="p-4">
              {/* Header with icon */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Delete Lead?
                </h3>
              </div>
              
              {/* Lead info - compact */}
              <div className="bg-gray-50 rounded p-2 mb-3">
                <p className="text-xs font-medium text-gray-900 truncate">
                  {leadToDelete.name}
                </p>
                <p className="text-[10px] text-gray-600">
                  {leadToDelete.referenceNumber}
                </p>
              </div>
              
              <p className="text-[10px] text-gray-500 mb-3">
                Associated appointments will also be removed.
              </p>
              
              {/* Compact buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={handleDeleteCancel}
                  variant="secondary"
                  className="flex-1 text-xs py-1.5 h-auto"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteConfirm}
                  className="flex-1 text-xs py-1.5 h-auto bg-red-600 hover:bg-red-700 text-white"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
