import api from '../api';

const roomAvailabilityService = {
  // Get room availability for date range
  getRoomAvailability: async (roomId, params = {}) => {
    const response = await api.get(`/hotels/rooms/${roomId}/availability`, { params });
    return response.data;
  },

  // Get availability calendar for a room
  getAvailabilityCalendar: async (roomId, params = {}) => {
    const response = await api.get(`/hotels/rooms/${roomId}/availability/calendar`, { params });
    return response.data;
  },

  // Update room availability for specific date
  updateRoomAvailability: async (roomId, date, availabilityData) => {
    const response = await api.put(`/hotels/rooms/${roomId}/availability/${date}`, availabilityData);
    return response.data;
  },

  // Bulk update room availability
  bulkUpdateAvailability: async (roomId, bulkData) => {
    const response = await api.put(`/hotels/rooms/${roomId}/availability/bulk`, bulkData);
    return response.data;
  },

  // Add offline booking
  addOfflineBooking: async (roomId, bookingData) => {
    const response = await api.post(`/hotels/rooms/${roomId}/availability/offline-booking`, bookingData);
    return response.data;
  },

  // Schedule maintenance
  scheduleMaintenance: async (roomId, maintenanceData) => {
    const response = await api.post(`/hotels/rooms/${roomId}/availability/maintenance`, maintenanceData);
    return response.data;
  },

  // Get availability conflicts
  getAvailabilityConflicts: async (roomId, params = {}) => {
    const response = await api.get(`/hotels/rooms/${roomId}/availability/conflicts`, { params });
    return response.data;
  }
};

export default roomAvailabilityService;
