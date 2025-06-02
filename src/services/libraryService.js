import apiClient from './apiClient.js';

const LIBRARY_KEY = 'wavy_library';

class LibraryService {
  getLocalLibrary(userId) {
    try {
      const library = localStorage.getItem(`${LIBRARY_KEY}_${userId}`);
      return library ? JSON.parse(library) : [];
    } catch (error) {
      console.error('Error getting local library:', error);
      return [];
    }
  }

  saveLocalLibrary(userId, library) {
    try {
      localStorage.setItem(`${LIBRARY_KEY}_${userId}`, JSON.stringify(library));
    } catch (error) {
      console.error('Error saving local library:', error);
    }
  }

  async getLibrary(userId) {
    try {
      const sessionToken = this.getSessionToken();
      if (!sessionToken) {
        return this.getLocalLibrary(userId);
      }
      
      try {
        return await apiClient.request(`/library/${userId}`, {
          headers: {
            'Authorization': `Bearer ${sessionToken}`
          }
        });
      } catch (apiError) {
        console.warn('API unavailable, using local library:', apiError.message);
        return this.getLocalLibrary(userId);
      }
    } catch (error) {
      console.error('Error getting library:', error);
      return this.getLocalLibrary(userId);
    }
  }

  async addToLibrary(movie) {
    try {
      const sessionToken = this.getSessionToken();
      const userId = this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const localLibrary = this.getLocalLibrary(userId);
      const movieExists = localLibrary.some(item => item.id === movie.movie_id || item.movie_id === movie.movie_id);
      
      if (movieExists) {
        throw new Error('Filme já está na biblioteca');
      }

      const libraryItem = {
        id: movie.movie_id,
        movie_id: movie.movie_id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview,
        created_at: new Date().toISOString()
      };

      localLibrary.push(libraryItem);
      this.saveLocalLibrary(userId, localLibrary);

      if (sessionToken) {
        try {
          await apiClient.request('/library', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sessionToken}`
            },
            body: JSON.stringify({ movie: libraryItem })
          });
        } catch (apiError) {
          console.warn('API unavailable, using local storage only:', apiError.message);
        }
      }

      window.dispatchEvent(new CustomEvent('libraryUpdated', { 
        detail: { action: 'add', movie: libraryItem } 
      }));

      return libraryItem;
    } catch (error) {
      console.error('Error adding to library:', error);
      throw error;
    }
  }

  async removeFromLibrary(movieId) {
    try {
      const sessionToken = this.getSessionToken();
      const userId = this.getCurrentUserId();
      
      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const localLibrary = this.getLocalLibrary(userId);
      const filteredLibrary = localLibrary.filter(item => item.id !== movieId && item.movie_id !== movieId);
      this.saveLocalLibrary(userId, filteredLibrary);

      if (sessionToken) {
        try {
          await apiClient.request(`/library/${movieId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${sessionToken}`
            }
          });
        } catch (apiError) {
          console.warn('API unavailable, using local storage only:', apiError.message);
        }
      }

      window.dispatchEvent(new CustomEvent('libraryUpdated', { 
        detail: { action: 'remove', movieId } 
      }));

      return true;
    } catch (error) {
      console.error('Error removing from library:', error);
      throw error;
    }
  }

  async isInLibrary(userId, movieId) {
    try {
      const library = await this.getLibrary(userId);
      return library.some(item => item.movie_id === movieId || item.id === movieId);
    } catch (error) {
      console.error('Error checking library status:', error);
      return false;
    }
  }

  getSessionToken() {
    const sessionData = localStorage.getItem('wavy_session');
    if (sessionData) {
      try {
        const { sessionToken } = JSON.parse(sessionData);
        return sessionToken;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  getCurrentUserId() {
    const sessionData = localStorage.getItem('wavy_session');
    if (sessionData) {
      try {
        const { userId } = JSON.parse(sessionData);
        return userId;
      } catch (error) {
        return null;
      }
    }
    return null;
  }
}

export default new LibraryService(); 
