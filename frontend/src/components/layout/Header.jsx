import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  Search,
  MapPin,
  Calendar
} from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, isAuthenticated, logout } = useAuth()
  const { unreadCount } = useNotification()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setIsProfileOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/tours?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const getDashboardLink = () => {
    if (!user) return '/dashboard'
    
    switch (user.role) {
      case 'admin':
        return '/admin'
      case 'hotel_owner':
        return '/hotel-owner/dashboard'
      case 'guide':
        return '/guide/dashboard'
      case 'driver':
        return '/driver/dashboard'
      case 'staff':
        return '/dashboard/staff'
      default:
        return '/dashboard'
    }
  }

  const isActiveLink = (path) => {
    return location.pathname === path
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">SerendibGo</span>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActiveLink('/') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/tours" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActiveLink('/tours') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Tours
            </Link>
            <Link 
              to="/guides" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActiveLink('/guides') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Guides
            </Link>
            <Link 
              to="/hotels" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActiveLink('/hotels') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Hotels
            </Link>
            <Link 
              to="/vehicles" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActiveLink('/vehicles') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Vehicles
            </Link>
            <Link 
              to="/custom-trip" 
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActiveLink('/custom-trip') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              Custom Trip
            </Link>
            {isAuthenticated && (
              <Link 
                to="/my-bookings" 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActiveLink('/my-bookings') 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-sm' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                My Bookings
              </Link>
            )}
          </nav>

          {/* Right Side - Auth & Actions */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-100 p-2"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden xl:block text-sm font-medium">{user?.firstName}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Book Now CTA Button */}
            <Link
              to="/custom-trip"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Book Now
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <div className="space-y-2">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tours..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="px-4 space-y-1">
                <Link
                  to="/"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActiveLink('/') 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/tours"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActiveLink('/tours') 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tours
                </Link>
                <Link
                  to="/guides"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActiveLink('/guides') 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Guides
                </Link>
                <Link
                  to="/hotels"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActiveLink('/hotels') 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hotels
                </Link>
                <Link
                  to="/vehicles"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActiveLink('/vehicles') 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vehicles
                </Link>
                <Link
                  to="/custom-trip"
                  className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActiveLink('/custom-trip') 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Custom Trip
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-bookings"
                    className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActiveLink('/my-bookings') 
                        ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                )}
              </div>

              {/* Mobile Auth Links */}
              {!isAuthenticated && (
                <div className="px-4 pt-3 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-center font-medium hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Book Now Button */}
              <div className="px-4 pt-3 border-t border-gray-200">
                <Link
                  to="/custom-trip"
                  className="block px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-center font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header