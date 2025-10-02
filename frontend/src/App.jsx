import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { TourProvider } from './context/TourContext'
import { HotelProvider } from './context/hotels/HotelContext'
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
import GuideSettings from './pages/Guide/GuideSettings'
import GuideSchedule from './pages/Guide/GuideSchedule'
import GuideReviews from './pages/Guide/GuideReviews'
import GuideProfile from './pages/Guide/GuideProfile'
import GuideEarnings from './pages/Guide/GuideEarnings'
import GuideAnalytics from './pages/Guide/GuideAnalytics'
import Hotels from './pages/Hotels'
import Vehicles from './pages/Vehicles'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Booking from './pages/Booking'
import Payment from './pages/Payment'
import CustomTrip from './pages/CustomTrip'
import NotFound from './pages/NotFound'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminTours from './pages/admin/AdminTours'
import AdminUsers from './pages/admin/AdminUsers'
import AdminBookings from './pages/admin/AdminBookings'

// Hotel Pages
import HotelSearch from './pages/hotels/HotelSearch'
import HotelOwnerRegistration from './pages/hotels/HotelOwnerRegistration'
import HotelOwnerDashboard from './pages/hotels/HotelOwnerDashboard'
import ManageRooms from './pages/hotels/ManageRooms'
import ManageBookings from './pages/hotels/ManageBookings'
import RoomAvailabilityCalendar from './pages/hotels/RoomAvailabilityCalendar'
import EditHotel from './pages/hotels/EditHotel'

function App() {
  return (
    <AuthProvider>
      <TourProvider>
        <HotelProvider>
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
                <Route path="guide/dashboard" element={
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
                <Route path="guide/settings" element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideSettings />
                  </ProtectedRoute>
                } />
                <Route path="guide/schedule" element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideSchedule />
                  </ProtectedRoute>
                } />
                <Route path="guide/reviews" element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideReviews />
                  </ProtectedRoute>
                } />
                <Route path="guide/profile" element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideProfile />
                  </ProtectedRoute>
                } />
                <Route path="guide/earnings" element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideEarnings />
                  </ProtectedRoute>
                } />
                <Route path="guide/analytics" element={
                  <ProtectedRoute allowedRoles={['guide']}>
                    <GuideAnalytics />
                  </ProtectedRoute>
                } />
                <Route path="hotels" element={<HotelSearch />} />
                <Route path="hotels/:id" element={<HotelSearch />} />
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
                
                {/* Custom Trip */}
                <Route path="custom-trip" element={<CustomTrip />} />
                
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
                
                {/* Hotel Owner Routes */}
                <Route path="hotel-owner/register" element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <HotelOwnerRegistration />
                  </ProtectedRoute>
                } />
                
                <Route path="hotel-owner/dashboard" element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <HotelOwnerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="hotel-owner/hotels/:hotelId/rooms" element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <ManageRooms />
                  </ProtectedRoute>
                } />
                
                <Route path="hotel-owner/hotels/:hotelId/bookings" element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <ManageBookings />
                  </ProtectedRoute>
                } />
                
                <Route path="hotel-owner/rooms/:roomId/availability" element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <RoomAvailabilityCalendar />
                  </ProtectedRoute>
                } />
                
                <Route path="hotel-owner/hotels/:hotelId/edit" element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <EditHotel />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          </NotificationProvider>
        </HotelProvider>
      </TourProvider>
    </AuthProvider>
  )
}

export default App
