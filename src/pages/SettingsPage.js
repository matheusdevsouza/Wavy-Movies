import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog, 
  faUser, 
  faEnvelope, 
  faLock, 
  faCamera,
  faSpinner,
  faExclamationTriangle,
  faCheck,
  faEye,
  faEyeSlash,
  faSave,
  faShield,
  faBell,
  faGlobe,
  faPalette,
  faTrash,
  faDownload,
  faSignOutAlt,
  faToggleOn,
  faToggleOff,
  faVolumeUp,
  faPlay,
  faVideo,
  faLanguage,
  faMoon,
  faSun,
  faDesktop,
  faUserShield,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { profilePictureOptions, setSelectedProfilePicture } from '../services/profilePictureService';
import profileService from '../services/profileService';

function SettingsPage() {
  const { user, isAuthenticated, logout, refreshUserAvatar } = useAuth();
  const { theme, changeTheme } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    avatar_url: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [activeTab, setActiveTab] = useState('profile'); 
  
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'pt-BR',
    autoplay: true,
    quality: 'auto',
    volume: 80,
    notifications: {
      email: true,
      browser: true,
      newContent: true,
      recommendations: false
    }
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProfile();
    }
  }, [isAuthenticated, user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      setProfileForm({
        name: profileData.name || '',
        avatar_url: profileData.avatar_url || ''
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Erro ao carregar dados do perfil.');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!profileForm.name || profileForm.name.trim().length < 2) {
      setError(t('nameMinLength'));
      return;
    }

    if (profileForm.name.length > 255) {
      setError(t('nameTooLong'));
      return;
    }

    setSaving(true);

    try {
      await profileService.updateProfile({
        name: profileForm.name.trim(),
        avatar_url: profileForm.avatar_url
      });
      
      setSuccess(t('profileUpdated'));
      await loadProfile(); 
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError(t('allFieldsRequired'));
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError(t('passwordMinLength'));
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError(t('passwordsNotMatch'));
      return;
    }

    setSaving(true);

    try {
      await profileService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      
      setSuccess(t('passwordChanged'));
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      setError(err.message || 'Erro ao alterar senha');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceToggle = (key, subKey = null) => {
    if (subKey) {
      setPreferences(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [subKey]: !prev[key][subKey]
        }
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDeleteAccount = async () => {
    try {
      alert(t('deleteAccountConfirm'));
      await logout();
    setShowDeleteConfirm(false);
    } catch (err) {
      setError('Erro ao excluir conta');
    }
  };

  const handleLogoutAllDevices = async () => {
    try {
      await logout();
      alert('Sessão encerrada em todos os dispositivos.');
    } catch (err) {
      setError('Erro ao encerrar sessões');
    }
  };

  const handleExportData = () => {
    alert('Funcionalidade de exportação de dados será implementada em breve.');
  };

  const handleProfilePictureSelect = async (pictureId) => {
    try {
      setSelectedProfilePicture(pictureId);
      refreshUserAvatar();
      setSuccess('Foto de perfil atualizada!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error updating profile picture:', error);
      setError('Erro ao atualizar foto de perfil');
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
          <p className="text-gray-400">Você precisa fazer login para acessar as configurações.</p>
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
          <p className="text-gray-400 text-lg">{t('loading')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FontAwesomeIcon icon={faCog} className="text-2xl sm:text-3xl text-purple-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('settings')}</h1>
          </div>
          <p className="text-gray-400 text-sm sm:text-base">Gerencie suas informações pessoais e configurações de conta</p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4 sm:mb-6 text-sm sm:text-base"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-500/20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4 sm:mb-6 flex items-center space-x-2 text-sm sm:text-base"
          >
            <FontAwesomeIcon icon={faCheck} />
            <span>{success}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-1"
          >
            <div className="glass-effect rounded-xl p-4 sm:p-6 border border-white/10 xl:sticky xl:top-8">
              <nav className="space-y-1 sm:space-y-2">
                {[
                  { id: 'profile', icon: faUser, label: t('profile'), color: 'purple' },
                  { id: 'security', icon: faShield, label: 'Segurança', color: 'purple' },
                  { id: 'preferences', icon: faPalette, label: t('appearance'), color: 'purple' },
                  { id: 'notifications', icon: faBell, label: t('notifications'), color: 'purple' },
                  { id: 'privacy', icon: faUserShield, label: t('privacy'), color: 'purple' },
                  { id: 'account', icon: faTrash, label: t('account'), color: 'red' }
                ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors duration-300 text-sm sm:text-base ${
                      activeTab === tab.id 
                        ? tab.color === 'red' 
                      ? 'bg-red-600 text-white' 
                          : 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                    <FontAwesomeIcon icon={tab.icon} className="text-sm sm:text-base" />
                    <span className="font-medium">{tab.label}</span>
                </button>
                ))}
              </nav>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="xl:col-span-3"
          >
            
            {activeTab === 'profile' && (
              <div className="glass-effect rounded-xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <FontAwesomeIcon icon={faUser} className="text-xl sm:text-2xl text-purple-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{t('profileSettings')}</h2>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-4">
                      Foto do Perfil
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                      <img
                        src={user?.avatar}
                        alt="Avatar atual"
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 border-purple-500/50 object-cover mx-auto sm:mx-0"
                      />
                      <div className="text-white text-center sm:text-left">
                        <h4 className="font-medium">Foto atual</h4>
                        <p className="text-sm text-gray-400">Escolha uma nova foto abaixo ({profilePictureOptions.length} opções disponíveis)</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-8 gap-2 sm:gap-3">
                      {profilePictureOptions.map((option) => (
                        <motion.button
                          key={option.id}
                          type="button"
                          onClick={() => handleProfilePictureSelect(option.id)}
                          className="group relative aspect-square rounded-full overflow-hidden border-2 transition-all duration-300 hover:scale-110 border-white/20 hover:border-purple-400 focus:border-purple-500 focus:outline-none"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title={`${option.name} - ${option.category}`}
                        >
                          <img 
                            src={option.url} 
                            alt={option.name} 
                            className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110" 
                          />
                          <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="text-white text-xs font-medium truncate px-1 hidden sm:block">{option.name}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center sm:text-left">Clique em qualquer avatar para selecioná-lo como sua foto de perfil</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                        {t('name')}
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faUser} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                      />
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full pl-10 pr-4 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-sm sm:text-base"
                        placeholder="Seu nome completo"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                        {t('email')}
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faEnvelope} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                      />
                      <input
                        type="email"
                          value={user?.email || ''}
                        disabled
                          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed text-sm sm:text-base"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">O e-mail não pode ser alterado</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    {saving ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    ) : (
                      <FontAwesomeIcon icon={faSave} />
                    )}
                    <span>{saving ? 'Salvando...' : t('save')}</span>
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass-effect rounded-xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <FontAwesomeIcon icon={faShield} className="text-xl sm:text-2xl text-purple-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Segurança da Conta</h2>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  
                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Senha Atual
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faLock} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                      />
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-sm sm:text-base"
                        placeholder="Digite sua senha atual"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                      >
                        <FontAwesomeIcon icon={showPasswords.current ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Nova Senha
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faLock} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                      />
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-sm sm:text-base"
                        placeholder="Digite a nova senha"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                      >
                        <FontAwesomeIcon icon={showPasswords.new ? faEyeSlash : faEye} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Mínimo 6 caracteres</p>
                  </div>

                  <div>
                    <label className="block text-purple-200 text-sm font-medium mb-2">
                      Confirmar Nova Senha
                    </label>
                    <div className="relative">
                      <FontAwesomeIcon 
                        icon={faLock} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                      />
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full pl-10 pr-12 py-3 bg-purple-800/50 border border-purple-600 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 text-sm sm:text-base"
                        placeholder="Confirme a nova senha"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400 hover:text-purple-300"
                      >
                        <FontAwesomeIcon icon={showPasswords.confirm ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-lg font-medium hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    {saving ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    ) : (
                      <FontAwesomeIcon icon={faLock} />
                    )}
                    <span>{saving ? 'Alterando...' : 'Alterar Senha'}</span>
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Informações de Segurança</h3>
                  <div className="space-y-3 text-sm text-gray-400">
                    <p>• Use uma senha forte com pelo menos 6 caracteres</p>
                    <p>• Não compartilhe suas credenciais com outras pessoas</p>
                    <p>• Faça logout ao usar computadores públicos</p>
                    <p>• Entre em contato conosco se suspeitar de atividade suspeita</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="glass-effect rounded-xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <FontAwesomeIcon icon={faPalette} className="text-xl sm:text-2xl text-purple-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{t('appearance')}</h2>
                </div>

                <div className="space-y-8">
                  
                  <div>
                    <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                      <FontAwesomeIcon icon={faPalette} className="text-purple-400" />
                      <span>{t('theme')}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { id: 'dark', icon: faMoon, label: t('darkTheme'), color: 'purple' },
                        { id: 'light', icon: faSun, label: t('lightTheme'), color: 'yellow' },
                        { id: 'auto', icon: faDesktop, label: t('autoTheme'), color: 'blue' }
                      ].map((themeOption) => (
                        <motion.button
                          key={themeOption.id}
                          onClick={() => changeTheme(themeOption.id)}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                            theme === themeOption.id 
                              ? 'border-purple-500 bg-purple-500/20'
                              : 'border-white/20 hover:border-purple-400'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                      <FontAwesomeIcon 
                            icon={themeOption.icon} 
                            className={`text-2xl mb-2 ${
                              themeOption.color === 'yellow' ? 'text-yellow-400' :
                              themeOption.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                            }`} 
                          />
                          <div className="text-white font-medium text-sm sm:text-base">{themeOption.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                    <div>
                    <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                      <FontAwesomeIcon icon={faLanguage} className="text-purple-400" />
                      <span>{t('language')}</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'pt-BR', label: '🇧🇷 Português (BR)' },
                        { id: 'en-US', label: '🇺🇸 English (US)' }
                      ].map((langOption) => (
                        <motion.button
                          key={langOption.id}
                          onClick={() => changeLanguage(langOption.id)}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                            language === langOption.id 
                              ? 'border-purple-500 bg-purple-500/20' 
                              : 'border-white/20 hover:border-purple-400'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="text-white font-medium text-sm sm:text-base">{langOption.label}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="glass-effect rounded-xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <FontAwesomeIcon icon={faBell} className="text-xl sm:text-2xl text-purple-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{t('notifications')}</h2>
                </div>

                <div className="space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{t('emailNotifications')}</h4>
                      <p className="text-gray-400 text-sm">Receba atualizações importantes por e-mail</p>
                    </div>
                    <motion.button
                      onClick={() => handlePreferenceToggle('notifications', 'email')}
                      className="relative"
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        preferences.notifications.email ? 'bg-purple-500' : 'bg-gray-600'
                      }`}>
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{
                            x: preferences.notifications.email ? 26 : 2,
                            y: 2
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{t('browserNotifications')}</h4>
                      <p className="text-gray-400 text-sm">Receba notificações no seu navegador</p>
                    </div>
                    <motion.button
                      onClick={() => handlePreferenceToggle('notifications', 'browser')}
                      className="relative"
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        preferences.notifications.browser ? 'bg-purple-500' : 'bg-gray-600'
                      }`}>
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{
                            x: preferences.notifications.browser ? 26 : 2,
                            y: 2
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{t('newContent')}</h4>
                      <p className="text-gray-400 text-sm">Seja notificado sobre novos filmes e séries</p>
                    </div>
                    <motion.button
                      onClick={() => handlePreferenceToggle('notifications', 'newContent')}
                      className="relative"
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        preferences.notifications.newContent ? 'bg-purple-500' : 'bg-gray-600'
                      }`}>
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{
                            x: preferences.notifications.newContent ? 26 : 2,
                            y: 2
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </motion.button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">{t('recommendations')}</h4>
                      <p className="text-gray-400 text-sm">Receba sugestões baseadas no seu histórico</p>
                    </div>
                    <motion.button
                      onClick={() => handlePreferenceToggle('notifications', 'recommendations')}
                      className="relative"
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                        preferences.notifications.recommendations ? 'bg-purple-500' : 'bg-gray-600'
                      }`}>
                        <motion.div
                          className="w-5 h-5 bg-white rounded-full shadow-md"
                          animate={{
                            x: preferences.notifications.recommendations ? 26 : 2,
                            y: 2
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </motion.button>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="glass-effect rounded-xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <FontAwesomeIcon icon={faUserShield} className="text-xl sm:text-2xl text-purple-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Privacidade e Dados</h2>
                </div>

                <div className="space-y-6">
                  
                  <div className="p-6 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium flex items-center space-x-2">
                          <FontAwesomeIcon icon={faDownload} className="text-blue-400" />
                          <span>Exportar Meus Dados</span>
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Baixe uma cópia dos seus dados pessoais
                        </p>
                      </div>
                      <button
                        onClick={handleExportData}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
                      >
                        Exportar
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white font-medium">Informações da Conta</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-gray-400">Membro desde</p>
                        <p className="text-white">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-lg">
                        <p className="text-gray-400">Último acesso</p>
                        <p className="text-white">
                          {profile?.last_login ? new Date(profile.last_login).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                    <h4 className="text-white font-medium mb-3">Política de Privacidade</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Seus dados são protegidos e utilizados apenas para melhorar sua experiência. 
                      Não compartilhamos informações pessoais com terceiros sem seu consentimento.
                    </p>
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="glass-effect rounded-xl p-6 sm:p-8 border border-white/10">
                <div className="flex items-center space-x-3 mb-6">
                  <FontAwesomeIcon icon={faTrash} className="text-xl sm:text-2xl text-red-500" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white">Gerenciar Conta</h2>
                </div>

                <div className="space-y-6">
                  
                  <div className="p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1">
                        <h4 className="text-white font-medium flex items-center space-x-2">
                          <FontAwesomeIcon icon={faSignOutAlt} className="text-yellow-400" />
                          <span>Encerrar Todas as Sessões</span>
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          Desconecta sua conta de todos os dispositivos
                        </p>
                      </div>
                      <button
                        onClick={handleLogoutAllDevices}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 whitespace-nowrap text-sm sm:text-base"
                      >
                        Encerrar
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="text-red-400 font-medium mb-4 flex items-center space-x-2">
                      <FontAwesomeIcon icon={faExclamationCircle} />
                      <span>Zona de Perigo</span>
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
                        <div className="flex-1">
                          <h5 className="text-white font-medium">{t('deleteAccount')}</h5>
                          <p className="text-gray-400 text-sm">
                            Remove permanentemente sua conta e todos os dados associados. 
                            Esta ação não pode ser desfeita.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 whitespace-nowrap text-sm sm:text-base"
                        >
                          {t('delete')}
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </motion.div>
        </div>

        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-effect border border-red-500/50 rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl sm:text-4xl text-red-500 mb-4" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{t('confirm')}</h3>
                <p className="text-gray-400 mb-6 text-sm sm:text-base">
                  {t('deleteAccountConfirm')}
                </p>
                
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base"
                  >
                    {t('delete')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default SettingsPage; 