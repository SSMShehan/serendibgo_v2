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
import HotelSearch from './pages/hotels/HotelSearch'
import HotelDetails from './pages/hotels/HotelDetails'
import HotelBooking from './pages/hotels/HotelBooking'
import Payment from './pages/hotels/booking/Payment'
import BookingConfirmation from './pages/hotels/booking/BookingConfirmation'
import HotelReviews from './pages/hotels/reviews/HotelReviews'
import AdminDashboard from './pages/admin/dashboard/AdminDashboard'
import StaffManagement from './pages/admin/staff/StaffManagement'
import AnalyticsDashboard from './pages/admin/analytics/AnalyticsDashboard'
import NotificationManagement from './pages/notifications/NotificationManagement'
import EarningsDashboard from './pages/earnings/EarningsDashboard'
import PricingManagement from './pages/pricing/PricingManagement'
import HotelOwnerRegistration from './pages/hotels/HotelOwnerRegistration'
import HotelOwnerDashboard from './pages/hotels/HotelOwnerDashboard'
import ManageRooms from './pages/hotels/ManageRooms'
import ManageBookings from './pages/hotels/ManageBookings'
import RoomAvailabilityCalendar from './pages/hotels/RoomAvailabilityCalendar'
import EditHotel from './pages/hotels/EditHotel'
import Vehicles from './pages/Vehicles'
import MyBookings from './pages/MyBookings'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Booking from './pages/Booking'
import CustomTrip from './pages/CustomTrip'
import NotFound from './pages/NotFound'

// Staff Pages
import StaffDashboard from './pages/Staff/StaffDashboard'

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
                <Route path="hotels/:id" element={<HotelDetails />} />
                <Route path="hotels/:id/booking" element={<HotelBooking />} />
                <Route path="payment/:bookingId" element={<Payment />} />
                <Route path="booking-confirmation/:bookingId" element={<BookingConfirmation />} />
                <Route path="hotels/:id/reviews" element={<HotelReviews />} />
                
                {/* Admin Routes */}
                <Route path="admin/dashboard" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="admin/staff" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <StaffManagement />
                  </ProtectedRoute>
                } />
                <Route path="admin/analytics" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AnalyticsDashboard />
                  </ProtectedRoute>
                } />
                <Route path="admin/notifications" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <NotificationManagement />
                  </ProtectedRoute>
                } />
                <Route path="admin/hotels" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-sm border">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Hotel Management</h2>
                        <p className="text-gray-600">Hotel approval and management features coming soon...</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="admin/settings" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="bg-white p-8 rounded-lg shadow-sm border">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform Settings</h2>
                        <p className="text-gray-600">Platform configuration features coming soon...</p>
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="earnings" element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <EarningsDashboard />
                  </ProtectedRoute>
                } />
                <Route path="pricing" element={
                  <ProtectedRoute allowedRoles={['hotel_owner']}>
                    <PricingManagement />
                  </ProtectedRoute>
                } />
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
                
                
                {/* Staff Routes */}
                <Route path="staff" element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <StaffDashboard />
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
