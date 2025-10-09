const express = require('express');
const router = express.Router();
const {
  getUserBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// @desc    Get all user bookings (both regular tours and custom trips)
// @route   GET /api/bookings/user
// @access  Private
router.get('/user', getUserBookings);

// @desc    Get single booking by ID (supports both regular and custom trips)
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', getBookingById);

// @desc    Cancel a booking (supports both regular and custom trips)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
router.put('/:id/cancel', cancelBooking);

module.exports = router;