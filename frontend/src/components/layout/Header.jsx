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
        return '/dashboard/hotel'
      case 'guide':
        return '/guide-dashboard'
      case 'driver':
        return '/dashboard/driver'
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg rounded-b-3xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300 tracking-tight">SerendibGo</span>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`relative px-6 py-3 font-medium text-gray-700 transition-all duration-300 rounded-2xl group overflow-hidden ${
                isActiveLink('/') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg transform scale-105' 
                  : 'hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5'
              }`}
            >
              <span className="relative z-10">Home</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isActiveLink('/') && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
            <Link 
              to="/tours" 
              className={`relative px-6 py-3 font-medium text-gray-700 transition-all duration-300 rounded-2xl group overflow-hidden ${
                isActiveLink('/tours') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg transform scale-105' 
                  : 'hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5'
              }`}
            >
              <span className="relative z-10">Tour</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isActiveLink('/tours') && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
            <Link 
              to="/guides" 
              className={`relative px-6 py-3 font-medium text-gray-700 transition-all duration-300 rounded-2xl group overflow-hidden ${
                isActiveLink('/guides') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg transform scale-105' 
                  : 'hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5'
              }`}
            >
              <span className="relative z-10">Guide</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isActiveLink('/guides') && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
            <Link 
              to="/hotels" 
              className={`relative px-6 py-3 font-medium text-gray-700 transition-all duration-300 rounded-2xl group overflow-hidden ${
                isActiveLink('/hotels') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg transform scale-105' 
                  : 'hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5'
              }`}
            >
              <span className="relative z-10">Hotel</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isActiveLink('/hotels') && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
            <Link 
              to="/vehicles" 
              className={`relative px-6 py-3 font-medium text-gray-700 transition-all duration-300 rounded-2xl group overflow-hidden ${
                isActiveLink('/vehicles') 
                  ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg transform scale-105' 
                  : 'hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5'
              }`}
            >
              <span className="relative z-10">Vehicle</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {isActiveLink('/vehicles') && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
            {isAuthenticated && (
              <Link 
                to="/my-bookings" 
                className={`relative px-6 py-3 font-medium text-gray-700 transition-all duration-300 rounded-2xl group overflow-hidden ${
                  isActiveLink('/my-bookings') 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg transform scale-105' 
                    : 'hover:text-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:shadow-xl hover:scale-105 hover:-translate-y-0.5'
                }`}
              >
                <span className="relative z-10">My Booking</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {isActiveLink('/my-bookings') && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            )}
          </nav>

          {/* Right Side - Auth & CTA */}
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button className="p-3 text-gray-600 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:scale-110">
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
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:scale-105 p-3"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden lg:block font-medium text-sm">{user?.firstName}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 py-3 z-50">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium px-5 py-3 rounded-2xl hover:bg-gray-50 hover:scale-105"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-cyan-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Book Now CTA Button */}
            <Link
              to="/tours"
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold hover:from-blue-700 hover:to-cyan-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Book Now
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-gray-600 hover:text-blue-600 transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:scale-110"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-6 bg-white/80 backdrop-blur-xl rounded-b-3xl">
            <div className="space-y-3">
              {/* Mobile Search */}
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tours..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white/80 transition-all duration-300 shadow-sm"
                  />
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link
                  to="/"
                  className={`block px-5 py-4 text-gray-700 font-medium transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:text-blue-600 hover:scale-105 ${
                    isActiveLink('/') ? 'bg-gray-100 text-blue-600' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/tours"
                  className={`block px-5 py-4 text-gray-700 font-medium transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:text-blue-600 hover:scale-105 ${
                    isActiveLink('/tours') ? 'bg-gray-100 text-blue-600' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tour
                </Link>
                <Link
                  to="/guides"
                  className={`block px-5 py-4 text-gray-700 font-medium transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:text-blue-600 hover:scale-105 ${
                    isActiveLink('/guides') ? 'bg-gray-100 text-blue-600' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Guide
                </Link>
                <Link
                  to="/hotels"
                  className={`block px-5 py-4 text-gray-700 font-medium transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:text-blue-600 hover:scale-105 ${
                    isActiveLink('/hotels') ? 'bg-gray-100 text-blue-600' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hotel
                </Link>
                <Link
                  to="/vehicles"
                  className={`block px-5 py-4 text-gray-700 font-medium transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:text-blue-600 hover:scale-105 ${
                    isActiveLink('/vehicles') ? 'bg-gray-100 text-blue-600' : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Vehicle
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/my-bookings"
                    className={`block px-5 py-4 text-gray-700 font-medium transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:text-blue-600 hover:scale-105 ${
                      isActiveLink('/my-bookings') ? 'bg-gray-100 text-blue-600' : ''
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Booking
                  </Link>
                )}
              </div>

              {/* Mobile Auth Links */}
              {!isAuthenticated && (
                <div className="pt-3 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-5 py-4 text-gray-700 font-medium transition-all duration-300 rounded-2xl hover:bg-gray-50 hover:text-blue-600 hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-5 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl text-center font-semibold hover:from-blue-700 hover:to-cyan-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Book Now Button */}
              <div className="pt-3 border-t border-gray-200">
                <Link
                  to="/tours"
                  className="block px-4 py-3 bg-slate-800 text-white rounded-lg text-center font-semibold hover:bg-slate-900 transition-colors duration-300 shadow-sm"
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