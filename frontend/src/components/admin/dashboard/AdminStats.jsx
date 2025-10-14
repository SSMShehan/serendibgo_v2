import React from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Star,
  MessageCircle,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminStats = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: stats?.totalUsers || 0,
      changeLabel: 'Registered users',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Hotels',
      value: stats?.totalHotels || 0,
      change: stats?.totalHotels || 0,
      changeLabel: 'Registered hotels',
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      change: stats?.totalBookings || 0,
      changeLabel: 'Total bookings',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Total Revenue',
      value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`,
      changeLabel: 'Platform revenue',
      icon: DollarSign,
      color: 'yellow'
    },
    {
      title: 'Active Staff',
      value: stats?.activeStaff || 0,
      change: stats?.activeStaff || 0,
      changeLabel: 'Active staff',
      icon: Users,
      color: 'indigo'
    },
    {
      title: 'Pending Approvals',
      value: stats?.pendingApprovals || 0,
      change: stats?.pendingApprovals || 0,
      changeLabel: 'Awaiting review',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      title: 'Hotel Owners',
      value: 2, // From our created accounts
      change: 2,
      changeLabel: 'Registered owners',
      icon: Building2,
      color: 'pink'
    },
    {
      title: 'Tourists',
      value: 2, // From our created accounts
      change: 2,
      changeLabel: 'Registered tourists',
      icon: Users,
      color: 'red'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      purple: 'text-purple-600 bg-purple-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      orange: 'text-orange-600 bg-orange-100',
      pink: 'text-pink-600 bg-pink-100',
      red: 'text-red-600 bg-red-100'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        const isPositive = stat.change >= 0;
        const colorClasses = getColorClasses(stat.color);
        
        return (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${colorClasses}`}>
                <IconComponent className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStats;
