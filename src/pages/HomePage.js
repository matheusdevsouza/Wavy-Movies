import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSearch, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import MovieCard from '../components/MovieCard';
import ContinueWatching from '../components/ContinueWatching';
import CategorySection from '../components/CategorySection';
import { searchMovies } from '../services/tmdbApi';
import categoriesService from '../services/categoriesService';
function HomePage() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');
  const isSearching = !!searchQuery;
  const homeCategories = [
    'popular', 
    'action',
    'comedy',
    'drama',
    'horror',
    'sci-fi',
    'animation',
    'thriller'
  ];
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);
  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      const data = await searchMovies(query);
      setSearchResults(data.results);
    } catch (err) {
      console.error('Error searching movies:', err);
      setError('Erro ao buscar filmes. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <FontAwesomeIcon 
            icon={faSpinner} 
            className="text-4xl text-purple-500 animate-spin mb-4" 
          />
          <p className="text-gray-400 text-lg">Carregando filmes...</p>
        </motion.div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-auto px-6"
        >
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            className="text-4xl text-purple-500 mb-4" 
          />
          <h2 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado</h2>
          <p className="text-gray-400">{error}</p>
        </motion.div>
      </div>
    );
  }
  if (isSearching) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-3 mb-2">
              <FontAwesomeIcon icon={faSearch} className="text-2xl text-purple-500" />
              <h1 className="text-4xl font-bold gradient-text">
                Resultados para "{searchQuery}"
              </h1>
            </div>
            <p className="text-gray-400">
              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
          {searchResults.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="text-6xl text-gray-500 mb-6" 
                />
                <h2 className="text-2xl font-bold text-white mb-3">
                  Nenhum filme encontrado
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  Tente buscar com outras palavras-chave ou verifique a ortografia
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            >
              <AnimatePresence>
                {searchResults.map((movie, index) => (
                  <MovieCard 
                    key={movie.id} 
                    movie={movie} 
                    index={index}
                    onLoginRequired={() => window.showLoginModal && window.showLoginModal()}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContinueWatching />
        {homeCategories.map((categoryId) => (
          <CategorySection 
            key={categoryId} 
            categoryId={categoryId} 
            showTitle={true}
            onLoginRequired={() => window.showLoginModal && window.showLoginModal()}
          />
        ))}
      </div>
    </div>
  );
}
export default HomePage; 
