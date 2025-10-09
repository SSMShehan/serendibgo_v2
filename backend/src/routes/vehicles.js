const express = require('express');
const router = express.Router();
const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getVehiclesByDriver,
  checkVehicleAvailability,
  getVehiclesNearLocation
} = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllVehicles);
router.get('/:id', getVehicleById);
router.post('/:id/check-availability', checkVehicleAvailability);
router.get('/near/:lat/:lng', getVehiclesNearLocation);

// Protected routes
router.use(protect);

// Driver/Staff/Admin routes
router.post('/', authorize('driver', 'staff', 'admin'), createVehicle);
router.put('/:id', authorize('driver', 'staff', 'admin'), updateVehicle);
router.delete('/:id', authorize('driver', 'staff', 'admin'), deleteVehicle);
router.get('/driver/:driverId', getVehiclesByDriver);

module.exports = router;
