// Staff Financial Management Component
import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  Building,
  Car,
  Calendar,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  CheckSquare,
  Square,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Target,
  Award,
  Shield,
  Globe,
  Camera,
  Upload as UploadIcon,
  Download as DownloadIcon,
  RefreshCw as RefreshCwIcon,
  Filter as FilterIcon,
  Search as SearchIcon,
  Plus as PlusIcon,
  X as XIcon,
  CheckCircle as CheckCircleIcon,
  AlertCircle as AlertCircleIcon,
  Info as InfoIcon,
  ExternalLink as ExternalLinkIcon,
  MoreHorizontal as MoreHorizontalIcon,
  Edit as EditIcon,
  Trash as TrashIcon,
  Copy as CopyIcon,
  Share as ShareIcon,
  Archive as ArchiveIcon,
  Ban as BanIcon,
  Unlock as UnlockIcon,
  Lock as LockIcon,
  EyeOff as EyeOffIcon,
  Send as SendIcon,
  Reply as ReplyIcon
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import staffService from '../../../services/staff/staffService';
import toast from 'react-hot-toast';

const FinancialManagement = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [financialData, setFinancialData] = useState({});
  const [commissionRates, setCommissionRates] = useState({});
  const [earnings, setEarnings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [filters, setFilters] = useState({
    period: '30d',
    type: 'all',
    status: 'all'
  });

  // Fetch financial overview
  const fetchFinancialOverview = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const data = await staffService.getFinancialOverview(filters.period);
      setFinancialData(data.data);
    } catch (error) {
      console.error('Fetch financial overview error:', error);
      toast.error(error.message || 'Failed to fetch financial overview');
    } finally {
      setLoading(false);
    }
  };

  // Fetch commission rates
  const fetchCommissionRates = async () => {
    try {
      const data = await staffService.getCommissionRates();
      setCommissionRates(data.data);
    } catch (error) {
      console.error('Fetch commission rates error:', error);
    }
  };

  // Fetch service provider earnings
  const fetchEarnings = async () => {
    try {
      const data = await staffService.getServiceProviderEarnings(filters.type, filters.period);
      setEarnings(data.data.earnings);
    } catch (error) {
      console.error('Fetch earnings error:', error);
      toast.error(error.message || 'Failed to fetch earnings');
    }
  };

  // Fetch payments
  const fetchPayments = async () => {
    try {
      const data = await staffService.getPaymentStatus(filters.status, filters.period);
      setPayments(data.data.payments);
    } catch (error) {
      console.error('Fetch payments error:', error);
      toast.error(error.message || 'Failed to fetch payments');
    }
  };

  // Fetch reports
  const fetchReports = async () => {
    try {
      const data = await staffService.getFinancialReports('all', filters.period);
      setReports(data.data);
    } catch (error) {
      console.error('Fetch reports error:', error);
      toast.error(error.message || 'Failed to fetch reports');
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchFinancialOverview();
      fetchCommissionRates();
      fetchEarnings();
      fetchPayments();
      fetchReports();
    }
  }, [filters, isAuthenticated, isLoading]);

  // Handle commission rate update
  const handleCommissionUpdate = async (newRates) => {
    try {
      const data = await staffService.updateCommissionRates(newRates);
      toast.success(data.message);
      setShowCommissionModal(false);
      fetchCommissionRates();
    } catch (error) {
      console.error('Update commission rates error:', error);
      toast.error(error.message || 'Failed to update commission rates');
    }
  };

  // Handle payout processing
  const handlePayout = async (payoutData) => {
    try {
      const data = await staffService.processPayout(payoutData);
      toast.success(data.message);
      setShowPayoutModal(false);
      fetchEarnings();
    } catch (error) {
      console.error('Process payout error:', error);
      toast.error(error.message || 'Failed to process payout');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'payments', label: 'Payments', icon: CheckCircle },
    { id: 'commissions', label: 'Commissions', icon: Target },
    { id: 'reports', label: 'Reports', icon: FileText }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'failed': return XCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Management</h2>
          <p className="text-slate-600">Manage platform finances, commissions, and payouts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowPayoutModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Process Payout
          </button>
          <button
            onClick={() => setShowCommissionModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Target className="h-4 w-4 mr-2" />
            Commission Rates
          </button>
          <button
            onClick={fetchFinancialOverview}
            className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Period</label>
              <select
                value={filters.period}
                onChange={(e) => setFilters({ ...filters, period: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="guides">Guides</option>
                <option value="hotels">Hotels</option>
                <option value="vehicles">Vehicles</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Financial Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-slate-900">
                        LKR {financialData.totalRevenue?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Platform Commission</p>
                      <p className="text-2xl font-bold text-blue-600">
                        LKR {financialData.totalCommissions?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Refunds</p>
                      <p className="text-2xl font-bold text-red-600">
                        LKR {financialData.totalRefunds?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Net Profit</p>
                      <p className="text-2xl font-bold text-purple-600">
                        LKR {((financialData.totalCommissions || 0) - (financialData.totalRefunds || 0)).toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Financial Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">New booking payment</p>
                        <p className="text-sm text-slate-600">LKR 15,000 received</p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">2 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Target className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Commission processed</p>
                        <p className="text-sm text-slate-600">LKR 2,250 to platform</p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">4 hours ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <XCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Refund processed</p>
                        <p className="text-sm text-slate-600">LKR 5,000 refunded</p>
                      </div>
                    </div>
                    <span className="text-sm text-slate-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Service Provider Earnings</h3>
                <button
                  onClick={() => setShowPayoutModal(true)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Payout
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : earnings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">No earnings found</h3>
                  <p className="text-slate-500">No earnings match your current filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {earnings.map((earning, index) => (
                    <div key={index} className="p-6 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {earning.type === 'guide' && <Users className="h-6 w-6 text-blue-600" />}
                            {earning.type === 'hotel' && <Building className="h-6 w-6 text-blue-600" />}
                            {earning.type === 'vehicle' && <Car className="h-6 w-6 text-blue-600" />}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {earning.guide?.firstName || earning.hotel?.firstName || earning.vehicle?.firstName} {' '}
                              {earning.guide?.lastName || earning.hotel?.lastName || earning.vehicle?.lastName}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {earning.guide?.email || earning.hotel?.email || earning.vehicle?.email}
                            </p>
                            <p className="text-sm text-slate-500">
                              {earning.count} bookings • {earning.type}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            LKR {earning.total?.toLocaleString()}
                          </p>
                          <button
                            onClick={() => setShowPayoutModal(true)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            Process Payout
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900">Payment Status</h3>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-700 mb-2">No payments found</h3>
                  <p className="text-slate-500">No payments match your current filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment, index) => {
                    const StatusIcon = getStatusIcon(payment.paymentStatus);
                    return (
                      <div key={index} className="p-6 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getStatusColor(payment.paymentStatus)}`}>
                              <StatusIcon className="h-6 w-6" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-900">
                                {payment.user?.firstName} {payment.user?.lastName}
                              </h4>
                              <p className="text-sm text-slate-600">{payment.user?.email}</p>
                              <p className="text-sm text-slate-500">{payment.tour?.title}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-slate-900">
                              LKR {payment.totalAmount?.toLocaleString()}
                            </p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.paymentStatus)}`}>
                              {payment.paymentStatus}
                            </span>
                            <p className="text-sm text-slate-500 mt-1">
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Commissions Tab */}
          {activeTab === 'commissions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Commission Rates</h3>
                <button
                  onClick={() => setShowCommissionModal(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Rates
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900">Platform Commission</h4>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Target className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Default:</span>
                      <span className="font-medium">{(commissionRates.platform?.default * 100)?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Range:</span>
                      <span className="text-sm text-slate-500">
                        {(commissionRates.platform?.minimum * 100)?.toFixed(1)}% - {(commissionRates.platform?.maximum * 100)?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900">Guide Commission</h4>
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Default:</span>
                      <span className="font-medium">{(commissionRates.guides?.default * 100)?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Range:</span>
                      <span className="text-sm text-slate-500">
                        {(commissionRates.guides?.minimum * 100)?.toFixed(1)}% - {(commissionRates.guides?.maximum * 100)?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900">Hotel Commission</h4>
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Building className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Default:</span>
                      <span className="font-medium">{(commissionRates.hotels?.default * 100)?.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Range:</span>
                      <span className="text-sm text-slate-500">
                        {(commissionRates.hotels?.minimum * 100)?.toFixed(1)}% - {(commissionRates.hotels?.maximum * 100)?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Financial Reports</h3>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Revenue Report</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Revenue:</span>
                      <span className="font-medium">LKR {financialData.totalRevenue?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Recent Revenue:</span>
                      <span className="font-medium">LKR {financialData.recentRevenue?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Growth Rate:</span>
                      <span className="font-medium text-green-600">+12.5%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <h4 className="font-semibold text-slate-900 mb-4">Commission Report</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Total Commissions:</span>
                      <span className="font-medium">LKR {financialData.totalCommissions?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Recent Commissions:</span>
                      <span className="font-medium">LKR {financialData.recentCommissions?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Commission Rate:</span>
                      <span className="font-medium">15.0%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Commission Rates Modal */}
      {showCommissionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Edit Commission Rates</h3>
                <button
                  onClick={() => setShowCommissionModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Platform Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    defaultValue={commissionRates.platform?.default * 100}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Guide Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    defaultValue={commissionRates.guides?.default * 100}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hotel Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    defaultValue={commissionRates.hotels?.default * 100}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Commission (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    defaultValue={commissionRates.vehicles?.default * 100}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowCommissionModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleCommissionUpdate({})}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Process Payout</h3>
                <button
                  onClick={() => setShowPayoutModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Service Provider</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Select provider...</option>
                    <option>John Doe (Guide)</option>
                    <option>Jane Smith (Hotel)</option>
                    <option>Mike Johnson (Vehicle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Amount (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Commission</option>
                    <option>Bonus</option>
                    <option>Refund</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add notes..."
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePayout({})}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Process Payout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialManagement;
