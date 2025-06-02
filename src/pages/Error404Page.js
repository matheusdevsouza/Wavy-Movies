import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faSearch,
  faFilm,
  faExclamationTriangle,
  faRocket,
  faQuestion,
  faBug,
  faArrowLeft,
  faPlay,
  faTv,
  faCompass
} from '@fortawesome/free-solid-svg-icons';
function Error404Page() {
  const navigate = useNavigate();
  const [floatingIcons, setFloatingIcons] = useState([]);
  const [glitchText, setGlitchText] = useState(false);
  useEffect(() => {
    const icons = [faFilm, faTv, faPlay, faRocket, faBug, faQuestion];
    const newFloatingIcons = [];
    for (let i = 0; i < 12; i++) {
      newFloatingIcons.push({
        id: i,
        icon: icons[Math.floor(Math.random() * icons.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0.5 + Math.random() * 0.5,
        duration: 10 + Math.random() * 20
      });
    }
    setFloatingIcons(newFloatingIcons);
    const glitchInterval = setInterval(() => {
      setGlitchText(true);
      setTimeout(() => setGlitchText(false), 200);
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);
  const quickActions = [
    { icon: faHome, label: 'Início', path: '/', color: 'from-purple-500 to-purple-600' },
    { icon: faSearch, label: 'Explorar', path: '/discover', color: 'from-blue-500 to-blue-600' },
    { icon: faFilm, label: 'Filmes', path: '/movies', color: 'from-red-500 to-red-600' },
    { icon: faTv, label: 'Séries', path: '/series', color: 'from-green-500 to-green-600' }
  ];
  const funnyMessages = [
    "Esta página foi abduzida por alienígenas! 👽",
    "Parece que este filme não está em cartaz... 🎬",
    "Houston, temos um problema! 🚀",
    "Esta página está em uma dimensão paralela... 🌌",
    "Ops! Parece que você encontrou um Easter Egg quebrado! 🥚"
  ];
  const [currentMessage, setCurrentMessage] = useState(0);
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % funnyMessages.length);
    }, 4000);
    return () => clearInterval(messageInterval);
  }, []);
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 md:p-8">
      {floatingIcons.map((item) => (
        <motion.div
          key={item.id}
          className="absolute text-white/10 pointer-events-none"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            transform: `scale(${item.scale})`
          }}
          animate={{
            y: [0, -50, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <FontAwesomeIcon icon={item.icon} size="3x" />
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-4xl mx-auto px-4 md:px-8 lg:px-12 relative z-10 w-full"
      >
        <motion.div
          className={`text-6xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-8 ${
            glitchText ? 'animate-pulse' : ''
          }`}
          animate={glitchText ? { 
            x: [0, -5, 5, -5, 0],
            textShadow: [
              '0 0 0 transparent',
              '2px 0 0 #ff00ff, -2px 0 0 #00ffff',
              '0 0 0 transparent'
            ]
          } : {}}
          transition={{ duration: 0.2 }}
        >
          <span className="gradient-text">4</span>
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mx-4"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-500" />
          </motion.span>
          <span className="gradient-text">4</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6 px-2"
        >
          Página Não Encontrada
        </motion.h1>
        <motion.div
          className="h-14 md:h-16 mb-6 md:mb-8 flex items-center justify-center px-2"
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg md:text-xl text-purple-200 font-medium text-center">
            {funnyMessages[currentMessage]}
          </p>
        </motion.div>
        <motion.div
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mx-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 md:px-6 py-3 rounded-lg font-medium transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faHome} />
            <span>Página Inicial</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
export default Error404Page; 
