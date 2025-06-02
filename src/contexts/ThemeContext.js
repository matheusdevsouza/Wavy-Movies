import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark'); 
  const [actualTheme, setActualTheme] = useState('dark'); 

  useEffect(() => {
    const savedTheme = localStorage.getItem('wavy_theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      let newActualTheme;
      
      if (theme === 'auto') {
        newActualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newActualTheme = theme;
      }
      
      setActualTheme(newActualTheme);
      
      if (newActualTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    };

    updateTheme();

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('wavy_theme', newTheme);
  };

  const getThemeStyles = () => {
    if (actualTheme === 'light') {
      return {
        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%)',
        primaryText: '#1e293b',
        secondaryText: '#475569',
        cardBackground: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(15, 23, 42, 0.15)',
        navBackground: 'rgba(255, 255, 255, 0.95)',
      };
    }
    return {
      background: 'linear-gradient(135deg, #1a0f24 0%, #2d1b3d 50%, #4a3865 100%)',
      primaryText: '#ffffff',
      secondaryText: '#d1d5db',
      cardBackground: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      navBackground: 'rgba(0, 0, 0, 0.1)',
    };
  };

  const value = {
    theme,
    actualTheme,
    changeTheme,
    getThemeStyles,
    isLight: actualTheme === 'light',
    isDark: actualTheme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 