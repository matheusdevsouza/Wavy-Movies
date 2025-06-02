import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  'pt-BR': {
    home: 'Home',
    movies: 'Filmes',
    series: 'Séries',
    discover: 'Explorar',
    trending: 'Em Alta',
    profile: 'Perfil',
    favorites: 'Favoritos',
    library: 'Biblioteca',
    settings: 'Configurações',
    logout: 'Sair',
    login: 'Entrar',
    register: 'Registrar',
    
    search: 'Buscar filmes e séries...',
    loading: 'Carregando...',
    error: 'Erro',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar',
    
    profileSettings: 'Configurações do Perfil',
    name: 'Nome',
    email: 'Email',
    password: 'Senha',
    currentPassword: 'Senha Atual',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Senha',
    changePassword: 'Alterar Senha',
    
    appearance: 'Aparência',
    theme: 'Tema',
    language: 'Idioma',
    darkTheme: 'Escuro',
    lightTheme: 'Claro',
    autoTheme: 'Automático',
    notifications: 'Notificações',
    emailNotifications: 'Notificações por Email',
    browserNotifications: 'Notificações do Navegador',
    newContent: 'Novo Conteúdo',
    recommendations: 'Recomendações',
    privacy: 'Privacidade',
    account: 'Conta',
    deleteAccount: 'Excluir Conta',
    
    profileUpdated: 'Perfil atualizado com sucesso!',
    passwordChanged: 'Senha alterada com sucesso!',
    loginError: 'Erro ao fazer login',
    logoutError: 'Erro ao fazer logout. Tente novamente.',
    deleteAccountConfirm: 'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
    
    nameRequired: 'Nome é obrigatório',
    nameMinLength: 'Nome deve ter pelo menos 2 caracteres',
    nameTooLong: 'Nome muito longo',
    passwordMinLength: 'Senha deve ter pelo menos 6 caracteres',
    passwordsNotMatch: 'Senhas não coincidem',
    allFieldsRequired: 'Todos os campos são obrigatórios',
    
    loadingProgress: 'Carregando...',
  },
  'en-US': {
    home: 'Home',
    movies: 'Movies',
    series: 'Series',
    discover: 'Discover',
    trending: 'Trending',
    profile: 'Profile',
    favorites: 'Favorites',
    library: 'Library',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    
    search: 'Search movies and series...',
    loading: 'Loading...',
    error: 'Error',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    
    profileSettings: 'Profile Settings',
    name: 'Name',
    email: 'Email',
    password: 'Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    changePassword: 'Change Password',
    
    appearance: 'Appearance',
    theme: 'Theme',
    language: 'Language',
    darkTheme: 'Dark',
    lightTheme: 'Light',
    autoTheme: 'Auto',
    notifications: 'Notifications',
    emailNotifications: 'Email Notifications',
    browserNotifications: 'Browser Notifications',
    newContent: 'New Content',
    recommendations: 'Recommendations',
    privacy: 'Privacy',
    account: 'Account',
    deleteAccount: 'Delete Account',
    
    profileUpdated: 'Profile updated successfully!',
    passwordChanged: 'Password changed successfully!',
    loginError: 'Login error',
    logoutError: 'Error logging out. Please try again.',
    deleteAccountConfirm: 'Are you sure you want to delete your account? This action cannot be undone.',
    
    nameRequired: 'Name is required',
    nameMinLength: 'Name must be at least 2 characters',
    nameTooLong: 'Name too long',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordsNotMatch: 'Passwords do not match',
    allFieldsRequired: 'All fields are required',
    
    loadingProgress: 'Loading...',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt-BR');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('wavy_language') || 'pt-BR';
    setLanguage(savedLanguage);
  }, []);

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('wavy_language', newLanguage);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['pt-BR']?.[key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t,
    isEnglish: language === 'en-US',
    isPortuguese: language === 'pt-BR'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 