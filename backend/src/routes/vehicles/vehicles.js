const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getMyVehicles,
  getVehicle,
  addVehicle,
  registerVehicle,
  getDriverVehicles,
  getAllVehiclesForReview,
  updateVehicle,
  deleteVehicle,
  updateVehicleStatus,
  getVehicleAvailability,
  updateVehicleAvailability,
  getVehicleTypes,
  getVehicleAmenities
} = require('../../controllers/vehicles/vehicleController');
const { protect, authorize } = require('../../middleware/auth');
const { body } = require('express-validator');
const { handleValidationErrors } = require('../../middleware/errorHandler');

// Public routes
router.get('/', getVehicles);
router.get('/types', getVehicleTypes);
router.get('/amenities', getVehicleAmenities);
router.get('/:id', getVehicle);
router.get('/:id/availability', getVehicleAvailability);

// Protected routes (Driver)
router.post('/register', [
  protect,
  authorize('driver'),
  body('make').notEmpty().withMessage('Vehicle make is required'),
  body('model').notEmpty().withMessage('Vehicle model is required'),
  body('year').isInt({ min: 1990, max: new Date().getFullYear() + 1 }).withMessage('Invalid year').toInt(),
  body('licensePlate').notEmpty().withMessage('License plate is required'),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('seatingCapacity').isInt({ min: 1, max: 50 }).withMessage('Invalid seating capacity').toInt(),
  handleValidationErrors
], registerVehicle);

router.get('/driver/:driverId', [
  protect,
  authorize('driver', 'admin')
], getDriverVehicles);

// Protected routes (Vehicle Owner)
router.get('/my-vehicles', protect, authorize('vehicle_owner'), getMyVehicles);
router.post('/', [
  protect,
  authorize('vehicle_owner'),
  body('name').notEmpty().withMessage('Vehicle name is required'),
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('make').notEmpty().withMessage('Vehicle make is required'),
  body('model').notEmpty().withMessage('Vehicle model is required'),
  body('year').isInt({ min: 1990, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('licensePlate').notEmpty().withMessage('License plate is required'),
  body('capacity').isObject().withMessage('Capacity must be an object'),
  body('amenities').isObject().withMessage('Amenities must be an object'),
  body('pricing').isObject().withMessage('Pricing must be an object'),
  body('serviceAreas').isArray().withMessage('Service areas must be an array'),
  body('availability').isObject().withMessage('Availability must be an object'),
  handleValidationErrors
], addVehicle);

router.put('/:id', [
  protect,
  authorize('vehicle_owner'),
  handleValidationErrors
], updateVehicle);

router.delete('/:id', [
  protect,
  authorize('vehicle_owner')
], deleteVehicle);

router.put('/:id/availability', [
  protect,
  authorize('vehicle_owner'),
  handleValidationErrors
], updateVehicleAvailability);

// Admin/Staff routes
router.get('/admin/all', [
  protect,
  authorize('admin', 'staff')
], getAllVehiclesForReview);

// Admin routes
router.put('/:id/status', [
  protect,
  authorize('admin'),
  body('status').isIn(['pending', 'approved', 'active', 'suspended', 'rejected', 'maintenance']).withMessage('Invalid status'),
  handleValidationErrors
], updateVehicleStatus);

module.exports = router;
