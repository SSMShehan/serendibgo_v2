import api from './api';

// Guide service functions
export const guideService = {
  // Get all guides with filters
  getGuides: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        queryParams.append(key, params[key]);
      }
    });
    
    const response = await api.get(`/guides?${queryParams.toString()}`);
    return response.data;
  },

  // Get guide by ID
  getGuideById: async (id) => {
    const response = await api.get(`/guides/${id}`);
    return response.data;
  },

  // Get guide statistics
  getGuideStats: async (id) => {
    const response = await api.get(`/guides/stats/${id}`);
    return response.data;
  },

  // Create guide (Admin only)
  createGuide: async (guideData) => {
    const response = await api.post('/guides', guideData);
    return response.data;
  },

  // Update guide profile (for guides themselves)
  updateGuideProfile: async (profileData) => {
    const response = await api.put('/guides/profile', profileData);
    return response.data;
  },

  // Update guide
  updateGuide: async (id, guideData) => {
    const response = await api.put(`/guides/${id}`, guideData);
    return response.data;
  },

  // Delete guide (Admin only)
  deleteGuide: async (id) => {
    const response = await api.delete(`/guides/${id}`);
    return response.data;
  }
};

export default guideService;
