import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSpinner, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import MovieCard from '../components/MovieCard';
import { getPopularMovies, getMoviesByGenre, getGenres, getTrending, getTopRated } from '../services/tmdbApi';
function DiscoverPage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const categories = [
    { id: 'popular', name: 'Populares', icon: faSearch },
    { id: 'trending', name: 'Em Alta', icon: faSearch },
    { id: 'top_rated', name: 'Mais Bem Avaliados', icon: faSearch }
  ];
  useEffect(() => {
    loadGenres();
  }, []);
  useEffect(() => {
    loadMovies();
  }, [selectedCategory, selectedGenre, page]);
  const loadGenres = async () => {
    try {
      const genreList = await getGenres();
      setGenres(genreList);
    } catch (error) {
      console.error('Error loading genres:', error);
    }
  };
  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (selectedGenre && selectedCategory) {
        let genreData = await getMoviesByGenre(selectedGenre, page);
        if (selectedCategory === 'trending') {
          const trendingData = await getTrending('day', page);
          const genreMovieIds = new Set(genreData.results.map(m => m.id));
          const filteredTrending = trendingData.results.filter(movie => 
            movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
          );
          data = { ...trendingData, results: filteredTrending };
        } else if (selectedCategory === 'top_rated') {
          const topRatedData = await getTopRated(page);
          const filteredTopRated = topRatedData.results.filter(movie => 
            movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
          );
          data = { ...topRatedData, results: filteredTopRated };
        } else {
          data = genreData;
        }
      } else if (selectedGenre) {
        data = await getMoviesByGenre(selectedGenre, page);
      } else {
        switch (selectedCategory) {
          case 'trending':
            data = await getTrending('day', page);
            break;
          case 'top_rated':
            data = await getTopRated(page);
            break;
          default:
            data = await getPopularMovies(page);
        }
      }
      if (page === 1) {
        let allMovies = data.results;
        for (let i = 2; i <= 6; i++) {
          try {
            const pageData = await (selectedGenre && selectedCategory) ? 
              (selectedCategory === 'trending' ? getTrending('day', i) : 
               selectedCategory === 'top_rated' ? getTopRated(i) : 
               getMoviesByGenre(selectedGenre, i)) :
              (selectedGenre ? getMoviesByGenre(selectedGenre, i) :
               (selectedCategory === 'trending' ? getTrending('day', i) :
                selectedCategory === 'top_rated' ? getTopRated(i) :
                getPopularMovies(i)));
            if (selectedGenre && selectedCategory) {
              if (selectedCategory === 'trending') {
                const filteredTrending = pageData.results.filter(movie => 
                  movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
                );
                allMovies = [...allMovies, ...filteredTrending];
              } else if (selectedCategory === 'top_rated') {
                const filteredTopRated = pageData.results.filter(movie => 
                  movie.genre_ids && movie.genre_ids.includes(parseInt(selectedGenre))
                );
                allMovies = [...allMovies, ...filteredTopRated];
              } else {
                allMovies = [...allMovies, ...pageData.results];
              }
            } else {
              allMovies = [...allMovies, ...pageData.results];
            }
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
      console.error('Error loading movies:', err);
      setError('Erro ao carregar filmes. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    setPage(1);
  };
  const handleGenreChange = (genreId) => {
    setSelectedGenre(genreId === selectedGenre ? '' : genreId);
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
          <p className="text-gray-400 text-lg">Descobrindo filmes incríveis...</p>
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
            <FontAwesomeIcon icon={faSearch} className="text-3xl text-purple-500" />
            <h1 className="text-4xl font-bold gradient-text">
              Explorar Filmes
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Explore nossa vasta coleção de filmes por categoria e gênero
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="glass-effect rounded-xl p-6 border border-white/10">
            <div className="flex items-center space-x-3 mb-4">
              <FontAwesomeIcon icon={faFilter} className="text-purple-500" />
              <h2 className="text-xl font-semibold text-white">Filtros</h2>
            </div>
            <div className="mb-6">
              <h3 className="text-white/80 font-medium mb-3">Categorias</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-white/80 font-medium mb-3">Gêneros</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleGenreChange('')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    !selectedGenre
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  Todos
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreChange(genre.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      selectedGenre === genre.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
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
export default DiscoverPage; 
