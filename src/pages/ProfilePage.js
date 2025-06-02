import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faCalendarAlt, 
  faCog, 
  faSpinner,
  faExclamationTriangle,
  faHeart,
  faBookmark,
  faEye,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import profileService from '../services/profileService';
import { getFavorites } from '../services/favoritesService';
import libraryService from '../services/libraryService';

function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalFavorites: 0,
    totalLibrary: 0,
    joinedDate: null
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfileData();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (profile && user && profile.avatar_url !== user.avatar) {
      setProfile(prev => ({ ...prev, avatar_url: user.avatar }));
    }
  }, [user?.avatar, profile]);

  useEffect(() => {
    const handleLibraryUpdate = () => {
      if (isAuthenticated && user) {
        loadProfileData();
      }
    };

    window.addEventListener('libraryUpdated', handleLibraryUpdate);
    return () => {
      window.removeEventListener('libraryUpdated', handleLibraryUpdate);
    };
  }, [isAuthenticated, user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileData, favoritesData, libraryData] = await Promise.all([
        profileService.getProfile(),
        getFavorites(user.id),
        libraryService.getLibrary(user.id)
      ]);
      setProfile(profileData);
      setFavorites(favoritesData.slice(0, 6)); 
      setLibrary(libraryData.slice(0, 6)); 
      setStats({
        totalFavorites: favoritesData.length,
        totalLibrary: libraryData.length,
        joinedDate: new Date(profileData.created_at).toLocaleDateString('pt-BR')
      });
    } catch (err) {
      console.error('Error loading profile data:', err);
      setError('Erro ao carregar dados do perfil.');
    } finally {
      setLoading(false);
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
          <p className="text-gray-400">Você precisa fazer login para acessar seu perfil.</p>
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
          <p className="text-gray-400 text-lg">Carregando perfil...</p>
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
            onClick={loadProfileData}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-white/10"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative flex-shrink-0">
              <img
                src={profile?.avatar_url || user?.avatar}
                alt={profile?.name || user?.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-purple-500/50 object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-dark-900"></div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {profile?.name || user?.name}
              </h1>
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-center sm:items-start gap-2 sm:gap-4 text-gray-400 text-sm sm:text-base">
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span className="truncate max-w-[200px] sm:max-w-none">{profile?.email || user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>Membro desde {stats.joinedDate}</span>
                </div>
                {profile?.last_login && (
                  <div className="flex items-center space-x-2">
                    <FontAwesomeIcon icon={faClock} />
                    <span className="hidden sm:inline">Último acesso: {new Date(profile.last_login).toLocaleDateString('pt-BR')}</span>
                    <span className="sm:hidden">Último acesso: {new Date(profile.last_login).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>
                  </div>
                )}
              </div>
            </div>
            <motion.a
              href="/settings"
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors duration-300 text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faCog} />
              <span className="hidden sm:inline">Configurações</span>
              <span className="sm:hidden">Config</span>
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
        >
          {[
            { icon: faHeart, count: stats.totalFavorites, label: 'Favoritos', color: 'red' },
            { icon: faBookmark, count: stats.totalLibrary, label: 'Biblioteca', color: 'blue' },
            { icon: faEye, count: 0, label: 'Assistidos', color: 'green' },
            { icon: faClock, count: 0, label: 'Horas assistidas', color: 'yellow' }
          ].map((stat, index) => (
            <div key={index} className="glass-effect rounded-xl p-4 sm:p-6 border border-white/10 text-center">
              <FontAwesomeIcon 
                icon={stat.icon} 
                className={`text-2xl sm:text-3xl mb-2 sm:mb-3 ${
                  stat.color === 'red' ? 'text-red-500' :
                  stat.color === 'blue' ? 'text-blue-500' :
                  stat.color === 'green' ? 'text-green-500' : 'text-yellow-500'
                }`} 
              />
              <h3 className="text-xl sm:text-2xl font-bold text-white">{stat.count}</h3>
              <p className="text-gray-400 text-xs sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-4 sm:p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <FontAwesomeIcon icon={faHeart} className="text-red-500" />
                <span>Favoritos Recentes</span>
              </h2>
              <a href="/favorites" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm">
                Ver todos
              </a>
            </div>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
                {favorites.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="aspect-[2/3] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/placeholder.jpg'}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-400">
                <FontAwesomeIcon icon={faHeart} className="text-3xl sm:text-4xl mb-3 opacity-50" />
                <p className="text-sm sm:text-base">Nenhum favorito ainda</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-4 sm:p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <FontAwesomeIcon icon={faBookmark} className="text-blue-500" />
                <span>Biblioteca</span>
              </h2>
              <a href="/library" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm">
                Ver todos
              </a>
            </div>
            {library.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
                {library.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="aspect-[2/3] rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/placeholder.jpg'}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-400">
                <FontAwesomeIcon icon={faBookmark} className="text-3xl sm:text-4xl mb-3 opacity-50" />
                <p className="text-sm sm:text-base">Nenhum filme na biblioteca</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage; 
