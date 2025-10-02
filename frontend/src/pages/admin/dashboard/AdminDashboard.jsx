import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  FileText,
  Settings
} from 'lucide-react';
import AdminStats from '../../../components/admin/dashboard/AdminStats';
import staffService from '../../../services/admin/staffService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin dashboard stats
      const statsResponse = await staffService.getDashboardStats();
      setStats(statsResponse.data);
      
      // Fetch recent activity from real data
      await fetchRecentActivity();
      
      // Fetch pending approvals from real data
      await fetchPendingApprovals();
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent users
      const recentUsersResponse = await staffService.getRecentUsers({ limit: 5 });
      const recentUsers = recentUsersResponse.data.users || [];
      
      // Fetch recent bookings
      const recentBookingsResponse = await staffService.getRecentBookings({ limit: 5 });
      const recentBookings = recentBookingsResponse.data.bookings || [];
      
      // Fetch recent hotels
      const recentHotelsResponse = await staffService.getRecentHotels({ limit: 5 });
      const recentHotels = recentHotelsResponse.data.hotels || [];
      
      // Combine and format recent activity
      const activities = [
        ...recentUsers.map(user => ({
          id: `user_${user._id}`,
          type: 'user_registration',
          message: `New ${user.role} "${user.firstName} ${user.lastName}" registered`,
          timestamp: user.createdAt,
          status: user.isVerified ? 'completed' : 'pending'
        })),
        ...recentBookings.map(booking => ({
          id: `booking_${booking._id}`,
          type: 'booking_created',
          message: `New booking #${booking.bookingNumber} created`,
          timestamp: booking.createdAt,
          status: booking.status
        })),
        ...recentHotels.map(hotel => ({
          id: `hotel_${hotel._id}`,
          type: 'hotel_registration',
          message: `New hotel "${hotel.name}" submitted for approval`,
          timestamp: hotel.createdAt,
          status: hotel.status
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
      
      setRecentActivity(activities);
      
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      setRecentActivity([]);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      // Fetch pending hotels
      const pendingHotelsResponse = await staffService.getPendingHotels({ limit: 10 });
      const pendingHotels = pendingHotelsResponse.data.hotels || [];
      
      // Fetch unverified users
      const unverifiedUsersResponse = await staffService.getUnverifiedUsers({ limit: 10 });
      const unverifiedUsers = unverifiedUsersResponse.data.users || [];
      
      // Combine pending approvals
      const approvals = [
        ...pendingHotels.map(hotel => ({
          id: `hotel_${hotel._id}`,
          type: 'hotel',
          title: hotel.name,
          submittedBy: hotel.owner?.firstName ? `${hotel.owner.firstName} ${hotel.owner.lastName}` : 'Unknown',
          submittedAt: hotel.createdAt,
          priority: hotel.owner?.profile?.hotelLicense ? 'high' : 'medium'
        })),
        ...unverifiedUsers.map(user => ({
          id: `user_${user._id}`,
          type: 'user',
          title: `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Verification`,
          submittedBy: `${user.firstName} ${user.lastName}`,
          submittedAt: user.createdAt,
          priority: 'medium'
        }))
      ].sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)).slice(0, 10);
      
      setPendingApprovals(approvals);
      
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      setPendingApprovals([]);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      user_registration: Users,
      booking_created: Calendar,
      hotel_registration: Building2,
      hotel_approval: Building2,
      staff_created: Users,
      booking_issue: AlertCircle,
      review_flagged: AlertCircle
    };
    return icons[type] || Activity;
  };

  const getActivityColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      completed: 'text-green-600 bg-green-100',
      failed: 'text-red-600 bg-red-100'
    };
    return colors[status] || colors.pending;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };
    return colors[priority] || colors.medium;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} days ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Overview of your platform operations</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </button>
              <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <AdminStats stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const IconComponent = getActivityIcon(activity.type);
                  const colorClasses = getActivityColor(activity.status);
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`p-2 rounded-full ${colorClasses}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClasses}`}>
                        {activity.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {pendingApprovals.length} pending
                </span>
              </div>
              
              <div className="space-y-4">
                {pendingApprovals.map((approval) => {
                  const priorityClasses = getPriorityColor(approval.priority);
                  
                  return (
                    <div key={approval.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">{approval.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">
                            Submitted by {approval.submittedBy}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(approval.submittedAt)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${priorityClasses}`}>
                          {approval.priority}
                        </span>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button className="flex-1 text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                          Approve
                        </button>
                        <button className="flex-1 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate('/admin/staff')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Manage Staff</p>
                  <p className="text-xs text-gray-600">Add or edit staff members</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/admin/hotels')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Building2 className="w-6 h-6 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Hotel Approvals</p>
                  <p className="text-xs text-gray-600">Review pending hotels</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/admin/analytics')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-6 h-6 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Analytics</p>
                  <p className="text-xs text-gray-600">View platform analytics</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/admin/settings')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-600 mr-3" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Settings</p>
                  <p className="text-xs text-gray-600">Configure platform</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
