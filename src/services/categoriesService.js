import tmdbApi from './tmdbApi';
const GENRES = {
  28: 'Ação',
  12: 'Aventura', 
  16: 'Animação',
  35: 'Comédia',
  80: 'Crime',
  99: 'Documentário',
  18: 'Drama',
  10751: 'Família',
  14: 'Fantasia',
  36: 'História',
  27: 'Terror',
  10402: 'Música',
  9648: 'Mistério',
  10749: 'Romance',
  878: 'Ficção Científica',
  10770: 'Cinema TV',
  53: 'Thriller',
  10752: 'Guerra',
  37: 'Faroeste'
};
class CategoriesService {
  constructor() {
    this.categories = [
      {
        id: 'trending',
        title: 'Em Alta',
        endpoint: 'trending'
      },
      {
        id: 'popular',
        title: 'Populares',
        endpoint: 'popular'
      },
      {
        id: 'top_rated',
        title: 'Mais Bem Avaliados',
        endpoint: 'top_rated'
      },
      {
        id: 'action',
        title: 'Ação',
        endpoint: 'genre',
        genreId: 28
      },
      {
        id: 'comedy',
        title: 'Comédia',
        endpoint: 'genre',
        genreId: 35
      },
      {
        id: 'drama',
        title: 'Drama',
        endpoint: 'genre',
        genreId: 18
      },
      {
        id: 'horror',
        title: 'Terror',
        endpoint: 'genre',
        genreId: 27
      },
      {
        id: 'romance',
        title: 'Romance',
        endpoint: 'genre',
        genreId: 10749
      },
      {
        id: 'sci-fi',
        title: 'Ficção Científica',
        endpoint: 'genre',
        genreId: 878
      },
      {
        id: 'thriller',
        title: 'Thriller',
        endpoint: 'genre',
        genreId: 53
      },
      {
        id: 'animation',
        title: 'Animação',
        endpoint: 'genre',
        genreId: 16
      }
    ];
  }
  getCategories() {
    return this.categories;
  }
  getCategoryById(id) {
    return this.categories.find(category => category.id === id);
  }
  async getMoviesByCategory(categoryId, page = 1) {
    try {
      const category = this.getCategoryById(categoryId);
      if (!category) {
        throw new Error('Category not found');
      }
      let movies = [];
      switch (category.endpoint) {
        case 'trending':
          const trendingResponse = await tmdbApi.getPopularMovies(page);
          movies = trendingResponse.results;
          break;
        case 'popular':
          const popularResponse = await tmdbApi.getPopularMovies(page);
          movies = popularResponse.results;
          break;
        case 'top_rated':
          const topRatedResponse = await tmdbApi.getPopularMovies(page);
          movies = topRatedResponse.results.sort((a, b) => b.vote_average - a.vote_average);
          break;
        case 'genre':
          const genreResponse = await tmdbApi.getMoviesByGenre(category.genreId, page);
          movies = genreResponse.results;
          break;
        default:
          movies = [];
      }
      return {
        results: movies,
        category: category,
        page: page,
        total_pages: 20, 
        total_results: movies.length
      };
    } catch (error) {
      console.error('Error fetching movies by category:', error);
      return {
        results: [],
        category: null,
        page: 1,
        total_pages: 1,
        total_results: 0
      };
    }
  }
  async getCategoryPreview(categoryId, limit = 6) {
    try {
      const response = await this.getMoviesByCategory(categoryId, 1);
      return {
        ...response,
        results: response.results.slice(0, limit)
      };
    } catch (error) {
      console.error('Error fetching category preview:', error);
      return {
        results: [],
        category: null
      };
    }
  }
  async getCategoryMovies(categoryId, page = 1) {
    return this.getMoviesByCategory(categoryId, page);
  }
  getGenreName(genreId) {
    return GENRES[genreId] || 'Desconhecido';
  }
  getGenreNames(genreIds) {
    return genreIds.map(id => this.getGenreName(id));
  }
  async searchInCategory(categoryId, query, page = 1) {
    try {
      const searchResults = await tmdbApi.searchMovies(query, page);
      const category = this.getCategoryById(categoryId);
      let filteredResults = searchResults.results;
      if (category && category.endpoint === 'genre') {
        filteredResults = searchResults.results.filter(movie => 
          movie.genre_ids && movie.genre_ids.includes(category.genreId)
        );
      }
      return {
        results: filteredResults,
        category: category,
        query: query,
        page: page,
        total_pages: Math.ceil(filteredResults.length / 20),
        total_results: filteredResults.length
      };
    } catch (error) {
      console.error('Error searching in category:', error);
      return {
        results: [],
        category: null,
        query: query,
        page: 1,
        total_pages: 1,
        total_results: 0
      };
    }
  }
}
export default new CategoriesService(); 
