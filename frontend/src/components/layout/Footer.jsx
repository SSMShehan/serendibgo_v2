import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">SerendibGo</span>
            </div>
            <p className="text-sm text-base-content/70">
              Your gateway to amazing Sri Lankan adventures. Discover, book, and experience the beauty of Sri Lanka with our comprehensive travel platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-base-content/60 hover:text-primary transition-colors duration-200">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tours" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  All Tours
                </Link>
              </li>
              <li>
                <Link to="/tours?category=adventure" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  Adventure Tours
                </Link>
              </li>
              <li>
                <Link to="/tours?category=cultural" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  Cultural Tours
                </Link>
              </li>
              <li>
                <Link to="/tours?category=nature" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  Nature Tours
                </Link>
              </li>
              <li>
                <Link to="/tours?category=beach" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  Beach Tours
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-base-content/70 hover:text-primary transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm text-base-content/70">
                  123 Colombo Street<br />
                  Colombo 03, Sri Lanka
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-sm text-base-content/70">
                  +94 11 234 5678
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm text-base-content/70">
                  info@serendibgo.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-base-300 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-base-content/60">
              © 2024 SerendibGo. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-sm text-base-content/60 hover:text-primary transition-colors duration-200">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-base-content/60 hover:text-primary transition-colors duration-200">
                Privacy
              </Link>
              <Link to="/cookies" className="text-sm text-base-content/60 hover:text-primary transition-colors duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
