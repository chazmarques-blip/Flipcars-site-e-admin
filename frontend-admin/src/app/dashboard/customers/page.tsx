'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Building2, User } from 'lucide-react';
import {
  Button,
  Badge,
  DataTable,
  SearchBar,
  FilterPanel,
  FilterSelect,
  Column,
} from '@/components/ui';
import { Customer, CustomerStatus, CustomerType, CustomerFilters } from '@/types/customer';
import { customerService } from '@/lib/api/customer.service';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize] = useState(10);
  
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters, searchQuery]);

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await customerService.getCustomers(currentPage, pageSize, {
        ...filters,
        search: searchQuery || undefined,
      });
      
      setCustomers(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalItems(response.meta.total);
    } catch (error) {
      toast.error('Failed to load customers');
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: CustomerStatus) => {
    const variants: Record<CustomerStatus, 'success' | 'warning' | 'danger'> = {
      [CustomerStatus.ACTIVE]: 'success',
      [CustomerStatus.INACTIVE]: 'warning',
      [CustomerStatus.BLOCKED]: 'danger',
    };

    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getTypeBadge = (type: CustomerType) => {
    const Icon = type === CustomerType.BUSINESS ? Building2 : User;
    return (
      <div className="flex items-center gap-1.5">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700 capitalize">{type}</span>
      </div>
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

  const columns: Column<Customer>[] = [
    {
      key: 'referenceNumber',
      label: 'Reference',
      sortable: true,
      render: (customer) => (
        <span className="font-mono text-sm font-medium text-primary">
          {customer.referenceNumber}
        </span>
      ),
    },
    {
      key: 'name',
      label: 'Customer',
      sortable: true,
      render: (customer) => (
        <div>
          <div className="font-medium text-gray-900">{customer.name}</div>
          <div className="text-xs text-gray-500">{customer.email}</div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (customer) => getTypeBadge(customer.type),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (customer) => (
        <a
          href={`tel:${customer.phone}`}
          className="text-sm text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {customer.phone}
        </a>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (customer) => (
        <div className="text-sm">
          {customer.city || customer.state ? (
            <>
              <div className="text-gray-900">{customer.city}</div>
              <div className="text-xs text-gray-500">{customer.state}</div>
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
      render: (customer) => getStatusBadge(customer.status),
    },
    {
      key: 'stats',
      label: 'Statistics',
      render: (customer) => (
        <div className="text-xs space-y-0.5">
          <div className="text-gray-900">
            {customer.totalLeads} lead{customer.totalLeads !== 1 ? 's' : ''}
          </div>
          <div className="text-gray-900">
            {customer.totalClaims} claim{customer.totalClaims !== 1 ? 's' : ''}
          </div>
          <div className="font-medium text-primary">
            {formatCurrency(customer.totalRevenue)}
          </div>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (customer) => (
        <span className="text-sm text-gray-600">
          {formatDistanceToNow(new Date(customer.createdAt), { addSuffix: true })}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (customer) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/dashboard/customers/${customer.id}`);
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
          <h1 className="text-3xl font-heading font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/customers/new')}
          leftIcon={<Plus className="w-5 h-5" />}
        >
          New Customer
        </Button>
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
              setFilters({ ...filters, status: value as CustomerStatus || undefined })
            }
            options={[
              { value: CustomerStatus.ACTIVE, label: 'Active' },
              { value: CustomerStatus.INACTIVE, label: 'Inactive' },
              { value: CustomerStatus.BLOCKED, label: 'Blocked' },
            ]}
            placeholder="All statuses"
          />

          <FilterSelect
            label="Type"
            value={filters.type || ''}
            onChange={(value) =>
              setFilters({ ...filters, type: value as CustomerType || undefined })
            }
            options={[
              { value: CustomerType.INDIVIDUAL, label: 'Individual' },
              { value: CustomerType.BUSINESS, label: 'Business' },
            ]}
            placeholder="All types"
          />
        </FilterPanel>
      </div>

      {/* Data Table */}
      <DataTable
        data={customers}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        isLoading={isLoading}
        emptyMessage="No customers found. Create your first customer to get started!"
        onRowClick={(customer) => router.push(`/dashboard/customers/${customer.id}`)}
      />
    </div>
  );
}
