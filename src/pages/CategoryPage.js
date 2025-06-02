import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import MovieCard from '../components/MovieCard';
import categoriesService from '../services/categoriesService';
function CategoryPage() {
  const { categoryId } = useParams();
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  useEffect(() => {
    loadCategoryMovies();
  }, [categoryId, page]);
  const loadCategoryMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getCategoryMovies(categoryId, page);
      if (page === 1) {
        setMovies(data.results);
        setCategory(data.category);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
    } catch (err) {
      console.error('Error loading category movies:', err);
      setError('Erro ao carregar filmes da categoria. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  if (loading && page === 1) {
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
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            {category?.icon && (
              <FontAwesomeIcon icon={category.icon} className="text-3xl text-purple-500" />
            )}
            <h1 className="text-4xl font-bold gradient-text">
              {category?.title || 'Categoria'}
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            {category?.description || 'Todos os filmes desta categoria'}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8"
        >
          <AnimatePresence>
            {movies.map((movie, index) => (
              <MovieCard 
                key={`${movie.id}-${index}`} 
                movie={movie} 
                index={index}
                onLoginRequired={() => window.showLoginModal && window.showLoginModal()}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        {movies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Carregando...
                </>
              ) : (
                'Carregar Mais'
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
export default CategoryPage; 
