// Staff Platform Configuration & Settings Routes
const express = require('express');
const router = express.Router();
const { 
  getPlatformSettings,
  updatePlatformSettings,
  getStaffProfile,
  updateStaffProfile,
  changeStaffPassword,
  getSystemLogs,
  getSystemHealth,
  createSystemBackup
} = require('../../controllers/staff/settingsController');
const { staffAuth, requirePermission } = require('../../middleware/staffAuth');

// Apply staff authentication middleware to all routes
router.use(staffAuth);

// Platform settings routes
router.get('/platform', getPlatformSettings);
router.put('/platform', updatePlatformSettings);

// Staff profile routes
router.get('/profile', getStaffProfile);
router.put('/profile', updateStaffProfile);
router.put('/password', changeStaffPassword);

// System management routes
router.get('/logs', getSystemLogs);
router.get('/health', getSystemHealth);
router.post('/backup', createSystemBackup);

module.exports = router;
