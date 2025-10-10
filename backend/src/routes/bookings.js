const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getGuideBookings
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', createBooking);

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', getUserBookings);

// @route   GET /api/bookings/user
// @desc    Get all user bookings (both regular tours and custom trips)
// @access  Private
router.get('/user', getUserBookings);

// @route   GET /api/bookings/guide
// @desc    Get guide bookings
// @access  Private (Guide)
router.get('/guide', getGuideBookings);

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', getBookingById);

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', updateBookingStatus);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', cancelBooking);

module.exports = router;