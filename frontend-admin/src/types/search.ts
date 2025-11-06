export enum SearchScope {
  ALL = 'all',
  LEADS = 'leads',
  CUSTOMERS = 'customers',
  CLAIMS = 'claims',
  USERS = 'users',
  FILES = 'files',
  EMAILS = 'emails',
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IN = 'in',
  NOT_IN = 'not_in',
  BETWEEN = 'between',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null',
}

export enum FilterLogic {
  AND = 'and',
  OR = 'or',
}

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
}

export interface FilterField {
  key: string
  label: string
  type: FieldType
  options?: Array<{ label: string; value: string | number }>
  operators?: FilterOperator[]
}

export interface FilterCondition {
  id: string
  field: string
  operator: FilterOperator
  value: string | number | boolean | Date | null | Array<string | number>
}

export interface FilterGroup {
  id: string
  logic: FilterLogic
  conditions: FilterCondition[]
  groups?: FilterGroup[]
}

export interface SearchFilter {
  id: string
  name: string
  scope: SearchScope
  query?: string
  filterGroup: FilterGroup
  createdAt: string
  updatedAt: string
}

export interface SavedSearch {
  id: string
  name: string
  description?: string
  scope: SearchScope
  filter: SearchFilter
  isDefault?: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  usageCount: number
  lastUsed?: string
}

export interface SearchResult<T = unknown> {
  id: string
  type: SearchScope
  title: string
  description: string
  metadata?: Record<string, unknown>
  data: T
  score?: number
  highlightedFields?: Record<string, string>
}

export interface SearchHistory {
  id: string
  query: string
  scope: SearchScope
  timestamp: string
  resultsCount: number
}

export interface QuickFilter {
  id: string
  label: string
  scope: SearchScope
  filter: FilterGroup
  icon?: string
  color?: string
}

// Predefined filter fields for different scopes
export const LEAD_FILTER_FIELDS: FilterField[] = [
  {
    key: 'name',
    label: 'Name',
    type: FieldType.TEXT,
    operators: [FilterOperator.CONTAINS, FilterOperator.STARTS_WITH, FilterOperator.EQUALS],
  },
  {
    key: 'email',
    label: 'Email',
    type: FieldType.TEXT,
    operators: [FilterOperator.CONTAINS, FilterOperator.EQUALS],
  },
  {
    key: 'phone',
    label: 'Phone',
    type: FieldType.TEXT,
    operators: [FilterOperator.CONTAINS, FilterOperator.EQUALS],
  },
  {
    key: 'status',
    label: 'Status',
    type: FieldType.SELECT,
    options: [
      { label: 'New', value: 'new' },
      { label: 'Contacted', value: 'contacted' },
      { label: 'Qualified', value: 'qualified' },
      { label: 'Converted', value: 'converted' },
      { label: 'Lost', value: 'lost' },
    ],
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
  },
  {
    key: 'source',
    label: 'Source',
    type: FieldType.SELECT,
    options: [
      { label: 'Website', value: 'website' },
      { label: 'Referral', value: 'referral' },
      { label: 'Social Media', value: 'social' },
      { label: 'Advertisement', value: 'ad' },
    ],
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    type: FieldType.DATE,
    operators: [FilterOperator.EQUALS, FilterOperator.GREATER_THAN, FilterOperator.LESS_THAN, FilterOperator.BETWEEN],
  },
]

export const CUSTOMER_FILTER_FIELDS: FilterField[] = [
  {
    key: 'name',
    label: 'Name',
    type: FieldType.TEXT,
    operators: [FilterOperator.CONTAINS, FilterOperator.STARTS_WITH, FilterOperator.EQUALS],
  },
  {
    key: 'email',
    label: 'Email',
    type: FieldType.TEXT,
    operators: [FilterOperator.CONTAINS, FilterOperator.EQUALS],
  },
  {
    key: 'phone',
    label: 'Phone',
    type: FieldType.TEXT,
    operators: [FilterOperator.CONTAINS, FilterOperator.EQUALS],
  },
  {
    key: 'status',
    label: 'Status',
    type: FieldType.SELECT,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'VIP', value: 'vip' },
    ],
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
  },
  {
    key: 'totalPurchases',
    label: 'Total Purchases',
    type: FieldType.NUMBER,
    operators: [FilterOperator.EQUALS, FilterOperator.GREATER_THAN, FilterOperator.LESS_THAN],
  },
  {
    key: 'createdAt',
    label: 'Registration Date',
    type: FieldType.DATE,
    operators: [FilterOperator.EQUALS, FilterOperator.GREATER_THAN, FilterOperator.LESS_THAN, FilterOperator.BETWEEN],
  },
]

export const CLAIM_FILTER_FIELDS: FilterField[] = [
  {
    key: 'claimNumber',
    label: 'Claim Number',
    type: FieldType.TEXT,
    operators: [FilterOperator.CONTAINS, FilterOperator.EQUALS],
  },
  {
    key: 'customerName',
    label: 'Customer Name',
    type: FieldType.TEXT,
    operators: [FilterOperator.CONTAINS, FilterOperator.STARTS_WITH],
  },
  {
    key: 'status',
    label: 'Status',
    type: FieldType.SELECT,
    options: [
      { label: 'Pending', value: 'pending' },
      { label: 'In Review', value: 'in_review' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' },
      { label: 'Closed', value: 'closed' },
    ],
    operators: [FilterOperator.EQUALS, FilterOperator.IN],
  },
  {
    key: 'claimAmount',
    label: 'Claim Amount',
    type: FieldType.NUMBER,
    operators: [FilterOperator.EQUALS, FilterOperator.GREATER_THAN, FilterOperator.LESS_THAN, FilterOperator.BETWEEN],
  },
  {
    key: 'incidentDate',
    label: 'Incident Date',
    type: FieldType.DATE,
    operators: [FilterOperator.EQUALS, FilterOperator.GREATER_THAN, FilterOperator.LESS_THAN, FilterOperator.BETWEEN],
  },
  {
    key: 'createdAt',
    label: 'Filed Date',
    type: FieldType.DATE,
    operators: [FilterOperator.EQUALS, FilterOperator.GREATER_THAN, FilterOperator.LESS_THAN, FilterOperator.BETWEEN],
  },
]

export function getFilterFieldsByScope(scope: SearchScope): FilterField[] {
  switch (scope) {
    case SearchScope.LEADS:
      return LEAD_FILTER_FIELDS
    case SearchScope.CUSTOMERS:
      return CUSTOMER_FILTER_FIELDS
    case SearchScope.CLAIMS:
      return CLAIM_FILTER_FIELDS
    default:
      return []
  }
}

export function getOperatorLabel(operator: FilterOperator): string {
  const labels: Record<FilterOperator, string> = {
    [FilterOperator.EQUALS]: 'equals',
    [FilterOperator.NOT_EQUALS]: 'does not equal',
    [FilterOperator.CONTAINS]: 'contains',
    [FilterOperator.NOT_CONTAINS]: 'does not contain',
    [FilterOperator.STARTS_WITH]: 'starts with',
    [FilterOperator.ENDS_WITH]: 'ends with',
    [FilterOperator.GREATER_THAN]: 'greater than',
    [FilterOperator.LESS_THAN]: 'less than',
    [FilterOperator.GREATER_THAN_OR_EQUAL]: 'greater than or equal',
    [FilterOperator.LESS_THAN_OR_EQUAL]: 'less than or equal',
    [FilterOperator.IN]: 'is one of',
    [FilterOperator.NOT_IN]: 'is not one of',
    [FilterOperator.BETWEEN]: 'between',
    [FilterOperator.IS_NULL]: 'is empty',
    [FilterOperator.IS_NOT_NULL]: 'is not empty',
  }
  return labels[operator]
}
