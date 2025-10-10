const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { handleValidationErrors, asyncHandler } = require('../middleware/errorHandler');

// Import controllers
const { getDashboardStats, getPlatformAnalytics } = require('../controllers/admin/adminController');
const {
  getStaff,
  getStaffStats,
  getStaffMember,
  createStaff,
  updateStaff,
  deleteStaff,
  toggleStaffStatus
} = require('../controllers/admin/staffController');
const {
  getRecentUsers,
  getUnverifiedUsers,
  getRecentBookings,
  getRecentHotels,
  getPendingHotels
} = require('../controllers/admin/dashboardController');

// Import vehicle admin controller
const {
  getAdminVehicles,
  getVehicleStats,
  getPendingVehicles,
  bulkUpdateVehicleStatus,
  getVehicleHistory,
  exportVehicles
} = require('../controllers/admin/vehicleController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard/stats', asyncHandler(getDashboardStats));
router.get('/analytics', asyncHandler(getPlatformAnalytics));

// Staff management routes
router.get('/staff', asyncHandler(getStaff));
router.get('/staff/stats', asyncHandler(getStaffStats));
router.get('/staff/:id', asyncHandler(getStaffMember));

router.post('/staff', [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number')
], handleValidationErrors, asyncHandler(createStaff));

router.put('/staff/:id', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .matches(/^[0-9+\-\s()]+$/)
    .withMessage('Please provide a valid phone number')
], handleValidationErrors, asyncHandler(updateStaff));

router.delete('/staff/:id', asyncHandler(deleteStaff));
router.patch('/staff/:id/toggle-status', asyncHandler(toggleStaffStatus));

// Dashboard data routes
router.get('/users/recent', asyncHandler(getRecentUsers));
router.get('/users/unverified', asyncHandler(getUnverifiedUsers));
router.get('/bookings/recent', asyncHandler(getRecentBookings));
router.get('/hotels/recent', asyncHandler(getRecentHotels));
router.get('/hotels/pending', asyncHandler(getPendingHotels));

// Vehicle management routes
router.get('/vehicles', asyncHandler(getAdminVehicles));
router.get('/vehicles/stats', asyncHandler(getVehicleStats));
router.get('/vehicles/pending', asyncHandler(getPendingVehicles));
router.put('/vehicles/bulk-status', [
  body('vehicleIds').isArray().withMessage('Vehicle IDs must be an array'),
  body('status').isIn(['pending', 'approved', 'active', 'suspended', 'rejected', 'maintenance'])
    .withMessage('Invalid status'),
  handleValidationErrors
], asyncHandler(bulkUpdateVehicleStatus));
router.get('/vehicles/:id/history', asyncHandler(getVehicleHistory));
router.get('/vehicles/export', asyncHandler(exportVehicles));

module.exports = router;

