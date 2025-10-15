const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPaymentIntent,
  confirmPayment,
  handleWebhook,
  getPaymentStatus,
  processRefund
} = require('../controllers/paymentController');

// Webhook endpoint (no auth required - Stripe webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes
router.post('/create-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmPayment);
router.get('/status/:bookingId', protect, getPaymentStatus);
router.post('/refund/:bookingId', protect, processRefund);

module.exports = router;

