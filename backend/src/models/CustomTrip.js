const mongoose = require('mongoose');

const customTripSchema = new mongoose.Schema({
  // Customer Information
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  customerPhone: {
    type: String
  },

  // Trip Details
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  duration: {
    type: Number, // in days
    min: 1
  },
  groupSize: {
    type: Number,
    required: true,
    min: 1
  },
  budget: {
    type: Number,
    min: 0
  },

  // Preferences
  interests: [{
    type: String
  }],
  activities: [{
    type: String
  }],
  accommodation: {
    type: String,
    enum: ['budget', 'mid-range', 'luxury', 'resort', 'homestay']
  },
  transport: [{
    type: String,
    enum: ['bus', 'private-car', 'train', 'flight', 'boat', 'bike']
  }],

  // Special Requirements
  specialRequests: {
    type: String
  },
  dietaryRequirements: {
    type: String
  },
  accessibility: {
    type: String
  },
  emergencyContact: {
    type: String
  },

  // Status and Response
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'in_progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  staffResponse: {
    message: {
      type: String
    },
    estimatedPrice: {
      type: Number
    },
    suggestedDates: [{
      type: Date
    }],
    alternativeOptions: [{
      type: String
    }],
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: {
      type: Date
    }
  },

  // Additional Information
  notes: {
    type: String
  },
  tags: [{
    type: String
  }],

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

// Indexes for better query performance
customTripSchema.index({ status: 1 });
customTripSchema.index({ priority: 1 });
customTripSchema.index({ createdAt: -1 });
customTripSchema.index({ customer: 1 });
customTripSchema.index({ destination: 'text', specialRequests: 'text' });

// Pre-save middleware to update updatedAt
customTripSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for trip duration calculation
customTripSchema.virtual('calculatedDuration').get(function() {
  if (this.startDate && this.endDate) {
    const diffTime = Math.abs(this.endDate - this.startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return this.duration;
});

// Virtual for budget per person
customTripSchema.virtual('budgetPerPerson').get(function() {
  if (this.budget && this.groupSize) {
    return this.budget / this.groupSize;
  }
  return 0;
});

// Method to check if trip is overdue
customTripSchema.methods.isOverdue = function() {
  if (this.status === 'pending' && this.startDate) {
    return new Date() > this.startDate;
  }
  return false;
};

// Method to get trip summary
customTripSchema.methods.getSummary = function() {
  return {
    id: this._id,
    destination: this.destination,
    customer: this.customerName,
    status: this.status,
    priority: this.priority,
    budget: this.budget,
    groupSize: this.groupSize,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('CustomTrip', customTripSchema);
