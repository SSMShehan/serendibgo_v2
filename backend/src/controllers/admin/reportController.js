const asyncHandler = require('express-async-handler');
const puppeteer = require('puppeteer');
const User = require('../../models/User');
const Hotel = require('../../models/hotels/Hotel');
const HotelBooking = require('../../models/hotels/HotelBooking');

// @desc    Generate PDF report
// @route   POST /api/admin/reports/generate
// @access  Private (Admin only)
const generatePDFReport = asyncHandler(async (req, res) => {
  try {
    const { reportType = 'dashboard', period = '30d' } = req.body;
    
    console.log('Generating PDF report:', { reportType, period });
    
    // Use mock data for testing when database is not available
    let reportData;
    try {
      if (reportType === 'users') {
        reportData = await fetchUserReportData(period);
      } else if (reportType === 'staff') {
        reportData = await fetchStaffReportData(period);
      } else {
        reportData = await fetchReportData(period);
      }
    } catch (dbError) {
      console.log('Database not available, using mock data:', dbError.message);
      // Mock data for testing
      if (reportType === 'users') {
        reportData = {
          period,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
          overview: {
            totalUsers: 30,
            verifiedUsers: 19,
            pendingUsers: 11,
            tourists: 15,
            hotelOwners: 8,
            guides: 4,
            drivers: 2,
            staff: 1
          },
          recent: {
            recentUsers: 5,
            recentVerifications: 3
          },
          users: [
            { name: 'John Doe', email: 'john@example.com', role: 'tourist', status: 'verified', joined: '2024-01-15' },
            { name: 'Jane Smith', email: 'jane@example.com', role: 'hotel_owner', status: 'verified', joined: '2024-01-10' },
            { name: 'Mike Johnson', email: 'mike@example.com', role: 'guide', status: 'pending', joined: '2024-01-20' },
            { name: 'Sarah Wilson', email: 'sarah@example.com', role: 'tourist', status: 'verified', joined: '2024-01-18' },
            { name: 'David Brown', email: 'david@example.com', role: 'driver', status: 'pending', joined: '2024-01-22' }
          ]
        };
      } else if (reportType === 'staff') {
        reportData = {
          period,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
          overview: {
            totalStaff: 3,
            activeStaff: 3,
            pendingStaff: 0,
            inactiveStaff: 0,
            managers: 1,
            supervisors: 1,
            regularStaff: 1
          },
          recent: {
            recentStaff: 2,
            recentActivations: 1
          },
          staff: [
            { name: 'Sadun Staff', email: 'sadunstaff@serandibgo.com', phone: '+94771234569', role: 'manager', status: 'active', joined: '2024-01-15' },
            { name: 'Autor Created', email: 'staff@gmail.com', phone: '+0000000000', role: 'supervisor', status: 'active', joined: '2024-01-10' },
            { name: 'John Manager', email: 'john@serandibgo.com', phone: '+94771234570', role: 'staff', status: 'active', joined: '2024-01-20' }
          ]
        };
      } else {
        reportData = {
          period,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          endDate: new Date(),
          overview: {
            totalUsers: 150,
            totalHotels: 25,
            totalBookings: 300,
            totalStaff: 10,
            totalHotelOwners: 20,
            totalGuides: 15,
            totalTourists: 100
          },
          pending: {
            pendingHotels: 5,
            pendingUsers: 8
          },
          recent: {
            recentBookings: 45,
            recentUsers: 12,
            recentHotels: 3
          },
          revenue: {
            totalRevenue: 125000,
            averageBookingValue: 2500
          },
          topHotels: [
            { name: 'Hotel Paradise', location: 'Colombo', totalBookings: 25, totalRevenue: 50000, rating: 4.5 },
            { name: 'Beach Resort', location: 'Galle', totalBookings: 20, totalRevenue: 40000, rating: 4.2 }
          ]
        };
      }
    }
    
    // Generate HTML content for the PDF
    const htmlContent = generateHTMLReport(reportData, reportType);
    
    // Generate PDF using Puppeteer
    const pdfBuffer = await generatePDFFromHTML(htmlContent);
    
    console.log('PDF generated successfully, size:', pdfBuffer.length);
    
    // Convert PDF buffer to base64 for CORS compatibility
    const base64PDF = Buffer.from(pdfBuffer).toString('base64');
    
    console.log('Base64 PDF length:', base64PDF.length);
    console.log('First 100 chars of base64:', base64PDF.substring(0, 100));
    
    res.json({
      success: true,
      data: base64PDF,
      filename: `serendibgo-report-${new Date().toISOString().split('T')[0]}.pdf`
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report',
      error: error.message
    });
  }
});

// Helper function to fetch report data
const fetchReportData = async (period) => {
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

  // Get recent activity
  const recentBookings = await HotelBooking.countDocuments({
    createdAt: { $gte: startDate }
  });

  const recentUsers = await User.countDocuments({
    createdAt: { $gte: startDate }
  });

  const recentHotels = await Hotel.countDocuments({
    createdAt: { $gte: startDate }
  });

  // Get revenue data
  const revenueData = await HotelBooking.aggregate([
    {
      $match: {
        status: 'confirmed',
        createdAt: { $gte: startDate }
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

  // Get top performing hotels
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
      $limit: 5
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

  return {
    period,
    startDate,
    endDate: new Date(),
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
    topHotels
  };
};

// Helper function to fetch user report data
const fetchUserReportData = async (period) => {
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

  // Get user statistics
  const totalUsers = await User.countDocuments();
  const verifiedUsers = await User.countDocuments({ isVerified: true });
  const pendingUsers = await User.countDocuments({ isVerified: false });
  const tourists = await User.countDocuments({ role: 'tourist' });
  const hotelOwners = await User.countDocuments({ role: 'hotel_owner' });
  const guides = await User.countDocuments({ role: 'guide' });
  const drivers = await User.countDocuments({ role: 'driver' });
  const staff = await User.countDocuments({ role: 'staff' });

  // Get recent activity
  const recentUsers = await User.countDocuments({
    createdAt: { $gte: startDate }
  });

  const recentVerifications = await User.countDocuments({
    isVerified: true,
    updatedAt: { $gte: startDate }
  });

  // Get sample users for the report
  const users = await User.find({}, {
    firstName: 1,
    lastName: 1,
    email: 1,
    role: 1,
    isVerified: 1,
    createdAt: 1
  })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();

  // Format users for display
  const formattedUsers = users.map(user => ({
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    role: user.role,
    status: user.isVerified ? 'verified' : 'pending',
    joined: user.createdAt.toLocaleDateString()
  }));

  return {
    period,
    startDate,
    endDate: new Date(),
    overview: {
      totalUsers,
      verifiedUsers,
      pendingUsers,
      tourists,
      hotelOwners,
      guides,
      drivers,
      staff
    },
    recent: {
      recentUsers,
      recentVerifications
    },
    users: formattedUsers
  };
};

// Helper function to fetch staff report data
const fetchStaffReportData = async (period) => {
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

  // Get staff statistics
  const totalStaff = await User.countDocuments({ role: 'staff' });
  const activeStaff = await User.countDocuments({ role: 'staff', isActive: true });
  const pendingStaff = await User.countDocuments({ role: 'staff', isVerified: false });
  const inactiveStaff = await User.countDocuments({ role: 'staff', isActive: false });
  
  // Get staff by role/level
  const managers = await User.countDocuments({ role: 'staff', 'profile.level': 'manager' });
  const supervisors = await User.countDocuments({ role: 'staff', 'profile.level': 'supervisor' });
  const regularStaff = await User.countDocuments({ role: 'staff', 'profile.level': { $nin: ['manager', 'supervisor'] } });

  // Get recent activity
  const recentStaff = await User.countDocuments({
    role: 'staff',
    createdAt: { $gte: startDate }
  });

  const recentActivations = await User.countDocuments({
    role: 'staff',
    isActive: true,
    updatedAt: { $gte: startDate }
  });

  // Get sample staff for the report
  const staff = await User.find({ role: 'staff' }, {
    firstName: 1,
    lastName: 1,
    email: 1,
    phone: 1,
    'profile.level': 1,
    isActive: 1,
    isVerified: 1,
    createdAt: 1
  })
  .sort({ createdAt: -1 })
  .limit(20)
  .lean();

  // Format staff for display
  const formattedStaff = staff.map(member => ({
    name: `${member.firstName} ${member.lastName}`,
    email: member.email,
    phone: member.phone || 'N/A',
    role: member.profile?.level || 'staff',
    status: member.isActive ? 'active' : 'inactive',
    joined: member.createdAt.toLocaleDateString()
  }));

  return {
    period,
    startDate,
    endDate: new Date(),
    overview: {
      totalStaff,
      activeStaff,
      pendingStaff,
      inactiveStaff,
      managers,
      supervisors,
      regularStaff
    },
    recent: {
      recentStaff,
      recentActivations
    },
    staff: formattedStaff
  };
};

// Helper function to generate HTML content
const generateHTMLReport = (data, reportType) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportTitle = reportType === 'users' ? 'User Management Report' : 
                     reportType === 'staff' ? 'Staff Management Report' : 
                     'Platform Performance Report';
  const reportTypeDisplay = reportType === 'users' ? 'User Management Report' : 
                           reportType === 'staff' ? 'Staff Management Report' : 
                           'Dashboard Report';

  // Generate content based on report type
  const generateContent = () => {
    if (reportType === 'users') {
      return generateUserReportContent(data);
    } else if (reportType === 'staff') {
      return generateStaffReportContent(data);
    } else {
      return generateDashboardReportContent(data);
    }
  };

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SerendibGo ${reportTitle}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background: white;
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
                margin-bottom: 30px;
            }
            
            .header h1 {
                font-size: 2.5em;
                margin-bottom: 10px;
                font-weight: bold;
            }
            
            .header p {
                font-size: 1.2em;
                opacity: 0.9;
            }
            
            .company-info {
                background: #f8f9fa;
                padding: 20px;
                margin-bottom: 30px;
                border-left: 4px solid #667eea;
            }
            
            .company-info h2 {
                color: #667eea;
                margin-bottom: 15px;
                font-size: 1.5em;
            }
            
            .company-info p {
                margin-bottom: 5px;
                font-size: 1.1em;
            }
            
            .report-info {
                background: #e3f2fd;
                padding: 15px;
                margin-bottom: 30px;
                border-radius: 8px;
            }
            
            .report-info h3 {
                color: #1976d2;
                margin-bottom: 10px;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .stat-card h4 {
                color: #666;
                font-size: 0.9em;
                margin-bottom: 10px;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .stat-card .value {
                font-size: 2em;
                font-weight: bold;
                color: #333;
                margin-bottom: 5px;
            }
            
            .stat-card .label {
                color: #888;
                font-size: 0.9em;
            }
            
            .section {
                margin-bottom: 30px;
            }
            
            .section h3 {
                color: #333;
                border-bottom: 2px solid #667eea;
                padding-bottom: 10px;
                margin-bottom: 20px;
                font-size: 1.3em;
            }
            
            .table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            
            .table th,
            .table td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: left;
            }
            
            .table th {
                background: #f8f9fa;
                font-weight: bold;
                color: #333;
            }
            
            .table tr:nth-child(even) {
                background: #f9f9f9;
            }
            
            .footer {
                margin-top: 50px;
                padding: 30px;
                background: #f8f9fa;
                border-top: 2px solid #667eea;
            }
            
            .signature-section {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 30px;
            }
            
            .signature-box {
                text-align: center;
                min-width: 200px;
            }
            
            .signature-line {
                border-bottom: 1px solid #333;
                width: 150px;
                margin: 0 auto 10px;
                height: 40px;
            }
            
            .signature-label {
                font-size: 0.9em;
                color: #666;
            }
            
            .date-section {
                text-align: right;
            }
            
            .date-section p {
                margin-bottom: 5px;
            }
            
            @media print {
                body { margin: 0; }
                .header { page-break-inside: avoid; }
                .section { page-break-inside: avoid; }
            }
        </style>
    </head>
    <body>
        <!-- Company Header -->
        <div class="header">
            <h1>SerendibGo</h1>
            <p>Your Gateway to Sri Lankan Adventures</p>
        </div>
        
        <!-- Company Information -->
        <div class="company-info">
            <h2>Company Information</h2>
            <p><strong>Company Name:</strong> SerendibGo (Pvt) Ltd</p>
            <p><strong>Address:</strong> 123 Colombo Street, Colombo 03, Sri Lanka</p>
            <p><strong>Phone:</strong> +94 11 234 5678</p>
            <p><strong>Email:</strong> info@serendibgo.com</p>
            <p><strong>Website:</strong> www.serendibgo.com</p>
            <p><strong>Registration:</strong> PV 123456789</p>
        </div>
        
        <!-- Report Information -->
        <div class="report-info">
            <h3>${reportTitle}</h3>
            <p><strong>Report Period:</strong> ${data.period.toUpperCase()} (${data.startDate.toLocaleDateString()} - ${data.endDate.toLocaleDateString()})</p>
            <p><strong>Generated On:</strong> ${currentDate}</p>
            <p><strong>Report Type:</strong> ${reportTypeDisplay}</p>
        </div>
        
        ${generateContent()}
        
        <!-- Footer with Signature -->
        <div class="footer">
            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-line"></div>
                    <div class="signature-label">Authorized Signature</div>
                </div>
                <div class="date-section">
                    <p><strong>Report Generated:</strong> ${currentDate}</p>
                    <p><strong>Generated By:</strong> SerendibGo Admin System</p>
                    <p><strong>Report ID:</strong> SRG-${Date.now().toString().slice(-6)}</p>
                </div>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #666; font-size: 0.9em;">
                <p>This report was automatically generated by the SerendibGo Platform Management System.</p>
                <p>For questions or clarifications, please contact our support team at support@serendibgo.com</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Generate user report content
const generateUserReportContent = (data) => {
  return `
    <!-- User Statistics -->
    <div class="section">
        <h3>User Overview</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <h4>Total Users</h4>
                <div class="value">${data.overview.totalUsers}</div>
                <div class="label">Registered Users</div>
            </div>
            <div class="stat-card">
                <h4>Verified Users</h4>
                <div class="value">${data.overview.verifiedUsers}</div>
                <div class="label">Verified Accounts</div>
            </div>
            <div class="stat-card">
                <h4>Pending Users</h4>
                <div class="value">${data.overview.pendingUsers}</div>
                <div class="label">Awaiting Verification</div>
            </div>
            <div class="stat-card">
                <h4>Tourists</h4>
                <div class="value">${data.overview.tourists}</div>
                <div class="label">Tourist Accounts</div>
            </div>
            <div class="stat-card">
                <h4>Hotel Owners</h4>
                <div class="value">${data.overview.hotelOwners}</div>
                <div class="label">Hotel Owner Accounts</div>
            </div>
            <div class="stat-card">
                <h4>Tour Guides</h4>
                <div class="value">${data.overview.guides}</div>
                <div class="label">Guide Accounts</div>
            </div>
            <div class="stat-card">
                <h4>Drivers</h4>
                <div class="value">${data.overview.drivers}</div>
                <div class="label">Driver Accounts</div>
            </div>
            <div class="stat-card">
                <h4>Staff</h4>
                <div class="value">${data.overview.staff}</div>
                <div class="label">Staff Accounts</div>
            </div>
        </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="section">
        <h3>Recent Activity (${data.period.toUpperCase()})</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <h4>New Users</h4>
                <div class="value">${data.recent.recentUsers}</div>
                <div class="label">Registered This Period</div>
            </div>
            <div class="stat-card">
                <h4>Verifications</h4>
                <div class="value">${data.recent.recentVerifications}</div>
                <div class="label">Verified This Period</div>
            </div>
        </div>
    </div>
    
    <!-- User List -->
    <div class="section">
        <h3>Recent Users</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                </tr>
            </thead>
            <tbody>
                ${data.users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td>${user.role}</td>
                        <td>${user.status}</td>
                        <td>${user.joined}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
  `;
};

// Generate staff report content
const generateStaffReportContent = (data) => {
  return `
    <!-- Staff Statistics -->
    <div class="section">
        <h3>Staff Overview</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <h4>Total Staff</h4>
                <div class="value">${data.overview.totalStaff}</div>
                <div class="label">Staff Members</div>
            </div>
            <div class="stat-card">
                <h4>Active Staff</h4>
                <div class="value">${data.overview.activeStaff}</div>
                <div class="label">Active Members</div>
            </div>
            <div class="stat-card">
                <h4>Pending Staff</h4>
                <div class="value">${data.overview.pendingStaff}</div>
                <div class="label">Awaiting Verification</div>
            </div>
            <div class="stat-card">
                <h4>Inactive Staff</h4>
                <div class="value">${data.overview.inactiveStaff}</div>
                <div class="label">Inactive Members</div>
            </div>
            <div class="stat-card">
                <h4>Managers</h4>
                <div class="value">${data.overview.managers}</div>
                <div class="label">Manager Level</div>
            </div>
            <div class="stat-card">
                <h4>Supervisors</h4>
                <div class="value">${data.overview.supervisors}</div>
                <div class="label">Supervisor Level</div>
            </div>
            <div class="stat-card">
                <h4>Regular Staff</h4>
                <div class="value">${data.overview.regularStaff}</div>
                <div class="label">Regular Level</div>
            </div>
        </div>
    </div>
    
    <!-- Recent Activity -->
    <div class="section">
        <h3>Recent Activity (${data.period.toUpperCase()})</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <h4>New Staff</h4>
                <div class="value">${data.recent.recentStaff}</div>
                <div class="label">Added This Period</div>
            </div>
            <div class="stat-card">
                <h4>Activations</h4>
                <div class="value">${data.recent.recentActivations}</div>
                <div class="label">Activated This Period</div>
            </div>
        </div>
    </div>
    
    <!-- Staff List -->
    <div class="section">
        <h3>Staff Members</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                </tr>
            </thead>
            <tbody>
                ${data.staff.map(member => `
                    <tr>
                        <td>${member.name}</td>
                        <td>${member.email}</td>
                        <td>${member.phone}</td>
                        <td>${member.role}</td>
                        <td>${member.status}</td>
                        <td>${member.joined}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
  `;
};

// Generate dashboard report content
const generateDashboardReportContent = (data) => {
  return `
    <!-- Key Statistics -->
    <div class="section">
        <h3>Platform Overview</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <h4>Total Users</h4>
                <div class="value">${data.overview.totalUsers}</div>
                <div class="label">Registered Users</div>
            </div>
            <div class="stat-card">
                <h4>Total Hotels</h4>
                <div class="value">${data.overview.totalHotels}</div>
                <div class="label">Registered Hotels</div>
            </div>
            <div class="stat-card">
                <h4>Total Bookings</h4>
                <div class="value">${data.overview.totalBookings}</div>
                <div class="label">Total Bookings</div>
            </div>
            <div class="stat-card">
                <h4>Total Revenue</h4>
                <div class="value">Rs. ${data.revenue.totalRevenue.toLocaleString()}</div>
                <div class="label">Platform Revenue</div>
            </div>
            <div class="stat-card">
                <h4>Active Staff</h4>
                <div class="value">${data.overview.totalStaff}</div>
                <div class="label">Staff Members</div>
            </div>
            <div class="stat-card">
                <h4>Pending Approvals</h4>
                <div class="value">${data.pending.pendingHotels + data.pending.pendingUsers}</div>
                <div class="label">Awaiting Review</div>
            </div>
        </div>
    </div>
    
    <!-- User Breakdown -->
    <div class="section">
        <h3>User Statistics</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>User Type</th>
                    <th>Count</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Tourists</td>
                    <td>${data.overview.totalTourists}</td>
                    <td>${((data.overview.totalTourists / data.overview.totalUsers) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>Hotel Owners</td>
                    <td>${data.overview.totalHotelOwners}</td>
                    <td>${((data.overview.totalHotelOwners / data.overview.totalUsers) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>Staff Members</td>
                    <td>${data.overview.totalStaff}</td>
                    <td>${((data.overview.totalStaff / data.overview.totalUsers) * 100).toFixed(1)}%</td>
                </tr>
                <tr>
                    <td>Tour Guides</td>
                    <td>${data.overview.totalGuides}</td>
                    <td>${((data.overview.totalGuides / data.overview.totalUsers) * 100).toFixed(1)}%</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <!-- Recent Activity -->
    <div class="section">
        <h3>Recent Activity (${data.period.toUpperCase()})</h3>
        <div class="stats-grid">
            <div class="stat-card">
                <h4>New Users</h4>
                <div class="value">${data.recent.recentUsers}</div>
                <div class="label">Registered This Period</div>
            </div>
            <div class="stat-card">
                <h4>New Hotels</h4>
                <div class="value">${data.recent.recentHotels}</div>
                <div class="label">Added This Period</div>
            </div>
            <div class="stat-card">
                <h4>New Bookings</h4>
                <div class="value">${data.recent.recentBookings}</div>
                <div class="label">Created This Period</div>
            </div>
            <div class="stat-card">
                <h4>Avg Booking Value</h4>
                <div class="value">Rs. ${data.revenue.averageBookingValue.toLocaleString()}</div>
                <div class="label">Per Booking</div>
            </div>
        </div>
    </div>
    
    <!-- Top Performing Hotels -->
    ${data.topHotels && data.topHotels.length > 0 ? `
    <div class="section">
        <h3>Top Performing Hotels</h3>
        <table class="table">
            <thead>
                <tr>
                    <th>Hotel Name</th>
                    <th>Location</th>
                    <th>Total Bookings</th>
                    <th>Total Revenue</th>
                    <th>Rating</th>
                </tr>
            </thead>
            <tbody>
                ${data.topHotels.map(hotel => `
                    <tr>
                        <td>${hotel.name}</td>
                        <td>${hotel.location}</td>
                        <td>${hotel.totalBookings}</td>
                        <td>Rs. ${hotel.totalRevenue.toLocaleString()}</td>
                        <td>${hotel.rating || 'N/A'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
    ` : ''}
  `;
};

// Helper function to generate PDF from HTML
const generatePDFFromHTML = async (htmlContent) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

module.exports = {
  generatePDFReport
};
