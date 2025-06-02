import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faTimes } from '@fortawesome/free-solid-svg-icons';
import continueWatchingService, { getContinueWatching, removeFromContinueWatching } from '../services/continueWatchingService';
import { useAuth } from '../contexts/AuthContext';
const ContinueWatchingCard = ({ item, onRemove, onPlay }) => {
  const [showPlayButton, setShowPlayButton] = useState(false);
  return (
    <motion.div
      className="relative group cursor-pointer"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setShowPlayButton(true)}
      onHoverEnd={() => setShowPlayButton(false)}
      onClick={() => onPlay(item)}
    >
      <div className="relative aspect-video rounded-lg overflow-hidden bg-dark-800">
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path || ''}`}
          alt={item.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${((item.progress_minutes || item.progress) / (item.total_minutes || item.duration || 120)) * 100}%` }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showPlayButton ? 1 : 0 }}
          className="absolute inset-0 bg-black/50 flex items-center justify-center"
        >
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: showPlayButton ? 1 : 0 }}
            transition={{ delay: 0.1 }}
            className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors duration-300"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(item);
            }}
          >
            <FontAwesomeIcon icon={faPlay} className="text-white text-xl ml-1" />
          </motion.button>
        </motion.div>

        <button
          className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/90"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(item.movie_id || item.movieId);
          }}
        >
          <FontAwesomeIcon icon={faTimes} className="text-white text-xs" />
        </button>
      </div>

      <div className="mt-3">
        <h3 className="text-white font-medium text-sm line-clamp-2">
          {item.title}
        </h3>
        <p className="text-white/60 text-xs mt-1">
          {continueWatchingService.getProgressText(((item.progress_minutes || item.progress) / (item.total_minutes || item.duration || 120)) * 100)}
        </p>
        <p className="text-white/40 text-xs">
          {continueWatchingService.getTimeRemaining(item.total_minutes || item.duration || 120, ((item.progress_minutes || item.progress) / (item.total_minutes || item.duration || 120)) * 100)}
        </p>
      </div>
    </motion.div>
  );
};
const ContinueWatching = () => {
  const [continueWatchingItems, setContinueWatchingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadContinueWatching();
    }
  }, [isAuthenticated, user?.id]);
  const loadContinueWatching = async () => {
    try {
      setLoading(true);
      const items = await getContinueWatching(user.id);
      setContinueWatchingItems(items);
    } catch (error) {
      console.error('Error loading continue watching:', error);
    } finally {
      setLoading(false);
    }
  };
  const handlePlay = (item) => {
    navigate(`/movie/${item.movie_id || item.movieId}`);
  };
  const handleRemove = async (movieId) => {
    try {
      await removeFromContinueWatching(user.id, movieId);
      await loadContinueWatching();
    } catch (error) {
      console.error('Error removing from continue watching:', error);
    }
  };
  if (!isAuthenticated || continueWatchingItems.length === 0) {
    return null;
  }
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Continue Assistindo</h2>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-300">
          Ver todos
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {continueWatchingItems.slice(0, 6).map((item) => (
          <ContinueWatchingCard
            key={item.movie_id || item.movieId}
            item={item}
            onPlay={handlePlay}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </section>
  );
};
export default ContinueWatching; 
