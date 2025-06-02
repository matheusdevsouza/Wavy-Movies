import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookmark, 
  faSpinner, 
  faExclamationTriangle,
  faTrash,
  faPlay,
  faStar,
  faCalendarAlt,
  faSearch,
  faFilter,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import libraryService from '../services/libraryService';
import MovieCard from '../components/MovieCard';
function LibraryPage() {
  const { user, isAuthenticated } = useAuth();
  const [library, setLibrary] = useState([]);
  const [filteredLibrary, setFilteredLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent'); 
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(null);
  useEffect(() => {
    if (isAuthenticated && user) {
      loadLibrary();
    }
  }, [isAuthenticated, user]);
  useEffect(() => {
    filterAndSortLibrary();
  }, [library, searchTerm, sortBy]);
  const loadLibrary = async () => {
    try {
      setLoading(true);
      setError(null);
      const libraryData = await libraryService.getLibrary(user.id);
      setLibrary(libraryData);
    } catch (err) {
      console.error('Error loading library:', err);
      setError('Erro ao carregar biblioteca.');
    } finally {
      setLoading(false);
    }
  };
  const filterAndSortLibrary = () => {
    let filtered = [...library];
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.vote_average || 0) - (a.vote_average || 0);
        case 'year':
          return new Date(b.release_date || 0) - new Date(a.release_date || 0);
        case 'recent':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });
    setFilteredLibrary(filtered);
  };
  const handleRemoveFromLibrary = async (movieId) => {
    try {
      await libraryService.removeFromLibrary(movieId);
      setLibrary(prev => prev.filter(movie => movie.movie_id !== movieId));
      setShowRemoveConfirm(null);
    } catch (err) {
      console.error('Error removing from library:', err);
      setError('Erro ao remover filme da biblioteca.');
    }
  };
  if (!isAuthenticated) {
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
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-gray-400">Você precisa fazer login para acessar sua biblioteca.</p>
        </motion.div>
      </div>
    );
  }
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
          <p className="text-gray-400 text-lg">Carregando biblioteca...</p>
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
          <button
            onClick={loadLibrary}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Tentar novamente
          </button>
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
            <FontAwesomeIcon icon={faBookmark} className="text-3xl text-blue-500" />
            <h1 className="text-4xl font-bold text-white">Minha Biblioteca</h1>
          </div>
          <p className="text-gray-400">
            {library.length} {library.length === 1 ? 'filme salvo' : 'filmes salvos'} para assistir mais tarde
          </p>
        </motion.div>
        {library.length > 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-effect rounded-xl p-6 mb-8 border border-white/10"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Buscar na biblioteca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50"
                  />
                </div>
                <div className="relative">
                  <FontAwesomeIcon 
                    icon={faSort} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 appearance-none"
                  >
                    <option value="recent" className="bg-dark-800">Mais recentes</option>
                    <option value="title" className="bg-dark-800">Título A-Z</option>
                    <option value="rating" className="bg-dark-800">Maior avaliação</option>
                    <option value="year" className="bg-dark-800">Mais novos</option>
                  </select>
                </div>
              </div>
            </motion.div>
            {filteredLibrary.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              >
                {filteredLibrary.map((movie, index) => (
                  <motion.div
                    key={movie.movie_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="relative group"
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                      <img
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/placeholder.jpg'}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{movie.title}</h3>
                          <div className="flex items-center justify-between text-xs text-gray-300 mb-3">
                            {movie.release_date && (
                              <div className="flex items-center space-x-1">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                                <span>{new Date(movie.release_date).getFullYear()}</span>
                              </div>
                            )}
                            {movie.vote_average > 0 && (
                              <div className="flex items-center space-x-1">
                                <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
                                <span>{movie.vote_average.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.location.href = `/movie/${movie.movie_id}`}
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 px-3 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-1"
                            >
                              <FontAwesomeIcon icon={faPlay} />
                              <span>Assistir</span>
                            </button>
                            <button
                              onClick={() => setShowRemoveConfirm(movie.movie_id)}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded-lg transition-colors duration-300"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 text-center">
                      Adicionado em {new Date(movie.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FontAwesomeIcon icon={faSearch} className="text-4xl text-gray-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum filme encontrado</h3>
                <p className="text-gray-400">Tente ajustar sua busca ou filtros</p>
              </motion.div>
            )}
          </>
        )}
        {library.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotateY: [0, 180, 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="mb-6"
            >
              <FontAwesomeIcon icon={faBookmark} className="text-6xl text-gray-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">Sua biblioteca está vazia</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Comece a salvar filmes que você quer assistir mais tarde. 
              Procure por filmes e clique no ícone de biblioteca para salvá-los.
            </p>
            <a
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 inline-flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={faSearch} />
              <span>Explorar Filmes</span>
            </a>
          </motion.div>
        )}
        {showRemoveConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowRemoveConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect border border-white/20 rounded-xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <FontAwesomeIcon icon={faTrash} className="text-3xl text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Remover da Biblioteca</h3>
                <p className="text-gray-400 mb-6">
                  Tem certeza de que deseja remover este filme da sua biblioteca?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowRemoveConfirm(null)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleRemoveFromLibrary(showRemoveConfirm)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
export default LibraryPage; 
