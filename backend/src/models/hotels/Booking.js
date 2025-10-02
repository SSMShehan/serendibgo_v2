const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Booking Reference
  bookingReference: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  
  // Guest Information
  guest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Guest information is required']
  },
  
  // Hotel and Room Information
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, 'Hotel information is required']
  },
  
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room information is required']
  },
  
  // Booking Dates
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  
  // Guest Details
  guestDetails: {
    firstName: {
      type: String,
      required: [true, 'Guest first name is required'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Guest last name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Guest email is required'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Guest phone is required']
    },
    nationality: String,
    passportNumber: String,
    dateOfBirth: Date,
    specialRequests: String,
    dietaryRequirements: String,
    accessibilityNeeds: String
  },
  
  // Occupancy
  occupancy: {
    adults: {
      type: Number,
      required: [true, 'Number of adults is required'],
      min: [1, 'Minimum 1 adult required'],
      max: [10, 'Maximum 10 adults allowed']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children count cannot be negative'],
      max: [8, 'Maximum 8 children allowed']
    },
    infants: {
      type: Number,
      default: 0,
      min: [0, 'Infant count cannot be negative'],
      max: [4, 'Maximum 4 infants allowed']
    }
  },
  
  // Pricing Information
  pricing: {
    roomPrice: {
      type: Number,
      required: [true, 'Room price is required'],
      min: [0, 'Room price cannot be negative']
    },
    taxes: {
      type: Number,
      default: 0,
      min: [0, 'Taxes cannot be negative']
    },
    serviceCharge: {
      type: Number,
      default: 0,
      min: [0, 'Service charge cannot be negative']
    },
    additionalFees: {
      type: Number,
      default: 0,
      min: [0, 'Additional fees cannot be negative']
    },
    discounts: {
      type: Number,
      default: 0,
      min: [0, 'Discounts cannot be negative']
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative']
    },
    currency: {
      type: String,
      default: 'LKR',
      enum: ['LKR', 'USD', 'EUR', 'GBP']
    },
    exchangeRate: {
      type: Number,
      default: 1
    }
  },
  
  // Payment Information
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'cash', 'mobile_payment']
    },
    transactionId: String,
    paymentDate: Date,
    refundAmount: {
      type: Number,
      default: 0
    },
    refundDate: Date,
    refundReason: String
  },
  
  // Booking Status
  status: {
    type: String,
    enum: [
      'confirmed', 'pending', 'cancelled', 'no_show', 'completed', 
      'modified', 'refunded', 'disputed'
    ],
    default: 'pending'
  },
  
  // Booking Source
  source: {
    type: String,
    enum: ['website', 'mobile_app', 'phone', 'walk_in', 'travel_agent', 'ota'],
    default: 'website'
  },
  
  // Special Requirements
  specialRequirements: {
    earlyCheckIn: {
      type: Boolean,
      default: false
    },
    lateCheckOut: {
      type: Boolean,
      default: false
    },
    airportPickup: {
      type: Boolean,
      default: false
    },
    airportDropoff: {
      type: Boolean,
      default: false
    },
    extraBed: {
      type: Boolean,
      default: false
    },
    crib: {
      type: Boolean,
      default: false
    },
    wheelchairAccess: {
      type: Boolean,
      default: false
    }
  },
  
  // Communication
  communication: {
    confirmationSent: {
      type: Boolean,
      default: false
    },
    confirmationDate: Date,
    reminderSent: {
      type: Boolean,
      default: false
    },
    reminderDate: Date,
    followUpSent: {
      type: Boolean,
      default: false
    },
    followUpDate: Date
  },
  
  // Check-in/Check-out Information
  checkInInfo: {
    actualCheckIn: Date,
    checkInStaff: String,
    roomNumber: String,
    keyCardIssued: {
      type: Boolean,
      default: false
    },
    welcomePackGiven: {
      type: Boolean,
      default: false
    },
    orientationCompleted: {
      type: Boolean,
      default: false
    }
  },
  
  checkOutInfo: {
    actualCheckOut: Date,
    checkOutStaff: String,
    keyCardReturned: {
      type: Boolean,
      default: false
    },
    finalBillSettled: {
      type: Boolean,
      default: false
    },
    feedbackCollected: {
      type: Boolean,
      default: false
    }
  },
  
  // Cancellation Information
  cancellation: {
    cancelledBy: {
      type: String,
      enum: ['guest', 'hotel', 'system', 'admin']
    },
    cancellationDate: Date,
    cancellationReason: String,
    refundAmount: Number,
    refundProcessed: {
      type: Boolean,
      default: false
    },
    refundDate: Date
  },
  
  // Notes and Comments
  notes: {
    guest: String,
    hotel: String,
    internal: String
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better performance
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ guest: 1 });
bookingSchema.index({ hotel: 1 });
bookingSchema.index({ room: 1 });
bookingSchema.index({ checkIn: 1 });
bookingSchema.index({ checkOut: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ createdAt: -1 });

// Virtual for number of nights
bookingSchema.virtual('nights').get(function() {
  return Math.ceil((this.checkOut - this.checkIn) / (1000 * 60 * 60 * 24));
});

// Virtual for booking status display
bookingSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'confirmed': 'Confirmed',
    'pending': 'Pending',
    'cancelled': 'Cancelled',
    'no_show': 'No Show',
    'completed': 'Completed',
    'modified': 'Modified',
    'refunded': 'Refunded',
    'disputed': 'Disputed'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for payment status display
bookingSchema.virtual('paymentStatusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'paid': 'Paid',
    'failed': 'Failed',
    'refunded': 'Refunded',
    'partially_refunded': 'Partially Refunded'
  };
  return statusMap[this.payment.status] || this.payment.status;
});

// Method to generate booking reference
bookingSchema.statics.generateBookingReference = function() {
  const prefix = 'SG';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const checkInDate = new Date(this.checkIn);
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);
  
  // Can cancel if more than 24 hours before check-in
  return hoursUntilCheckIn > 24 && this.status === 'confirmed';
};

// Method to calculate cancellation fee
bookingSchema.methods.calculateCancellationFee = function() {
  const now = new Date();
  const checkInDate = new Date(this.checkIn);
  const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);
  
  if (hoursUntilCheckIn > 48) {
    return 0; // Free cancellation
  } else if (hoursUntilCheckIn > 24) {
    return this.pricing.totalAmount * 0.25; // 25% fee
  } else if (hoursUntilCheckIn > 0) {
    return this.pricing.totalAmount * 0.5; // 50% fee
  } else {
    return this.pricing.totalAmount; // No refund
  }
};

// Method to check if booking is active
bookingSchema.methods.isActive = function() {
  const now = new Date();
  return this.status === 'confirmed' && 
         this.checkIn <= now && 
         this.checkOut > now;
};

// Method to check if booking is upcoming
bookingSchema.methods.isUpcoming = function() {
  const now = new Date();
  return this.status === 'confirmed' && this.checkIn > now;
};

// Method to check if booking is completed
bookingSchema.methods.isCompleted = function() {
  const now = new Date();
  return this.status === 'completed' || 
         (this.status === 'confirmed' && this.checkOut <= now);
};

// Pre-save middleware
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Generate booking reference if not exists
  if (!this.bookingReference) {
    this.bookingReference = this.constructor.generateBookingReference();
  }
  
  // Calculate total amount if not set
  if (!this.pricing.totalAmount) {
    this.pricing.totalAmount = this.pricing.roomPrice + 
                              this.pricing.taxes + 
                              this.pricing.serviceCharge + 
                              this.pricing.additionalFees - 
                              this.pricing.discounts;
  }
  
  next();
});

// Post-save middleware
bookingSchema.post('save', function(doc) {
  // Update room availability
  // This would trigger a function to update room availability
  // Implementation would depend on your availability management system
});

module.exports = mongoose.model('Booking', bookingSchema);
