const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if ((options.method === 'POST' || options.method === 'PUT') && options.body) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout(sessionToken) {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ sessionToken }),
    });
  }

  async verifySession(sessionToken) {
    return this.request(`/auth/verify?sessionToken=${sessionToken}`);
  }

  async getFavorites(userId) {
    return this.request(`/favorites/${userId}`);
  }

  async addToFavorites(userId, movie) {
    return this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ userId, movie }),
    });
  }

  async removeFromFavorites(userId, movieId) {
    return this.request(`/favorites/${userId}/${movieId}`, {
      method: 'DELETE',
    });
  }

  async getContinueWatching(userId) {
    return this.request(`/continue-watching/${userId}`);
  }

  async updateProgress(userId, movieId, progress, duration) {
    return this.request('/continue-watching', {
      method: 'POST',
      body: JSON.stringify({ userId, movieId, progress, duration }),
    });
  }

  async healthCheck() {
    return this.request('/health');
  }
}

export default new ApiClient(); 