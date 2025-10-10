// Staff Support & Quality Control Controller
const { asyncHandler } = require('../../middleware/errorHandler');
const User = require('../../models/User');
const Booking = require('../../models/Booking');
const Tour = require('../../models/Tour');
const { staffAuth, requirePermission, logActivity } = require('../../middleware/staffAuth');

// @desc    Get support tickets
// @route   GET /api/staff/support/tickets
// @access  Private (Staff)
const getSupportTickets = asyncHandler(async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      priority, 
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build filter object
    let filter = {};
    
    // Status filter
    if (status) {
      filter.status = status;
    }
    
    // Priority filter
    if (priority) {
      filter.priority = priority;
    }
    
    // Category filter
    if (category) {
      filter.category = category;
    }
    
    // Search filter
    if (search) {
      filter.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'user.firstName': { $regex: search, $options: 'i' } },
        { 'user.lastName': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Get support tickets (mock data for now)
    const mockTickets = [
      {
        _id: '1',
        subject: 'Booking cancellation issue',
        description: 'Customer wants to cancel booking but system is not allowing it',
        status: 'open',
        priority: 'high',
        category: 'booking',
        user: {
          _id: 'user1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890'
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        assignedTo: null,
        messages: [
          {
            _id: 'msg1',
            sender: 'customer',
            message: 'I need to cancel my booking but the system is not working',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          }
        ]
      },
      {
        _id: '2',
        subject: 'Payment not processed',
        description: 'Customer payment failed but money was deducted from account',
        status: 'in_progress',
        priority: 'urgent',
        category: 'payment',
        user: {
          _id: 'user2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '+1234567891'
        },
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        updatedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        assignedTo: req.user._id,
        messages: [
          {
            _id: 'msg2',
            sender: 'customer',
            message: 'My payment was deducted but booking was not confirmed',
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
          },
          {
            _id: 'msg3',
            sender: 'staff',
            message: 'We are looking into this issue. Please provide your transaction ID.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000)
          }
        ]
      },
      {
        _id: '3',
        subject: 'Guide not responding',
        description: 'Customer cannot reach their assigned guide',
        status: 'resolved',
        priority: 'medium',
        category: 'service',
        user: {
          _id: 'user3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike@example.com',
          phone: '+1234567892'
        },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        assignedTo: req.user._id,
        messages: [
          {
            _id: 'msg4',
            sender: 'customer',
            message: 'My guide is not responding to calls or messages',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
          },
          {
            _id: 'msg5',
            sender: 'staff',
            message: 'We have contacted the guide and resolved the issue. New guide assigned.',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
          }
        ]
      }
    ];
    
    // Filter mock data
    let filteredTickets = mockTickets;
    if (status) {
      filteredTickets = filteredTickets.filter(ticket => ticket.status === status);
    }
    if (priority) {
      filteredTickets = filteredTickets.filter(ticket => ticket.priority === priority);
    }
    if (category) {
      filteredTickets = filteredTickets.filter(ticket => ticket.category === category);
    }
    if (search) {
      filteredTickets = filteredTickets.filter(ticket => 
        ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(search.toLowerCase()) ||
        ticket.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        ticket.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        ticket.user.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort mock data
    filteredTickets.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });
    
    // Paginate mock data
    const paginatedTickets = filteredTickets.slice(skip, skip + parseInt(limit));
    
    // Get ticket statistics
    const stats = {
      total: mockTickets.length,
      open: mockTickets.filter(t => t.status === 'open').length,
      in_progress: mockTickets.filter(t => t.status === 'in_progress').length,
      resolved: mockTickets.filter(t => t.status === 'resolved').length,
      closed: mockTickets.filter(t => t.status === 'closed').length,
      urgent: mockTickets.filter(t => t.priority === 'urgent').length,
      high: mockTickets.filter(t => t.priority === 'high').length,
      medium: mockTickets.filter(t => t.priority === 'medium').length,
      low: mockTickets.filter(t => t.priority === 'low').length
    };
    
    res.status(200).json({
      success: true,
      data: {
        tickets: paginatedTickets,
        stats,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredTickets.length / parseInt(limit)),
          total: filteredTickets.length
        }
      }
    });
    
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching support tickets'
    });
  }
});

// @desc    Get single support ticket
// @route   GET /api/staff/support/tickets/:id
// @access  Private (Staff)
const getSupportTicket = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock ticket data
    const mockTicket = {
      _id: id,
      subject: 'Booking cancellation issue',
      description: 'Customer wants to cancel booking but system is not allowing it',
      status: 'open',
      priority: 'high',
      category: 'booking',
      user: {
        _id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        avatar: null
      },
      booking: {
        _id: 'booking1',
        tour: {
          title: 'Sigiriya Rock Fortress Tour',
          duration: '1 day'
        },
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalAmount: 15000
      },
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      assignedTo: null,
      messages: [
        {
          _id: 'msg1',
          sender: 'customer',
          senderName: 'John Doe',
          message: 'I need to cancel my booking but the system is not working',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          attachments: []
        },
        {
          _id: 'msg2',
          sender: 'staff',
          senderName: 'Staff Member',
          message: 'I understand your concern. Let me help you with the cancellation.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          attachments: []
        }
      ],
      tags: ['booking', 'cancellation', 'system-issue'],
      resolution: null,
      resolvedAt: null,
      resolvedBy: null
    };
    
    res.status(200).json({
      success: true,
      data: mockTicket
    });
    
  } catch (error) {
    console.error('Get support ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching support ticket'
    });
  }
});

// @desc    Update support ticket
// @route   PUT /api/staff/support/tickets/:id
// @access  Private (Staff)
const updateSupportTicket = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, tags, resolution } = req.body;
    const staffId = req.user._id;
    
    // Mock update response
    const updatedTicket = {
      _id: id,
      status: status || 'in_progress',
      priority: priority || 'medium',
      assignedTo: assignedTo || staffId,
      tags: tags || [],
      resolution: resolution || null,
      updatedAt: new Date(),
      updatedBy: staffId
    };
    
    // Log activity
    console.log(`Staff ${staffId} updated ticket ${id}`);
    
    res.status(200).json({
      success: true,
      message: 'Support ticket updated successfully',
      data: updatedTicket
    });
    
  } catch (error) {
    console.error('Update support ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating support ticket'
    });
  }
});

// @desc    Add message to support ticket
// @route   POST /api/staff/support/tickets/:id/messages
// @access  Private (Staff)
const addSupportMessage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { message, attachments } = req.body;
    const staffId = req.user._id;
    
    // Mock message response
    const newMessage = {
      _id: `msg_${Date.now()}`,
      sender: 'staff',
      senderName: req.user.firstName + ' ' + req.user.lastName,
      message,
      timestamp: new Date(),
      attachments: attachments || []
    };
    
    // Log activity
    console.log(`Staff ${staffId} added message to ticket ${id}`);
    
    res.status(201).json({
      success: true,
      message: 'Message added successfully',
      data: newMessage
    });
    
  } catch (error) {
    console.error('Add support message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding support message'
    });
  }
});

// @desc    Resolve support ticket
// @route   POST /api/staff/support/tickets/:id/resolve
// @access  Private (Staff)
const resolveSupportTicket = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution, notes } = req.body;
    const staffId = req.user._id;
    
    // Mock resolve response
    const resolvedTicket = {
      _id: id,
      status: 'resolved',
      resolution,
      notes,
      resolvedAt: new Date(),
      resolvedBy: staffId,
      updatedAt: new Date()
    };
    
    // Log activity
    console.log(`Staff ${staffId} resolved ticket ${id}`);
    
    res.status(200).json({
      success: true,
      message: 'Support ticket resolved successfully',
      data: resolvedTicket
    });
    
  } catch (error) {
    console.error('Resolve support ticket error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resolving support ticket'
    });
  }
});

// @desc    Get reviews and ratings
// @route   GET /api/staff/support/reviews
// @access  Private (Staff)
const getReviews = asyncHandler(async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      rating, 
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Mock reviews data
    const mockReviews = [
      {
        _id: 'review1',
        user: {
          _id: 'user1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          avatar: null
        },
        tour: {
          _id: 'tour1',
          title: 'Sigiriya Rock Fortress Tour',
          guide: {
            _id: 'guide1',
            firstName: 'Sarah',
            lastName: 'Perera'
          }
        },
        rating: 5,
        comment: 'Amazing tour! The guide was very knowledgeable and friendly.',
        status: 'approved',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        moderatedBy: null,
        moderatedAt: null
      },
      {
        _id: 'review2',
        user: {
          _id: 'user2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          avatar: null
        },
        tour: {
          _id: 'tour2',
          title: 'Kandy Cultural Show',
          guide: {
            _id: 'guide2',
            firstName: 'David',
            lastName: 'Fernando'
          }
        },
        rating: 3,
        comment: 'The tour was okay but the guide seemed uninterested.',
        status: 'pending',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        moderatedBy: null,
        moderatedAt: null
      },
      {
        _id: 'review3',
        user: {
          _id: 'user3',
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike@example.com',
          avatar: null
        },
        tour: {
          _id: 'tour3',
          title: 'Ella Scenic Train Journey',
          guide: {
            _id: 'guide3',
            firstName: 'Lisa',
            lastName: 'Silva'
          }
        },
        rating: 1,
        comment: 'Terrible experience! Guide was rude and unprofessional.',
        status: 'rejected',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        moderatedBy: req.user._id,
        moderatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];
    
    // Filter mock data
    let filteredReviews = mockReviews;
    if (rating) {
      filteredReviews = filteredReviews.filter(review => review.rating === parseInt(rating));
    }
    if (status) {
      filteredReviews = filteredReviews.filter(review => review.status === status);
    }
    if (search) {
      filteredReviews = filteredReviews.filter(review => 
        review.comment.toLowerCase().includes(search.toLowerCase()) ||
        review.tour.title.toLowerCase().includes(search.toLowerCase()) ||
        review.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        review.user.lastName.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Sort mock data
    filteredReviews.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      } else {
        return aVal > bVal ? 1 : -1;
      }
    });
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedReviews = filteredReviews.slice(skip, skip + parseInt(limit));
    
    // Get review statistics
    const stats = {
      total: mockReviews.length,
      approved: mockReviews.filter(r => r.status === 'approved').length,
      pending: mockReviews.filter(r => r.status === 'pending').length,
      rejected: mockReviews.filter(r => r.status === 'rejected').length,
      averageRating: mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length,
      ratingDistribution: {
        5: mockReviews.filter(r => r.rating === 5).length,
        4: mockReviews.filter(r => r.rating === 4).length,
        3: mockReviews.filter(r => r.rating === 3).length,
        2: mockReviews.filter(r => r.rating === 2).length,
        1: mockReviews.filter(r => r.rating === 1).length
      }
    };
    
    res.status(200).json({
      success: true,
      data: {
        reviews: paginatedReviews,
        stats,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(filteredReviews.length / parseInt(limit)),
          total: filteredReviews.length
        }
      }
    });
    
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews'
    });
  }
});

// @desc    Moderate review
// @route   PUT /api/staff/support/reviews/:id/moderate
// @access  Private (Staff)
const moderateReview = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    const staffId = req.user._id;
    
    // Mock moderate response
    const moderatedReview = {
      _id: id,
      status,
      reason,
      moderatedBy: staffId,
      moderatedAt: new Date(),
      updatedAt: new Date()
    };
    
    // Log activity
    console.log(`Staff ${staffId} moderated review ${id} as ${status}`);
    
    res.status(200).json({
      success: true,
      message: `Review ${status} successfully`,
      data: moderatedReview
    });
    
  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error moderating review'
    });
  }
});

module.exports = {
  getSupportTickets,
  getSupportTicket,
  updateSupportTicket,
  addSupportMessage,
  resolveSupportTicket,
  getReviews,
  moderateReview
};


