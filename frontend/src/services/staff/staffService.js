// Staff Service - API calls for staff operations
class StaffService {
  constructor() {
    this.baseURL = '/api/staff';
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return data;
  }

  // Dashboard
  async getDashboardOverview() {
    const response = await fetch(`${this.baseURL}/dashboard/overview`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getPlatformStatistics(period = '30d') {
    const response = await fetch(`${this.baseURL}/dashboard/statistics?period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Authentication
  async login(email, password) {
    const response = await fetch(`${this.baseURL}/staff/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${this.baseURL}/staff/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${this.baseURL}/settings/profile`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updateProfile(profileData) {
    const response = await fetch(`${this.baseURL}/settings/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData),
    });
    
    return this.handleResponse(response);
  }

  async changePassword(passwordData) {
    const response = await fetch(`${this.baseURL}/settings/password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(passwordData),
    });
    
    return this.handleResponse(response);
  }

  // Approvals
  async getPendingApprovals(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/approvals/pending?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getApprovalDetails(approvalId) {
    const response = await fetch(`${this.baseURL}/approvals/${approvalId}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async approveServiceProvider(userId, notes = '') {
    const response = await fetch(`${this.baseURL}/approvals/${userId}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ notes }),
    });
    
    return this.handleResponse(response);
  }

  async rejectServiceProvider(userId, reason, notes = '') {
    const response = await fetch(`${this.baseURL}/approvals/${userId}/reject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason, notes }),
    });
    
    return this.handleResponse(response);
  }

  async bulkApproveServiceProviders(userIds) {
    const response = await fetch(`${this.baseURL}/approvals/bulk-approve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ userIds }),
    });
    
    return this.handleResponse(response);
  }

  async getApprovalStatistics() {
    const response = await fetch(`${this.baseURL}/approvals/statistics`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Bookings
  async getBookings(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/bookings?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getBookingDetails(bookingId) {
    const response = await fetch(`${this.baseURL}/bookings/${bookingId}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updateBooking(bookingId, bookingData) {
    const response = await fetch(`${this.baseURL}/bookings/${bookingId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(bookingData),
    });
    
    return this.handleResponse(response);
  }

  async cancelBooking(bookingId, reason) {
    const response = await fetch(`${this.baseURL}/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason }),
    });
    
    return this.handleResponse(response);
  }

  async createManualBooking(bookingData) {
    const response = await fetch(`${this.baseURL}/bookings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(bookingData),
    });
    
    return this.handleResponse(response);
  }

  async getBookingStatistics(period = '30d') {
    const response = await fetch(`${this.baseURL}/bookings/statistics?period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getBookingConflicts(guideId, date) {
    const response = await fetch(`${this.baseURL}/bookings/conflicts?guideId=${guideId}&date=${date}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Vehicle Management
  async getVehicles(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/vehicles?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getVehicleStatistics() {
    const response = await fetch(`${this.baseURL}/vehicles/statistics`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async deleteVehicle(vehicleId) {
    const response = await fetch(`${this.baseURL}/vehicles/${vehicleId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async bulkVehicleAction(vehicleIds, action) {
    const response = await fetch(`${this.baseURL}/vehicles/bulk-action`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ vehicleIds, action }),
    });
    
    return this.handleResponse(response);
  }

  // Guide Management
  async getGuides(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/guides?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getGuideStatistics() {
    const response = await fetch(`${this.baseURL}/guides/statistics`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async deleteGuide(guideId) {
    const response = await fetch(`${this.baseURL}/guides/${guideId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async bulkGuideAction(guideIds, action) {
    const response = await fetch(`${this.baseURL}/guides/bulk-action`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ guideIds, action }),
    });
    
    return this.handleResponse(response);
  }

  // Hotel Management
  async getHotels(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/hotels?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getHotelStatistics() {
    const response = await fetch(`${this.baseURL}/hotels/statistics`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async createHotel(hotelData) {
    const response = await fetch(`${this.baseURL}/hotels`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(hotelData),
    });
    
    return this.handleResponse(response);
  }

  async updateHotel(hotelId, hotelData) {
    const response = await fetch(`${this.baseURL}/hotels/${hotelId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(hotelData),
    });
    
    return this.handleResponse(response);
  }

  async deleteHotel(hotelId) {
    const response = await fetch(`${this.baseURL}/hotels/${hotelId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async bulkHotelAction(hotelIds, action) {
    const response = await fetch(`${this.baseURL}/hotels/bulk-action`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ hotelIds, action }),
    });
    
    return this.handleResponse(response);
  }

  // Custom Trip Management
  async getCustomTrips(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/custom-trips?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getCustomTripStatistics() {
    const response = await fetch(`${this.baseURL}/custom-trips/statistics`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async respondToCustomTrip(tripId, responseData) {
    const response = await fetch(`${this.baseURL}/custom-trips/${tripId}/respond`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(responseData),
    });
    
    return this.handleResponse(response);
  }

  async deleteCustomTrip(tripId) {
    const response = await fetch(`${this.baseURL}/custom-trips/${tripId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async bulkCustomTripAction(tripIds, action) {
    const response = await fetch(`${this.baseURL}/custom-trips/bulk-action`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ tripIds, action }),
    });
    
    return this.handleResponse(response);
  }

  // Trip Management
  async getTrips(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/trips?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getTripStatistics() {
    const response = await fetch(`${this.baseURL}/trips/statistics`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async createTrip(tripData) {
    const response = await fetch(`${this.baseURL}/trips`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(tripData),
    });
    
    return this.handleResponse(response);
  }

  async updateTrip(tripId, tripData) {
    const response = await fetch(`${this.baseURL}/trips/${tripId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(tripData),
    });
    
    return this.handleResponse(response);
  }

  async deleteTrip(tripId) {
    const response = await fetch(`${this.baseURL}/trips/${tripId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async bulkTripAction(tripIds, action) {
    const response = await fetch(`${this.baseURL}/trips/bulk-action`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ tripIds, action }),
    });
    
    return this.handleResponse(response);
  }

  // Financial Management
  async getFinancialOverview(period = '30d') {
    const response = await fetch(`${this.baseURL}/financial/overview?period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getCommissionRates() {
    const response = await fetch(`${this.baseURL}/financial/commission-rates`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updateCommissionRates(rates) {
    const response = await fetch(`${this.baseURL}/financial/commission-rates`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(rates),
    });
    
    return this.handleResponse(response);
  }

  async getServiceProviderEarnings(type = 'all', period = '30d') {
    const response = await fetch(`${this.baseURL}/financial/earnings?type=${type}&period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async processPayout(payoutData) {
    const response = await fetch(`${this.baseURL}/financial/payouts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payoutData),
    });
    
    return this.handleResponse(response);
  }

  async getFinancialReports(type = 'all', period = '30d') {
    const response = await fetch(`${this.baseURL}/financial/reports?type=${type}&period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getPaymentStatus(status = 'all', period = '30d') {
    const response = await fetch(`${this.baseURL}/financial/payments?status=${status}&period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Support & Quality Control
  async getSupportTickets(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/support/tickets?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getSupportTicket(ticketId) {
    const response = await fetch(`${this.baseURL}/support/tickets/${ticketId}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updateSupportTicket(ticketId, ticketData) {
    const response = await fetch(`${this.baseURL}/support/tickets/${ticketId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(ticketData),
    });
    
    return this.handleResponse(response);
  }

  async addSupportMessage(ticketId, message) {
    const response = await fetch(`${this.baseURL}/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message }),
    });
    
    return this.handleResponse(response);
  }

  async resolveSupportTicket(ticketId, resolution) {
    const response = await fetch(`${this.baseURL}/support/tickets/${ticketId}/resolve`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ resolution }),
    });
    
    return this.handleResponse(response);
  }

  async getReviews(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/support/reviews?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async moderateReview(reviewId, status, reason) {
    const response = await fetch(`${this.baseURL}/support/reviews/${reviewId}/moderate`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, reason }),
    });
    
    return this.handleResponse(response);
  }

  // Analytics & Monitoring
  async getAnalyticsOverview(period = '30d') {
    const response = await fetch(`${this.baseURL}/analytics/overview?period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getUserAnalytics(period = '30d') {
    const response = await fetch(`${this.baseURL}/analytics/users?period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getBookingAnalytics(period = '30d') {
    const response = await fetch(`${this.baseURL}/analytics/bookings?period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getPerformanceMetrics(period = '30d') {
    const response = await fetch(`${this.baseURL}/analytics/performance?period=${period}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getMonitoringData() {
    const response = await fetch(`${this.baseURL}/analytics/monitoring`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  // Settings & Configuration
  async getPlatformSettings() {
    const response = await fetch(`${this.baseURL}/settings/platform`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updatePlatformSettings(category, settings) {
    const response = await fetch(`${this.baseURL}/settings/platform`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ category, settings }),
    });
    
    return this.handleResponse(response);
  }

  async getStaffProfile() {
    const response = await fetch(`${this.baseURL}/settings/profile`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async updateStaffProfile(profileData) {
    const response = await fetch(`${this.baseURL}/settings/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData),
    });
    
    return this.handleResponse(response);
  }

  async changeStaffPassword(passwordData) {
    const response = await fetch(`${this.baseURL}/settings/password`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(passwordData),
    });
    
    return this.handleResponse(response);
  }

  async getSystemLogs(params = {}) {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/settings/logs?${queryParams}`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async getSystemHealth() {
    const response = await fetch(`${this.baseURL}/settings/health`, {
      headers: this.getHeaders(),
    });
    
    return this.handleResponse(response);
  }

  async createSystemBackup(backupData) {
    const response = await fetch(`${this.baseURL}/settings/backup`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(backupData),
    });
    
    return this.handleResponse(response);
  }
}

export default new StaffService();