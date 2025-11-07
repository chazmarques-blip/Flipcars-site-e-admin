/**
 * Mock Lead Storage using localStorage for persistence
 * This allows leads created during development to persist across page reloads
 */

import { Lead } from '@/types/lead';

const STORAGE_KEY = 'flipcars_mock_leads';

export const mockLeadStorage = {
  /**
   * Get all stored leads
   */
  getLeads(): Lead[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const leads = JSON.parse(stored);
      return Array.isArray(leads) ? leads : [];
    } catch (error) {
      console.error('[MockLeadStorage] Error reading leads:', error);
      return [];
    }
  },

  /**
   * Save leads to storage
   */
  saveLeads(leads: Lead[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
      console.log('[MockLeadStorage] Saved', leads.length, 'leads');
    } catch (error) {
      console.error('[MockLeadStorage] Error saving leads:', error);
    }
  },

  /**
   * Add a new lead
   */
  addLead(lead: Lead): void {
    const leads = this.getLeads();
    leads.unshift(lead); // Add to beginning (newest first)
    this.saveLeads(leads);
    console.log('[MockLeadStorage] Added lead:', lead.referenceNumber);
  },

  /**
   * Update an existing lead
   */
  updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const leads = this.getLeads();
    const index = leads.findIndex(l => l.id === id);
    
    if (index === -1) return null;
    
    leads[index] = { ...leads[index], ...updates, updatedAt: new Date().toISOString() };
    this.saveLeads(leads);
    console.log('[MockLeadStorage] Updated lead:', id);
    
    return leads[index];
  },

  /**
   * Delete a lead
   */
  deleteLead(id: string): boolean {
    const leads = this.getLeads();
    const filtered = leads.filter(l => l.id !== id);
    
    if (filtered.length === leads.length) return false;
    
    this.saveLeads(filtered);
    console.log('[MockLeadStorage] Deleted lead:', id);
    return true;
  },

  /**
   * Get lead by ID
   */
  getLeadById(id: string): Lead | null {
    const leads = this.getLeads();
    return leads.find(l => l.id === id) || null;
  },

  /**
   * Get lead by reference number
   */
  getLeadByReference(referenceNumber: string): Lead | null {
    const leads = this.getLeads();
    return leads.find(l => l.referenceNumber === referenceNumber) || null;
  },

  /**
   * Clear all leads (useful for testing)
   */
  clearAll(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEY);
    console.log('[MockLeadStorage] Cleared all leads');
  },

  /**
   * Initialize with default leads if empty
   */
  initializeWithDefaults(defaultLeads: Lead[]): void {
    const existing = this.getLeads();
    
    if (existing.length === 0) {
      this.saveLeads(defaultLeads);
      console.log('[MockLeadStorage] Initialized with', defaultLeads.length, 'default leads');
    }
  },
};
