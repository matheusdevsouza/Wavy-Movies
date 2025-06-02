import apiClient from './apiClient.js';
class FavoritesService {
  async getFavorites(userId) {
    try {
      if (!userId) return [];
      return await apiClient.getFavorites(userId);
    } catch (error) {
      console.error('Error getting favorites:', error);
      return [];
    }
  }
  async addToFavorites(userId, movie) {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      await apiClient.addToFavorites(userId, movie);
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      if (error.message.includes('já está nos favoritos')) {
        return false; 
      }
      throw error;
    }
  }
  async removeFromFavorites(userId, movieId) {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      await apiClient.removeFromFavorites(userId, movieId);
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  }
  async isFavorite(userId, movieId) {
    try {
      if (!userId) return false;
      const favorites = await this.getFavorites(userId);
      return favorites.some(fav => fav.id === movieId);
    } catch (error) {
      console.error('Error checking if favorite:', error);
      return false;
    }
  }
  async clearFavorites(userId) {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      const favorites = await this.getFavorites(userId);
      for (const fav of favorites) {
        await this.removeFromFavorites(userId, fav.id);
      }
      return favorites.length;
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw error;
    }
  }
  async getFavoritesCount(userId) {
    try {
      if (!userId) return 0;
      const favorites = await this.getFavorites(userId);
      return favorites.length;
    } catch (error) {
      console.error('Error getting favorites count:', error);
      return 0;
    }
  }
}
const favoritesService = new FavoritesService();
export const getFavorites = async (userId) => {
  return await favoritesService.getFavorites(userId);
};
export const addToFavorites = async (userId, movie) => {
  return await favoritesService.addToFavorites(userId, movie);
};
export const removeFromFavorites = async (userId, movieId) => {
  return await favoritesService.removeFromFavorites(userId, movieId);
};
export const isFavorite = async (userId, movieId) => {
  return await favoritesService.isFavorite(userId, movieId);
};
export const clearFavorites = async (userId) => {
  return await favoritesService.clearFavorites(userId);
};
export default favoritesService; 
