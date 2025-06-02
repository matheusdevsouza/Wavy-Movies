import apiClient from './apiClient.js';
class ContinueWatchingService {
  async getContinueWatching(userId) {
    try {
      if (!userId) return [];
      return await apiClient.getContinueWatching(userId);
    } catch (error) {
      console.error('Error getting continue watching:', error);
      return [];
    }
  }
  async updateProgress(userId, movieId, progress, duration = null) {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      await apiClient.updateProgress(userId, movieId, progress, duration);
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }
  async addToContinueWatching(userId, movieId, progress = 0, duration = null) {
    return this.updateProgress(userId, movieId, progress, duration);
  }
  async removeFromContinueWatching(userId, movieId) {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      console.warn('Remove from continue watching not implemented in API yet');
      return true;
    } catch (error) {
      console.error('Error removing from continue watching:', error);
      throw error;
    }
  }
  async clearContinueWatching(userId) {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      console.warn('Clear continue watching not implemented in API yet');
      return 0;
    } catch (error) {
      console.error('Error clearing continue watching:', error);
      throw error;
    }
  }
  async getMovieProgress(userId, movieId) {
    try {
      if (!userId) return null;
      const items = await this.getContinueWatching(userId);
      return items.find(item => item.movie_id === movieId || item.tmdb_id === movieId) || null;
    } catch (error) {
      console.error('Error getting movie progress:', error);
      return null;
    }
  }
  getTimeRemaining(duration, progress) {
    const watched = (duration * progress) / 100;
    const remaining = duration - watched;
    const hours = Math.floor(remaining / 60);
    const minutes = Math.floor(remaining % 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m restantes`;
    }
    return `${minutes}m restantes`;
  }
  getProgressText(progress) {
    if (progress < 5) return 'Começar';
    if (progress > 95) return 'Assistir novamente';
    return `${Math.round(progress)}% assistido`;
  }
}
const continueWatchingService = new ContinueWatchingService();
export const getContinueWatching = async (userId) => {
  return await continueWatchingService.getContinueWatching(userId);
};
export const updateProgress = async (userId, movieId, progress, duration) => {
  return await continueWatchingService.updateProgress(userId, movieId, progress, duration);
};
export const addToContinueWatching = async (userId, movieId, progress, duration) => {
  return await continueWatchingService.addToContinueWatching(userId, movieId, progress, duration);
};
export const removeFromContinueWatching = async (userId, movieId) => {
  return await continueWatchingService.removeFromContinueWatching(userId, movieId);
};
export const clearContinueWatching = async (userId) => {
  return await continueWatchingService.clearContinueWatching(userId);
};
export default continueWatchingService; 
