import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire, faSpinner, faExclamationTriangle, faClock, faCalendarDay, faCalendarWeek, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import MovieCard from '../components/MovieCard';
import { getTrending } from '../services/tmdbApi';
function TrendingPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeWindow, setTimeWindow] = useState('day');
  const [page, setPage] = useState(1);
  const timeWindows = [
    { id: 'day', name: 'Hoje', icon: faCalendarDay, description: 'Filmes populares hoje' },
    { id: 'week', name: 'Esta Semana', icon: faCalendarWeek, description: 'Top da semana' },
    { id: 'month', name: 'Este Mês', icon: faCalendarAlt, description: 'Mais populares do mês' },
    { id: 'year', name: 'Este Ano', icon: faClock, description: 'Destaques do ano' }
  ];
  useEffect(() => {
    loadMovies();
  }, [timeWindow, page]);
  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTrending(timeWindow, page);
      if (page === 1) {
        let allMovies = data.results;
        for (let i = 2; i <= 6; i++) {
          try {
            const pageData = await getTrending(timeWindow, i);
            allMovies = [...allMovies, ...pageData.results];
          } catch (error) {
            console.error(`Error loading page ${i}:`, error);
            break;
          }
        }
        setMovies(allMovies.slice(0, 120)); 
        setPage(7); 
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
    } catch (err) {
      console.error('Error loading trending movies:', err);
      setError('Erro ao carregar filmes em alta. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };
  const handleTimeWindowChange = (window) => {
    setTimeWindow(window);
    setPage(1);
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
          <p className="text-gray-400 text-lg">Carregando filmes em alta...</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FontAwesomeIcon icon={faFire} className="text-2xl sm:text-3xl text-purple-500" />
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
              Em Alta
            </h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            Descubra os filmes mais populares do momento
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="glass-effect rounded-xl p-4 sm:p-6 border border-white/10">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Período</h2>
            <p className="text-white/60 text-sm mb-4 sm:mb-6">Escolha o período para ver os filmes mais populares</p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {timeWindows.map((window, index) => (
                <motion.button
                  key={window.id}
                  onClick={() => handleTimeWindowChange(window.id)}
                  className={`relative p-3 sm:p-4 rounded-xl border transition-all duration-300 group ${
                    timeWindow === window.id
                      ? 'bg-purple-600 border-purple-500 text-white shadow-lg'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20'
                  }`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-center">
                    <FontAwesomeIcon 
                      icon={window.icon} 
                      className={`text-xl sm:text-2xl transition-all duration-300 mb-2 ${
                        timeWindow === window.id 
                          ? 'text-white' 
                          : 'text-purple-400 group-hover:text-purple-300'
                      }`} 
                    />
                    <div className="space-y-1">
                      <span className="font-semibold text-sm sm:text-base block">{window.name}</span>
                      <span className={`text-xs transition-all duration-300 block ${
                        timeWindow === window.id 
                          ? 'text-purple-100' 
                          : 'text-white/50 group-hover:text-white/70'
                      }`}>
                        {window.description}
                      </span>
                    </div>
                  </div>
                  {timeWindow === window.id && (
                    <motion.div
                      className="absolute inset-0 rounded-xl border-2 border-purple-400"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon 
                icon={timeWindows.find(w => w.id === timeWindow)?.icon} 
                className="text-purple-400" 
              />
              <span className="text-white font-medium text-sm sm:text-base">
                Mostrando: {timeWindows.find(w => w.id === timeWindow)?.name}
              </span>
            </div>
            <span className="text-white/60 text-xs sm:text-sm">
              {movies.length} filmes encontrados
            </span>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div
            key={timeWindow} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            {movies.map((movie, index) => (
              <MovieCard 
                key={movie.id} 
                movie={movie} 
                index={index}
                onLoginRequired={() => window.showLoginModal && window.showLoginModal()}
              />
            ))}
          </motion.div>
        )}

        {!loading && movies.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 sm:py-16"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-4xl sm:text-5xl text-gray-500 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Nenhum filme encontrado</h3>
            <p className="text-gray-400 text-sm sm:text-base">Tente selecionar um período diferente.</p>
          </motion.div>
        )}

      </div>
    </div>
  );
}
export default TrendingPage; 
