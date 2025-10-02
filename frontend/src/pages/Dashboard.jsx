import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    // Redirect users to their appropriate dashboards
    if (user?.role === 'hotel_owner') {
      navigate('/hotel-owner/dashboard', { replace: true })
    } else if (user?.role === 'admin') {
      navigate('/admin', { replace: true })
    } else if (user?.role === 'guide') {
      navigate('/guide/dashboard', { replace: true })
    } else if (user?.role === 'driver') {
      navigate('/driver/dashboard', { replace: true })
    }
  }, [user, navigate])
  
  // Show loading or redirect message for non-tourist users
  if (user?.role !== 'tourist') {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-base-content/70">Redirecting to your dashboard...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-xl text-base-content/70">
            This is your tourist dashboard
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
