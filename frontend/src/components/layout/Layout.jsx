import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Header from './Header'
import Footer from './Footer'
import Chatbot from '../chatbot/Chatbot'

const Layout = () => {
  const location = useLocation()
  const { user } = useAuth()
  
  // Hide header for guide dashboard, staff dashboard, admin dashboard and related pages
  const shouldHideHeader = (
    (user?.role === 'guide' && (
      location.pathname.startsWith('/guide/dashboard') ||
      location.pathname.startsWith('/guide-support') ||
      location.pathname.startsWith('/guide-notifications')
    )) ||
    (user?.role === 'staff' && location.pathname.startsWith('/staff')) ||
    (user?.role === 'admin' && (
      location.pathname.startsWith('/staff') ||
      location.pathname.startsWith('/admin')
    ))
  )

  // Add top padding for all pages except homepage to prevent overlap with absolute header
  const isHomePage = location.pathname === '/'
  const mainClassName = isHomePage ? 'flex-1' : 'flex-1 pt-20'

  // Glassmorphism background for non-homepage pages
  const getBackgroundImage = () => {
    if (isHomePage) return null
    
    // Use specific image for hotels page
    if (location.pathname === '/hotels') {
      return '/glassmorphism-bg-5.jpg'
    }
    
    const backgrounds = [
      '/glassmorphism-bg-1.jpg',
      '/glassmorphism-bg-2.jpg', 
      '/glassmorphism-bg-3.jpg',
      '/glassmorphism-bg-4.jpg'
    ]
    
    // Use pathname to determine which background to use
    const pathHash = location.pathname.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    
    return backgrounds[Math.abs(pathHash) % backgrounds.length]
  }

  const backgroundImage = getBackgroundImage()

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideHeader && <Header />}
      <main className={mainClassName} style={backgroundImage ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}>
        {backgroundImage && <div className="glass-overlay"></div>}
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
      {!shouldHideHeader && <Footer />}
      {!shouldHideHeader && <Chatbot />}
    </div>
  )
}

export default Layout
