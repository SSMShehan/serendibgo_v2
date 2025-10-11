// Staff Vehicle Management Routes
const express = require('express');
const router = express.Router();
const { 
  getVehicles,
  getVehicleStatistics,
  deleteVehicle,
  bulkVehicleAction,
  updateVehicleStatus
} = require('../../controllers/staff/vehicleController');
const { staffAuth, requirePermission } = require('../../middleware/staffAuth');

// Apply staff authentication middleware to all routes
router.use(staffAuth);

// Vehicle routes
router.get('/', getVehicles);
router.get('/statistics', getVehicleStatistics);
router.put('/:id/status', updateVehicleStatus);
router.delete('/:id', deleteVehicle);
router.post('/bulk-action', bulkVehicleAction);

module.exports = router;
