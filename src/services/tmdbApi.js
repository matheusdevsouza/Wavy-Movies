import axios from 'axios';

const API_KEY = process.env.TMDB_API_KEY || '8265bd1679663a7ea12ac168da84d2e8';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';

const getCurrentLanguage = () => {
  try {
    const language = localStorage.getItem('wavy_language') || 'pt-BR';
    return language === 'en-US' ? 'en-US' : 'pt-BR';
  } catch (error) {
    return 'pt-BR';
  }
};

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: getCurrentLanguage()
  }
});

tmdbApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    language: getCurrentLanguage()
  };
  return config;
});

const isAsianMovie = (movie) => {
  const asianCountries = ['JP', 'KR', 'CN', 'TH', 'IN', 'TW', 'HK'];
  return movie.origin_country && movie.origin_country.some(country => asianCountries.includes(country)) ||
         movie.original_language && ['ja', 'ko', 'zh', 'th', 'hi', 'ta', 'te'].includes(movie.original_language);
};
const makeApiCall = async (endpoint, params = {}) => {
  try {
    const response = await tmdbApi.get(endpoint, { params });
    const data = response.data;
    if (data.results && Array.isArray(data.results)) {
      const enhancedResults = await Promise.all(
        data.results.map(async (movie) => {
          if (isAsianMovie(movie)) {
            try {
              const englishResponse = await tmdbApi.get(endpoint.includes('/movie/') ? endpoint : `/movie/${movie.id}`, {
                params: { ...params, language: 'en-US' }
              });
              return {
                ...movie,
                title: englishResponse.data.title || movie.title,
                overview: englishResponse.data.overview || movie.overview,
                poster_path: englishResponse.data.poster_path || movie.poster_path,
                backdrop_path: englishResponse.data.backdrop_path || movie.backdrop_path
              };
            } catch (error) {
              return movie; 
            }
          }
          return movie;
        })
      );
      return { ...data, results: enhancedResults };
    }
    if (data.id && isAsianMovie(data)) {
      try {
        const englishResponse = await tmdbApi.get(endpoint, {
          params: { ...params, language: 'en-US' }
        });
        return {
          ...data,
          title: englishResponse.data.title || data.title,
          overview: englishResponse.data.overview || data.overview,
          poster_path: englishResponse.data.poster_path || data.poster_path,
          backdrop_path: englishResponse.data.backdrop_path || data.backdrop_path
        };
      } catch (error) {
        return data; 
      }
    }
    return data;
  } catch (error) {
    throw error;
  }
};
const cache = new Map();
const cacheTimeout = 60 * 60 * 1000; 
const getCachedData = async (endpoint, params = {}) => {
  const cacheKey = `tmdb_${endpoint.replace('/', '_')}_${JSON.stringify(params)}`;
  try {
    const cached = cache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp < cacheTimeout)) {
      console.log(`📋 Cache hit for: ${endpoint}`);
      return cached.data;
    }
    console.log(`🌐 API request for: ${endpoint}`);
    const data = await makeApiCall(endpoint, params);
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    const cached = cache.get(cacheKey);
    if (cached) {
      console.log(`⚠️ Using expired cache for: ${endpoint}`);
      return cached.data;
    }
    throw error;
  }
};
export const getPopularMovies = async (page = 1) => {
  return await getCachedData('/movie/popular', { page });
};
export const searchMovies = async (query, page = 1) => {
  return await getCachedData('/search/movie', { query, page });
};
export const getMovieDetails = async (id) => {
  return await getCachedData(`/movie/${id}`, {
    append_to_response: 'videos,credits'
  });
};
export const getMoviesByGenre = async (genreId, page = 1) => {
  return await getCachedData('/discover/movie', {
    with_genres: genreId,
    page,
    sort_by: 'popularity.desc'
  });
};
export const getGenres = async () => {
  const data = await getCachedData('/genre/movie/list');
  return data.genres;
};
export const getTrending = async (timeWindow = 'day', page = 1) => {
  if (timeWindow === 'day' || timeWindow === 'week') {
    return await getCachedData(`/trending/movie/${timeWindow}`, { page });
  }
  const now = new Date();
  let startDate, endDate;
  if (timeWindow === 'month') {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else if (timeWindow === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
    endDate = new Date(now.getFullYear(), 11, 31);
  }
  const formatDate = (date) => date.toISOString().split('T')[0];
  return await getCachedData('/discover/movie', {
    page,
    sort_by: 'popularity.desc',
    'primary_release_date.gte': formatDate(startDate),
    'primary_release_date.lte': formatDate(endDate),
    'vote_count.gte': 100 
  });
};
export const getTopRated = async (page = 1) => {
  return await getCachedData('/movie/top_rated', { page });
};
export const getUpcoming = async (page = 1) => {
  return await getCachedData('/movie/upcoming', { page });
};
export const getNowPlaying = async (page = 1) => {
  return await getCachedData('/movie/now_playing', { page });
};
export const getMovieCredits = async (movieId) => {
  return await getCachedData(`/movie/${movieId}/credits`);
};
export const getSimilarMovies = async (movieId, page = 1) => {
  return await getCachedData(`/movie/${movieId}/similar`, { page });
};
export const getMovieRecommendations = async (movieId, page = 1) => {
  return await getCachedData(`/movie/${movieId}/recommendations`, { page });
};
export const getMovieTrailer = (videos) => {
  if (!videos || !videos.results) return null;
  const trailer = videos.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );
  return trailer ? trailer.key : null;
};
export const getImageUrl = (path, size = 'w500') => {
  return path ? `${IMAGE_BASE_URL}${size}${path}` : null;
};
export const getFullImageUrls = (movie) => {
  return {
    ...movie,
    poster_url: getImageUrl(movie.poster_path),
    backdrop_url: getImageUrl(movie.backdrop_path, 'w1280')
  };
};
export const getMovies = getPopularMovies;
export default {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getMovieTrailer,
  getMoviesByGenre,
  getImageUrl,
  getGenres,
  getTrending,
  getTopRated,
  getUpcoming,
  getNowPlaying,
  getMovieCredits,
  getSimilarMovies,
  getMovieRecommendations,
  getFullImageUrls
}; 
