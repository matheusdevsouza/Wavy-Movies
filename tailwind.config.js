/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        dark: {
          50: '#faf9fc',
          100: '#f3f1f7',
          200: '#e9e4f0',
          300: '#d6cce3',
          400: '#b8a9d1',
          500: '#9a85bd',
          600: '#7c65a3',
          700: '#654d87',
          800: '#4a3865',
          900: '#2d1b3d',
          950: '#1a0f24',
        },
        primary: {
          50: '#faf7ff',
          100: '#f3ecff',
          200: '#e9dcff',
          300: '#d6bfff',
          400: '#bb93ff',
          500: '#9d5eff',
          600: '#8b39ff',
          700: '#7c25f0',
          800: '#6820c7',
          900: '#551ca3',
          950: '#380f6e',
        },
        accent: {
          50: '#ffffff',
          100: '#fefefe',
          200: '#fdfdfd',
          300: '#fbfbfb',
          400: '#f8f8f8',
          500: '#f5f5f5',
          600: '#e0e0e0',
          700: '#c7c7c7',
          800: '#8f8f8f',
          900: '#5c5c5c',
        },
        purple: {
          50: '#faf7ff',
          100: '#f3ecff',
          200: '#e9dcff',
          300: '#d6bfff',
          400: '#bb93ff',
          500: '#9d5eff',
          600: '#8b39ff',
          700: '#7c25f0',
          800: '#6820c7',
          900: '#551ca3',
          950: '#380f6e',
        }
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #1a0f24 0%, #2d1b3d 50%, #4a3865 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-purple': 'linear-gradient(45deg, #8b39ff, #9d5eff, #bb93ff)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.6s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSoft: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-4px)' },
          '60%': { transform: 'translateY(-2px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(255, 0, 128, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(255, 0, 128, 0.8), 0 0 30px rgba(0, 128, 255, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neon': '0 0 20px rgba(255, 0, 128, 0.5)',
        'glow': '0 0 50px rgba(255, 255, 255, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
} 