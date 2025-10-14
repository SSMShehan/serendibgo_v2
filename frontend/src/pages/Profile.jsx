import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import tripService from '../services/vehicles/tripService';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Car, 
  FileText, 
  Shield, 
  Edit3, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  ArrowLeft,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [driverProfile, setDriverProfile] = useState(null);
  const [needsDriverCompletion, setNeedsDriverCompletion] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    avatar: ''
  });

  // Driver profile completion form data
  const [driverFormData, setDriverFormData] = useState({
    personalInfo: {
      dateOfBirth: '',
      gender: '',
      nationality: '',
      emergencyContact: {
        name: '',
        relationship: 'friend',
        phone: '',
        email: ''
      }
    },
    license: {
      licenseNumber: '',
      licenseType: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: 'Department of Motor Traffic',
      licenseClass: 'Light Vehicle'
    },
    vehicleTypes: [{
      vehicleType: '',
      experience: 0,
      isPreferred: true
    }],
    serviceAreas: [{
      city: '',
      district: '',
      radius: 50,
      isActive: true
    }],
    financial: {
      baseRate: 500,
      currency: 'LKR',
      paymentMethod: 'bank_transfer'
    }
  });

  const totalSteps = 6;

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'driver') {
      fetchDriverProfile();
    }
  }, [user]);

  const fetchDriverProfile = async () => {
    try {
      const response = await tripService.driverService.getDriverByUserId(user.id);
      if (response.status === 'success') {
        setDriverProfile(response.data.driver);
        // Check if driver profile needs completion
        if (response.data.driver.status === 'pending' && 
            (!response.data.driver.license?.licenseNumber || 
             response.data.driver.license?.licenseNumber === 'TBD')) {
          setNeedsDriverCompletion(true);
        }
      } else if (response.status === 'error' && response.data?.needsRegistration) {
        // Driver profile not found - user needs to register
        setDriverProfile(null);
        if (user?.role === 'driver') {
          setNeedsDriverCompletion(true);
        }
      }
    } catch (error) {
      // Only log unexpected errors (not 404s which are handled by the service)
      if (!error.suppressConsoleError && error.response?.status !== 404) {
        console.error('Error fetching driver profile:', error);
      }
      // If driver profile doesn't exist, show completion form
      if (user?.role === 'driver') {
        setNeedsDriverCompletion(true);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDriverInputChange = (section, field, value) => {
    setDriverFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedDriverInputChange = (section, subsection, field, value) => {
    setDriverFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDriverProfileSubmit = async () => {
    setLoading(true);
    try {
      console.log('Submitting driver profile data:', driverFormData);
      
      // If no driver profile exists, register as driver instead of updating
      if (!driverProfile) {
        const result = await tripService.driverService.registerDriver(driverFormData);
        if (result.status === 'success') {
          toast.success('Driver registration completed successfully!');
          setNeedsDriverCompletion(false);
          // Refresh the page to get updated user role
          window.location.reload();
        } else {
          toast.error(result.message || 'Failed to register as driver');
        }
      } else {
        // Update existing driver profile
        const result = await tripService.driverService.updateDriverProfile(user.id, driverFormData);
        if (result.status === 'success') {
          toast.success('Driver profile updated successfully!');
          setNeedsDriverCompletion(false);
          navigate('/driver/dashboard');
        } else if (result.status === 'error' && result.data?.needsRegistration) {
          // Driver profile was deleted or doesn't exist, register instead
          const registerResult = await tripService.driverService.registerDriver(driverFormData);
          if (registerResult.status === 'success') {
            toast.success('Driver registration completed successfully!');
            setNeedsDriverCompletion(false);
            window.location.reload();
          } else {
            toast.error(registerResult.message || 'Failed to register as driver');
          }
        } else {
          toast.error(result.message || 'Failed to update driver profile');
        }
      }
    } catch (error) {
      console.error('Error updating driver profile:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle specific error cases
      if (error.response?.status === 404) {
        toast.error('Driver profile not found. Please try registering as a driver first.');
      } else if (error.response?.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error('Failed to complete driver profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || ''
    });
    setIsEditing(false);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { color: 'badge-error', text: 'Admin' },
      staff: { color: 'badge-warning', text: 'Staff' },
      driver: { color: 'badge-info', text: 'Driver' },
      guide: { color: 'badge-success', text: 'Guide' },
      hotel_owner: { color: 'badge-primary', text: 'Hotel Owner' },
      vehicle_owner: { color: 'badge-secondary', text: 'Vehicle Owner' },
      customer: { color: 'badge-neutral', text: 'Customer' }
    };
    return badges[role] || { color: 'badge-neutral', text: 'User' };
  };

  const roleBadge = getRoleBadge(user?.role);

  // If driver needs to complete profile, show completion form
  if (needsDriverCompletion && user?.role === 'driver') {
    return (
      <div className="min-h-screen bg-base-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-base-content mb-4">
              Complete Your Driver Profile
            </h1>
            <p className="text-xl text-base-content/70">
              Please complete your driver information to start accepting rides
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-base-content">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-base-content/70">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Steps */}
          <div className="bg-base-200 rounded-lg p-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date of Birth</span>
                    </label>
                    <input
                      type="date"
                      value={driverFormData.personalInfo.dateOfBirth}
                      onChange={(e) => handleDriverInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Gender</span>
                    </label>
                    <select
                      value={driverFormData.personalInfo.gender}
                      onChange={(e) => handleDriverInputChange('personalInfo', 'gender', e.target.value)}
                      className="select select-bordered"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Nationality</span>
                    </label>
                    <input
                      type="text"
                      value={driverFormData.personalInfo.nationality}
                      onChange={(e) => handleDriverInputChange('personalInfo', 'nationality', e.target.value)}
                      className="input input-bordered"
                      placeholder="Sri Lankan"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Emergency Contact Name</span>
                    </label>
                    <input
                      type="text"
                      value={driverFormData.personalInfo.emergencyContact.name}
                      onChange={(e) => handleNestedDriverInputChange('personalInfo', 'emergencyContact', 'name', e.target.value)}
                      className="input input-bordered"
                      placeholder="Emergency contact name"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Emergency Contact Relationship</span>
                    </label>
                    <select
                      value={driverFormData.personalInfo.emergencyContact.relationship}
                      onChange={(e) => handleNestedDriverInputChange('personalInfo', 'emergencyContact', 'relationship', e.target.value)}
                      className="select select-bordered"
                    >
                      <option value="">Select Relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="friend">Friend</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Emergency Contact Phone</span>
                    </label>
                    <input
                      type="tel"
                      value={driverFormData.personalInfo.emergencyContact.phone}
                      onChange={(e) => handleNestedDriverInputChange('personalInfo', 'emergencyContact', 'phone', e.target.value)}
                      className="input input-bordered"
                      placeholder="Emergency contact phone"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: License Information */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2" />
                  License Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">License Number</span>
                    </label>
                    <input
                      type="text"
                      value={driverFormData.license.licenseNumber}
                      onChange={(e) => handleDriverInputChange('license', 'licenseNumber', e.target.value)}
                      className="input input-bordered"
                      placeholder="B1234567"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">License Type</span>
                    </label>
                    <select
                      value={driverFormData.license.licenseType}
                      onChange={(e) => handleDriverInputChange('license', 'licenseType', e.target.value)}
                      className="select select-bordered"
                    >
                      <option value="">Select License Type</option>
                      <option value="A">A - Motorcycle</option>
                      <option value="B">B - Light Vehicle</option>
                      <option value="C">C - Heavy Vehicle</option>
                      <option value="D">D - Bus</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Issue Date</span>
                    </label>
                    <input
                      type="date"
                      value={driverFormData.license.issueDate}
                      onChange={(e) => handleDriverInputChange('license', 'issueDate', e.target.value)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Expiry Date</span>
                    </label>
                    <input
                      type="date"
                      value={driverFormData.license.expiryDate}
                      onChange={(e) => handleDriverInputChange('license', 'expiryDate', e.target.value)}
                      className="input input-bordered"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Issuing Authority</span>
                    </label>
                    <input
                      type="text"
                      value={driverFormData.license.issuingAuthority}
                      onChange={(e) => handleDriverInputChange('license', 'issuingAuthority', e.target.value)}
                      className="input input-bordered"
                      placeholder="Department of Motor Traffic"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">License Class</span>
                    </label>
                    <select
                      value={driverFormData.license.licenseClass}
                      onChange={(e) => handleDriverInputChange('license', 'licenseClass', e.target.value)}
                      className="select select-bordered"
                    >
                      <option value="">Select License Class</option>
                      <option value="Light Vehicle">Light Vehicle</option>
                      <option value="Heavy Vehicle">Heavy Vehicle</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Bus">Bus</option>
                      <option value="Truck">Truck</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Vehicle Experience */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
                  <Car className="w-6 h-6 mr-2" />
                  Vehicle Experience
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Vehicle Type</span>
                    </label>
                    <select
                      value={driverFormData.vehicleTypes[0].vehicleType}
                      onChange={(e) => {
                        const newVehicleTypes = [...driverFormData.vehicleTypes];
                        newVehicleTypes[0].vehicleType = e.target.value;
                        setDriverFormData(prev => ({
                          ...prev,
                          vehicleTypes: newVehicleTypes
                        }));
                      }}
                      className="select select-bordered"
                    >
                      <option value="">Select Vehicle Type</option>
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="van">Van</option>
                      <option value="bus">Bus</option>
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Years of Experience</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={driverFormData.vehicleTypes[0].experience}
                      onChange={(e) => {
                        const newVehicleTypes = [...driverFormData.vehicleTypes];
                        newVehicleTypes[0].experience = parseInt(e.target.value) || 0;
                        setDriverFormData(prev => ({
                          ...prev,
                          vehicleTypes: newVehicleTypes
                        }));
                      }}
                      className="input input-bordered"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Service Areas */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2" />
                  Service Areas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">City</span>
                    </label>
                    <input
                      type="text"
                      value={driverFormData.serviceAreas[0].city}
                      onChange={(e) => {
                        const newServiceAreas = [...driverFormData.serviceAreas];
                        newServiceAreas[0].city = e.target.value;
                        setDriverFormData(prev => ({
                          ...prev,
                          serviceAreas: newServiceAreas
                        }));
                      }}
                      className="input input-bordered"
                      placeholder="Colombo"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">District</span>
                    </label>
                    <input
                      type="text"
                      value={driverFormData.serviceAreas[0].district}
                      onChange={(e) => {
                        const newServiceAreas = [...driverFormData.serviceAreas];
                        newServiceAreas[0].district = e.target.value;
                        setDriverFormData(prev => ({
                          ...prev,
                          serviceAreas: newServiceAreas
                        }));
                      }}
                      className="input input-bordered"
                      placeholder="Colombo"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Financial Information */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
                  <DollarSign className="w-6 h-6 mr-2" />
                  Financial Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Base Rate (LKR)</span>
                    </label>
                    <input
                      type="number"
                      min="100"
                      value={driverFormData.financial.baseRate}
                      onChange={(e) => handleDriverInputChange('financial', 'baseRate', parseInt(e.target.value) || 500)}
                      className="input input-bordered"
                      placeholder="500"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Payment Method</span>
                    </label>
                    <select
                      value={driverFormData.financial.paymentMethod}
                      onChange={(e) => handleDriverInputChange('financial', 'paymentMethod', e.target.value)}
                      className="select select-bordered"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="mobile_payment">Mobile Payment</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review */}
            {currentStep === 6 && (
              <div>
                <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Review Your Information
                </h2>
                <div className="bg-base-100 rounded-lg p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-base-content">Personal Information</h3>
                    <p className="text-sm text-base-content/70">
                      DOB: {driverFormData.personalInfo.dateOfBirth} | 
                      Gender: {driverFormData.personalInfo.gender} | 
                      Nationality: {driverFormData.personalInfo.nationality}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Emergency: {driverFormData.personalInfo.emergencyContact.name} ({driverFormData.personalInfo.emergencyContact.relationship}) - {driverFormData.personalInfo.emergencyContact.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">License Information</h3>
                    <p className="text-sm text-base-content/70">
                      License: {driverFormData.license.licenseNumber} ({driverFormData.license.licenseType})
                    </p>
                    <p className="text-sm text-base-content/70">
                      Authority: {driverFormData.license.issuingAuthority} | Class: {driverFormData.license.licenseClass}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">Vehicle Experience</h3>
                    <p className="text-sm text-base-content/70">
                      {driverFormData.vehicleTypes[0].vehicleType} - {driverFormData.vehicleTypes[0].experience} years
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">Service Areas</h3>
                    <p className="text-sm text-base-content/70">
                      {driverFormData.serviceAreas[0].city}, {driverFormData.serviceAreas[0].district}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content">Financial</h3>
                    <p className="text-sm text-base-content/70">
                      Base Rate: LKR {driverFormData.financial.baseRate} | 
                      Payment: {driverFormData.financial.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="btn btn-outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="btn btn-primary"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleDriverProfileSubmit}
                  disabled={loading}
                  className="btn btn-success"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {loading ? 'Completing...' : 'Complete Profile'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular profile page for non-drivers or completed drivers
  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Profile Settings
          </h1>
          <p className="text-xl text-base-content/70">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-base-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-base-content">Personal Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="btn btn-primary btn-sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="btn btn-outline btn-sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input input-bordered"
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="input input-bordered"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Info Card */}
            <div className="bg-base-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-16">
                    <span className="text-xl">
                      {user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-base-content">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <div className={`badge ${roleBadge.color}`}>
                    {roleBadge.text}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-base-content/70">
                  <Mail className="w-4 h-4 mr-2" />
                  {user?.email}
                </div>
                <div className="flex items-center text-base-content/70">
                  <Phone className="w-4 h-4 mr-2" />
                  {user?.phone || 'Not provided'}
                </div>
                <div className="flex items-center text-base-content/70">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {new Date(user?.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Driver Profile Card */}
            {user?.role === 'driver' && driverProfile && (
              <div className="bg-base-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  Driver Profile
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/70">Driver ID</span>
                    <span className="text-sm font-mono">{driverProfile.driverId}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/70">Status</span>
                    <div className={`badge ${
                      driverProfile.status === 'active' ? 'badge-success' :
                      driverProfile.status === 'pending' ? 'badge-warning' :
                      driverProfile.status === 'suspended' ? 'badge-error' :
                      'badge-neutral'
                    }`}>
                      {driverProfile.status}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/70">License Type</span>
                    <span className="text-sm">{driverProfile.license?.licenseType || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/70">Experience</span>
                    <span className="text-sm">
                      {driverProfile.vehicleTypes?.[0]?.experience || 0} years
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/70">Service Areas</span>
                    <span className="text-sm">
                      {driverProfile.serviceAreas?.length || 0} areas
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-base-300">
                  <button
                    onClick={() => window.location.href = '/driver/dashboard'}
                    className="btn btn-primary btn-sm w-full"
                  >
                    <Car className="w-4 h-4 mr-2" />
                    Go to Driver Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* Account Status */}
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-base-content mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Account Status
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">Email Verified</span>
                  <div className="flex items-center">
                    {user?.isVerified ? (
                      <CheckCircle className="w-4 h-4 text-success" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-warning" />
                    )}
                    <span className="text-sm ml-1">
                      {user?.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-base-content/70">Account Status</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm ml-1">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;