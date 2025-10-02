import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Header from './Header'
import Footer from './Footer'
import Chatbot from '../chatbot/Chatbot'

const Layout = () => {
  const location = useLocation()
  const { user } = useAuth()
  
  // Hide header for guide dashboard and related pages
  const shouldHideHeader = user?.role === 'guide' && (
    location.pathname.startsWith('/guide/dashboard') ||
    location.pathname.startsWith('/guide-support') ||
    location.pathname.startsWith('/guide-notifications')
  )

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideHeader && <Header />}
      <main className={`flex-1 ${shouldHideHeader ? '' : 'pt-16'}`}>
        <Outlet />
      </main>
      {!shouldHideHeader && <Footer />}
      {!shouldHideHeader && <Chatbot />}
    </div>
  )
}

export default Layout
