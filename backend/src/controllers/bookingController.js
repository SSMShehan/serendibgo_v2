const Booking = require('../models/Booking');
const CustomTrip = require('../models/CustomTrip');
const Tour = require('../models/Tour');
const User = require('../models/User');

// @desc    Get all user bookings (both regular tours and custom trips)
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    console.log('=== GET USER BOOKINGS ===');
    console.log('User ID:', req.user?._id);
    console.log('User email:', req.user?.email);
    
    const { status, type, page = 1, limit = 10 } = req.query;

    // Build query for regular bookings
    const bookingQuery = { user: req.user._id };
    if (status) {
      bookingQuery.status = status;
    }

    // Get regular tour bookings
    const regularBookings = await Booking.find(bookingQuery)
      .populate('tour', 'title description images duration price location')
      .populate('guide', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get custom trip bookings
    const customTripQuery = { customer: req.user._id };
    if (status) {
      customTripQuery.status = status;
    }

    const customTrips = await CustomTrip.find(customTripQuery)
      .populate('staffAssignment.assignedGuide', 'firstName lastName email phone')
      .populate('staffAssignment.hotelBookings.hotel', 'name location.city starRating amenities')
      .populate('staffAssignment.assignedVehicles.vehicleId', 'type model capacity')
      .populate('staffAssignment.assignedVehicles.driver', 'firstName lastName phone')
      .populate('approvalDetails.approvedBy', 'firstName lastName')
      .populate('booking', 'status paymentStatus')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    console.log('Found custom trips:', customTrips.length);
    console.log('Custom trip query:', customTripQuery);
    
    // Debug: Log populated data for first custom trip
    if (customTrips.length > 0) {
      console.log('=== FIRST CUSTOM TRIP POPULATED DATA ===');
      console.log('Trip ID:', customTrips[0]._id);
      console.log('Staff Assignment:', customTrips[0].staffAssignment);
      console.log('Hotel Bookings:', customTrips[0].staffAssignment?.hotelBookings);
      console.log('Assigned Vehicles:', customTrips[0].staffAssignment?.assignedVehicles);
      if (customTrips[0].staffAssignment?.hotelBookings?.length > 0) {
        console.log('First Hotel Booking:', customTrips[0].staffAssignment.hotelBookings[0]);
        console.log('Hotel Data:', customTrips[0].staffAssignment.hotelBookings[0].hotel);
      }
      if (customTrips[0].staffAssignment?.assignedVehicles?.length > 0) {
        console.log('First Vehicle:', customTrips[0].staffAssignment.assignedVehicles[0]);
        console.log('Vehicle Data:', customTrips[0].staffAssignment.assignedVehicles[0].vehicleId);
      }
    }
    
    // Debug: Check all custom trips in database
    const allCustomTrips = await CustomTrip.find({}).populate('customer', 'email firstName lastName');
    console.log('=== ALL CUSTOM TRIPS IN DATABASE ===');
    allCustomTrips.forEach((trip, index) => {
      console.log(`Trip ${index + 1}:`, {
        id: trip._id,
        customer: trip.customer?.email || 'No customer',
        customerId: trip.customer?._id || 'No customer ID',
        status: trip.status,
        destination: trip.requestDetails?.destination
      });
    });

    // Transform data to unified format
    const allBookings = [];

    // Add regular tour bookings
    regularBookings.forEach(booking => {
      allBookings.push({
        id: booking._id,
        type: 'tour',
        title: booking.tour?.title || 'Tour Booking',
        description: booking.tour?.description || '',
        images: booking.tour?.images || [],
        startDate: booking.startDate,
        endDate: booking.endDate,
        duration: booking.duration,
        groupSize: booking.groupSize,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        guide: booking.guide,
        location: booking.tour?.location?.name || 'Sri Lanka',
        specialRequests: booking.specialRequests,
        createdAt: booking.createdAt,
        bookingDate: booking.bookingDate
      });
    });

    // Add custom trip bookings
    customTrips.forEach(trip => {
      allBookings.push({
        id: trip._id,
        type: 'custom',
        title: `Custom Trip to ${trip.requestDetails.destination}`,
        description: `Personalized ${trip.requestDetails.destination} adventure`,
        images: [], // Custom trips don't have predefined images
        startDate: trip.requestDetails.startDate,
        endDate: trip.requestDetails.endDate,
        duration: 'multi-day',
        groupSize: trip.requestDetails.groupSize,
        totalAmount: trip.staffAssignment?.totalBudget?.totalAmount || trip.requestDetails.budget,
        status: trip.status,
        paymentStatus: trip.paymentStatus,
        guide: trip.staffAssignment?.assignedGuide,
        location: trip.requestDetails.destination,
        specialRequests: trip.requestDetails.specialRequests,
        createdAt: trip.createdAt,
        bookingDate: trip.createdAt,
        hotels: trip.staffAssignment?.hotelBookings || [],
        // Include the complete trip data for detailed view
        requestDetails: trip.requestDetails,
        staffAssignment: trip.staffAssignment,
        approvalDetails: trip.approvalDetails,
        customTripDetails: {
          interests: trip.requestDetails.interests,
          accommodation: trip.requestDetails.accommodation,
          transport: trip.requestDetails.transport,
          activities: trip.requestDetails.activities
        }
      });
    });

    // Sort all bookings by creation date
    allBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply type filter if specified
    const filteredBookings = type ? allBookings.filter(booking => booking.type === type) : allBookings;

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        bookings: paginatedBookings,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredBookings.length / limit),
          total: filteredBookings.length,
          limit: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// @desc    Get single booking by ID (supports both regular and custom trips)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find regular booking first
    let booking = await Booking.findById(id)
      .populate('tour', 'title description images duration price location itinerary')
      .populate('guide', 'firstName lastName email phone profile.pricePerDay profile.specialties')
      .populate('user', 'firstName lastName email phone');

    if (booking) {
      // Check if user owns this booking
      if (booking.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      return res.json({
        success: true,
        data: {
          id: booking._id,
          type: 'tour',
          title: booking.tour?.title || 'Tour Booking',
          description: booking.tour?.description || '',
          images: booking.tour?.images || [],
          startDate: booking.startDate,
          endDate: booking.endDate,
          duration: booking.duration,
          groupSize: booking.groupSize,
          totalAmount: booking.totalAmount,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          guide: booking.guide,
          location: booking.tour?.location?.name || 'Sri Lanka',
          specialRequests: booking.specialRequests,
          createdAt: booking.createdAt,
          bookingDate: booking.bookingDate,
          tour: booking.tour
        }
      });
    }

    // Try to find custom trip
    const customTrip = await CustomTrip.findById(id)
      .populate('staffAssignment.assignedGuide', 'firstName lastName email phone profile.pricePerDay profile.specialties')
      .populate('staffAssignment.hotelBookings.hotel', 'name location starRating amenities')
      .populate('customer', 'firstName lastName email phone');

    if (customTrip) {
      // Check if user owns this custom trip
      if (customTrip.customer._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      return res.json({
        success: true,
        data: {
          id: customTrip._id,
          type: 'custom',
          title: `Custom Trip to ${customTrip.requestDetails.destination}`,
          description: `Personalized ${customTrip.requestDetails.destination} adventure`,
          images: [],
          startDate: customTrip.requestDetails.startDate,
          endDate: customTrip.requestDetails.endDate,
          duration: 'multi-day',
          groupSize: customTrip.requestDetails.groupSize,
          totalAmount: customTrip.staffAssignment?.totalBudget?.totalAmount || customTrip.requestDetails.budget,
          status: customTrip.status,
          paymentStatus: customTrip.paymentStatus,
          guide: customTrip.staffAssignment?.assignedGuide,
          location: customTrip.requestDetails.destination,
          specialRequests: customTrip.requestDetails.specialRequests,
          createdAt: customTrip.createdAt,
          bookingDate: customTrip.createdAt,
          hotels: customTrip.staffAssignment?.hotelBookings || [],
          customTripDetails: {
            interests: customTrip.requestDetails.interests,
            accommodation: customTrip.requestDetails.accommodation,
            transport: customTrip.requestDetails.transport,
            activities: customTrip.requestDetails.activities,
            dietaryRequirements: customTrip.requestDetails.dietaryRequirements,
            accessibility: customTrip.requestDetails.accessibility
          },
          staffAssignment: customTrip.staffAssignment,
          itinerary: customTrip.staffAssignment?.itinerary || []
        }
      });
    }

    // Booking not found
    res.status(404).json({
      success: false,
      message: 'Booking not found'
    });

  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// @desc    Cancel a booking (supports both regular and custom trips)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;

    // Try to find regular booking first
    let booking = await Booking.findById(id);

    if (booking) {
      // Check if user owns this booking
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Check if booking can be cancelled
      if (['cancelled', 'completed'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: 'Booking cannot be cancelled in current status'
        });
      }

      // Update booking status
      booking.status = 'cancelled';
      booking.cancellationReason = cancellationReason;
      booking.paymentStatus = 'refunded';
      booking.refundAmount = booking.totalAmount;

      await booking.save();

      return res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
      });
    }

    // Try to find custom trip
    const customTrip = await CustomTrip.findById(id);

    if (customTrip) {
      // Check if user owns this custom trip
      if (customTrip.customer.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }

      // Check if custom trip can be cancelled
      if (['cancelled', 'completed'].includes(customTrip.status)) {
        return res.status(400).json({
          success: false,
          message: 'Custom trip cannot be cancelled in current status'
        });
      }

      // Update custom trip status
      customTrip.status = 'cancelled';
      customTrip.paymentStatus = 'refunded';

      await customTrip.save();

      // If there's a linked booking, cancel it too
      if (customTrip.booking) {
        const linkedBooking = await Booking.findById(customTrip.booking);
        if (linkedBooking) {
          linkedBooking.status = 'cancelled';
          linkedBooking.cancellationReason = cancellationReason;
          linkedBooking.paymentStatus = 'refunded';
          linkedBooking.refundAmount = linkedBooking.totalAmount;
          await linkedBooking.save();
        }
      }

      return res.json({
        success: true,
        message: 'Custom trip cancelled successfully',
        data: customTrip
      });
    }

    // Booking not found
    res.status(404).json({
      success: false,
      message: 'Booking not found'
    });

  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
};

module.exports = {
  getUserBookings,
  getBookingById,
  cancelBooking
};
