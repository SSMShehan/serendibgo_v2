import React from 'react'
import { useAuth } from '../../context/AuthContext'
import { 
  Users, 
  Calendar, 
  Car, 
  Hotel, 
  TrendingUp, 
  Settings,
  Shield,
  Activity
} from 'lucide-react'

const AdminDashboard = () => {
  const { user } = useAuth()

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Active Bookings',
      value: '89',
      change: '+5%',
      icon: Calendar,
      color: 'text-green-600'
    },
    {
      title: 'Vehicles',
      value: '156',
      change: '+8%',
      icon: Car,
      color: 'text-purple-600'
    },
    {
      title: 'Hotels',
      value: '45',
      change: '+3%',
      icon: Hotel,
      color: 'text-orange-600'
    }
  ]

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500'
    },
    {
      title: 'Manage Bookings',
      description: 'Review and approve bookings',
      icon: Calendar,
      href: '/admin/bookings',
      color: 'bg-green-500'
    },
    {
      title: 'Vehicle Management',
      description: 'Approve and manage vehicles',
      icon: Car,
      href: '/admin/vehicles',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'View platform analytics',
      icon: TrendingUp,
      href: '/admin/analytics',
      color: 'bg-orange-500'
    },
    {
      title: 'Staff Management',
      description: 'Manage staff accounts',
      icon: Shield,
      href: '/admin/staff',
      color: 'bg-red-500'
    },
    {
      title: 'Settings',
      description: 'Platform configuration',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ]

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Admin Dashboard
          </h1>
          <p className="text-xl text-base-content/70">
            Welcome back, {user?.firstName}! Manage your SerendibGo platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-base-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-base-content/70">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-base-content">
                      {stat.value}
                    </p>
                    <p className="text-sm text-green-600">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-full bg-base-300`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-base-content mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <a
                  key={index}
                  href={action.href}
                  className="bg-base-200 rounded-lg p-6 hover:bg-base-300 transition-colors duration-200 group"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full ${action.color} mr-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-base-content group-hover:text-primary">
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-base-content/70">
                    {action.description}
                  </p>
                </a>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-base-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Activity className="w-5 h-5 text-base-content mr-2" />
            <h2 className="text-xl font-bold text-base-content">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-base-300">
              <div>
                <p className="font-medium text-base-content">New user registration</p>
                <p className="text-sm text-base-content/70">John Doe registered as a guide</p>
              </div>
              <span className="text-sm text-base-content/70">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-base-300">
              <div>
                <p className="font-medium text-base-content">Vehicle approval</p>
                <p className="text-sm text-base-content/70">Toyota Camry approved for driver Sarah</p>
              </div>
              <span className="text-sm text-base-content/70">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-base-content">Booking completed</p>
                <p className="text-sm text-base-content/70">Hotel booking #12345 completed</p>
              </div>
              <span className="text-sm text-base-content/70">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
