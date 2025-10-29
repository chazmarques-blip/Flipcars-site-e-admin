import apiClient from './client';
import {
  Customer,
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomerFilters,
  CustomerStats,
  CustomerStatus,
} from '@/types/customer';
import { PaginatedResponse } from '@/types';

export const customerService = {
  /**
   * Get paginated customers with filters
   */
  async getCustomers(
    page: number = 1,
    limit: number = 10,
    filters?: CustomerFilters
  ): Promise<PaginatedResponse<Customer>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.minRevenue) params.append('minRevenue', filters.minRevenue.toString());
    if (filters?.maxRevenue) params.append('maxRevenue', filters.maxRevenue.toString());

    const response = await apiClient.get<PaginatedResponse<Customer>>(`/customers?${params.toString()}`);
    return response.data;
  },

  /**
   * Get customer statistics
   */
  async getStatistics(): Promise<CustomerStats> {
    const response = await apiClient.get<CustomerStats>('/customers/statistics');
    return response.data;
  },

  /**
   * Get customers assigned to current user
   */
  async getMyCustomers(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Customer>> {
    const response = await apiClient.get<PaginatedResponse<Customer>>(
      `/customers/my-customers?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  /**
   * Get customer by ID
   */
  async getCustomerById(id: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  /**
   * Get customer by reference number
   */
  async getCustomerByReference(referenceNumber: string): Promise<Customer> {
    const response = await apiClient.get<Customer>(`/customers/reference/${referenceNumber}`);
    return response.data;
  },

  /**
   * Create new customer
   */
  async createCustomer(data: CreateCustomerDto): Promise<Customer> {
    const response = await apiClient.post<Customer>('/customers', data);
    return response.data;
  },

  /**
   * Update customer
   */
  async updateCustomer(id: string, data: UpdateCustomerDto): Promise<Customer> {
    const response = await apiClient.patch<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  /**
   * Update customer status
   */
  async updateCustomerStatus(id: string, status: CustomerStatus, note?: string): Promise<Customer> {
    const response = await apiClient.patch<Customer>(`/customers/${id}/status`, {
      status,
      statusNote: note,
    });
    return response.data;
  },

  /**
   * Assign customer to user
   */
  async assignCustomer(id: string, userId: string): Promise<Customer> {
    const response = await apiClient.patch<Customer>(`/customers/${id}/assign`, {
      assignedToId: userId,
    });
    return response.data;
  },

  /**
   * Delete customer
   */
  async deleteCustomer(id: string): Promise<void> {
    await apiClient.delete(`/customers/${id}`);
  },
};
