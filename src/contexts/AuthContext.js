import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../services/apiClient.js';
import { getUserAvatar } from '../services/profilePictureService.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setIsLoading(true);
      const savedSession = localStorage.getItem('wavy_session');
      if (savedSession) {
        const sessionData = JSON.parse(savedSession);
        const userData = await apiClient.verifySession(sessionData.sessionToken);
        if (userData) {
          setUser({
            ...userData,
            avatar: getUserAvatar(userData.id)
          });
          setSessionToken(sessionData.sessionToken);
        } else {
          localStorage.removeItem('wavy_session');
          localStorage.removeItem('wavy_jwt');
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      localStorage.removeItem('wavy_session');
      localStorage.removeItem('wavy_jwt');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const result = await apiClient.login(email, password);
      const userData = {
        ...result.user,
        avatar: getUserAvatar(result.user.id)
      };
      setUser(userData);
      setSessionToken(result.tokens.session);
      localStorage.setItem('wavy_session', JSON.stringify({
        sessionToken: result.tokens.session,
        userId: result.user.id
      }));
      localStorage.setItem('wavy_jwt', result.tokens.jwt);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const newUser = await apiClient.register(userData);
      const loginResult = await apiClient.login(userData.email, userData.password);
      const userWithAvatar = {
        ...loginResult.user,
        avatar: getUserAvatar(loginResult.user.id)
      };
      setUser(userWithAvatar);
      setSessionToken(loginResult.tokens.session);
      localStorage.setItem('wavy_session', JSON.stringify({
        sessionToken: loginResult.tokens.session,
        userId: loginResult.user.id
      }));
      localStorage.setItem('wavy_jwt', loginResult.tokens.jwt);
      return userWithAvatar;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (sessionToken) {
        await apiClient.logout(sessionToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setSessionToken(null);
      localStorage.removeItem('wavy_session');
      localStorage.removeItem('wavy_jwt');
    }
  };

  const updateProfile = async (updateData) => {
    try {
      if (!user) throw new Error('Usuário não está logado');
      const updatedUser = { 
        ...user, 
        ...updateData,
        avatar: updateData.avatar || getUserAvatar(user.id)
      };
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const refreshUserAvatar = () => {
    if (user) {
      setUser(prev => ({
        ...prev,
        avatar: getUserAvatar(prev.id)
      }));
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (!user) throw new Error('Usuário não está logado');
      return true;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  };

  const quickLogin = async () => {
    try {
      const demoEmail = 'demo@wavy.com';
      const demoPassword = 'demo123';
      try {
        await login(demoEmail, demoPassword);
      } catch (error) {
        if (error.message === 'Credenciais inválidas') {
          await register({
            name: 'Demo User',
            email: demoEmail,
            password: demoPassword,
            avatarUrl: getUserAvatar('demo')
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Quick login error:', error);
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    sessionToken,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    quickLogin,
    refreshUserAvatar,
    isAuthenticated: !!user,
    refreshAuth: initializeAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
