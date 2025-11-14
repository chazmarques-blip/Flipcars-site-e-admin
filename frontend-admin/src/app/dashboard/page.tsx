'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardContent, Badge } from '@/components/ui';
import { EstimateFormModal } from '@/components/estimate';
import { leadService } from '@/lib/api/lead.service';
import { Lead, LeadStatus } from '@/types/lead';
import { useRouter } from 'next/navigation';
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
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeCustomers: 0,
    openClaims: 0,
    revenue: 0,
    todayCompleted: 0,
    todayPending: 0,
    todayUrgent: 0,
  });

  // Fetch dashboard data function
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
        
        // Fetch all leads (increased limit to ensure recent leads are included)
        // Changed from 100 to 500 to fix issue where lead FL-2025-4645 wasn't showing
        const response = await leadService.getLeads(1, 500);
        const allLeads = response.data;
        setLeads(allLeads);

        // Calculate statistics
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const totalLeads = allLeads.length;
        
        // Active customers: converted leads
        const activeCustomers = allLeads.filter(
          (lead) => lead.status === LeadStatus.CONVERTED
        ).length;
        
        // Open claims: non-archived, non-lost leads
        const openClaims = allLeads.filter(
          (lead) => 
            lead.status !== LeadStatus.ARCHIVED && 
            lead.status !== LeadStatus.LOST && 
            lead.status !== LeadStatus.CONVERTED
        ).length;
        
        // Revenue: sum of estimated values for converted leads (month-to-date)
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const revenue = allLeads
          .filter((lead) => {
            if (lead.status !== LeadStatus.CONVERTED) return false;
            const leadDate = new Date(lead.updatedAt);
            return (
              leadDate.getMonth() === currentMonth &&
              leadDate.getFullYear() === currentYear
            );
          })
          .reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);
        
        // Today's summary
        const todayLeads = allLeads.filter((lead) => {
          const createdDate = new Date(lead.createdAt);
          createdDate.setHours(0, 0, 0, 0);
          return createdDate.getTime() === today.getTime();
        });
        
        const todayCompleted = todayLeads.filter(
          (lead) => lead.status === LeadStatus.CONVERTED
        ).length;
        
        const todayPending = todayLeads.filter(
          (lead) => 
            lead.status === LeadStatus.NEW ||
            lead.status === LeadStatus.CONTACTED ||
            lead.status === LeadStatus.QUALIFIED
        ).length;
        
        const todayUrgent = todayLeads.filter(
          (lead) => lead.priority === 'high'
        ).length;

        setStats({
          totalLeads,
          activeCustomers,
          openClaims,
          revenue,
          todayCompleted,
          todayPending,
          todayUrgent,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all leads and calculate statistics
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const statsConfig = [
    {
      label: 'Total Leads',
      value: isLoading ? '...' : stats.totalLeads.toString(),
      icon: Car,
      color: 'text-primary',
      bgColor: 'bg-primary-100',
    },
    {
      label: 'Active Customers',
      value: isLoading ? '...' : stats.activeCustomers.toString(),
      icon: Users,
      color: 'text-secondary',
      bgColor: 'bg-secondary-100',
    },
    {
      label: 'Open Claims',
      value: isLoading ? '...' : stats.openClaims.toString(),
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent-100',
    },
    {
      label: 'Revenue (MTD)',
      value: isLoading ? '...' : formatCurrency(stats.revenue),
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-green-100',
    },
  ];

  // Get recent leads (last 5)
  const recentLeads = leads.slice(0, 5);

  // Calculate relative time
  const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  // Format reference number
  const formatReferenceNumber = (ref: string): string => {
    if (ref && ref.startsWith('FLIP-')) {
      const parts = ref.replace('FLIP-', '').split('-');
      const date = parts[0]; // YYYYMMDD
      const num = parts[1] || '001';
      const year = date.substring(0, 4);
      const monthDay = date.substring(4);
      return `${year}-${monthDay}-${num.padStart(3, '0')}`;
    }
    return ref;
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW:
        return <Badge variant="primary">New</Badge>;
      case LeadStatus.CONTACTED:
        return <Badge variant="secondary">Contacted</Badge>;
      case LeadStatus.QUALIFIED:
        return <Badge variant="success">Qualified</Badge>;
      case LeadStatus.APPOINTMENT_SCHEDULED:
        return <Badge variant="info">Scheduled</Badge>;
      case LeadStatus.IN_PROGRESS:
        return <Badge variant="warning">In Progress</Badge>;
      case LeadStatus.CONVERTED:
        return <Badge variant="success">Converted</Badge>;
      case LeadStatus.LOST:
        return <Badge variant="danger">Lost</Badge>;
      case LeadStatus.ARCHIVED:
        return <Badge variant="default">Archived</Badge>;
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
        {statsConfig.map((stat) => (
          <Card key={stat.label} variant="default">
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
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
              <div className="flex items-center gap-3">
                <button
                  onClick={fetchDashboardData}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors disabled:opacity-50"
                  title="Refresh leads"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <a href="/dashboard/leads" className="text-sm text-primary hover:text-primary-600">
                  View all
                </a>
              </div>
            }
          />
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Loading recent leads...
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No leads yet. Create your first lead to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                  >
                    {/* Nome e Badge */}
                    <div className="flex items-center gap-2 min-w-[180px]">
                      <p className="font-semibold text-gray-900">{lead.name}</p>
                      {getStatusBadge(lead.status)}
                    </div>
                    
                    {/* Veículo */}
                    <div className="flex-1 min-w-[200px]">
                      {lead.vehicleYear || lead.vehicleMake || lead.vehicleModel ? (
                        <p className="text-sm text-gray-700 font-medium">
                          {lead.vehicleYear && `${lead.vehicleYear} `}
                          {lead.vehicleMake && `${lead.vehicleMake} `}
                          {lead.vehicleModel}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Vehicle info not provided</p>
                      )}
                    </div>
                    
                    {/* Tempo */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 min-w-[120px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{getRelativeTime(lead.createdAt)}</span>
                    </div>
                    
                    {/* Número de Referência */}
                    <div className="min-w-[130px] text-center">
                      <p className="text-sm text-gray-600 font-mono">
                        {formatReferenceNumber(lead.referenceNumber)}
                      </p>
                    </div>
                    
                    {/* Botão View Details */}
                    <div className="min-w-[110px] text-right">
                      <button 
                        className="text-sm text-primary hover:text-primary-600 font-semibold transition-colors group-hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/leads/${lead.id}`);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  <span className="font-medium text-gray-900">
                    {isLoading ? '...' : stats.todayCompleted}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {isLoading ? '...' : stats.todayPending}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-danger" />
                    <span className="text-gray-600">Urgent</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {isLoading ? '...' : stats.todayUrgent}
                  </span>
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
