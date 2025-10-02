import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  MapPin,
  Star,
  Clock,
  Users,
  Award,
  Globe,
  Camera,
  Save,
  Edit3,
  Eye,
  Phone,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Upload,
  X,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Languages,
  Briefcase,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Heart,
  Bell,
  Headphones,
  Home,
  TrendingUp,
  BookOpen,
  LogOut,
  ChevronDown
} from 'lucide-react'
import { guideService } from '../../services/guideService'
import { useAuth } from '../../context/AuthContext'

const GuideDashboard = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [guideStats, setGuideStats] = useState({
    activeBookings: 0,
    averageRating: 0,
    totalEarnings: 0,
    newMessages: 0
  })
  
  // Guide profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: '',
    profile: {
      guideLicense: '',
      languages: [],
      experience: 0,
      specialties: [],
      location: '',
      pricePerDay: 0,
      bio: '',
      certifications: [],
      responseTime: 'Within 24 hours',
      highlights: [],
      availability: 'Available'
    }
  })

  // Form states
  const [newLanguage, setNewLanguage] = useState('')
  const [newSpecialty, setNewSpecialty] = useState('')
  const [newCertification, setNewCertification] = useState('')
  const [newHighlight, setNewHighlight] = useState('')

  // Validation states
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Get current user info
  useEffect(() => {
    if (isLoading) return
    
    if (!isAuthenticated || !user) {
      navigate('/login')
      return
    }
    
    if (user.role !== 'guide') {
      navigate('/dashboard')
      return
    }
    
    // Debug: Log user data
    console.log('User data loaded:', user)
    console.log('User profile data:', user.profile)
    
    // Set initial profile data
    setProfile({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || '',
      profile: {
        guideLicense: user.profile?.guideLicense || '',
        languages: user.profile?.languages || [],
        experience: user.profile?.experience || 0,
        specialties: user.profile?.specialties || [],
        location: user.profile?.location || '',
        pricePerDay: user.profile?.pricePerDay || 0,
        bio: user.profile?.bio || '',
        certifications: user.profile?.certifications || [],
        responseTime: user.profile?.responseTime || 'Within 24 hours',
        highlights: user.profile?.highlights || [],
        availability: user.profile?.availability || 'Available'
      }
    })
  }, [isLoading, isAuthenticated, user, navigate])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  // Fetch guide stats when component loads
  useEffect(() => {
    if (user?.id) {
      fetchGuideStats()
    }
  }, [user?.id])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  // Validation functions
  const validateField = (name, value) => {
    const newErrors = { ...errors }
    
    switch (name) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
          newErrors.email = 'Email is required'
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address'
        } else {
          delete newErrors.email
        }
        break
        
      case 'phone':
        if (!value.trim()) {
          newErrors.phone = 'Phone number is required'
        } else {
          // Remove all non-digit characters to check length
          const digitsOnly = value.replace(/\D/g, '')
          if (digitsOnly.length !== 10) {
            newErrors.phone = 'Phone number must be exactly 10 digits'
          } else {
            delete newErrors.phone
          }
        }
        break
        
      case 'bio':
        if (!value.trim()) {
          newErrors.bio = 'Bio is required'
        } else if (value.trim().length < 50) {
          newErrors.bio = 'Bio must be at least 50 characters'
        } else if (value.trim().length > 1000) {
          newErrors.bio = 'Bio cannot exceed 1000 characters'
        } else {
          delete newErrors.bio
        }
        break
        
      default:
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = (formType = 'profile') => {
    const newErrors = {}
    
    if (formType === 'profile') {
      // Only validate essential fields for profile form
      if (!profile.email.trim()) newErrors.email = 'Email is required'
      if (!profile.phone.trim()) newErrors.phone = 'Phone number is required'
      if (!profile.profile.bio.trim()) newErrors.bio = 'Bio is required'
      
      // Validate email format only if email is provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (profile.email && !emailRegex.test(profile.email)) {
        newErrors.email = 'Please enter a valid email address'
      }
      
      // Validate phone format only if phone is provided
      if (profile.phone) {
        const digitsOnly = profile.phone.replace(/\D/g, '')
        if (digitsOnly.length !== 10) {
          newErrors.phone = 'Phone number must be exactly 10 digits'
        }
      }
      
      // Validate bio length only if bio is provided
      if (profile.profile.bio && (profile.profile.bio.length < 50 || profile.profile.bio.length > 1000)) {
        newErrors.bio = 'Bio must be between 50 and 1000 characters'
      }
    } else if (formType === 'pricing') {
      // Validate pricing fields
      if (!profile.profile.pricePerDay || profile.profile.pricePerDay === 0) {
        newErrors.pricePerDay = 'Price per day is required'
      } else if (profile.profile.pricePerDay < 1000) {
        newErrors.pricePerDay = 'Price must be at least LKR 1,000'
      } else if (profile.profile.pricePerDay > 100000) {
        newErrors.pricePerDay = 'Price cannot exceed LKR 100,000'
      }
    } else if (formType === 'services') {
      // No validation needed for services (placeholder form)
      // This form doesn't have any required fields yet
    } else if (formType === 'availability') {
      // No validation needed for availability (placeholder form)
      // This form doesn't have any required fields yet
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFieldChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }))
    }
    
    // Validate field on change
    validateField(field, value)
  }

  const handleFieldBlur = (field) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const fetchGuideStats = async () => {
    try {
      if (user?.id) {
        const response = await guideService.getGuideStats(user.id)
        setGuideStats({
          activeBookings: response.data.totalBookings || 0,
          averageRating: response.data.averageRating || 0,
          totalEarnings: response.data.totalRevenue || 0,
          newMessages: Math.floor(Math.random() * 5) // Placeholder for now
        })
      }
    } catch (error) {
      console.error('Error fetching guide stats:', error)
      // Set default values if API fails
      setGuideStats({
        activeBookings: 12,
        averageRating: 4.8,
        totalEarnings: 45000,
        newMessages: 3
      })
    }
  }

  // Save Profile Information
  const handleSaveProfile = async () => {
    if (!validateForm('profile')) {
      showMessage('error', 'Please fix the validation errors before saving')
      const touchedFields = { email: true, phone: true, bio: true }
      setTouched(touchedFields)
      return
    }

    try {
      setSaving(true)
      
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar,
        profile: {
          guideLicense: profile.profile.guideLicense,
          languages: profile.profile.languages,
          experience: profile.profile.experience,
          specialties: profile.profile.specialties,
          location: profile.profile.location,
          pricePerDay: profile.profile.pricePerDay, // Keep existing price
          bio: profile.profile.bio,
          certifications: profile.profile.certifications,
          responseTime: profile.profile.responseTime,
          highlights: profile.profile.highlights,
          availability: profile.profile.availability
        }
      }
      
      console.log('Saving profile data:', updateData)
      
      const response = await guideService.updateGuideProfile(updateData)
      
      if (response.data && response.data.data) {
        const savedProfile = response.data.data
        
        // Update user data
        const updatedUser = {
          ...user,
          firstName: savedProfile.firstName || user.firstName,
          lastName: savedProfile.lastName || user.lastName,
          email: savedProfile.email || user.email,
          phone: savedProfile.phone || user.phone,
          avatar: savedProfile.avatar || user.avatar,
          profile: {
            ...user.profile,
            guideLicense: savedProfile.profile?.guideLicense || user.profile?.guideLicense,
            languages: savedProfile.profile?.languages || user.profile?.languages,
            experience: savedProfile.profile?.experience || user.profile?.experience,
            specialties: savedProfile.profile?.specialties || user.profile?.specialties,
            location: savedProfile.profile?.location || user.profile?.location,
            pricePerDay: savedProfile.profile?.pricePerDay || user.profile?.pricePerDay,
            bio: savedProfile.profile?.bio || user.profile?.bio,
            certifications: savedProfile.profile?.certifications || user.profile?.certifications,
            responseTime: savedProfile.profile?.responseTime || user.profile?.responseTime,
            highlights: savedProfile.profile?.highlights || user.profile?.highlights,
            availability: savedProfile.profile?.availability || user.profile?.availability
          }
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        setProfile({
          firstName: savedProfile.firstName || profile.firstName,
          lastName: savedProfile.lastName || profile.lastName,
          email: savedProfile.email || profile.email,
          phone: savedProfile.phone || profile.phone,
          avatar: savedProfile.avatar || profile.avatar,
          profile: {
            guideLicense: savedProfile.profile?.guideLicense || profile.profile.guideLicense,
            languages: savedProfile.profile?.languages || profile.profile.languages,
            experience: savedProfile.profile?.experience || profile.profile.experience,
            specialties: savedProfile.profile?.specialties || profile.profile.specialties,
            location: savedProfile.profile?.location || profile.profile.location,
            pricePerDay: savedProfile.profile?.pricePerDay || profile.profile.pricePerDay,
            bio: savedProfile.profile?.bio || profile.profile.bio,
            certifications: savedProfile.profile?.certifications || profile.profile.certifications,
            responseTime: savedProfile.profile?.responseTime || profile.profile.responseTime,
            highlights: savedProfile.profile?.highlights || profile.profile.highlights,
            availability: savedProfile.profile?.availability || profile.profile.availability
          }
        })
      }
      
      showMessage('success', 'Profile information updated successfully!')
      
      window.dispatchEvent(new CustomEvent('guideProfileUpdated', {
        detail: { guideId: user.id, updatedData: savedProfile }
      }))
    } catch (error) {
      console.error('Error updating profile:', error)
      showMessage('error', 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Save Pricing Information
  const handleSavePricing = async () => {
    if (!validateForm('pricing')) {
      showMessage('error', 'Please fix the validation errors before saving')
      const touchedFields = { pricePerDay: true }
      setTouched(touchedFields)
      return
    }

    try {
      setSaving(true)
      
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        avatar: profile.avatar,
        profile: {
          guideLicense: profile.profile.guideLicense,
          languages: profile.profile.languages,
          experience: profile.profile.experience,
          specialties: profile.profile.specialties,
          location: profile.profile.location,
          pricePerDay: profile.profile.pricePerDay, // Only update price
          bio: profile.profile.bio,
          certifications: profile.profile.certifications,
          responseTime: profile.profile.responseTime,
          highlights: profile.profile.highlights,
          availability: profile.profile.availability
        }
      }
      
      console.log('Saving pricing data:', updateData)
      
      const response = await guideService.updateGuideProfile(updateData)
      
      if (response.data && response.data.data) {
        const savedProfile = response.data.data
        
        // Update user data
        const updatedUser = {
          ...user,
          firstName: savedProfile.firstName || user.firstName,
          lastName: savedProfile.lastName || user.lastName,
          email: savedProfile.email || user.email,
          phone: savedProfile.phone || user.phone,
          avatar: savedProfile.avatar || user.avatar,
          profile: {
            ...user.profile,
            guideLicense: savedProfile.profile?.guideLicense || user.profile?.guideLicense,
            languages: savedProfile.profile?.languages || user.profile?.languages,
            experience: savedProfile.profile?.experience || user.profile?.experience,
            specialties: savedProfile.profile?.specialties || user.profile?.specialties,
            location: savedProfile.profile?.location || user.profile?.location,
            pricePerDay: savedProfile.profile?.pricePerDay || user.profile?.pricePerDay,
            bio: savedProfile.profile?.bio || user.profile?.bio,
            certifications: savedProfile.profile?.certifications || user.profile?.certifications,
            responseTime: savedProfile.profile?.responseTime || user.profile?.responseTime,
            highlights: savedProfile.profile?.highlights || user.profile?.highlights,
            availability: savedProfile.profile?.availability || user.profile?.availability
          }
        }
        
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        setProfile({
          firstName: savedProfile.firstName || profile.firstName,
          lastName: savedProfile.lastName || profile.lastName,
          email: savedProfile.email || profile.email,
          phone: savedProfile.phone || profile.phone,
          avatar: savedProfile.avatar || profile.avatar,
          profile: {
            guideLicense: savedProfile.profile?.guideLicense || profile.profile.guideLicense,
            languages: savedProfile.profile?.languages || profile.profile.languages,
            experience: savedProfile.profile?.experience || profile.profile.experience,
            specialties: savedProfile.profile?.specialties || profile.profile.specialties,
            location: savedProfile.profile?.location || profile.profile.location,
            pricePerDay: savedProfile.profile?.pricePerDay || profile.profile.pricePerDay,
            bio: savedProfile.profile?.bio || profile.profile.bio,
            certifications: savedProfile.profile?.certifications || profile.profile.certifications,
            responseTime: savedProfile.profile?.responseTime || profile.profile.responseTime,
            highlights: savedProfile.profile?.highlights || profile.profile.highlights,
            availability: savedProfile.profile?.availability || profile.profile.availability
          }
        })
      }
      
      showMessage('success', 'Pricing updated successfully!')
      
      window.dispatchEvent(new CustomEvent('guideProfileUpdated', {
        detail: { guideId: user.id, updatedData: savedProfile }
      }))
    } catch (error) {
      console.error('Error updating pricing:', error)
      showMessage('error', 'Failed to update pricing. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Save Services Information (placeholder for future implementation)
  const handleSaveServices = async () => {
    try {
      setSaving(true)
      // Future implementation for services
      showMessage('success', 'Services updated successfully!')
    } catch (error) {
      console.error('Error updating services:', error)
      showMessage('error', 'Failed to update services. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Save Availability Information (placeholder for future implementation)
  const handleSaveAvailability = async () => {
    try {
      setSaving(true)
      // Future implementation for availability
      showMessage('success', 'Availability updated successfully!')
    } catch (error) {
      console.error('Error updating availability:', error)
      showMessage('error', 'Failed to update availability. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addItem = (type, value) => {
    if (!value.trim()) return
    
    // Validate the input based on type
    const fieldName = `new${type.charAt(0).toUpperCase() + type.slice(1)}`
    if (!validateField(fieldName, value)) {
      return
    }
    
    const newItem = value.trim()
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [type]: [...prev.profile[type], newItem]
      }
    }))
    
    // Clear input
    switch(type) {
      case 'languages': setNewLanguage(''); break
      case 'specialties': setNewSpecialty(''); break
      case 'certifications': setNewCertification(''); break
      case 'highlights': setNewHighlight(''); break
    }
  }

  const removeItem = (type, index) => {
    setProfile(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [type]: prev.profile[type].filter((_, i) => i !== index)
      }
    }))
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'availability', label: 'Availability', icon: Calendar },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Support', icon: Headphones }
  ]

  const handleTabClick = (tabId) => {
    if (tabId === 'notifications') {
      navigate('/guide-notifications')
    } else if (tabId === 'support') {
      navigate('/guide-support')
    } else {
      setActiveTab(tabId)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Guide Dashboard</h1>
                <p className="text-slate-600">Manage your profile and services</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/guides')}
                className="flex items-center px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Public Profile
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
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('profile')
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Profile Settings
                    </button>
                    <button
                      onClick={() => {
                        navigate('/guide-support')
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Headphones className="h-4 w-4 mr-3" />
                      Support
                    </button>
                    <button
                      onClick={() => {
                        navigate('/guide-notifications')
                        setIsProfileDropdownOpen(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Bell className="h-4 w-4 mr-3" />
                      Notifications
                    </button>
                    <hr className="my-1 border-slate-100" />
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsProfileDropdownOpen(false)
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

      {/* Message */}
      {message.text && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className={`p-4 rounded-xl border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              {message.text}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-8">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
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
                  )
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
                        Welcome back, {profile.firstName}!
                      </h2>
                      <p className="text-blue-100 text-lg">
                        Ready to show tourists the beauty of Sri Lanka?
                      </p>
                    </div>
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                      <User className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{guideStats.activeBookings}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Active Bookings</h3>
                    <p className="text-sm text-slate-600">Tours scheduled this month</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <Star className="h-6 w-6 text-yellow-600" />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{guideStats.averageRating}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Average Rating</h3>
                    <p className="text-sm text-slate-600">Based on customer reviews</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">LKR {guideStats.totalEarnings.toLocaleString()}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">Total Earnings</h3>
                    <p className="text-sm text-slate-600">All-time earnings</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Bell className="h-6 w-6 text-purple-600" />
                      </div>
                      <span className="text-2xl font-bold text-slate-900">{guideStats.newMessages}</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">New Messages</h3>
                    <p className="text-sm text-slate-600">Unread notifications</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <TrendingUp className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Update Profile</h3>
                      <p className="text-sm text-slate-600">Keep your information current</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('availability')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                        <Calendar className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Set Availability</h3>
                      <p className="text-sm text-slate-600">Manage your schedule</p>
                    </button>

                    <button
                      onClick={() => navigate('/guide-notifications')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                        <Bell className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">View Notifications</h3>
                      <p className="text-sm text-slate-600">Check messages and updates</p>
                    </button>

                    <button
                      onClick={() => navigate('/guide-support')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                        <Headphones className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Get Support</h3>
                      <p className="text-sm text-slate-600">Contact customer support</p>
                    </button>

                    <button
                      onClick={() => setActiveTab('pricing')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
                        <DollarSign className="h-6 w-6 text-yellow-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">Update Pricing</h3>
                      <p className="text-sm text-slate-600">Adjust your rates</p>
                    </button>

                    <button
                      onClick={() => navigate('/guides')}
                      className="p-6 border-2 border-slate-200 rounded-xl hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 text-left group"
                    >
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition-colors">
                        <Eye className="h-6 w-6 text-cyan-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2">View Public Profile</h3>
                      <p className="text-sm text-slate-600">See how tourists see you</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">New booking received</h3>
                        <p className="text-sm text-slate-600">Colombo City Tour - Tomorrow 9:00 AM</p>
                      </div>
                      <span className="text-sm text-slate-500">2 hours ago</span>
                    </div>

                    <div className="flex items-center p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                        <Star className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">New review received</h3>
                        <p className="text-sm text-slate-600">5-star rating for Sigiriya Tour</p>
                      </div>
                      <span className="text-sm text-slate-500">1 day ago</span>
                    </div>

                    <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">Message from tourist</h3>
                        <p className="text-sm text-slate-600">Question about Kandy Temple Tour</p>
                      </div>
                      <span className="text-sm text-slate-500">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <User className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        onBlur={() => handleFieldBlur('email')}
                        className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                          errors.email && touched.email ? 'border-red-500' : 'border-slate-200'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && touched.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-500 text-sm">+94</span>
                        </div>
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => {
                            // Only allow digits and limit to 10 characters
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                            handleFieldChange('phone', value)
                          }}
                          onBlur={() => handleFieldBlur('phone')}
                          className={`w-full pl-12 pr-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                            errors.phone && touched.phone ? 'border-red-500' : 'border-slate-200'
                          }`}
                          placeholder="77 123 4567"
                          maxLength="10"
                        />
                      </div>
                      {errors.phone && touched.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                      <p className="text-slate-500 text-xs mt-1">Enter 10-digit phone number without country code</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Photo URL</label>
                    <input
                      type="url"
                      value={profile.avatar}
                      onChange={(e) => setProfile(prev => ({ ...prev, avatar: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="https://example.com/your-photo.jpg"
                    />
                    <p className="text-slate-500 text-xs mt-1">Enter a valid image URL (jpg, jpeg, png, gif, webp)</p>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Professional Details</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Guide License</label>
                      <input
                        type="text"
                        value={profile.profile.guideLicense}
                        onChange={(e) => setProfile(prev => ({ 
                          ...prev, 
                          profile: { ...prev.profile, guideLicense: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Enter your guide license number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Experience (Years)</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={profile.profile.experience}
                        onChange={(e) => setProfile(prev => ({ 
                          ...prev, 
                          profile: { ...prev.profile, experience: parseInt(e.target.value) || 0 }
                        }))}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Years of experience"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={profile.profile.location}
                        onChange={(e) => setProfile(prev => ({ 
                          ...prev, 
                          profile: { ...prev.profile, location: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="e.g., Colombo, Kandy, Galle"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Response Time</label>
                      <select
                        value={profile.profile.responseTime}
                        onChange={(e) => setProfile(prev => ({ 
                          ...prev, 
                          profile: { ...prev.profile, responseTime: e.target.value }
                        }))}
                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      >
                        <option value="Within 1 hour">Within 1 hour</option>
                        <option value="Within 2 hours">Within 2 hours</option>
                        <option value="Within 4 hours">Within 4 hours</option>
                        <option value="Within 24 hours">Within 24 hours</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Bio</label>
                    <textarea
                      value={profile.profile.bio}
                      onChange={(e) => handleFieldChange('profile.bio', e.target.value)}
                      onBlur={() => handleFieldBlur('bio')}
                      rows="4"
                      placeholder="Tell potential clients about yourself, your experience, and what makes you special..."
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${
                        errors.bio && touched.bio ? 'border-red-500' : 'border-slate-200'
                      }`}
                    />
                    {errors.bio && touched.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                    )}
                    <p className="text-slate-500 text-sm mt-1">
                      {profile.profile.bio.length}/1000 characters
                    </p>
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <Globe className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Languages</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    {profile.profile.languages.map((lang, index) => (
                      <span key={index} className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-xl font-semibold">
                        {lang}
                        <button
                          onClick={() => removeItem('languages', index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newLanguage}
                      onChange={(e) => {
                        setNewLanguage(e.target.value)
                        validateField('newLanguage', e.target.value)
                      }}
                      onBlur={() => handleFieldBlur('newLanguage')}
                      placeholder="Add a language"
                      className={`flex-1 px-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.newLanguage && touched.newLanguage ? 'border-red-500' : 'border-slate-200'
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('languages', newLanguage)}
                    />
                    {errors.newLanguage && touched.newLanguage && (
                      <p className="text-red-500 text-sm mt-1">{errors.newLanguage}</p>
                    )}
                    <button
                      onClick={() => addItem('languages', newLanguage)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Specialties */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <Award className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Specialties</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    {profile.profile.specialties.map((specialty, index) => (
                      <span key={index} className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-xl font-semibold">
                        {specialty}
                        <button
                          onClick={() => removeItem('specialties', index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => {
                        setNewSpecialty(e.target.value)
                        validateField('newSpecialty', e.target.value)
                      }}
                      onBlur={() => handleFieldBlur('newSpecialty')}
                      placeholder="Add a specialty"
                      className={`flex-1 px-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.newSpecialty && touched.newSpecialty ? 'border-red-500' : 'border-slate-200'
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('specialties', newSpecialty)}
                    />
                    {errors.newSpecialty && touched.newSpecialty && (
                      <p className="text-red-500 text-sm mt-1">{errors.newSpecialty}</p>
                    )}
                    <button
                      onClick={() => addItem('specialties', newSpecialty)}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <Shield className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Certifications</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    {profile.profile.certifications.map((cert, index) => (
                      <span key={index} className="flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-xl font-semibold">
                        {cert}
                        <button
                          onClick={() => removeItem('certifications', index)}
                          className="ml-2 text-purple-600 hover:text-purple-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newCertification}
                      onChange={(e) => {
                        setNewCertification(e.target.value)
                        validateField('newCertification', e.target.value)
                      }}
                      onBlur={() => handleFieldBlur('newCertification')}
                      placeholder="Add a certification"
                      className={`flex-1 px-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.newCertification && touched.newCertification ? 'border-red-500' : 'border-slate-200'
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('certifications', newCertification)}
                    />
                    {errors.newCertification && touched.newCertification && (
                      <p className="text-red-500 text-sm mt-1">{errors.newCertification}</p>
                    )}
                    <button
                      onClick={() => addItem('certifications', newCertification)}
                      className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <div className="flex items-center mb-6">
                    <Star className="h-6 w-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-slate-900">Key Highlights</h2>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    {profile.profile.highlights.map((highlight, index) => (
                      <span key={index} className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl font-semibold">
                        {highlight}
                        <button
                          onClick={() => removeItem('highlights', index)}
                          className="ml-2 text-yellow-600 hover:text-yellow-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => {
                        setNewHighlight(e.target.value)
                        validateField('newHighlight', e.target.value)
                      }}
                      onBlur={() => handleFieldBlur('newHighlight')}
                      placeholder="Add a highlight"
                      className={`flex-1 px-4 py-3 bg-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.newHighlight && touched.newHighlight ? 'border-red-500' : 'border-slate-200'
                      }`}
                      onKeyPress={(e) => e.key === 'Enter' && addItem('highlights', newHighlight)}
                    />
                    {errors.newHighlight && touched.newHighlight && (
                      <p className="text-red-500 text-sm mt-1">{errors.newHighlight}</p>
                    )}
                    <button
                      onClick={() => addItem('highlights', newHighlight)}
                      className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors duration-200 font-semibold"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Save Button for Profile */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center mb-6">
                  <Briefcase className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-slate-900">Service Management</h2>
                </div>
                <p className="text-slate-600 mb-8">Manage your tour services and offerings.</p>
                
                <div className="text-center py-12">
                  <Briefcase className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Service Management</h3>
                  <p className="text-slate-500">This feature will be available soon. You'll be able to manage your tour packages and services here.</p>
                </div>

                {/* Save Button for Services */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <button
                    onClick={handleSaveServices}
                    disabled={saving}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Services Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-slate-900">Pricing</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Price Per Day (LKR)</label>
                    <input
                      type="number"
                      min="1000"
                      max="100000"
                      value={profile.profile.pricePerDay}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        profile: { ...prev.profile, pricePerDay: parseInt(e.target.value) || 0 }
                      }))}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter price per day"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Availability Status</label>
                    <select
                      value={profile.profile.availability}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        profile: { ...prev.profile, availability: e.target.value }
                      }))}
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    >
                      <option value="Available">Available</option>
                      <option value="Busy">Busy</option>
                      <option value="Unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-lg font-semibold text-green-800">Current Pricing</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    LKR {profile.profile.pricePerDay.toLocaleString()}
                  </div>
                  <p className="text-green-700">per day</p>
                </div>

                {/* Save Button for Pricing */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <button
                    onClick={handleSavePricing}
                    disabled={saving}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Pricing Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center mb-6">
                  <Calendar className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-slate-900">Availability</h2>
                </div>
                <p className="text-slate-600 mb-8">Manage your availability and schedule.</p>
                
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Calendar Management</h3>
                  <p className="text-slate-500">This feature will be available soon. You'll be able to manage your availability calendar here.</p>
                </div>

                {/* Save Button for Availability */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                  <button
                    onClick={handleSaveAvailability}
                    disabled={saving}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Availability Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Statistics Tab */}
            {activeTab === 'stats' && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
                <div className="flex items-center mb-6">
                  <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-slate-900">Statistics</h2>
                </div>
                <p className="text-slate-600 mb-8">View your performance and booking statistics.</p>
                
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Performance Analytics</h3>
                  <p className="text-slate-500">This feature will be available soon. You'll be able to view your booking statistics and performance metrics here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuideDashboard
