import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TourProvider } from './context/TourContext'
import { NotificationProvider } from './context/NotificationContext'

// Layout Components
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

// Pages
import Home from './pages/Home'
import Tours from './pages/Tours'
import TourDetails from './pages/TourDetails'
import Guides from './pages/Guides'
import GuideDetail from './pages/Guide/GuideDetail'
import GuideDashboard from './pages/Guide/GuideDashboard'
import GuideSupport from './pages/Guide/GuideSupport'
import GuideNotifications from './pages/Guide/GuideNotifications'
import Hotels from './pages/Hotels'
import Vehicles from './pages/Vehicles'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Booking from './pages/Booking'
import Payment from './pages/Payment'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminTours from './pages/admin/AdminTours'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'

function App() {
  return (
    <AuthProvider>
      <TourProvider>
        <NotificationProvider>
          <div className="min-h-screen bg-base-100" data-theme="serendibgo">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes with Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="tours" element={<Tours />} />
                <Route path="tours/:id" element={<TourDetails />} />
                <Route path="guides" element={<Guides />} />
                <Route path="guides/:id" element={<GuideDetail />} />
                <Route path="guide-dashboard" element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideDashboard />
                  </ProtectedRoute>
                } />
                <Route path="guide-support" element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideSupport />
                  </ProtectedRoute>
                } />
                <Route path="guide-notifications" element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideNotifications />
                  </ProtectedRoute>
                } />
                <Route path="hotels" element={<Hotels />} />
                <Route path="vehicles" element={<Vehicles />} />
                
                {/* User Dashboard */}
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                {/* Profile */}
                <Route path="profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                {/* My Bookings */}
                <Route path="my-bookings" element={
                  <ProtectedRoute>
                    <MyBookings />
                  </ProtectedRoute>
                } />
                
                {/* Booking Flow */}
                <Route path="booking/:tourId" element={
                  <ProtectedRoute>
                    <Booking />
                  </ProtectedRoute>
                } />
                
                <Route path="payment/:bookingId" element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="admin/tours" element={
                  <ProtectedRoute allowedRoles={['admin', 'guide']}>
                    <AdminTours />
                  </ProtectedRoute>
                } />
                
                <Route path="admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                
                <Route path="admin/bookings" element={
                  <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <AdminBookings />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </NotificationProvider>
      </TourProvider>
    </AuthProvider>
  )
}

export default App
