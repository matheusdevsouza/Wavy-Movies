import { useState, useEffect } from 'react';
import { getFavorites, addToFavorites, removeFromFavorites, isFavorite } from '../services/favoritesService';
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);
  const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
      const updated = removeFromFavorites(movie.id);
      setFavorites(updated);
      return false;
    } else {
      const updated = addToFavorites(movie);
      setFavorites(updated);
      return true;
    }
  };
  const clearAllFavorites = () => {
    localStorage.removeItem('wavy_favorites');
    setFavorites([]);
  };
  const checkIsFavorite = (movieId) => {
    return favorites.some(fav => fav.id === movieId);
  };
  return {
    favorites,
    toggleFavorite,
    clearAllFavorites,
    checkIsFavorite,
    favoritesCount: favorites.length
  };
}; 
