import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faHome,
  faPlay,
  faList,
  faUser,
  faSignInAlt,
  faChevronDown,
  faCog,
  faHeart,
  faBookmark,
  faSignOutAlt,
  faCompass,
  faFilm,
  faTv
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { user, quickLogin, logout, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  window.showLoginModal = () => {
    setShowLoginForm(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogin = () => {
    setShowLoginForm(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
      alert(t('logoutError'));
    }
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 h-16 glass-effect backdrop-blur-xl border-b border-white/10`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 h-full">
        <div 
          className="flex items-center justify-between h-full"
        >
          <Link to="/" className="flex items-center space-x-3 group">
            <span 
              className="font-bold gradient-text tracking-wide text-2xl"
            >
              Wavy
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group"
            >
              <FontAwesomeIcon 
                icon={faHome} 
                className="group-hover:scale-110 transition-transform duration-300" 
              />
              <span className="font-medium">{t('home')}</span>
            </Link>
            <Link 
              to="/movies" 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group"
            >
              <FontAwesomeIcon 
                icon={faFilm} 
                className="group-hover:scale-110 transition-transform duration-300" 
              />
              <span className="font-medium">{t('movies')}</span>
            </Link>
            <Link 
              to="/series" 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group"
            >
              <FontAwesomeIcon 
                icon={faTv} 
                className="group-hover:scale-110 transition-transform duration-300" 
              />
              <span className="font-medium">{t('series')}</span>
            </Link>
            <Link 
              to="/discover" 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group"
            >
              <FontAwesomeIcon 
                icon={faCompass} 
                className="group-hover:scale-110 transition-transform duration-300" 
              />
              <span className="font-medium">{t('discover')}</span>
            </Link>
            <Link 
              to="/trending" 
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300 group"
            >
              <FontAwesomeIcon 
                icon={faPlay} 
                className="group-hover:scale-110 transition-transform duration-300" 
              />
              <span className="font-medium">{t('trending')}</span>
            </Link>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4">
            <div 
              className="relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search')}
                className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-4 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <motion.img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border-2 border-purple-500/50 hover:border-purple-400 transition-colors duration-300"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  <motion.div
                    animate={{ rotate: showUserMenu ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <FontAwesomeIcon 
                      icon={faChevronDown} 
                      className="text-sm"
                    />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -15, scale: 0.95 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: "easeInOut",
                        type: "spring",
                        stiffness: 300,
                        damping: 30
                      }}
                      className="absolute right-0 mt-2 w-48 glass-effect border border-white/10 rounded-lg shadow-lg overflow-hidden"
                    >
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-sm font-medium text-white">{user?.name}</p>
                          <p className="text-xs text-white/60">{user?.email}</p>
                        </div>
                        
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FontAwesomeIcon icon={faUser} />
                            <span>{t('profile')}</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to="/favorites"
                            className="flex items-center space-x-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FontAwesomeIcon icon={faHeart} />
                            <span>{t('favorites')}</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to="/library"
                            className="flex items-center space-x-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FontAwesomeIcon icon={faBookmark} />
                            <span>{t('library')}</span>
                          </Link>
                        </motion.div>
                        
                        <motion.div
                          whileHover={{ x: 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to="/settings"
                            className="flex items-center space-x-3 px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <FontAwesomeIcon icon={faCog} />
                            <span>{t('settings')}</span>
                          </Link>
                        </motion.div>
                        
                        <div className="border-t border-white/10 mt-2">
                          <motion.button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
                            whileHover={{ x: 3 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span>{t('logout')}</span>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                onClick={handleLogin}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors duration-300"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>{t('login')}</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLoginForm && (
          <LoginForm
            onClose={() => setShowLoginForm(false)}
            onSwitchToRegister={() => {
              setShowLoginForm(false);
              setShowRegisterForm(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRegisterForm && (
          <RegisterForm
            onClose={() => setShowRegisterForm(false)}
            onSwitchToLogin={() => {
              setShowRegisterForm(false);
              setShowLoginForm(true);
            }}
          />
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 