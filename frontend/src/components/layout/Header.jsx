import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Menu,
  X,
  User
} from 'lucide-react'

const Header = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path) => {
    return location.pathname === path
  }

  const isHomePage = location.pathname === '/'
  const navClassName = "bg-white/50 backdrop-blur-sm absolute top-0 left-0 right-0 z-50"
  
  const textColor = 'text-[#272C2F]'
  const hoverColor = 'hover:text-[#E59B2C]'

  return (
    <>
      {/* Main Navigation */}
      <nav className={navClassName}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Left Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className={`font-semibold transition-colors ${
                  isActive('/') ? textColor : `${textColor} ${hoverColor}`
                }`}
              >
                HOME
              </Link>
              <Link 
                to="/tours" 
                className={`font-semibold transition-colors ${
                  isActive('/tours') ? textColor : `${textColor} ${hoverColor}`
                }`}
              >
                TOURS
              </Link>
              <Link 
                to="/guides" 
                className={`font-semibold transition-colors ${
                  isActive('/guides') ? textColor : `${textColor} ${hoverColor}`
                }`}
              >
                GUIDES
              </Link>
              <Link 
                to="/hotels" 
                className={`font-semibold transition-colors ${
                  isActive('/hotels') ? textColor : `${textColor} ${hoverColor}`
                }`}
              >
                HOTELS
              </Link>
            </div>

            {/* Center Brand Name */}
            <div className="text-center">
              <span className={`font-bold text-3xl drop-shadow-lg ${textColor}`} style={{ fontFamily: 'Georgia, serif' }}>SERENDIB</span>
              <span className="font-bold text-3xl ml-2 drop-shadow-lg text-[#E59B2C]" style={{ fontFamily: 'Georgia, serif' }}>GO</span>
            </div>

            {/* Right Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/vehicles" 
                className={`font-semibold transition-colors ${
                  isActive('/vehicles') ? textColor : `${textColor} ${hoverColor}`
                }`}
              >
                VEHICLES
              </Link>
              <Link 
                to="/custom-trip" 
                className={`font-semibold transition-colors ${
                  isActive('/custom-trip') ? textColor : `${textColor} ${hoverColor}`
                }`}
              >
                CUSTOM TRIP
              </Link>
              <Link 
                to="/my-bookings" 
                className={`font-semibold transition-colors ${
                  isActive('/my-bookings') ? textColor : `${textColor} ${hoverColor}`
                }`}
              >
                MY BOOKINGS
              </Link>
              <div className="flex items-center space-x-2">
                <User className={`w-5 h-5 ${textColor}`} />
                <span className={`${textColor} font-semibold`}>John Doe</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden p-2 ${textColor}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/50 backdrop-blur-sm border-t border-gray-200 py-4 rounded-b-lg">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`font-semibold transition-colors px-4 ${
                    isActive('/') ? textColor : `${textColor} ${hoverColor}`
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link 
                  to="/tours" 
                  className={`font-semibold transition-colors px-4 ${
                    isActive('/tours') ? textColor : `${textColor} ${hoverColor}`
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  TOURS
                </Link>
                <Link 
                  to="/guides" 
                  className={`font-semibold transition-colors px-4 ${
                    isActive('/guides') ? textColor : `${textColor} ${hoverColor}`
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  GUIDES
                </Link>
                <Link 
                  to="/hotels" 
                  className={`font-semibold transition-colors px-4 ${
                    isActive('/hotels') ? textColor : `${textColor} ${hoverColor}`
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  HOTELS
                </Link>
                <Link 
                  to="/vehicles" 
                  className={`font-semibold transition-colors px-4 ${
                    isActive('/vehicles') ? textColor : `${textColor} ${hoverColor}`
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  VEHICLES
                </Link>
                <Link 
                  to="/custom-trip" 
                  className={`font-semibold transition-colors px-4 ${
                    isActive('/custom-trip') ? textColor : `${textColor} ${hoverColor}`
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  CUSTOM TRIP
                </Link>
                <Link 
                  to="/my-bookings" 
                  className={`font-semibold transition-colors px-4 ${
                    isActive('/my-bookings') ? textColor : `${textColor} ${hoverColor}`
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  MY BOOKINGS
                </Link>
                <div className="flex items-center space-x-2 px-4">
                  <User className={`w-5 h-5 ${textColor}`} />
                  <span className={`${textColor} font-semibold`}>John Doe</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Header