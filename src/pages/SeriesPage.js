import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv } from '@fortawesome/free-solid-svg-icons';
import CategorySection from '../components/CategorySection';
function SeriesPage() {
  const seriesCategories = [
    'popular',
    'top_rated',
    'drama',
    'comedy',
    'action',
    'sci-fi',
    'thriller',
    'romance'
  ];
  const handleLoginRequired = () => {
    if (window.showLoginModal) {
      window.showLoginModal();
    }
  };
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FontAwesomeIcon icon={faTv} className="text-3xl text-purple-500" />
            <h1 className="text-4xl font-bold gradient-text">
              Séries
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Descubra as melhores séries de todos os gêneros
          </p>
        </motion.div>
        <div className="space-y-12">
          {seriesCategories.map((categoryId, index) => (
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <CategorySection 
                categoryId={categoryId} 
                onLoginRequired={handleLoginRequired}
                mediaType="tv"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default SeriesPage; 
