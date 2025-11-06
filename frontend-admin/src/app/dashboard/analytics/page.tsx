'use client'

import { useState } from 'react'
import {
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  ShoppingCart,
  UserCheck,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import {
  KPICard,
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  DateRangePicker,
} from '@/components/analytics'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  })

  // Mock data - Em produção, buscar da API
  const leadsOverTime = [
    { month: 'Jan', leads: 65, qualified: 45 },
    { month: 'Feb', leads: 78, qualified: 52 },
    { month: 'Mar', leads: 90, qualified: 68 },
    { month: 'Apr', leads: 81, qualified: 61 },
    { month: 'May', leads: 95, qualified: 72 },
    { month: 'Jun', leads: 112, qualified: 89 },
  ]

  const leadsBySource = [
    { label: 'Website', value: 245 },
    { label: 'Referral', value: 156 },
    { label: 'Social Media', value: 98 },
    { label: 'Email Campaign', value: 87 },
    { label: 'Direct', value: 65 },
  ]

  const revenueByMonth = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 61000 },
    { month: 'Apr', revenue: 58000 },
    { month: 'May', revenue: 67000 },
    { month: 'Jun', revenue: 75000 },
  ]

  const claimsByStatus = [
    { label: 'Pending', value: 45 },
    { label: 'Approved', value: 123 },
    { label: 'Rejected', value: 12 },
    { label: 'In Progress', value: 67 },
  ]

  const customerGrowth = [
    { month: 'Jan', new: 34, active: 245, total: 512 },
    { month: 'Feb', new: 45, active: 267, total: 557 },
    { month: 'Mar', new: 52, active: 289, total: 609 },
    { month: 'Apr', new: 48, active: 301, total: 657 },
    { month: 'May', new: 61, active: 324, total: 718 },
    { month: 'Jun', new: 73, active: 356, total: 791 },
  ]

  const topPerformingServices = [
    { service: 'Body Repair', revenue: 125000 },
    { service: 'Paint Job', revenue: 98000 },
    { service: 'Dent Removal', revenue: 76000 },
    { service: 'Glass Replacement', revenue: 54000 },
    { service: 'Detailing', revenue: 32000 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your business performance
          </p>
        </div>

        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={(startDate, endDate) => setDateRange({ startDate, endDate })}
        />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Total Revenue"
          value="358,000"
          prefix="$"
          change={12.5}
          changeType="increase"
          icon={<DollarSign className="w-5 h-5" />}
          color="success"
        />
        <KPICard
          label="Total Leads"
          value="651"
          change={8.2}
          changeType="increase"
          icon={<TrendingUp className="w-5 h-5" />}
          color="primary"
        />
        <KPICard
          label="Active Customers"
          value="356"
          change={5.1}
          changeType="increase"
          icon={<Users className="w-5 h-5" />}
          color="info"
        />
        <KPICard
          label="Pending Claims"
          value="45"
          change={-3.2}
          changeType="decrease"
          icon={<FileText className="w-5 h-5" />}
          color="warning"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads Over Time */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads Over Time</h2>
          <LineChart
            data={leadsOverTime}
            lines={[
              { dataKey: 'leads', name: 'Total Leads', color: '#3B82F6' },
              { dataKey: 'qualified', name: 'Qualified Leads', color: '#10B981' },
            ]}
            xAxisKey="month"
            height={300}
          />
        </div>

        {/* Leads by Source */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads by Source</h2>
          <PieChart data={leadsBySource} height={300} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
          <AreaChart
            data={revenueByMonth}
            areas={[
              { dataKey: 'revenue', name: 'Revenue', color: '#10B981' },
            ]}
            xAxisKey="month"
            height={300}
          />
        </div>

        {/* Claims by Status */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Claims by Status</h2>
          <BarChart
            data={claimsByStatus.map(item => ({ name: item.label, value: item.value }))}
            bars={[
              { dataKey: 'value', name: 'Claims', color: '#3B82F6' },
            ]}
            xAxisKey="name"
            height={300}
          />
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Growth</h2>
          <AreaChart
            data={customerGrowth}
            areas={[
              { dataKey: 'new', name: 'New Customers', color: '#3B82F6' },
              { dataKey: 'active', name: 'Active Customers', color: '#10B981' },
            ]}
            xAxisKey="month"
            height={300}
            stacked
          />
        </div>

        {/* Top Performing Services */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Services
          </h2>
          <BarChart
            data={topPerformingServices}
            bars={[
              { dataKey: 'revenue', name: 'Revenue', color: '#8B5CF6' },
            ]}
            xAxisKey="service"
            height={300}
            horizontal
          />
        </div>
      </div>

      {/* Additional KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          label="Conversion Rate"
          value="68.5"
          suffix="%"
          change={4.3}
          changeType="increase"
          icon={<CheckCircle className="w-5 h-5" />}
          color="success"
        />
        <KPICard
          label="Avg. Order Value"
          value="2,450"
          prefix="$"
          change={-1.2}
          changeType="decrease"
          icon={<ShoppingCart className="w-5 h-5" />}
          color="info"
        />
        <KPICard
          label="Customer Satisfaction"
          value="4.8"
          suffix="/5"
          change={0.3}
          changeType="increase"
          icon={<UserCheck className="w-5 h-5" />}
          color="success"
        />
        <KPICard
          label="Claim Resolution Time"
          value="2.3"
          suffix=" days"
          change={-8.5}
          changeType="increase"
          icon={<AlertCircle className="w-5 h-5" />}
          color="warning"
        />
      </div>
    </div>
  )
}
