import apiClient from './apiClient.js';
class ProfileService {
  async getProfile() {
    try {
      const sessionToken = this.getSessionToken();
      if (!sessionToken) {
        throw new Error('Usuário não autenticado');
      }
      return await apiClient.request('/profile', {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }
  async updateProfile(profileData) {
    try {
      const sessionToken = this.getSessionToken();
      if (!sessionToken) {
        throw new Error('Usuário não autenticado');
      }
      return await apiClient.request('/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify(profileData)
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
  async changePassword(currentPassword, newPassword) {
    try {
      const sessionToken = this.getSessionToken();
      if (!sessionToken) {
        throw new Error('Usuário não autenticado');
      }
      return await apiClient.request('/profile/password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }
  getSessionToken() {
    const sessionData = localStorage.getItem('wavy_session');
    if (sessionData) {
      const { sessionToken } = JSON.parse(sessionData);
      return sessionToken;
    }
    return null;
  }
}
export default new ProfileService(); 
