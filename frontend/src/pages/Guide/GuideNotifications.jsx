import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  User,
  DollarSign,
  MessageSquare,
  Star,
  Filter,
  Check,
  Trash2,
  Eye,
  EyeOff,
  Home,
  Briefcase,
  DollarSign as DollarSignIcon,
  BarChart3,
  Headphones,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const GuideNotifications = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all')
  const [showRead, setShowRead] = useState(true)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  // Mock notifications data
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'booking',
        title: 'New Booking Request',
        message: 'John Smith wants to book your Colombo City Tour for tomorrow',
        timestamp: '2 hours ago',
        isRead: false,
        priority: 'high',
        action: 'View Booking'
      },
      {
        id: 2,
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of LKR 15,000 received for Sigiriya Tour completed yesterday',
        timestamp: '4 hours ago',
        isRead: false,
        priority: 'medium',
        action: 'View Details'
      },
      {
        id: 3,
        type: 'review',
        title: 'New Review',
        message: 'Sarah Johnson left a 5-star review for your Kandy Temple Tour',
        timestamp: '1 day ago',
        isRead: true,
        priority: 'low',
        action: 'View Review'
      },
      {
        id: 4,
        type: 'message',
        title: 'New Message',
        message: 'Tourist Mike Wilson sent you a message about availability',
        timestamp: '2 days ago',
        isRead: true,
        priority: 'medium',
        action: 'Reply'
      },
      {
        id: 5,
        type: 'system',
        title: 'Profile Update Required',
        message: 'Please update your guide license information for verification',
        timestamp: '3 days ago',
        isRead: false,
        priority: 'high',
        action: 'Update Profile'
      },
      {
        id: 6,
        type: 'booking',
        title: 'Booking Cancelled',
        message: 'Emma Davis cancelled her booking for Galle Fort Tour',
        timestamp: '4 days ago',
        isRead: true,
        priority: 'medium',
        action: 'View Details'
      }
    ]
    setNotifications(mockNotifications)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking':
        return Calendar
      case 'payment':
        return DollarSign
      case 'review':
        return Star
      case 'message':
        return MessageSquare
      case 'system':
        return Info
      default:
        return Bell
    }
  }

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') return 'text-red-600 bg-red-50 border-red-200'
    if (priority === 'medium') return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-blue-600 bg-blue-50 border-blue-200'
  }

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.isRead
    return notification.type === filter
  })

  const visibleNotifications = showRead 
    ? filteredNotifications 
    : filteredNotifications.filter(notification => !notification.isRead)

  const unreadCount = notifications.filter(n => !n.isRead).length

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'pricing', label: 'Pricing', icon: DollarSignIcon },
    { id: 'availability', label: 'Availability', icon: Calendar },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Support', icon: Headphones }
  ]

  const handleTabClick = (tabId) => {
    if (tabId === 'overview') {
      navigate('/guide-dashboard')
    } else if (tabId === 'support') {
      navigate('/guide-support')
    } else if (tabId === 'profile') {
      navigate('/guide-dashboard', { state: { activeTab: 'profile' } })
    } else if (tabId === 'services') {
      navigate('/guide-dashboard', { state: { activeTab: 'services' } })
    } else if (tabId === 'pricing') {
      navigate('/guide-dashboard', { state: { activeTab: 'pricing' } })
    } else if (tabId === 'availability') {
      navigate('/guide-dashboard', { state: { activeTab: 'availability' } })
    } else if (tabId === 'stats') {
      navigate('/guide-dashboard', { state: { activeTab: 'stats' } })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Bell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                <p className="text-slate-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowRead(!showRead)}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                {showRead ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {showRead ? 'Hide Read' : 'Show Read'}
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </button>
              )}
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{user?.firstName}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigate('/guide-dashboard', { state: { activeTab: 'profile' } })
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate('/guide-support')
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Headphones className="h-4 w-4 mr-3" />
                      Support
                    </button>
                    <button
                      onClick={() => {
                        navigate('/guide-dashboard')
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Home className="h-4 w-4 mr-3" />
                      Dashboard
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                        tab.id === 'notifications'
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Filter Notifications</h2>
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'unread', label: 'Unread', count: unreadCount },
              { id: 'booking', label: 'Bookings', count: notifications.filter(n => n.type === 'booking').length },
              { id: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
              { id: 'review', label: 'Reviews', count: notifications.filter(n => n.type === 'review').length },
              { id: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
              { id: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
                  filter === filterOption.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {visibleNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Notifications</h3>
              <p className="text-slate-500">
                {filter === 'all' 
                  ? "You're all caught up! No notifications at the moment."
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          ) : (
            visibleNotifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type)
              const colorClass = getNotificationColor(notification.type, notification.priority)
              
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl shadow-lg border border-slate-100 p-6 transition-all duration-200 hover:shadow-xl ${
                    !notification.isRead ? 'ring-2 ring-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${colorClass}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`text-lg font-semibold ${
                          !notification.isRead ? 'text-slate-900' : 'text-slate-600'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-500">{notification.timestamp}</span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-slate-600 mb-4 ${
                        !notification.isRead ? 'font-medium' : ''
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-semibold text-sm">
                          {notification.action}
                        </button>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.isRead && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-slate-400 hover:text-green-600 transition-colors"
                              title="Mark as read"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Notification Settings */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Email Notifications</h3>
                <p className="text-sm text-slate-600">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">Push Notifications</h3>
                <p className="text-sm text-slate-600">Receive push notifications in browser</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-slate-900">SMS Notifications</h3>
                <p className="text-sm text-slate-600">Receive urgent notifications via SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideNotifications
