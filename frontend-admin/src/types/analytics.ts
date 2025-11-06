export interface DateRange {
  startDate: string
  endDate: string
}

export interface MetricData {
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  trend: 'up' | 'down' | 'stable'
}

export interface KPIMetric {
  id: string
  label: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  prefix?: string
  suffix?: string
  icon?: string
  color?: string
}

export interface ChartDataPoint {
  label: string
  value: number
  [key: string]: string | number
}

export interface LeadAnalytics {
  totalLeads: MetricData
  qualifiedLeads: MetricData
  convertedLeads: MetricData
  conversionRate: MetricData
  leadsBySource: ChartDataPoint[]
  leadsByStatus: ChartDataPoint[]
  leadsOverTime: ChartDataPoint[]
}

export interface SalesAnalytics {
  totalRevenue: MetricData
  averageOrderValue: MetricData
  totalOrders: MetricData
  revenueGrowth: MetricData
  revenueByMonth: ChartDataPoint[]
  revenueByCategory: ChartDataPoint[]
  topPerformingProducts: ChartDataPoint[]
}

export interface CustomerAnalytics {
  totalCustomers: MetricData
  activeCustomers: MetricData
  newCustomers: MetricData
  churnRate: MetricData
  customersBySegment: ChartDataPoint[]
  customerGrowth: ChartDataPoint[]
  customerLifetimeValue: ChartDataPoint[]
}

export interface ClaimAnalytics {
  totalClaims: MetricData
  pendingClaims: MetricData
  approvedClaims: MetricData
  averageClaimValue: MetricData
  claimsByStatus: ChartDataPoint[]
  claimsByType: ChartDataPoint[]
  claimsOverTime: ChartDataPoint[]
}

export interface DashboardAnalytics {
  leads: LeadAnalytics
  sales: SalesAnalytics
  customers: CustomerAnalytics
  claims: ClaimAnalytics
  dateRange: DateRange
}
