import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faCalendarAlt, faBookmark } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular, faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';
import { getImageUrl } from '../services/tmdbApi';
import { addToFavorites, removeFromFavorites, isFavorite } from '../services/favoritesService';
import libraryService from '../services/libraryService';
import { useAuth } from '../contexts/AuthContext';

function MovieCard({ movie, index = 0, onLoginRequired }) {
  const { user, isAuthenticated } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [inLibrary, setInLibrary] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const [favStatus, libStatus] = await Promise.all([
            isFavorite(user.id, movie.id),
            libraryService.isInLibrary(user.id, movie.id)
          ]);
          setFavorited(favStatus);
          setInLibrary(libStatus);
        } catch (error) {
          console.error('Error checking movie status:', error);
        }
      }
    };
    checkStatus();
  }, [isAuthenticated, user, movie.id]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      if (onLoginRequired) onLoginRequired();
      return;
    }

    try {
      if (favorited) {
        await removeFromFavorites(user.id, movie.id);
        setFavorited(false);
      } else {
        await addToFavorites(user.id, {
          ...movie,
          id: movie.id 
        });
        setFavorited(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLibraryClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      if (onLoginRequired) onLoginRequired();
      return;
    }

    setIsLoading(true);
    try {
      if (inLibrary) {
        await libraryService.removeFromLibrary(movie.id);
        setInLibrary(false);
      } else {
        await libraryService.addToLibrary({
          ...movie,
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average
        });
        setInLibrary(true);
      }
    } catch (error) {
      console.error('Error toggling library:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average ? Number(movie.vote_average).toFixed(1) : 'N/A';

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      className="group relative cursor-pointer"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-dark-800 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
          <div className="relative aspect-[2/3] overflow-hidden">
            {movie.poster_path ? (
              <img
                src={getImageUrl(movie.poster_path)}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center">
                <FontAwesomeIcon icon={faStar} className="text-4xl text-gray-500" />
              </div>
            )}
            
            <div className="absolute top-2 right-2 flex flex-col space-y-2">
              <button
                onClick={handleFavoriteClick}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                  isAuthenticated && favorited 
                    ? 'bg-red-500 text-white shadow-lg' 
                    : 'bg-black/50 text-white hover:bg-black/70'
                }`}
                title="Add to Favorites"
              >
                <FontAwesomeIcon 
                  icon={isAuthenticated && favorited ? faHeart : faHeartRegular} 
                  className="text-sm" 
                />
              </button>

              <button
                onClick={handleLibraryClick}
                disabled={isLoading}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-sm ${
                  isAuthenticated && inLibrary 
                    ? 'bg-purple-500 text-white shadow-lg' 
                    : 'bg-black/50 text-white hover:bg-black/70'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title="Add to Library"
              >
                {isLoading ? (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FontAwesomeIcon 
                    icon={isAuthenticated && inLibrary ? faBookmark : faBookmarkRegular} 
                    className="text-sm" 
                  />
                )}
              </button>
            </div>
          </div>
          
          <div className="p-4 h-32 flex flex-col justify-between">
            <h3 className="text-white font-semibold text-sm line-clamp-3 leading-tight">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between text-sm mt-2">
              <div className="flex items-center space-x-1 text-white/70">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-xs" />
                <span>{releaseYear}</span>
              </div>
              <div className="flex items-center space-x-1 bg-purple-500/20 px-2 py-1 rounded-full">
                <FontAwesomeIcon icon={faStar} className="text-yellow-400 text-xs" />
                <span className="text-white font-medium">
                  {rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default MovieCard; 
