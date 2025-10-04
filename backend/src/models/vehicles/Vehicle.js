const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Vehicle name is required'],
    trim: true,
    maxlength: [100, 'Vehicle name cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Vehicle Owner Reference
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vehicle owner is required']
  },
  
  // Vehicle Type (Sri Lankan specific)
  vehicleType: {
    type: String,
    required: [true, 'Vehicle type is required'],
    enum: [
      'Car', 'Van', 'Tuk-tuk', 'Bus', 'Minibus', 'SUV', 'Motorcycle',
      'Bicycle', 'Boat', 'Train', 'Airplane', 'Helicopter'
    ]
  },
  
  // Vehicle Details
  make: {
    type: String,
    required: [true, 'Vehicle make is required'],
    trim: true
  },
  
  model: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  
  year: {
    type: Number,
    required: [true, 'Vehicle year is required'],
    min: [1990, 'Vehicle year must be 1990 or later'],
    max: [new Date().getFullYear() + 1, 'Vehicle year cannot be in the future']
  },
  
  color: {
    type: String,
    trim: true
  },
  
  licensePlate: {
    type: String,
    required: [true, 'License plate is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  
  // Capacity Details
  capacity: {
    passengers: {
      type: Number,
      required: [true, 'Passenger capacity is required'],
      min: [1, 'Minimum passenger capacity is 1'],
      max: [50, 'Maximum passenger capacity is 50']
    },
    luggage: {
      type: Number,
      default: 0,
      min: [0, 'Luggage capacity cannot be negative'],
      max: [20, 'Maximum luggage capacity is 20']
    },
    wheelchairAccessible: {
      type: Boolean,
      default: false
    }
  },
  
  // Vehicle Amenities
  amenities: {
    airConditioning: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    childSeats: { type: Boolean, default: false },
    musicSystem: { type: Boolean, default: false },
    chargingPorts: { type: Boolean, default: false },
    waterBottles: { type: Boolean, default: false },
    firstAidKit: { type: Boolean, default: false },
    fireExtinguisher: { type: Boolean, default: false },
    gpsNavigation: { type: Boolean, default: false },
    englishSpeakingDriver: { type: Boolean, default: false },
    localGuide: { type: Boolean, default: false },
    cameraEquipment: { type: Boolean, default: false },
    umbrella: { type: Boolean, default: false },
    coolerBox: { type: Boolean, default: false },
    phoneCharger: { type: Boolean, default: false }
  },
  
  // Images
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      enum: ['exterior', 'interior', 'engine', 'dashboard', 'seats', 'trunk', 'other']
    },
    order: {
      type: Number,
      default: 0
    }
  }],
  
  // Documents
  documents: {
    insurance: {
      policyNumber: String,
      expiryDate: Date,
      documentUrl: String
    },
    registration: {
      registrationNumber: String,
      expiryDate: Date,
      documentUrl: String
    },
    fitnessCertificate: {
      certificateNumber: String,
      expiryDate: Date,
      documentUrl: String
    },
    driverLicense: {
      licenseNumber: String,
      expiryDate: Date,
      documentUrl: String
    }
  },
  
  // Pricing
  pricing: {
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'LKR',
      enum: ['LKR', 'USD', 'EUR', 'GBP']
    },
    perKmRate: {
      type: Number,
      default: 0,
      min: [0, 'Per km rate cannot be negative']
    },
    hourlyRate: {
      type: Number,
      default: 0,
      min: [0, 'Hourly rate cannot be negative']
    },
    dailyRate: {
      type: Number,
      default: 0,
      min: [0, 'Daily rate cannot be negative']
    },
    seasonalRates: [{
      name: {
        type: String,
        required: true
      },
      startDate: {
        type: Date,
        required: true
      },
      endDate: {
        type: Date,
        required: true
      },
      priceMultiplier: {
        type: Number,
        default: 1,
        min: [0.1, 'Minimum price multiplier is 0.1'],
        max: [5, 'Maximum price multiplier is 5']
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }]
  },
  
  // Location & Service Areas
  serviceAreas: [{
    city: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    radius: {
      type: Number,
      default: 50, // km
      min: [1, 'Minimum radius is 1 km'],
      max: [500, 'Maximum radius is 500 km']
    }
  }],
  
  // Availability
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    workingHours: {
      start: {
        type: String,
        default: '06:00'
      },
      end: {
        type: String,
        default: '22:00'
      }
    },
    workingDays: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    minimumBookingNotice: {
      type: Number,
      default: 2, // hours
      min: [0, 'Minimum booking notice cannot be negative']
    }
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'active', 'suspended', 'rejected', 'maintenance'],
    default: 'pending'
  },
  
  // Rejection/Approval Details
  approvalDetails: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    rejectionReason: String,
    rejectionNotes: String,
    adminNotes: String
  },
  
  // Ratings
  ratings: {
    overall: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    cleanliness: { type: Number, default: 0, min: 0, max: 5 },
    comfort: { type: Number, default: 0, min: 0, max: 5 },
    driver: { type: Number, default: 0, min: 0, max: 5 },
    value: { type: Number, default: 0, min: 0, max: 5 }
  },
  
  reviewCount: {
    type: Number,
    default: 0
  },
  
  // Statistics
  stats: {
    totalTrips: {
      type: Number,
      default: 0
    },
    totalEarnings: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    lastTripDate: Date
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
vehicleSchema.index({ owner: 1 });
vehicleSchema.index({ vehicleType: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ 'pricing.basePrice': 1 });
vehicleSchema.index({ 'ratings.overall': -1 });
vehicleSchema.index({ licensePlate: 1 });

// Virtual for current price (considering seasonal rates)
vehicleSchema.virtual('currentPrice').get(function() {
  const now = new Date();
  const seasonalRate = this.pricing.seasonalRates.find(rate => 
    rate.isActive && 
    now >= rate.startDate && 
    now <= rate.endDate
  );
  
  if (seasonalRate) {
    return this.pricing.basePrice * seasonalRate.priceMultiplier;
  }
  
  return this.pricing.basePrice;
});

// Virtual for primary image
vehicleSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images.length > 0 ? this.images[0].url : null);
});

// Method to check if vehicle is available for booking
vehicleSchema.methods.isAvailableForBooking = function(startDate, endDate) {
  if (!this.availability.isAvailable || this.status !== 'active') {
    return false;
  }
  
  // Check if dates are within working hours and days
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Additional availability logic can be added here
  return true;
};

// Method to calculate price for trip
vehicleSchema.methods.calculateTripPrice = function(distance, duration, startDate, endDate) {
  let totalPrice = 0;
  
  // Base price
  totalPrice += this.currentPrice;
  
  // Distance-based pricing
  if (this.pricing.perKmRate > 0 && distance > 0) {
    totalPrice += distance * this.pricing.perKmRate;
  }
  
  // Time-based pricing
  if (this.pricing.hourlyRate > 0 && duration > 0) {
    totalPrice += duration * this.pricing.hourlyRate;
  }
  
  return totalPrice;
};

// Pre-save middleware
vehicleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Ensure only one primary image
  if (this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      this.images.forEach((img, index) => {
        if (index > 0) img.isPrimary = false;
      });
    }
  }
  
  next();
});

module.exports = mongoose.model('Vehicle', vehicleSchema);
