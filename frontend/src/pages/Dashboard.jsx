import React from 'react'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Welcome, {user?.firstName}!
          </h1>
          <p className="text-xl text-base-content/70">
            This is your {user?.role} dashboard
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
