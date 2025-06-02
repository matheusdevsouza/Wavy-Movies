import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash, faHeartBroken, faSpinner } from '@fortawesome/free-solid-svg-icons';
import MovieCard from '../components/MovieCard';
import { getFavorites, clearFavorites } from '../services/favoritesService';
import { useAuth } from '../contexts/AuthContext';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};
function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favoriteMovies = await getFavorites(user.id);
      setFavorites(favoriteMovies);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleClearFavorites = async () => {
    if (window.confirm('Tem certeza que deseja remover todos os favoritos?')) {
      try {
        await clearFavorites(user.id);
        setFavorites([]);
      } catch (error) {
        console.error('Error clearing favorites:', error);
        alert('Erro ao limpar favoritos. Tente novamente.');
      }
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-purple-500 animate-spin mb-4" />
          <p className="text-gray-400 text-lg">Carregando favoritos...</p>
        </motion.div>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
            <FontAwesomeIcon icon={faHeart} className="text-6xl text-purple-500 mb-6" />
            <h2 className="text-2xl font-bold text-white mb-3">
              Faça login para ver seus favoritos
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Entre na sua conta para acessar sua lista de filmes favoritos.
            </p>
          </div>
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
            <FontAwesomeIcon icon={faHeart} className="text-3xl text-purple-500" />
            <h1 className="text-4xl font-bold gradient-text">
              Meus Favoritos
            </h1>
          </div>
        </motion.div>
        {favorites.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl p-6 mb-8 border border-white/10"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-500/20 p-3 rounded-xl">
                    <FontAwesomeIcon icon={faHeart} className="text-xl text-purple-500" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">
                      {favorites.length} {favorites.length === 1 ? 'filme favorito' : 'filmes favoritos'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Sua coleção pessoal de filmes
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={handleClearFavorites}
                  disabled={favorites.length === 0}
                  className="flex items-center space-x-2 px-4 py-2 border border-purple-500/50 text-purple-500 rounded-xl hover:bg-purple-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                  <span className="hidden sm:block">Limpar Favoritos</span>
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
              <AnimatePresence>
                {favorites.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ delay: index * 0.05 }}
                  >
                    <MovieCard movie={movie} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -10, 10, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <FontAwesomeIcon icon={faHeartBroken} className="text-6xl text-gray-500 mb-6" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Nenhum favorito ainda
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Comece a explorar filmes e adicione seus favoritos clicando no ❤️ 
                em qualquer filme que você goste!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="/"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-xl text-white font-medium hover:shadow-glow transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faHeart} className="text-lg" />
                  <span>Descobrir Filmes</span>
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
export default Favorites; 
