const express = require('express');
const router = express.Router();
const {
<<<<<<< HEAD
  getUserBookings,
  getBookingById,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);
=======
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
>>>>>>> c9204dac1330c27c888267c357011c6607dc4779

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