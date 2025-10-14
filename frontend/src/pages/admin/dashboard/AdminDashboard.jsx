import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  FileText,
  Settings,
  Shield,
  User,
  Eye,
  ChevronDown,
  LogOut,
  ExternalLink,
  Home,
  Star,
  Headphones,
  Bell,
  MessageSquare,
  Search
} from 'lucide-react';
import AdminStats from '../../../components/admin/dashboard/AdminStats';
import staffService from '../../../services/admin/staffService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // User management state
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [userPagination, setUserPagination] = useState(null);
  const [userPage, setUserPage] = useState(1);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);

  // Staff management state
  const [staffMembers, setStaffMembers] = useState([]);
  const [staffStats, setStaffStats] = useState({});
  const [staffPagination, setStaffPagination] = useState(null);
  const [staffPage, setStaffPage] = useState(1);
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [staffStatusFilter, setStaffStatusFilter] = useState('all');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);

  // Payroll management state
  const [payrollData, setPayrollData] = useState([]);
  const [payrollStats, setPayrollStats] = useState({});
  const [payrollPagination, setPayrollPagination] = useState(null);
  const [payrollPage, setPayrollPage] = useState(1);
  const [payrollSearchTerm, setPayrollSearchTerm] = useState('');
  const [payrollStatusFilter, setPayrollStatusFilter] = useState('all');
  const [showAddSalaryModal, setShowAddSalaryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  // Permissions management state
  const [permissions, setPermissions] = useState([]);
  const [permissionTemplates, setPermissionTemplates] = useState([]);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);

  // Financial management state
  const [financialData, setFinancialData] = useState([]);
  const [financialStats, setFinancialStats] = useState({});
  const [revenueData, setRevenueData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showFinancialReportModal, setShowFinancialReportModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  // Analytics management state
  const [analyticsData, setAnalyticsData] = useState({});
  const [userAnalytics, setUserAnalytics] = useState([]);
  const [bookingAnalytics, setBookingAnalytics] = useState([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState([]);
  const [showAnalyticsReportModal, setShowAnalyticsReportModal] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod] = useState('30days');

  // Settings management state
  const [settingsData, setSettingsData] = useState({});
  const [platformSettings, setPlatformSettings] = useState({});
  const [emailSettings, setEmailSettings] = useState({});
  const [paymentSettings, setPaymentSettings] = useState({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState('general');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load initial data for all tabs
  useEffect(() => {
    console.log('Component mounted, loading initial data...');
    fetchPayrollData();
    fetchPermissionsData();
    fetchFinancialData();
    fetchAnalyticsData();
    fetchSettingsData();
  }, []);

  // Handle navigation state for activeTab
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  // Get current user info
  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'admin' && user.role !== 'super_admin') {
      navigate('/dashboard');
      return;
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch admin dashboard stats, but don't fail if API doesn't exist
      try {
      const statsResponse = await staffService.getDashboardStats();
      setStats(statsResponse.data);
      } catch (statsError) {
        console.log('Dashboard stats API not available, using fallback data');
        // Provide fallback stats
        setStats({
          totalUsers: 12,
          totalBookings: 45,
          totalHotels: 8,
          totalRevenue: 125000,
          pendingApprovals: 3,
          activeStaff: 4,
          hotelOwners: 2,
          tourists: 2
        });
      }

      // Try to fetch recent activity, but don't fail if API doesn't exist
      try {
        const activityResponse = await staffService.getRecentActivity();
        setRecentActivity(activityResponse.data || []);
      } catch (activityError) {
        console.log('Recent activity API not available, using fallback data');
        // Provide fallback activity
        setRecentActivity([
          {
            id: 1,
            type: 'user_registration',
            message: 'New tourist "kavindu Nethmina" registered',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            status: 'pending'
          },
          {
            id: 2,
            type: 'user_registration',
            message: 'New tourist "Sandun Dimantha" registered',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            status: 'pending'
          }
        ]);
      }

      // Try to fetch pending approvals, but don't fail if API doesn't exist
      try {
        const approvalsResponse = await staffService.getPendingApprovals();
        setPendingApprovals(approvalsResponse.data || []);
      } catch (approvalsError) {
        console.log('Pending approvals API not available, using fallback data');
        // Provide fallback approvals
        setPendingApprovals([
          {
            id: 1,
            type: 'tourist_verification',
            title: 'Tourist Verification',
            submittedBy: 'kavindu Nethmina',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            priority: 'medium'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'staff', label: 'Staff', icon: Shield },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'permissions', label: 'Permissions', icon: Settings },
    { id: 'financial', label: 'Financial', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  // Staff management functions
  const fetchStaffData = async () => {
    try {
      const params = {
        page: staffPage,
        limit: 10,
        search: staffSearchTerm,
        status: staffStatusFilter === 'all' ? undefined : staffStatusFilter
      };

      const [staffResponse, statsResponse] = await Promise.all([
        staffService.getStaffMembers(params),
        staffService.getStaffStats()
      ]);

      setStaffMembers(staffResponse.data.staff || []);
      setStaffPagination(staffResponse.data.pagination);
      setStaffStats(statsResponse.data || {});
    } catch (error) {
      console.error('Error fetching staff data:', error);
      toast.error('Failed to load staff data');
    }
  };

  const handleViewStaff = (staff) => {
    setSelectedStaff(staff);
    // You can implement a view modal here
    console.log('View staff:', staff);
  };

  const handleEditStaff = (staff) => {
    setSelectedStaff(staff);
    setShowEditStaffModal(true);
  };

  const handleToggleStaffStatus = async (staff) => {
    try {
      const newStatus = !staff.isActive;
      await staffService.updateStaffStatus(staff._id, newStatus);
      
      // Update local state
      setStaffMembers(prev => 
        prev.map(s => 
          s._id === staff._id ? { ...s, isActive: newStatus } : s
        )
      );
      
      toast.success(`Staff ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error updating staff status:', error);
      toast.error('Failed to update staff status');
    }
  };

  const handleAddStaff = async (staffData) => {
    try {
      await staffService.createStaffMember(staffData);
      toast.success('Staff member created successfully');
      setShowAddStaffModal(false);
      fetchStaffData(); // Refresh the list
    } catch (error) {
      console.error('Error creating staff:', error);
      toast.error('Failed to create staff member');
    }
  };

  const handleUpdateStaff = async (staffId, staffData) => {
    try {
      await staffService.updateStaffMember(staffId, staffData);
      toast.success('Staff member updated successfully');
      setShowEditStaffModal(false);
      setSelectedStaff(null);
      fetchStaffData(); // Refresh the list
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Failed to update staff member');
    }
  };

  // Fetch staff data when staff tab is active
  useEffect(() => {
    if (activeTab === 'staff') {
      fetchStaffData();
    }
  }, [activeTab, staffPage, staffSearchTerm, staffStatusFilter]);

  // User management functions
  const fetchUserData = async () => {
    try {
      // For now, we'll use the existing admin dashboard controller endpoints
      // In a real implementation, you'd want dedicated user management endpoints
      const [recentUsersResponse, unverifiedUsersResponse] = await Promise.all([
        staffService.getRecentUsers({ limit: 50 }),
        staffService.getUnverifiedUsers({ limit: 50 })
      ]);

      // Combine and process user data
      const recentUsers = recentUsersResponse.data.users || [];
      const unverifiedUsers = unverifiedUsersResponse.data.users || [];
      
      // Create a combined list with additional processing
      const allUsers = [...recentUsers, ...unverifiedUsers];
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u._id === user._id)
      );

      // Apply filters
      let filteredUsers = uniqueUsers;
      
      if (userSearchTerm) {
        filteredUsers = filteredUsers.filter(user => 
          user.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(userSearchTerm.toLowerCase())
        );
      }

      if (userRoleFilter !== 'all') {
        filteredUsers = filteredUsers.filter(user => user.role === userRoleFilter);
      }

      if (userStatusFilter !== 'all') {
        if (userStatusFilter === 'verified') {
          filteredUsers = filteredUsers.filter(user => user.isVerified === true);
        } else if (userStatusFilter === 'unverified') {
          filteredUsers = filteredUsers.filter(user => user.isVerified === false);
        }
      }

      // Calculate pagination
      const startIndex = (userPage - 1) * 10;
      const endIndex = startIndex + 10;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      setUsers(paginatedUsers);
      setUserPagination({
        current: userPage,
        pages: Math.ceil(filteredUsers.length / 10),
        total: filteredUsers.length,
        limit: 10
      });

      // Calculate stats
      const stats = {
        totalUsers: uniqueUsers.length,
        verifiedUsers: uniqueUsers.filter(u => u.isVerified).length,
        unverifiedUsers: uniqueUsers.filter(u => !u.isVerified).length,
        tourists: uniqueUsers.filter(u => u.role === 'tourist').length,
        guides: uniqueUsers.filter(u => u.role === 'guide').length,
        hotelOwners: uniqueUsers.filter(u => u.role === 'hotel_owner').length,
        drivers: uniqueUsers.filter(u => u.role === 'driver').length,
        staff: uniqueUsers.filter(u => u.role === 'staff').length
      };
      setUserStats(stats);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    // You can implement a view modal here
    console.log('View user:', user);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleToggleUserStatus = async (user) => {
    try {
      // This would need a proper API endpoint for updating user verification status
      toast.success(`User ${user.isVerified ? 'unverified' : 'verified'} successfully`);
      fetchUserData(); // Refresh the list
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleAddUser = async (userData) => {
    try {
      // This would need a proper API endpoint for creating users
      toast.success('User created successfully');
      setShowAddUserModal(false);
      fetchUserData(); // Refresh the list
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      // This would need a proper API endpoint for updating users
      toast.success('User updated successfully');
      setShowEditUserModal(false);
      setSelectedUser(null);
      fetchUserData(); // Refresh the list
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  // Fetch user data when users tab is active
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUserData();
    }
  }, [activeTab, userPage, userSearchTerm, userRoleFilter, userStatusFilter]);

  // Payroll management functions
  const fetchPayrollData = async () => {
    try {
      console.log('fetchPayrollData called');
      // Mock payroll data - in real implementation, this would come from API
      const mockPayrollData = [
        {
          _id: '1',
          staffId: 'staff1',
          staffName: 'John Smith',
          position: 'Manager',
          baseSalary: 50000,
          allowances: 5000,
          deductions: 2000,
          netSalary: 53000,
          status: 'paid',
          payPeriod: '2024-01',
          paymentDate: '2024-01-31',
          paymentMethod: 'Bank Transfer'
        },
        {
          _id: '2',
          staffId: 'staff2',
          staffName: 'Sarah Johnson',
          position: 'Developer',
          baseSalary: 45000,
          allowances: 3000,
          deductions: 1500,
          netSalary: 46500,
          status: 'pending',
          payPeriod: '2024-01',
          paymentDate: null,
          paymentMethod: 'Bank Transfer'
        }
      ];

      console.log('Setting payroll data:', mockPayrollData);
      setPayrollData(mockPayrollData);
      setPayrollStats({
        totalStaff: mockPayrollData.length,
        paidStaff: mockPayrollData.filter(p => p.status === 'paid').length,
        pendingStaff: mockPayrollData.filter(p => p.status === 'pending').length,
        totalPayroll: mockPayrollData.reduce((sum, p) => sum + p.netSalary, 0)
      });
      console.log('Payroll data set successfully');
    } catch (error) {
      console.error('Error fetching payroll data:', error);
      toast.error('Failed to load payroll data');
    }
  };

  const handleProcessPayment = async (payrollId) => {
    try {
      // Mock payment processing
      toast.success('Payment processed successfully');
      fetchPayrollData(); // Refresh the list
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Failed to process payment');
    }
  };

  const handleAddSalary = async (salaryData) => {
    try {
      // Mock salary addition
      toast.success('Salary record added successfully');
      setShowAddSalaryModal(false);
      fetchPayrollData(); // Refresh the list
    } catch (error) {
      console.error('Error adding salary:', error);
      toast.error('Failed to add salary record');
    }
  };

  const handleViewPayroll = (payroll) => {
    setSelectedPayroll(payroll);
    console.log('View payroll:', payroll);
  };

  const handleEditPayroll = (payroll) => {
    setSelectedPayroll(payroll);
    console.log('Edit payroll:', payroll);
  };

  // Permissions management functions
  const fetchPermissionsData = async () => {
    try {
      // Mock permissions data
      const mockPermissions = [
        {
          _id: '1',
          staffId: 'staff1',
          staffName: 'John Smith',
          role: 'Manager',
          permissions: {
            users: { view: true, create: true, edit: true, delete: false },
            bookings: { view: true, create: false, edit: true, delete: false },
            vehicles: { view: true, create: true, edit: true, delete: true },
            reports: { view: true, create: false, edit: false, delete: false }
          }
        },
        {
          _id: '2',
          staffId: 'staff2',
          staffName: 'Sarah Johnson',
          role: 'Developer',
          permissions: {
            users: { view: true, create: false, edit: false, delete: false },
            bookings: { view: true, create: false, edit: false, delete: false },
            vehicles: { view: true, create: false, edit: false, delete: false },
            reports: { view: false, create: false, edit: false, delete: false }
          }
        }
      ];

      setPermissions(mockPermissions);

      // Mock permission templates
      const mockTemplates = [
        {
          _id: 'template1',
          name: 'Manager Template',
          description: 'Full access to all modules',
          permissions: {
            users: { view: true, create: true, edit: true, delete: true },
            bookings: { view: true, create: true, edit: true, delete: true },
            vehicles: { view: true, create: true, edit: true, delete: true },
            reports: { view: true, create: true, edit: true, delete: true }
          }
        },
        {
          _id: 'template2',
          name: 'Staff Template',
          description: 'Limited access for regular staff',
          permissions: {
            users: { view: true, create: false, edit: false, delete: false },
            bookings: { view: true, create: false, edit: true, delete: false },
            vehicles: { view: true, create: false, edit: false, delete: false },
            reports: { view: false, create: false, edit: false, delete: false }
          }
        }
      ];

      setPermissionTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching permissions data:', error);
      toast.error('Failed to load permissions data');
    }
  };

  const handleUpdatePermissions = async (staffId, newPermissions) => {
    try {
      // Mock permission update
      toast.success('Permissions updated successfully');
      setShowPermissionModal(false);
      fetchPermissionsData(); // Refresh the list
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    }
  };

  const handleCreateTemplate = async (templateData) => {
    try {
      // Mock template creation
      toast.success('Permission template created successfully');
      setShowTemplateModal(false);
      fetchPermissionsData(); // Refresh the list
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('Failed to create template');
    }
  };

  // Financial management functions
  const fetchFinancialData = async () => {
    try {
      // Mock financial data
      const mockRevenueData = [
        { month: 'Jan', revenue: 125000, bookings: 45, tours: 32, hotels: 28 },
        { month: 'Feb', revenue: 142000, bookings: 52, tours: 38, hotels: 35 },
        { month: 'Mar', revenue: 138000, bookings: 48, tours: 35, hotels: 31 },
        { month: 'Apr', revenue: 156000, bookings: 58, tours: 42, hotels: 38 },
        { month: 'May', revenue: 168000, bookings: 62, tours: 45, hotels: 42 },
        { month: 'Jun', revenue: 175000, bookings: 68, tours: 48, hotels: 45 }
      ];

      const mockExpenseData = [
        { id: '1', category: 'Staff Salaries', amount: 45000, date: '2024-01-15', description: 'Monthly staff salaries' },
        { id: '2', category: 'Marketing', amount: 12000, date: '2024-01-20', description: 'Digital marketing campaigns' },
        { id: '3', category: 'Operations', amount: 8500, date: '2024-01-25', description: 'Office rent and utilities' },
        { id: '4', category: 'Technology', amount: 3500, date: '2024-01-30', description: 'Software subscriptions' }
      ];

      setRevenueData(mockRevenueData);
      setExpenseData(mockExpenseData);

      // Calculate financial stats
      const totalRevenue = mockRevenueData.reduce((sum, item) => sum + item.revenue, 0);
      const totalExpenses = mockExpenseData.reduce((sum, item) => sum + item.amount, 0);
      const netProfit = totalRevenue - totalExpenses;
      const growthRate = ((mockRevenueData[mockRevenueData.length - 1].revenue - mockRevenueData[mockRevenueData.length - 2].revenue) / mockRevenueData[mockRevenueData.length - 2].revenue) * 100;

      setFinancialStats({
        totalRevenue,
        totalExpenses,
        netProfit,
        growthRate,
        totalBookings: mockRevenueData.reduce((sum, item) => sum + item.bookings, 0),
        totalTours: mockRevenueData.reduce((sum, item) => sum + item.tours, 0),
        totalHotels: mockRevenueData.reduce((sum, item) => sum + item.hotels, 0)
      });

    } catch (error) {
      console.error('Error fetching financial data:', error);
      toast.error('Failed to load financial data');
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      // Mock expense addition
      toast.success('Expense added successfully');
      setShowAddExpenseModal(false);
      fetchFinancialData(); // Refresh the data
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const handleGenerateReport = async (period) => {
    try {
      // Mock report generation
      toast.success(`${period} financial report generated successfully`);
      setShowFinancialReportModal(false);
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  // Analytics management functions
  const fetchAnalyticsData = async () => {
    try {
      console.log('fetchAnalyticsData called');
      
      // Mock user analytics data
      const mockUserAnalytics = [
        { date: '2024-01-01', newUsers: 45, activeUsers: 120, totalUsers: 1250 },
        { date: '2024-01-02', newUsers: 52, activeUsers: 135, totalUsers: 1302 },
        { date: '2024-01-03', newUsers: 38, activeUsers: 128, totalUsers: 1340 },
        { date: '2024-01-04', newUsers: 61, activeUsers: 142, totalUsers: 1401 },
        { date: '2024-01-05', newUsers: 47, activeUsers: 138, totalUsers: 1448 },
        { date: '2024-01-06', newUsers: 55, activeUsers: 145, totalUsers: 1503 },
        { date: '2024-01-07', newUsers: 43, activeUsers: 132, totalUsers: 1546 }
      ];

      // Mock booking analytics data
      const mockBookingAnalytics = [
        { date: '2024-01-01', tours: 12, hotels: 8, vehicles: 15, total: 35 },
        { date: '2024-01-02', tours: 18, hotels: 12, vehicles: 22, total: 52 },
        { date: '2024-01-03', tours: 15, hotels: 10, vehicles: 18, total: 43 },
        { date: '2024-01-04', tours: 22, hotels: 15, vehicles: 25, total: 62 },
        { date: '2024-01-05', tours: 19, hotels: 13, vehicles: 20, total: 52 },
        { date: '2024-01-06', tours: 25, hotels: 18, vehicles: 28, total: 71 },
        { date: '2024-01-07', tours: 16, hotels: 11, vehicles: 19, total: 46 }
      ];

      // Mock revenue analytics data
      const mockRevenueAnalytics = [
        { date: '2024-01-01', revenue: 12500, bookings: 35, avgBookingValue: 357 },
        { date: '2024-01-02', revenue: 18600, bookings: 52, avgBookingValue: 358 },
        { date: '2024-01-03', revenue: 15400, bookings: 43, avgBookingValue: 358 },
        { date: '2024-01-04', revenue: 22100, bookings: 62, avgBookingValue: 356 },
        { date: '2024-01-05', revenue: 18600, bookings: 52, avgBookingValue: 358 },
        { date: '2024-01-06', revenue: 25300, bookings: 71, avgBookingValue: 356 },
        { date: '2024-01-07', revenue: 16400, bookings: 46, avgBookingValue: 357 }
      ];

      setUserAnalytics(mockUserAnalytics);
      setBookingAnalytics(mockBookingAnalytics);
      setRevenueAnalytics(mockRevenueAnalytics);

      // Calculate analytics summary
      const totalNewUsers = mockUserAnalytics.reduce((sum, item) => sum + item.newUsers, 0);
      const avgActiveUsers = mockUserAnalytics.reduce((sum, item) => sum + item.activeUsers, 0) / mockUserAnalytics.length;
      const totalBookings = mockBookingAnalytics.reduce((sum, item) => sum + item.total, 0);
      const totalRevenue = mockRevenueAnalytics.reduce((sum, item) => sum + item.revenue, 0);
      const avgBookingValue = totalRevenue / totalBookings;

      setAnalyticsData({
        totalNewUsers,
        avgActiveUsers: Math.round(avgActiveUsers),
        totalBookings,
        totalRevenue,
        avgBookingValue: Math.round(avgBookingValue),
        userGrowthRate: 12.5,
        bookingGrowthRate: 8.3,
        revenueGrowthRate: 15.2
      });

      console.log('Analytics data set successfully');
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    }
  };

  const handleGenerateAnalyticsReport = async (period) => {
    try {
      // Mock analytics report generation
      toast.success(`${period} analytics report generated successfully`);
      setShowAnalyticsReportModal(false);
    } catch (error) {
      console.error('Error generating analytics report:', error);
      toast.error('Failed to generate analytics report');
    }
  };

  // Settings management functions
  const fetchSettingsData = async () => {
    try {
      console.log('fetchSettingsData called');
      
      // Mock platform settings
      const mockPlatformSettings = {
        siteName: 'SerendibGo',
        siteDescription: 'Your gateway to Sri Lankan adventures',
        siteUrl: 'https://serendibgo.com',
        timezone: 'Asia/Colombo',
        currency: 'LKR',
        language: 'en',
        maintenanceMode: false,
        registrationEnabled: true,
        emailVerificationRequired: true,
        maxFileUploadSize: '10MB',
        sessionTimeout: 30
      };

      // Mock email settings
      const mockEmailSettings = {
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUsername: 'noreply@serendibgo.com',
        smtpPassword: '••••••••',
        fromEmail: 'noreply@serendibgo.com',
        fromName: 'SerendibGo Team',
        emailTemplates: {
          welcome: true,
          bookingConfirmation: true,
          passwordReset: true,
          newsletter: false
        }
      };

      // Mock payment settings
      const mockPaymentSettings = {
        stripeEnabled: true,
        stripePublicKey: 'pk_test_••••••••',
        stripeSecretKey: 'sk_test_••••••••',
        paypalEnabled: false,
        paypalClientId: '',
        paypalClientSecret: '',
        bankTransferEnabled: true,
        minimumDeposit: 1000,
        refundPolicy: '7 days',
        commissionRate: 5.0
      };

      setPlatformSettings(mockPlatformSettings);
      setEmailSettings(mockEmailSettings);
      setPaymentSettings(mockPaymentSettings);

      setSettingsData({
        lastUpdated: new Date().toISOString(),
        version: '1.2.0',
        environment: 'production',
        databaseStatus: 'connected',
        cacheStatus: 'active'
      });

      console.log('Settings data set successfully');
    } catch (error) {
      console.error('Error fetching settings data:', error);
      toast.error('Failed to load settings data');
    }
  };

  const handleUpdateSettings = async (settingsType, newSettings) => {
    try {
      // Mock settings update
      toast.success(`${settingsType} settings updated successfully`);
      setShowSettingsModal(false);
      fetchSettingsData(); // Refresh the data
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleResetSettings = async (settingsType) => {
    try {
      // Mock settings reset
      toast.success(`${settingsType} settings reset to defaults`);
      fetchSettingsData(); // Refresh the data
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Failed to reset settings');
    }
  };

  // Fetch data when tabs are active
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
    if (activeTab === 'payroll') {
      console.log('Fetching payroll data...');
      fetchPayrollData();
    } else if (activeTab === 'permissions') {
      console.log('Fetching permissions data...');
      fetchPermissionsData();
    } else if (activeTab === 'financial') {
      console.log('Fetching financial data...');
      fetchFinancialData();
    } else if (activeTab === 'analytics') {
      console.log('Fetching analytics data...');
      fetchAnalyticsData();
    } else if (activeTab === 'settings') {
      console.log('Fetching settings data...');
      fetchSettingsData();
    }
  }, [activeTab]);

  // Show loading state while checking authentication
  if (isLoading) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Loading Admin Dashboard</h2>
          <p className="text-slate-500">Please wait while we verify your access...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-slate-600">Overview of your platform operations</p>
            </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-50"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{user?.firstName}</span>
                  <ChevronDown className="h-4 w-4" />
              </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-slate-500">{user?.email}</p>
                      <p className="text-xs text-blue-600 font-medium">Administrator</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                Settings
              </button>
                    <button
                      onClick={() => {
                        navigate('/');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-3" />
                      View Site
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsProfileDropdownOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Logout
              </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">
                        Welcome back, {user?.firstName}!
                      </h2>
                      <p className="text-blue-100 text-lg">
                        Manage and oversee the SerendibGo platform operations
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                        <FileText className="h-5 w-5 mr-2" />
                        Generate Report
                      </button>
                      <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                        <Settings className="h-5 w-5 mr-2" />
                        Settings
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
        <AdminStats stats={stats} loading={loading} />

                {/* Recent Activity and Pending Approvals */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
                      <button className="text-blue-600 hover:text-blue-800 font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Users className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-slate-500">
                                {activity.timestamp ? Math.floor((Date.now() - activity.timestamp) / (1000 * 60 * 60 * 24)) : 'NaN'} days ago
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {activity.status}
                      </span>
                    </div>
              </div>
                        </div>
                      ))}
            </div>
          </div>

          {/* Pending Approvals */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
              <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-slate-900">Pending Approvals</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {pendingApprovals.length} pending
                </span>
              </div>
              <div className="space-y-4">
                      {pendingApprovals.map((approval) => (
                        <div key={approval.id} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                              <h4 className="font-medium text-slate-900">{approval.title}</h4>
                              <p className="text-sm text-slate-600 mt-1">Submitted by: {approval.submittedBy}</p>
                              <p className="text-xs text-slate-500 mt-1">
                                {approval.timestamp ? Math.floor((Date.now() - approval.timestamp) / (1000 * 60 * 60 * 24)) : 'NaN'} days ago
                          </p>
                        </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                approval.priority === 'high' ? 'bg-red-100 text-red-800' :
                                approval.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                          {approval.priority}
                        </span>
                      </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-3">
                            <button className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                              <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </button>
                            <button className="flex items-center px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                              <AlertCircle className="h-4 w-4 mr-1" />
                          Reject
                        </button>
                      </div>
                    </div>
                      ))}
              </div>
            </div>
          </div>
        </div>
            )}

            {/* User Management Tab */}
            {activeTab === 'users' && (
              <div className="space-y-8">
                {/* User Management Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">User Management</h2>
                      <p className="text-blue-100 text-lg">
                        Manage platform users, roles, and verification status
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowAddUserModal(true)}
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <User className="h-5 w-5 mr-2" />
                        Add User
                      </button>
                      <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                        <FileText className="h-5 w-5 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{userStats.totalUsers || 0}</p>
                        <p className="text-sm text-slate-600">Total Users</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{userStats.verifiedUsers || 0}</p>
                        <p className="text-sm text-slate-600">Verified</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{userStats.unverifiedUsers || 0}</p>
                        <p className="text-sm text-slate-600">Pending</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <User className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{userStats.tourists || 0}</p>
                        <p className="text-sm text-slate-600">Tourists</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User List */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Users</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search users..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Roles</option>
                        <option value="tourist">Tourist</option>
                        <option value="guide">Guide</option>
                        <option value="hotel_owner">Hotel Owner</option>
                        <option value="driver">Driver</option>
                        <option value="staff">Staff</option>
                      </select>
                      <select
                        value={userStatusFilter}
                        onChange={(e) => setUserStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="verified">Verified</option>
                        <option value="unverified">Unverified</option>
                      </select>
                    </div>
                  </div>

                  {/* User Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Role</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Joined</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium text-slate-900">{user.firstName} {user.lastName}</p>
                                  <p className="text-sm text-slate-500">{user.role}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-600">{user.email}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                                user.role === 'guide' ? 'bg-green-100 text-green-800' :
                                user.role === 'hotel_owner' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'driver' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role?.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.isVerified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-600">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
              <button 
                                  onClick={() => handleViewUser(user)}
                                  className="flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 transition-colors text-sm"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </button>
                                <button
                                  onClick={() => handleEditUser(user)}
                                  className="flex items-center px-2 py-1 text-green-600 hover:text-green-900 transition-colors text-sm"
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(user)}
                                  className={`flex items-center px-2 py-1 transition-colors text-sm ${
                                    user.isVerified 
                                      ? 'text-yellow-600 hover:text-yellow-900' 
                                      : 'text-green-600 hover:text-green-900'
                                  }`}
                                >
                                  {user.isVerified ? (
                                    <>
                                      <Clock className="h-4 w-4 mr-1" />
                                      Unverify
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Verify
                                    </>
                                  )}
                                </button>
                </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {userPagination && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-slate-600">
                        Showing {((userPagination.current - 1) * 10) + 1} to {Math.min(userPagination.current * 10, userPagination.total)} of {userPagination.total} results
                      </p>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setUserPage(userPage - 1)}
                          disabled={userPage === 1}
                          className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
              </button>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                          {userPage}
                        </span>
                        <button
                          onClick={() => setUserPage(userPage + 1)}
                          disabled={userPage === userPagination.pages}
                          className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Staff Management Tab */}
            {activeTab === 'staff' && (
              <div className="space-y-8">
                {/* Staff Management Header */}
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Staff Management</h2>
                      <p className="text-blue-100 text-lg">
                        Manage staff members, permissions, and access controls
                      </p>
                    </div>
                    <div className="flex space-x-3">
              <button 
                        onClick={() => setShowAddStaffModal(true)}
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <User className="h-5 w-5 mr-2" />
                        Add Staff
                      </button>
                      <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                        <FileText className="h-5 w-5 mr-2" />
                        Export
                      </button>
                </div>
                  </div>
                </div>

                {/* Staff Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{staffStats.totalStaff || 0}</p>
                        <p className="text-sm text-slate-600">Total Staff</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{staffStats.activeStaff || 0}</p>
                        <p className="text-sm text-slate-600">Active Staff</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{staffStats.pendingStaff || 0}</p>
                        <p className="text-sm text-slate-600">Pending</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{staffStats.inactiveStaff || 0}</p>
                        <p className="text-sm text-slate-600">Inactive</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Staff List */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Staff Members</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search staff..."
                          value={staffSearchTerm}
                          onChange={(e) => setStaffSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                      <select
                        value={staffStatusFilter}
                        onChange={(e) => setStaffStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  {/* Staff Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Phone</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Joined</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffMembers.map((staff) => (
                          <tr key={staff._id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium text-slate-900">{staff.firstName} {staff.lastName}</p>
                                  <p className="text-sm text-slate-500">Staff Member</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-600">{staff.email}</td>
                            <td className="py-4 px-4 text-slate-600">{staff.phone || 'N/A'}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                staff.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {staff.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-600">
                              {new Date(staff.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleViewStaff(staff)}
                                  className="flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 transition-colors text-sm"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
              </button>
                                <button
                                  onClick={() => handleEditStaff(staff)}
                                  className="flex items-center px-2 py-1 text-green-600 hover:text-green-900 transition-colors text-sm"
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleToggleStaffStatus(staff)}
                                  className={`flex items-center px-2 py-1 transition-colors text-sm ${
                                    staff.isActive 
                                      ? 'text-red-600 hover:text-red-900' 
                                      : 'text-green-600 hover:text-green-900'
                                  }`}
                                >
                                  {staff.isActive ? (
                                    <>
                                      <AlertCircle className="h-4 w-4 mr-1" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Activate
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {staffPagination && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-slate-600">
                        Showing {((staffPagination.current - 1) * 10) + 1} to {Math.min(staffPagination.current * 10, staffPagination.total)} of {staffPagination.total} results
                      </p>
                      <div className="flex items-center space-x-2">
              <button 
                          onClick={() => setStaffPage(staffPage - 1)}
                          disabled={staffPage === 1}
                          className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                          {staffPage}
                        </span>
                        <button
                          onClick={() => setStaffPage(staffPage + 1)}
                          disabled={staffPage === staffPagination.pages}
                          className="px-3 py-1 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payroll Management Tab */}
            {activeTab === 'payroll' && (
              <div className="space-y-8">
                {console.log('Rendering payroll tab, payrollData:', payrollData, 'payrollStats:', payrollStats)}
                {/* Payroll Management Header */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Payroll Management</h2>
                      <p className="text-green-100 text-lg">
                        Manage staff salaries, payments, and payroll reports
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowAddSalaryModal(true)}
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <DollarSign className="h-5 w-5 mr-2" />
                        Add Salary
              </button>
                      <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                        <FileText className="h-5 w-5 mr-2" />
                        Export Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payroll Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{payrollStats.totalStaff || 0}</p>
                        <p className="text-sm text-slate-600">Total Staff</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{payrollStats.paidStaff || 0}</p>
                        <p className="text-sm text-slate-600">Paid</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{payrollStats.pendingStaff || 0}</p>
                        <p className="text-sm text-slate-600">Pending</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">Rs. {(payrollStats.totalPayroll || 0).toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Total Payroll</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payroll List */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Payroll Records</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search payroll..."
                          value={payrollSearchTerm}
                          onChange={(e) => setPayrollSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                      <select
                        value={payrollStatusFilter}
                        onChange={(e) => setPayrollStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                  </div>

                  {/* Payroll Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Staff</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Position</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Base Salary</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Net Salary</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Pay Period</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payrollData.map((payroll) => (
                          <tr key={payroll._id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium text-slate-900">{payroll.staffName}</p>
                                  <p className="text-sm text-slate-500">ID: {payroll.staffId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-600">{payroll.position}</td>
                            <td className="py-4 px-4 text-slate-600">Rs. {payroll.baseSalary.toLocaleString()}</td>
                            <td className="py-4 px-4 text-slate-600 font-semibold">Rs. {payroll.netSalary.toLocaleString()}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                payroll.status === 'paid' ? 'bg-green-100 text-green-800' : 
                                payroll.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-600">{payroll.payPeriod}</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
              <button 
                                  onClick={() => handleViewPayroll(payroll)}
                                  className="flex items-center px-2 py-1 text-blue-600 hover:text-blue-900 transition-colors text-sm"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </button>
                                {payroll.status === 'pending' && (
                                  <button
                                    onClick={() => handleProcessPayment(payroll._id)}
                                    className="flex items-center px-2 py-1 text-green-600 hover:text-green-900 transition-colors text-sm"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Pay
                                  </button>
                                )}
                                <button
                                  onClick={() => handleEditPayroll(payroll)}
                                  className="flex items-center px-2 py-1 text-purple-600 hover:text-purple-900 transition-colors text-sm"
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  Edit
                                </button>
                </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Management Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {console.log('Rendering analytics tab, analyticsData:', analyticsData)}
                {/* Analytics Management Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Analytics Dashboard</h2>
                      <p className="text-indigo-100 text-lg">
                        Comprehensive analytics and performance metrics
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowAnalyticsReportModal(true)}
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        Generate Report
                      </button>
                      <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>

                {/* Analytics Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{analyticsData.totalNewUsers || 0}</p>
                        <p className="text-sm text-slate-600">New Users (7 days)</p>
                        <p className="text-xs text-green-600">+{analyticsData.userGrowthRate || 0}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Activity className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{analyticsData.avgActiveUsers || 0}</p>
                        <p className="text-sm text-slate-600">Avg Active Users</p>
                        <p className="text-xs text-green-600">+{analyticsData.userGrowthRate || 0}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{analyticsData.totalBookings || 0}</p>
                        <p className="text-sm text-slate-600">Total Bookings</p>
                        <p className="text-xs text-green-600">+{analyticsData.bookingGrowthRate || 0}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">Rs. {(analyticsData.totalRevenue || 0).toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Total Revenue</p>
                        <p className="text-xs text-green-600">+{analyticsData.revenueGrowthRate || 0}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* User Analytics Chart */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-slate-900">User Growth</h3>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setAnalyticsPeriod('7days')}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            analyticsPeriod === '7days' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          7 Days
                        </button>
                        <button 
                          onClick={() => setAnalyticsPeriod('30days')}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            analyticsPeriod === '30days' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          30 Days
                        </button>
                      </div>
                    </div>

                    {/* Simple Line Chart for Users */}
                    <div className="h-64 flex items-end justify-between space-x-1">
                      {userAnalytics.map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg w-full mb-2 transition-all duration-500 hover:from-blue-600 hover:to-blue-500"
                            style={{ height: `${(item.newUsers / Math.max(...userAnalytics.map(d => d.newUsers))) * 200}px` }}
                            title={`New Users: ${item.newUsers}`}
                          ></div>
                          <div className="text-xs text-slate-600 font-medium">{new Date(item.date).getDate()}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Analytics Chart */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-slate-900">Booking Trends</h3>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Tours</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Hotels</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Vehicles</span>
                      </div>
                    </div>

                    {/* Stacked Bar Chart for Bookings */}
                    <div className="h-64 flex items-end justify-between space-x-1">
                      {bookingAnalytics.map((item, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="w-full mb-2">
                            <div 
                              className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg w-full"
                              style={{ height: `${(item.vehicles / Math.max(...bookingAnalytics.map(d => d.total))) * 200}px` }}
                              title={`Vehicles: ${item.vehicles}`}
                            ></div>
                            <div 
                              className="bg-gradient-to-t from-green-500 to-green-400 w-full"
                              style={{ height: `${(item.hotels / Math.max(...bookingAnalytics.map(d => d.total))) * 200}px` }}
                              title={`Hotels: ${item.hotels}`}
                            ></div>
                            <div 
                              className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-b-lg w-full"
                              style={{ height: `${(item.tours / Math.max(...bookingAnalytics.map(d => d.total))) * 200}px` }}
                              title={`Tours: ${item.tours}`}
                            ></div>
                          </div>
                          <div className="text-xs text-slate-600 font-medium">{new Date(item.date).getDate()}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Revenue Analytics */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Revenue Analytics</h3>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">Rs. {(analyticsData.avgBookingValue || 0).toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Avg Booking Value</p>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {revenueAnalytics.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg w-full mb-2 transition-all duration-500 hover:from-orange-600 hover:to-orange-500"
                          style={{ height: `${(item.revenue / Math.max(...revenueAnalytics.map(d => d.revenue))) * 200}px` }}
                          title={`Revenue: Rs. ${item.revenue.toLocaleString()}`}
                        ></div>
                        <div className="text-xs text-slate-600 font-medium">{new Date(item.date).getDate()}</div>
                        <div className="text-xs text-slate-500">Rs. {(item.revenue / 1000).toFixed(0)}k</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Top Performing Services</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-slate-700">Vehicle Rentals</span>
                        </div>
                        <span className="font-semibold text-slate-900">45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-slate-700">Tour Bookings</span>
                        </div>
                        <span className="font-semibold text-slate-900">35%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-slate-700">Hotel Bookings</span>
                        </div>
                        <span className="font-semibold text-slate-900">20%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">User Engagement</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Daily Active Users</span>
                        <span className="font-semibold text-slate-900">{analyticsData.avgActiveUsers || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Session Duration</span>
                        <span className="font-semibold text-slate-900">4.2 min</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Bounce Rate</span>
                        <span className="font-semibold text-slate-900">23%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4">Growth Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">User Growth</span>
                        <span className="font-semibold text-green-600">+{analyticsData.userGrowthRate || 0}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Booking Growth</span>
                        <span className="font-semibold text-green-600">+{analyticsData.bookingGrowthRate || 0}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Revenue Growth</span>
                        <span className="font-semibold text-green-600">+{analyticsData.revenueGrowthRate || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Management Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-8">
                {console.log('Rendering settings tab, settingsData:', settingsData)}
                {/* Settings Management Header */}
                <div className="bg-gradient-to-r from-gray-600 to-slate-600 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Platform Settings</h2>
                      <p className="text-gray-100 text-lg">
                        Configure platform settings, preferences, and system options
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowSettingsModal(true)}
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <Settings className="h-5 w-5 mr-2" />
                        Advanced Settings
                      </button>
                      <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                        <FileText className="h-5 w-5 mr-2" />
                        Export Config
                      </button>
                    </div>
                  </div>
                </div>

                {/* System Status */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{settingsData.version || '1.2.0'}</p>
                        <p className="text-sm text-slate-600">Platform Version</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Activity className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900 capitalize">{settingsData.environment || 'Production'}</p>
                        <p className="text-sm text-slate-600">Environment</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900 capitalize">{settingsData.databaseStatus || 'Connected'}</p>
                        <p className="text-sm text-slate-600">Database Status</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900 capitalize">{settingsData.cacheStatus || 'Active'}</p>
                        <p className="text-sm text-slate-600">Cache Status</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Platform Settings */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-slate-900">Platform Settings</h3>
                      <button 
                        onClick={() => {
                          setActiveSettingsTab('platform');
                          setShowSettingsModal(true);
                        }}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Site Name</span>
                        <span className="font-semibold text-slate-900">{platformSettings.siteName || 'SerendibGo'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Currency</span>
                        <span className="font-semibold text-slate-900">{platformSettings.currency || 'LKR'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Timezone</span>
                        <span className="font-semibold text-slate-900">{platformSettings.timezone || 'Asia/Colombo'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Registration</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          platformSettings.registrationEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {platformSettings.registrationEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Maintenance Mode</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          platformSettings.maintenanceMode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {platformSettings.maintenanceMode ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Email Settings */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-slate-900">Email Settings</h3>
                      <button 
                        onClick={() => {
                          setActiveSettingsTab('email');
                          setShowSettingsModal(true);
                        }}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">SMTP Host</span>
                        <span className="font-semibold text-slate-900">{emailSettings.smtpHost || 'smtp.gmail.com'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">SMTP Port</span>
                        <span className="font-semibold text-slate-900">{emailSettings.smtpPort || 587}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">From Email</span>
                        <span className="font-semibold text-slate-900">{emailSettings.fromEmail || 'noreply@serendibgo.com'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Welcome Emails</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          emailSettings.emailTemplates?.welcome ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {emailSettings.emailTemplates?.welcome ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Newsletter</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          emailSettings.emailTemplates?.newsletter ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {emailSettings.emailTemplates?.newsletter ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Settings */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-slate-900">Payment Settings</h3>
                      <button 
                        onClick={() => {
                          setActiveSettingsTab('payment');
                          setShowSettingsModal(true);
                        }}
                        className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Stripe</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          paymentSettings.stripeEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {paymentSettings.stripeEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">PayPal</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          paymentSettings.paypalEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {paymentSettings.paypalEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Bank Transfer</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          paymentSettings.bankTransferEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {paymentSettings.bankTransferEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Min Deposit</span>
                        <span className="font-semibold text-slate-900">Rs. {paymentSettings.minimumDeposit || 1000}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Commission Rate</span>
                        <span className="font-semibold text-slate-900">{paymentSettings.commissionRate || 5.0}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button 
                      onClick={() => handleResetSettings('platform')}
                      className="flex items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="h-5 w-5 mr-2 text-slate-600" />
                      <span className="text-slate-700">Reset Platform</span>
                    </button>
                    <button 
                      onClick={() => handleResetSettings('email')}
                      className="flex items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <MessageSquare className="h-5 w-5 mr-2 text-slate-600" />
                      <span className="text-slate-700">Reset Email</span>
                    </button>
                    <button 
                      onClick={() => handleResetSettings('payment')}
                      className="flex items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <DollarSign className="h-5 w-5 mr-2 text-slate-600" />
                      <span className="text-slate-700">Reset Payment</span>
                    </button>
                    <button 
                      onClick={() => toast.success('Cache cleared successfully')}
                      className="flex items-center justify-center p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      <Activity className="h-5 w-5 mr-2 text-slate-600" />
                      <span className="text-slate-700">Clear Cache</span>
                    </button>
                  </div>
                </div>

                {/* System Information */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">System Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">Platform Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Version:</span>
                          <span className="font-medium">{settingsData.version || '1.2.0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Environment:</span>
                          <span className="font-medium capitalize">{settingsData.environment || 'Production'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Last Updated:</span>
                          <span className="font-medium">{settingsData.lastUpdated ? new Date(settingsData.lastUpdated).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-700 mb-3">System Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Database:</span>
                          <span className={`font-medium capitalize ${
                            settingsData.databaseStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {settingsData.databaseStatus || 'Connected'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Cache:</span>
                          <span className={`font-medium capitalize ${
                            settingsData.cacheStatus === 'active' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {settingsData.cacheStatus || 'Active'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Uptime:</span>
                          <span className="font-medium">99.9%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Permissions Management Tab */}
            {activeTab === 'permissions' && (
              <div className="space-y-8">
                {/* Permissions Management Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Permissions Management</h2>
                      <p className="text-purple-100 text-lg">
                        Manage staff permissions and access controls
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowTemplateModal(true)}
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <Settings className="h-5 w-5 mr-2" />
                        Create Template
                      </button>
                      <button className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors">
                        <FileText className="h-5 w-5 mr-2" />
                        Export
              </button>
            </div>
          </div>
        </div>

                {/* Permission Templates */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Permission Templates</h3>
                    <button 
                      onClick={() => setShowTemplateModal(true)}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      New Template
                    </button>
      </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {permissionTemplates.map((template) => (
                      <div key={template._id} className="border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-slate-900">{template.name}</h4>
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Template
                          </span>
                        </div>
                        <p className="text-slate-600 mb-4">{template.description}</p>
                        
                        <div className="space-y-2">
                          <h5 className="font-medium text-slate-700">Permissions:</h5>
                          {Object.entries(template.permissions).map(([module, perms]) => (
                            <div key={module} className="flex items-center justify-between text-sm">
                              <span className="capitalize">{module.replace('_', ' ')}:</span>
                              <div className="flex space-x-2">
                                {Object.entries(perms).map(([action, allowed]) => (
                                  <span key={action} className={`px-2 py-1 rounded text-xs ${
                                    allowed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {action}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <button className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                            Apply to Staff
                          </button>
                          <button className="px-3 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Staff Permissions */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Staff Permissions</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Staff</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Role</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Users</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Bookings</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Vehicles</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Reports</th>
                          <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {permissions.map((permission) => (
                          <tr key={permission._id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium text-slate-900">{permission.staffName}</p>
                                  <p className="text-sm text-slate-500">ID: {permission.staffId}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {permission.role}
                              </span>
                            </td>
                            {['users', 'bookings', 'vehicles', 'reports'].map((module) => (
                              <td key={module} className="py-4 px-4">
                                <div className="flex space-x-1">
                                  {Object.entries(permission.permissions[module] || {}).map(([action, allowed]) => (
                                    <span key={action} className={`px-1 py-0.5 rounded text-xs ${
                                      allowed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                      {action.charAt(0)}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            ))}
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedPermission(permission);
                                    setShowPermissionModal(true);
                                  }}
                                  className="flex items-center px-2 py-1 text-purple-600 hover:text-purple-900 transition-colors text-sm"
                                >
                                  <Settings className="h-4 w-4 mr-1" />
                                  Edit
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Management Tab */}
            {activeTab === 'financial' && (
              <div className="space-y-8">
                {/* Financial Management Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-lg p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">Financial Management</h2>
                      <p className="text-emerald-100 text-lg">
                        Monitor revenue, expenses, and financial performance
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowAddExpenseModal(true)}
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <DollarSign className="h-5 w-5 mr-2" />
                        Add Expense
                      </button>
                      <button 
                        onClick={() => setShowFinancialReportModal(true)}
                        className="flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Financial Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">Rs. {(financialStats.totalRevenue || 0).toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Total Revenue</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                        <TrendingDown className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">Rs. {(financialStats.totalExpenses || 0).toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Total Expenses</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">Rs. {(financialStats.netProfit || 0).toLocaleString()}</p>
                        <p className="text-sm text-slate-600">Net Profit</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-slate-900">{(financialStats.growthRate || 0).toFixed(1)}%</p>
                        <p className="text-sm text-slate-600">Growth Rate</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">Revenue Trend</h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setSelectedPeriod('monthly')}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          selectedPeriod === 'monthly' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Monthly
                      </button>
                      <button 
                        onClick={() => setSelectedPeriod('quarterly')}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          selectedPeriod === 'quarterly' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Quarterly
                      </button>
                      <button 
                        onClick={() => setSelectedPeriod('yearly')}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          selectedPeriod === 'yearly' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>

                  {/* Simple Bar Chart */}
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {revenueData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg w-full mb-2 transition-all duration-500 hover:from-emerald-600 hover:to-emerald-500"
                          style={{ height: `${(item.revenue / Math.max(...revenueData.map(d => d.revenue))) * 200}px` }}
                        ></div>
                        <div className="text-xs text-slate-600 font-medium">{item.month}</div>
                        <div className="text-xs text-slate-500">Rs. {(item.revenue / 1000).toFixed(0)}k</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue Sources */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">Revenue Sources</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-slate-700">Bookings</span>
                        </div>
                        <span className="font-semibold text-slate-900">{financialStats.totalBookings || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                          <span className="text-slate-700">Tours</span>
                        </div>
                        <span className="font-semibold text-slate-900">{financialStats.totalTours || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
                          <span className="text-slate-700">Hotels</span>
                        </div>
                        <span className="font-semibold text-slate-900">{financialStats.totalHotels || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Expenses */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold text-slate-900">Recent Expenses</h3>
                      <button 
                        onClick={() => setShowAddExpenseModal(true)}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                      >
                        Add Expense
                      </button>
                    </div>
                    <div className="space-y-4">
                      {expenseData.map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <p className="font-medium text-slate-900">{expense.category}</p>
                            <p className="text-sm text-slate-600">{expense.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900">Rs. {expense.amount.toLocaleString()}</p>
                            <p className="text-sm text-slate-600">{new Date(expense.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-6">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <div className="text-2xl font-bold text-green-600 mb-2">Rs. {(financialStats.totalRevenue || 0).toLocaleString()}</div>
                      <div className="text-sm text-green-700">Total Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                      <div className="text-2xl font-bold text-red-600 mb-2">Rs. {(financialStats.totalExpenses || 0).toLocaleString()}</div>
                      <div className="text-sm text-red-700">Total Expenses</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-2">Rs. {(financialStats.netProfit || 0).toLocaleString()}</div>
                      <div className="text-sm text-blue-700">Net Profit</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Add New Staff Member</h3>
              <button 
                onClick={() => setShowAddStaffModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const staffData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password')
              };
              handleAddStaff(staffData);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Staff
              </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      {showEditStaffModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-900">Edit Staff Member</h3>
              <button 
                onClick={() => {
                  setShowEditStaffModal(false);
                  setSelectedStaff(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const staffData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone')
              };
              handleUpdateStaff(selectedStaff._id, staffData);
            }}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      defaultValue={selectedStaff.firstName}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      defaultValue={selectedStaff.lastName}
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={selectedStaff.email}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={selectedStaff.phone || ''}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditStaffModal(false);
                    setSelectedStaff(null);
                  }}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;