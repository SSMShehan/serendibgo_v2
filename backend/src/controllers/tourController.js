const Tour = require('../models/Tour');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all tours
// @route   GET /api/tours
// @access  Public
const getTours = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    minPrice,
    maxPrice,
    duration,
    difficulty,
    location,
    search,
    featured,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = { isActive: true };
  
  if (category) {
    filter.category = category;
  }
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }
  
  if (duration) {
    filter.duration = parseInt(duration);
  }
  
  if (difficulty) {
    filter.difficulty = difficulty;
  }
  
  if (location) {
    filter['location.name'] = new RegExp(location, 'i');
  }
  
  if (featured === 'true') {
    filter.isFeatured = true;
  }
  
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { 'location.name': new RegExp(search, 'i') },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Calculate pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Get tours with pagination
  const tours = await Tour.find(filter)
    .populate('guide', 'firstName lastName email avatar profile')
    .skip(skip)
    .limit(limitNum)
    .sort(sort);

  // Get total count for pagination
  const total = await Tour.countDocuments(filter);

  res.json({
    success: true,
    count: tours.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    data: tours
  });
});

// @desc    Get tour by ID
// @route   GET /api/tours/:id
// @access  Public
const getTourById = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id)
    .populate('guide', 'firstName lastName email avatar profile')
    .populate('bookings');

  if (!tour || !tour.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found'
    });
  }

  res.json({
    success: true,
    data: tour
  });
});

// @desc    Create new tour
// @route   POST /api/tours
// @access  Private (Guide/Admin)
const createTour = asyncHandler(async (req, res) => {
  // Add guide ID from authenticated user
  req.body.guide = req.user.id;

  const tour = await Tour.create(req.body);

  res.status(201).json({
    success: true,
    data: tour
  });
});

// @desc    Update tour
// @route   PUT /api/tours/:id
// @access  Private (Guide/Admin)
const updateTour = asyncHandler(async (req, res) => {
  let tour = await Tour.findById(req.params.id);

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found'
    });
  }

  // Check if user is the tour guide or admin
  if (tour.guide.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this tour'
    });
  }

  tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    data: tour
  });
});

// @desc    Delete tour
// @route   DELETE /api/tours/:id
// @access  Private (Guide/Admin)
const deleteTour = asyncHandler(async (req, res) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found'
    });
  }

  // Check if user is the tour guide or admin
  if (tour.guide.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this tour'
    });
  }

  // Soft delete by setting isActive to false
  tour.isActive = false;
  await tour.save();

  res.json({
    success: true,
    message: 'Tour deleted successfully'
  });
});

// @desc    Get tours by guide
// @route   GET /api/tours/guide/:guideId
// @access  Public
const getToursByGuide = asyncHandler(async (req, res) => {
  const tours = await Tour.find({ 
    guide: req.params.guideId, 
    isActive: true 
  }).populate('guide', 'firstName lastName email avatar');

  res.json({
    success: true,
    count: tours.length,
    data: tours
  });
});

// @desc    Get featured tours
// @route   GET /api/tours/featured
// @access  Public
const getFeaturedTours = asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;
  
  const tours = await Tour.find({ 
    isFeatured: true, 
    isActive: true 
  })
    .populate('guide', 'firstName lastName email avatar')
    .limit(parseInt(limit))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tours.length,
    data: tours
  });
});

// @desc    Search tours
// @route   GET /api/tours/search
// @access  Public
const searchTours = asyncHandler(async (req, res) => {
  const { q, limit = 10 } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const tours = await Tour.find({
    $text: { $search: q },
    isActive: true
  })
    .populate('guide', 'firstName lastName email avatar')
    .limit(parseInt(limit))
    .sort({ score: { $meta: 'textScore' } });

  res.json({
    success: true,
    count: tours.length,
    data: tours
  });
});

module.exports = {
  getTours,
  getTourById,
  createTour,
  updateTour,
  deleteTour,
  getToursByGuide,
  getFeaturedTours,
  searchTours
};
