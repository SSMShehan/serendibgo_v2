import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import tripService from '../../services/vehicles/tripService';
import { 
  Car, 
  Upload, 
  MapPin, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  Calendar,
  Users,
  Fuel,
  Settings,
  Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

const DriverVehicleRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Check if user has driver role
  useEffect(() => {
    if (user && user.role !== 'driver') {
      toast.error('You need to complete your driver registration first before registering a vehicle.');
      navigate('/driver/register');
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    // Basic Information
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    color: '',
    licensePlate: '',
    vin: '',
    
    // Vehicle Details
    vehicleType: 'Car',
    fuelType: 'petrol',
    transmission: 'manual',
    engineCapacity: '',
    mileage: '',
    seatingCapacity: '4',
    
    // Features & Amenities
    features: [],
    amenities: {},
    
    // Location & Service
    location: {
      city: '',
      district: '',
      address: '',
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    },
    
    // Pricing
    pricing: {
      baseRate: '',
      perKmRate: '',
      hourlyRate: '',
      dailyRate: '',
      currency: 'LKR'
    },
    
    // Documents
    documents: {
      registration: null,
      insurance: null,
      fitness: null,
      revenue: null
    },
    
    // Images
    images: [],
    
    // Additional Info
    description: '',
    availability: {
      isAvailable: true,
      workingHours: {
        start: '06:00',
        end: '22:00'
      },
      workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }
  });

  const totalSteps = 6;

  const vehicleTypes = [
    { value: 'Car', label: 'Car' },
    { value: 'Van', label: 'Van' },
    { value: 'Tuk-tuk', label: 'Tuk-tuk' },
    { value: 'Bus', label: 'Bus' },
    { value: 'Minibus', label: 'Minibus' },
    { value: 'SUV', label: 'SUV' },
    { value: 'Motorcycle', label: 'Motorcycle' },
    { value: 'Bicycle', label: 'Bicycle' },
    { value: 'Boat', label: 'Boat' },
    { value: 'Train', label: 'Train' },
    { value: 'Airplane', label: 'Airplane' },
    { value: 'Helicopter', label: 'Helicopter' }
  ];

  const fuelTypes = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' },
    { value: 'cng', label: 'CNG' }
  ];

  const transmissionTypes = [
    { value: 'manual', label: 'Manual' },
    { value: 'automatic', label: 'Automatic' },
    { value: 'semi_automatic', label: 'Semi-Automatic' }
  ];

  const features = [
    'Air Conditioning',
    'Power Steering',
    'Power Windows',
    'Central Locking',
    'ABS Brakes',
    'Airbags',
    'GPS Navigation',
    'Bluetooth',
    'USB Charging',
    'Rear Camera',
    'Parking Sensors',
    'Cruise Control',
    'Sunroof',
    'Leather Seats',
    'Heated Seats'
  ];

  const amenities = [
    'WiFi',
    'Charging Ports',
    'Water Bottles',
    'Snacks',
    'Magazines',
    'First Aid Kit',
    'Child Seat',
    'Wheelchair Access',
    'Luggage Space',
    'Climate Control'
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNestedInputChange = (parent, child, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity]
      }
    }));
  };

  const handleFileUpload = (documentType, url) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [documentType]: url
      }
    }));
  };

  const handleImageUpload = (urls) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }));
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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (!formData.make || !formData.model || !formData.licensePlate) {
        toast.error('Please fill in all required fields (Make, Model, License Plate)');
        setLoading(false);
        return;
      }

      // Process form data to convert empty strings to proper values
      const processedData = {
        ...formData,
        year: formData.year && formData.year !== '' ? parseInt(formData.year) : new Date().getFullYear(),
        engineCapacity: formData.engineCapacity || '',
        mileage: formData.mileage && formData.mileage !== '' ? parseInt(formData.mileage) : 0,
        seatingCapacity: formData.seatingCapacity && formData.seatingCapacity !== '' ? parseInt(formData.seatingCapacity) : 4,
        pricing: {
          ...formData.pricing,
          baseRate: formData.pricing.baseRate && formData.pricing.baseRate !== '' ? parseInt(formData.pricing.baseRate) : 0,
          perKmRate: formData.pricing.perKmRate && formData.pricing.perKmRate !== '' ? parseFloat(formData.pricing.perKmRate) : 0,
          hourlyRate: formData.pricing.hourlyRate && formData.pricing.hourlyRate !== '' ? parseInt(formData.pricing.hourlyRate) : 0,
          dailyRate: formData.pricing.dailyRate && formData.pricing.dailyRate !== '' ? parseInt(formData.pricing.dailyRate) : 0
        }
      };

      // Create FormData for file uploads
      const submitData = new FormData();
      
      // Add all form data as individual fields (not JSON strings)
      Object.keys(processedData).forEach(key => {
        if (key === 'documents' || key === 'images') {
          // Handle file uploads separately
          return;
        }
        if (key === 'pricing' || key === 'location' || key === 'features' || key === 'amenities' || key === 'availability') {
          // Handle complex objects as JSON strings
          submitData.append(key, JSON.stringify(processedData[key]));
        } else {
          // Handle simple values directly
          submitData.append(key, processedData[key]);
        }
      });

      // Add documents and images as URLs
      const finalData = {
        ...processedData,
        documents: formData.documents,
        images: formData.images
      };

      // Submit to backend
      console.log('Submitting vehicle data:', finalData);
      await tripService.vehicleService.registerVehicle(finalData);
      
      toast.success('Vehicle registered successfully! It will be reviewed by our team.');
      navigate('/driver/dashboard');
    } catch (error) {
      console.error('Error registering vehicle:', error);
      console.error('Error response:', error.response?.data);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        toast.error('You need to complete your driver registration first before registering a vehicle.');
        navigate('/driver/register');
      } else if (error.response?.status === 400 && error.response?.data?.message === 'Validation failed') {
        // Show validation errors
        const errors = error.response.data.errors || [];
        const errorMessages = errors.map(err => `${err.field}: ${err.message}`).join(', ');
        toast.error(`Validation failed: ${errorMessages}`);
      } else {
        toast.error(`Failed to register vehicle: ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
              <Car className="w-6 h-6 mr-2" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Make</span>
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  className="input input-bordered"
                  placeholder="Toyota"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Model</span>
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  className="input input-bordered"
                  placeholder="Camry"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Year</span>
                </label>
                <input
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', e.target.value)}
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Color</span>
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="input input-bordered"
                  placeholder="White"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">License Plate</span>
                </label>
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => handleInputChange('licensePlate', e.target.value)}
                  className="input input-bordered"
                  placeholder="ABC-1234"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">VIN Number</span>
                </label>
                <input
                  type="text"
                  value={formData.vin}
                  onChange={(e) => handleInputChange('vin', e.target.value)}
                  className="input input-bordered"
                  placeholder="17-digit VIN"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
              <Settings className="w-6 h-6 mr-2" />
              Vehicle Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Vehicle Type</span>
                </label>
                <select
                  value={formData.vehicleType}
                  onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                  className="select select-bordered"
                >
                  {vehicleTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Fuel Type</span>
                </label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => handleInputChange('fuelType', e.target.value)}
                  className="select select-bordered"
                >
                  {fuelTypes.map(fuel => (
                    <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Transmission</span>
                </label>
                <select
                  value={formData.transmission}
                  onChange={(e) => handleInputChange('transmission', e.target.value)}
                  className="select select-bordered"
                >
                  {transmissionTypes.map(trans => (
                    <option key={trans.value} value={trans.value}>{trans.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Engine Capacity (CC)</span>
                </label>
                <input
                  type="number"
                  value={formData.engineCapacity}
                  onChange={(e) => handleInputChange('engineCapacity', e.target.value)}
                  className="input input-bordered"
                  placeholder="1500"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mileage (KM)</span>
                </label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value ? parseInt(e.target.value) : '')}
                  className="input input-bordered"
                  placeholder="50000"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Seating Capacity</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.seatingCapacity}
                  onChange={(e) => handleInputChange('seatingCapacity', e.target.value ? parseInt(e.target.value) : 4)}
                  className="input input-bordered"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              Features & Amenities
            </h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-base-content mb-4">Vehicle Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {features.map(feature => (
                  <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="checkbox checkbox-primary"
                    />
                    <span className="text-sm">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-base-content mb-4">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {amenities.map(amenity => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities[amenity] || false}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="checkbox checkbox-secondary"
                    />
                    <span className="text-sm">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
              <MapPin className="w-6 h-6 mr-2" />
              Location & Service Area
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">City</span>
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleNestedInputChange('location', 'city', e.target.value)}
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
                  value={formData.location.district}
                  onChange={(e) => handleNestedInputChange('location', 'district', e.target.value)}
                  className="input input-bordered"
                  placeholder="Colombo"
                />
              </div>
              <div className="form-control md:col-span-2">
                <label className="label">
                  <span className="label-text">Address</span>
                </label>
                <textarea
                  value={formData.location.address}
                  onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                  className="textarea textarea-bordered"
                  placeholder="Full address"
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Base Rate (LKR)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.pricing.baseRate}
                  onChange={(e) => handleNestedInputChange('pricing', 'baseRate', e.target.value ? parseInt(e.target.value) : '')}
                  className="input input-bordered"
                  placeholder="500"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Per KM Rate (LKR)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.pricing.perKmRate}
                  onChange={(e) => handleNestedInputChange('pricing', 'perKmRate', e.target.value ? parseFloat(e.target.value) : '')}
                  className="input input-bordered"
                  placeholder="50"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Hourly Rate (LKR)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.pricing.hourlyRate}
                  onChange={(e) => handleNestedInputChange('pricing', 'hourlyRate', e.target.value ? parseInt(e.target.value) : '')}
                  className="input input-bordered"
                  placeholder="2000"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Daily Rate (LKR)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.pricing.dailyRate}
                  onChange={(e) => handleNestedInputChange('pricing', 'dailyRate', e.target.value ? parseInt(e.target.value) : '')}
                  className="input input-bordered"
                  placeholder="15000"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div>
            <h2 className="text-2xl font-semibold text-base-content mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Documents & Images
            </h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-base-content mb-4">Required Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Vehicle Registration URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/registration.pdf"
                    onChange={(e) => handleFileUpload('registration', e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Insurance Certificate URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/insurance.pdf"
                    onChange={(e) => handleFileUpload('insurance', e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Fitness Certificate URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/fitness.pdf"
                    onChange={(e) => handleFileUpload('fitness', e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Revenue License URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/revenue.pdf"
                    onChange={(e) => handleFileUpload('revenue', e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-base-content mb-4">Vehicle Images</h3>
              <div className="space-y-4">
                <input
                  type="url"
                  placeholder="https://example.com/vehicle-front.jpg"
                  onChange={(e) => handleImageUpload([e.target.value])}
                  className="input input-bordered w-full"
                />
                <input
                  type="url"
                  placeholder="https://example.com/vehicle-side.jpg"
                  onChange={(e) => handleImageUpload([e.target.value])}
                  className="input input-bordered w-full"
                />
                <input
                  type="url"
                  placeholder="https://example.com/vehicle-interior.jpg"
                  onChange={(e) => handleImageUpload([e.target.value])}
                  className="input input-bordered w-full"
                />
              </div>
              <p className="text-sm text-base-content/70 mt-2">
                Add URLs for multiple images showing different angles of your vehicle
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-base-content mb-4">Description</h3>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="textarea textarea-bordered w-full"
                placeholder="Describe your vehicle, its condition, and any special features..."
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-base-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-base-content mb-4">
            Register Your Vehicle
          </h1>
          <p className="text-xl text-base-content/70">
            Add your vehicle to our platform and start earning
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
          {renderStepContent()}

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
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-success"
              >
                <Shield className="w-4 h-4 mr-2" />
                {loading ? 'Submitting...' : 'Submit for Review'}
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-info/10 border border-info/20 rounded-lg p-6">
          <div className="flex items-start">
            <Shield className="w-6 h-6 text-info mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-info mb-2">Review Process</h3>
              <p className="text-base-content/70">
                Your vehicle will be reviewed by our staff team within 24-48 hours. 
                You'll receive an email notification once the review is complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverVehicleRegistration;
