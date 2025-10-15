const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const User = require('../models/User');
const Tour = require('../models/Tour');
const Booking = require('../models/Booking');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  try {
    const { tourId, guideId, bookingId, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!tourId || !guideId || !bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: tourId, guideId, bookingId, rating, comment'
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if tour exists (for direct guide bookings, tourId might be 'guide-service')
    let tour = null;
    if (tourId && tourId !== 'guide-service') {
      tour = await Tour.findById(tourId);
      if (!tour) {
        return res.status(404).json({
          success: false,
          message: 'Tour not found'
        });
      }
    }

    // Check if guide exists
    const guide = await User.findById(guideId);
    if (!guide || guide.role !== 'guide') {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if user has already reviewed this guide for this booking
    const existingReview = await Review.findOne({
      user: userId,
      guide: guideId,
      booking: bookingId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this guide for this booking'
      });
    }

    // Create review
    const review = new Review({
      user: userId,
      tour: tourId !== 'guide-service' ? tourId : null, // Only set tour if it's a real tour
      guide: guideId,
      booking: bookingId,
      rating,
      comment,
      isVerified: true // Auto-verify for now
    });

    await review.save();

    // Populate the review for response
    const populateFields = [
      { path: 'user', select: 'firstName lastName avatar' },
      { path: 'guide', select: 'firstName lastName' },
      { path: 'booking', select: 'startDate endDate' }
    ];
    
    // Only populate tour if it exists
    if (review.tour) {
      populateFields.push({ path: 'tour', select: 'title' });
    }
    
    await review.populate(populateFields);

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
});

// @desc    Get reviews for a specific guide
// @route   GET /api/reviews/guide/:guideId
// @access  Public
const getGuideReviews = asyncHandler(async (req, res) => {
  try {
    const { guideId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      rating, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Validate guide exists
    const guide = await User.findById(guideId);
    if (!guide || guide.role !== 'guide') {
      return res.status(404).json({
        success: false,
        message: 'Guide not found'
      });
    }

    // Build filter
    const filter = { guide: guideId, isActive: true };
    if (rating) {
      filter.rating = parseInt(rating);
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get reviews
    const reviews = await Review.find(filter)
      .populate([
        { path: 'user', select: 'firstName lastName avatar' },
        { path: 'tour', select: 'title' },
        { path: 'booking', select: 'startDate endDate' }
      ])
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Review.countDocuments(filter);

    // Calculate average rating
    const avgRatingResult = await Review.aggregate([
      { $match: { guide: guide._id, isActive: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;
    const totalReviews = avgRatingResult.length > 0 ? avgRatingResult[0].count : 0;

    // Get rating distribution
    const ratingDistribution = await Review.aggregate([
      { $match: { guide: guide._id, isActive: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          limit: limitNum
        },
        statistics: {
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews,
          ratingDistribution
        }
      }
    });

  } catch (error) {
    console.error('Error fetching guide reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// @desc    Get reviews for a specific tour
// @route   GET /api/reviews/tour/:tourId
// @access  Public
const getTourReviews = asyncHandler(async (req, res) => {
  try {
    const { tourId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      rating, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Validate tour exists
    const tour = await Tour.findById(tourId);
    if (!tour) {
      return res.status(404).json({
        success: false,
        message: 'Tour not found'
      });
    }

    // Build filter
    const filter = { tour: tourId, isActive: true };
    if (rating) {
      filter.rating = parseInt(rating);
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get reviews
    const reviews = await Review.find(filter)
      .populate([
        { path: 'user', select: 'firstName lastName avatar' },
        { path: 'guide', select: 'firstName lastName' },
        { path: 'booking', select: 'startDate endDate' }
      ])
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Review.countDocuments(filter);

    // Calculate average rating
    const avgRatingResult = await Review.aggregate([
      { $match: { tour: tour._id, isActive: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating : 0;
    const totalReviews = avgRatingResult.length > 0 ? avgRatingResult[0].count : 0;

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          limit: limitNum
        },
        statistics: {
          averageRating: Math.round(avgRating * 10) / 10,
          totalReviews
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tour reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    // Find the review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Update review
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    // Populate the review for response
    await review.populate([
      { path: 'user', select: 'firstName lastName avatar' },
      { path: 'tour', select: 'title' },
      { path: 'guide', select: 'firstName lastName' },
      { path: 'booking', select: 'startDate endDate' }
    ]);

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    // Soft delete by setting isActive to false
    review.isActive = false;
    await review.save();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
});

// @desc    Mark review as helpful/not helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
const markReviewHelpful = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { helpful } = req.body; // true for helpful, false for not helpful

    // Find the review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Update helpful count
    if (helpful === true) {
      review.helpful += 1;
    } else if (helpful === false) {
      review.notHelpful += 1;
    } else {
      return res.status(400).json({
        success: false,
        message: 'helpful field must be true or false'
      });
    }

    await review.save();

    res.json({
      success: true,
      message: 'Review marked successfully',
      data: {
        helpful: review.helpful,
        notHelpful: review.notHelpful
      }
    });

  } catch (error) {
    console.error('Error marking review helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking review',
      error: error.message
    });
  }
});

// @desc    Get user's reviews
// @route   GET /api/reviews/user/:userId
// @access  Private
const getUserReviews = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user._id;

    // Check if user is requesting their own reviews or is admin
    if (userId !== requestingUserId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these reviews'
      });
    }

    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get reviews
    const reviews = await Review.find({ user: userId, isActive: true })
      .populate([
        { path: 'tour', select: 'title' },
        { path: 'guide', select: 'firstName lastName' },
        { path: 'booking', select: 'startDate endDate' }
      ])
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count
    const total = await Review.countDocuments({ user: userId, isActive: true });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          limit: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

module.exports = {
  createReview,
  getGuideReviews,
  getTourReviews,
  updateReview,
  deleteReview,
  markReviewHelpful,
  getUserReviews
};

