'use client';

import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardContent, Badge } from '@/components/ui';
import { EstimateFormModal } from '@/components/estimate';
import {
  TrendingUp,
  Users,
  Car,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ClipboardList,
} from 'lucide-react';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

  const stats = [
    {
      label: 'Total Leads',
      value: '156',
      change: '+12%',
      trend: 'up',
      icon: Car,
      color: 'text-primary',
      bgColor: 'bg-primary-100',
    },
    {
      label: 'Active Customers',
      value: '89',
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary-100',
    },
    {
      label: 'Open Claims',
      value: '34',
      change: '-5%',
      trend: 'down',
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent-100',
    },
    {
      label: 'Revenue (MTD)',
      value: '$45.2K',
      change: '+18%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-green-100',
    },
  ];

  const recentLeads = [
    {
      id: 'FLIP-20251028-0001',
      customer: 'John Doe',
      vehicle: '2023 Tesla Model 3',
      status: 'qualified',
      time: '2 hours ago',
    },
    {
      id: 'FLIP-20251028-0002',
      customer: 'Jane Smith',
      vehicle: '2022 BMW X5',
      status: 'new',
      time: '4 hours ago',
    },
    {
      id: 'FLIP-20251028-0003',
      customer: 'Bob Johnson',
      vehicle: '2021 Mercedes C-Class',
      status: 'contacted',
      time: '6 hours ago',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'qualified':
        return <Badge variant="success">Qualified</Badge>;
      case 'new':
        return <Badge variant="primary">New</Badge>;
      case 'contacted':
        return <Badge variant="secondary">Contacted</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your auto body shop today.
          </p>
        </div>
        {/* Test Estimate Form Button */}
        <button
          onClick={() => setIsEstimateModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white font-semibold rounded-lg shadow-lg transition-all hover:scale-105"
        >
          <ClipboardList className="w-5 h-5" />
          <span>Test Estimate Form</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} variant="default">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp
                      className={`w-4 h-4 ${
                        stat.trend === 'up' ? 'text-success' : 'text-danger'
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-success' : 'text-danger'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Recent Leads"
            subtitle="Latest lead submissions"
            action={
              <a href="/dashboard/leads" className="text-sm text-primary hover:text-primary-600">
                View all
              </a>
            }
          />
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{lead.customer}</p>
                      {getStatusBadge(lead.status)}
                    </div>
                    <p className="text-sm text-gray-600">{lead.vehicle}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {lead.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-2">{lead.id}</p>
                    <button className="text-sm text-primary hover:text-primary-600 font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader title="Quick Actions" subtitle="Common tasks" />
          <CardContent>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors">
                <Car className="w-5 h-5" />
                <span className="font-medium">New Lead</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-secondary text-white rounded-lg hover:bg-secondary-600 transition-colors">
                <Users className="w-5 h-5" />
                <span className="font-medium">Add Customer</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors">
                <FileText className="w-5 h-5" />
                <span className="font-medium">Create Claim</span>
              </button>
            </div>

            {/* Status Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Today&apos;s Summary</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-gray-600">Completed</span>
                  </div>
                  <span className="font-medium text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <span className="font-medium text-gray-900">8</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-danger" />
                    <span className="text-gray-600">Urgent</span>
                  </div>
                  <span className="font-medium text-gray-900">3</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estimate Form Modal */}
      <EstimateFormModal
        isOpen={isEstimateModalOpen}
        onClose={() => setIsEstimateModalOpen(false)}
      />
    </div>
  );
}
