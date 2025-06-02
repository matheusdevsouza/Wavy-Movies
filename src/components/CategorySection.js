import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import MovieCard from './MovieCard';
import categoriesService from '../services/categoriesService';
const CategorySection = ({ categoryId, showTitle = true, onLoginRequired, mediaType = 'movie' }) => {
  const [movies, setMovies] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategoryMovies = async () => {
      setLoading(true);
      try {
        const response = await categoriesService.getCategoryPreview(categoryId, 6);
        setMovies(response.results);
        setCategory(response.category);
      } catch (error) {
        console.error('Error fetching category movies:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryMovies();
  }, [categoryId]);
  const handleSeeAll = () => {
    navigate(`/category/${categoryId}`);
  };
  if (loading) {
    return (
      <section className="mb-12">
        {showTitle && (
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded w-20 animate-pulse"></div>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="aspect-[2/3] bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }
  if (!movies || movies.length === 0) {
    return null;
  }
  return (
    <motion.section 
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {showTitle && category && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {category.title}
          </h2>
          <button
            onClick={handleSeeAll}
            className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 group"
          >
            <span className="text-sm font-medium">Ver todos</span>
            <FontAwesomeIcon 
              icon={faChevronRight} 
              className="text-xs group-hover:translate-x-1 transition-transform duration-300" 
            />
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {movies.map((movie, index) => (
          <MovieCard 
            key={movie.id} 
            movie={movie} 
            index={index}
            onLoginRequired={onLoginRequired}
          />
        ))}
      </div>
    </motion.section>
  );
};
export default CategorySection; 
