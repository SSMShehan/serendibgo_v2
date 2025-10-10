const { asyncHandler } = require('../../middleware/errorHandler');
const User = require('../../models/User');
const Hotel = require('../../models/hotels/Hotel');
const HotelBooking = require('../../models/hotels/HotelBooking');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private (Admin only)
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalHotels = await Hotel.countDocuments();
    const totalBookings = await HotelBooking.countDocuments();
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalHotelOwners = await User.countDocuments({ role: 'hotel_owner' });
    const totalGuides = await User.countDocuments({ role: 'guide' });
    const totalTourists = await User.countDocuments({ role: 'tourist' });

    // Get pending approvals
    const pendingHotels = await Hotel.countDocuments({ status: 'pending' });
    const pendingUsers = await User.countDocuments({ isVerified: false });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentBookings = await HotelBooking.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recentHotels = await Hotel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get revenue data (last 30 days)
    const revenueData = await HotelBooking.aggregate([
      {
        $match: {
          status: 'confirmed',
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageBookingValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const averageBookingValue = revenueData.length > 0 ? revenueData[0].averageBookingValue : 0;

    // Get booking status distribution
    const bookingStatusStats = await HotelBooking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get hotel status distribution
    const hotelStatusStats = await Hotel.countDocuments({ status: 'active' });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalHotels,
          totalBookings,
          totalStaff,
          totalHotelOwners,
          totalGuides,
          totalTourists
        },
        pending: {
          pendingHotels,
          pendingUsers
        },
        recent: {
          recentBookings,
          recentUsers,
          recentHotels
        },
        revenue: {
          totalRevenue,
          averageBookingValue
        },
        bookingStatusStats,
        activeHotels: hotelStatusStats
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics'
    });
  }
});

// @desc    Get platform analytics
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getPlatformAnalytics = asyncHandler(async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range based on period
    let startDate = new Date();
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Booking trends
    const bookingTrends = await HotelBooking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Hotel registration trends
    const hotelTrends = await Hotel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Top performing hotels
    const topHotels = await Hotel.aggregate([
      {
        $lookup: {
          from: 'hotelbookings',
          localField: '_id',
          foreignField: 'hotel',
          as: 'bookings'
        }
      },
      {
        $addFields: {
          totalBookings: { $size: '$bookings' },
          totalRevenue: {
            $sum: {
              $map: {
                input: '$bookings',
                as: 'booking',
                in: '$$booking.totalAmount'
              }
            }
          }
        }
      },
      {
        $sort: { totalBookings: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: 1,
          location: 1,
          totalBookings: 1,
          totalRevenue: 1,
          rating: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        userTrends,
        bookingTrends,
        hotelTrends,
        topHotels
      }
    });
  } catch (error) {
    console.error('Error fetching platform analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching platform analytics'
    });
  }
});

module.exports = {
  getDashboardStats,
  getPlatformAnalytics
};
