const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../../middleware/auth');
const { handleValidationErrors, asyncHandler } = require('../../middleware/errorHandler');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getMyHotels,
  searchHotelsByLocation,
  getHotelStats,
  approveHotel,
  getPendingHotels
} = require('../../controllers/hotels/hotelController');

const router = express.Router();

// @desc    Get all hotels with filtering
// @route   GET /api/hotels
// @access  Public
router.get('/', asyncHandler(getHotels));

// @desc    Search hotels by location
// @route   GET /api/hotels/search/location
// @access  Public
router.get('/search/location', asyncHandler(searchHotelsByLocation));

// @desc    Get pending hotels for approval
// @route   GET /api/hotels/pending
// @access  Private (Admin)
router.get('/pending', protect, authorize('admin'), asyncHandler(getPendingHotels));

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
router.get('/:id', asyncHandler(getHotel));

// @desc    Get hotel statistics
// @route   GET /api/hotels/:id/stats
// @access  Private (Hotel Owner/Admin)
router.get('/:id/stats', protect, asyncHandler(getHotelStats));

// @desc    Get hotels by owner
// @route   GET /api/hotels/owner/my-hotels
// @access  Private (Hotel Owner)
router.get('/owner/my-hotels', protect, authorize('hotel_owner'), asyncHandler(getMyHotels));

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private (Hotel Owner)
router.post('/', [
  protect,
  authorize('hotel_owner'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Hotel name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Hotel name must be between 2 and 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Hotel description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Hotel description must be between 10 and 2000 characters'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('location.city')
    .notEmpty()
    .withMessage('City is required'),
  body('location.district')
    .notEmpty()
    .withMessage('District is required'),
  body('location.coordinates.latitude')
    .isFloat({ min: 5.9, max: 9.8 })
    .withMessage('Invalid latitude for Sri Lanka'),
  body('location.coordinates.longitude')
    .isFloat({ min: 79.7, max: 81.9 })
    .withMessage('Invalid longitude for Sri Lanka'),
  body('contact.phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number'),
  body('contact.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('category')
    .notEmpty()
    .withMessage('Hotel category is required'),
  body('starRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Star rating must be between 1 and 5'),
  handleValidationErrors
], asyncHandler(createHotel));

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private (Hotel Owner)
router.put('/:id', [
  protect,
  authorize('hotel_owner'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Hotel name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Hotel description must be between 10 and 2000 characters'),
  body('starRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Star rating must be between 1 and 5'),
  handleValidationErrors
], asyncHandler(updateHotel));

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private (Hotel Owner/Admin)
router.delete('/:id', protect, asyncHandler(deleteHotel));

// @desc    Approve/Reject hotel
// @route   PUT /api/hotels/:id/approve
// @access  Private (Admin)
router.put('/:id/approve', [
  protect,
  authorize('admin'),
  body('status')
    .isIn(['approved', 'rejected'])
    .withMessage('Status must be either approved or rejected'),
  body('rejectionReason')
    .if(body('status').equals('rejected'))
    .notEmpty()
    .withMessage('Rejection reason is required when rejecting a hotel'),
  handleValidationErrors
], asyncHandler(approveHotel));

module.exports = router;
