// Staff Platform Configuration & Settings Controller
const { asyncHandler } = require('../../middleware/errorHandler');
const User = require('../../models/User');
const { staffAuth, requirePermission, logActivity } = require('../../middleware/staffAuth');

// @desc    Get platform settings
// @route   GET /api/staff/settings/platform
// @access  Private (Staff)
const getPlatformSettings = asyncHandler(async (req, res) => {
  try {
    // Mock platform settings (in production, these would come from a settings table)
    const settings = {
      // General Settings
      general: {
        platformName: 'SerendibGo',
        platformDescription: 'Sri Lanka\'s premier travel platform',
        platformLogo: '/images/logo.png',
        platformFavicon: '/images/favicon.ico',
        defaultLanguage: 'en',
        supportedLanguages: ['en', 'si', 'ta'],
        timezone: 'Asia/Colombo',
        currency: 'LKR',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h'
      },
      
      // Business Settings
      business: {
        companyName: 'SerendibGo Pvt Ltd',
        companyAddress: '123 Main Street, Colombo 01, Sri Lanka',
        companyPhone: '+94 11 234 5678',
        companyEmail: 'info@serendibgo.com',
        companyWebsite: 'https://serendibgo.com',
        businessRegistration: 'PV123456789',
        taxId: 'TAX123456789',
        vatNumber: 'VAT123456789'
      },
      
      // Commission Settings
      commission: {
        platformCommission: 0.15, // 15%
        guideCommission: 0.70, // 70%
        hotelCommission: 0.75, // 75%
        vehicleCommission: 0.80, // 80%
        minimumCommission: 0.10, // 10%
        maximumCommission: 0.25 // 25%
      },
      
      // Payment Settings
      payment: {
        defaultPaymentMethod: 'card',
        supportedPaymentMethods: ['card', 'bank_transfer', 'cash'],
        paymentGateway: 'stripe',
        stripePublicKey: 'pk_test_...',
        stripeSecretKey: 'sk_test_...',
        paymentTimeout: 15, // minutes
        refundPolicy: '7 days',
        autoRefundEnabled: false
      },
      
      // Notification Settings
      notifications: {
        emailNotifications: true,
        smsNotifications: true,
        pushNotifications: true,
        emailProvider: 'sendgrid',
        smsProvider: 'twilio',
        notificationTemplates: {
          bookingConfirmation: true,
          paymentConfirmation: true,
          bookingReminder: true,
          cancellationNotice: true,
          reviewRequest: true
        }
      },
      
      // Security Settings
      security: {
        passwordMinLength: 8,
        passwordRequireSpecial: true,
        passwordRequireNumbers: true,
        passwordRequireUppercase: true,
        sessionTimeout: 30, // minutes
        maxLoginAttempts: 5,
        lockoutDuration: 15, // minutes
        twoFactorAuth: false,
        sslRequired: true,
        corsOrigins: ['https://serendibgo.com', 'https://www.serendibgo.com']
      },
      
      // Content Settings
      content: {
        maxImageSize: 5, // MB
        allowedImageTypes: ['jpg', 'jpeg', 'png', 'webp'],
        maxVideoSize: 50, // MB
        allowedVideoTypes: ['mp4', 'mov', 'avi'],
        contentModeration: true,
        autoApproveContent: false,
        maxDescriptionLength: 1000,
        maxTitleLength: 100
      },
      
      // Feature Flags
      features: {
        enableReviews: true,
        enableRatings: true,
        enableChat: true,
        enableVideoCalls: false,
        enableLiveTracking: true,
        enableMultiLanguage: true,
        enableDarkMode: true,
        enableOfflineMode: false,
        enableAdvancedSearch: true,
        enableRecommendations: true
      }
    };
    
    res.status(200).json({
      success: true,
      data: settings
    });
    
  } catch (error) {
    console.error('Get platform settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching platform settings'
    });
  }
});

// @desc    Update platform settings
// @route   PUT /api/staff/settings/platform
// @access  Private (Staff - Admin only)
const updatePlatformSettings = asyncHandler(async (req, res) => {
  try {
    const { category, settings } = req.body;
    const staffId = req.user._id;
    
    // Validate settings based on category
    const validateSettings = (category, settings) => {
      switch (category) {
        case 'general':
          if (settings.platformName && settings.platformName.length < 3) {
            throw new Error('Platform name must be at least 3 characters');
          }
          break;
        case 'commission':
          if (settings.platformCommission && (settings.platformCommission < 0 || settings.platformCommission > 1)) {
            throw new Error('Commission must be between 0 and 1');
          }
          break;
        case 'security':
          if (settings.passwordMinLength && settings.passwordMinLength < 6) {
            throw new Error('Password minimum length must be at least 6');
          }
          break;
        default:
          break;
      }
    };
    
    validateSettings(category, settings);
    
    // In production, save to database
    console.log(`Staff ${staffId} updated ${category} settings`);
    
    res.status(200).json({
      success: true,
      message: `${category} settings updated successfully`,
      data: settings
    });
    
  } catch (error) {
    console.error('Update platform settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error updating platform settings'
    });
  }
});

// @desc    Get staff profile
// @route   GET /api/staff/settings/profile
// @access  Private (Staff)
const getStaffProfile = asyncHandler(async (req, res) => {
  try {
    const staffId = req.user._id;
    
    const staff = await User.findById(staffId).select('-password');
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: staff
    });
    
  } catch (error) {
    console.error('Get staff profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching staff profile'
    });
  }
});

// @desc    Update staff profile
// @route   PUT /api/staff/settings/profile
// @access  Private (Staff)
const updateStaffProfile = asyncHandler(async (req, res) => {
  try {
    const staffId = req.user._id;
    const { firstName, lastName, email, phone, profile } = req.body;
    
    // Validate input
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Update staff profile
    const updatedStaff = await User.findByIdAndUpdate(
      staffId,
      { 
        firstName, 
        lastName, 
        email, 
        phone, 
        profile: { ...profile }
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedStaff
    });
    
  } catch (error) {
    console.error('Update staff profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating staff profile'
    });
  }
});

// @desc    Change staff password
// @route   PUT /api/staff/settings/password
// @access  Private (Staff)
const changeStaffPassword = asyncHandler(async (req, res) => {
  try {
    const staffId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters'
      });
    }
    
    // Get staff member
    const staff = await User.findById(staffId);
    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await staff.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    staff.password = newPassword;
    await staff.save();
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change staff password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
});

// @desc    Get system logs
// @route   GET /api/staff/settings/logs
// @access  Private (Staff - Admin only)
const getSystemLogs = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 50, level, search } = req.query;
    
    // Mock system logs (in production, these would come from a logging system)
    const mockLogs = [
      {
        _id: '1',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        level: 'info',
        message: 'User login successful',
        userId: 'user1',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        details: { action: 'login', success: true }
      },
      {
        _id: '2',
        timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        level: 'warning',
        message: 'High memory usage detected',
        userId: null,
        ip: '127.0.0.1',
        userAgent: 'System',
        details: { memoryUsage: '85%', threshold: '80%' }
      },
      {
        _id: '3',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        level: 'error',
        message: 'Payment processing failed',
        userId: 'user2',
        ip: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        details: { error: 'Card declined', amount: 15000 }
      },
      {
        _id: '4',
        timestamp: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
        level: 'info',
        message: 'Booking created successfully',
        userId: 'user3',
        ip: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15',
        details: { bookingId: 'booking1', amount: 25000 }
      },
      {
        _id: '5',
        timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
        level: 'debug',
        message: 'Cache cleared',
        userId: null,
        ip: '127.0.0.1',
        userAgent: 'System',
        details: { cacheType: 'user_sessions', cleared: 150 }
      }
    ];
    
    // Filter logs
    let filteredLogs = mockLogs;
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    if (search) {
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        log.userId?.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Paginate logs
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedLogs = filteredLogs.slice(skip, skip + parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: {
        logs: paginatedLogs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredLogs.length / parseInt(limit)),
          total: filteredLogs.length
        }
      }
    });
    
  } catch (error) {
    console.error('Get system logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching system logs'
    });
  }
});

// @desc    Get system health
// @route   GET /api/staff/settings/health
// @access  Private (Staff)
const getSystemHealth = asyncHandler(async (req, res) => {
  try {
    // Mock system health data (in production, these would come from monitoring systems)
    const health = {
      // Database Health
      database: {
        status: 'healthy',
        responseTime: 15, // ms
        connections: {
          active: 25,
          idle: 5,
          total: 30
        },
        lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        backupSize: '2.5 GB'
      },
      
      // Server Health
      server: {
        status: 'healthy',
        uptime: 99.9, // percentage
        cpuUsage: 45.2, // percentage
        memoryUsage: 62.8, // percentage
        diskUsage: 38.5, // percentage
        loadAverage: [1.2, 1.5, 1.8], // 1min, 5min, 15min
        responseTime: 150 // ms
      },
      
      // External Services
      services: {
        paymentGateway: {
          status: 'healthy',
          responseTime: 200, // ms
          lastCheck: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
        },
        emailService: {
          status: 'healthy',
          responseTime: 300, // ms
          lastCheck: new Date(Date.now() - 1 * 60 * 1000) // 1 minute ago
        },
        smsService: {
          status: 'warning',
          responseTime: 800, // ms
          lastCheck: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
        },
        storageService: {
          status: 'healthy',
          responseTime: 100, // ms
          lastCheck: new Date(Date.now() - 30 * 1000) // 30 seconds ago
        }
      },
      
      // Security Status
      security: {
        sslCertificate: {
          status: 'valid',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          issuer: 'Let\'s Encrypt'
        },
        firewall: {
          status: 'active',
          blockedRequests: 1250,
          lastUpdate: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
        },
        antivirus: {
          status: 'active',
          lastScan: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
          threatsDetected: 0
        }
      },
      
      // Performance Metrics
      performance: {
        averageResponseTime: 150, // ms
        requestsPerMinute: 1250,
        errorRate: 0.02, // percentage
        throughput: 1250, // requests per minute
        peakConcurrentUsers: 850
      }
    };
    
    res.status(200).json({
      success: true,
      data: health
    });
    
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching system health'
    });
  }
});

// @desc    Backup system data
// @route   POST /api/staff/settings/backup
// @access  Private (Staff - Admin only)
const createSystemBackup = asyncHandler(async (req, res) => {
  try {
    const { type = 'full', description } = req.body;
    const staffId = req.user._id;
    
    // Mock backup creation (in production, this would trigger actual backup)
    const backup = {
      _id: `backup_${Date.now()}`,
      type,
      description: description || `${type} backup`,
      status: 'in_progress',
      createdAt: new Date(),
      createdBy: staffId,
      size: '0 MB',
      progress: 0
    };
    
    // Log activity
    console.log(`Staff ${staffId} initiated ${type} backup`);
    
    res.status(201).json({
      success: true,
      message: 'Backup initiated successfully',
      data: backup
    });
    
  } catch (error) {
    console.error('Create system backup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating system backup'
    });
  }
});

module.exports = {
  getPlatformSettings,
  updatePlatformSettings,
  getStaffProfile,
  updateStaffProfile,
  changeStaffPassword,
  getSystemLogs,
  getSystemHealth,
  createSystemBackup
};


