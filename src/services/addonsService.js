const ADDONS_KEY = 'wavy_addons';
export const getInstalledAddons = () => {
  try {
    const addons = localStorage.getItem(ADDONS_KEY);
    return addons ? JSON.parse(addons) : getDefaultAddons();
  } catch (error) {
    console.error('Error getting addons:', error);
    return getDefaultAddons();
  }
};
export const getDefaultAddons = () => {
  return [
    {
      id: 'youtube_trailers',
      name: 'YouTube Trailers',
      description: 'Player de trailers do YouTube integrado',
      version: '1.0.0',
      enabled: true,
      type: 'player',
      icon: '🎬'
    },
    {
      id: 'tmdb_metadata',
      name: 'TMDB Metadata',
      description: 'Metadados de filmes da base TMDB',
      version: '1.0.0',
      enabled: true,
      type: 'metadata',
      icon: '📊'
    },
    {
      id: 'local_favorites',
      name: 'Favoritos Locais',
      description: 'Sistema de favoritos com armazenamento local',
      version: '1.0.0',
      enabled: true,
      type: 'storage',
      icon: '❤️'
    }
  ];
};
export const toggleAddon = (addonId) => {
  try {
    const addons = getInstalledAddons();
    const updatedAddons = addons.map(addon => 
      addon.id === addonId 
        ? { ...addon, enabled: !addon.enabled }
        : addon
    );
    localStorage.setItem(ADDONS_KEY, JSON.stringify(updatedAddons));
    return updatedAddons;
  } catch (error) {
    console.error('Error toggling addon:', error);
    return getInstalledAddons();
  }
};
export const installAddon = (addonData) => {
  try {
    const addons = getInstalledAddons();
    const exists = addons.find(addon => addon.id === addonData.id);
    if (exists) {
      throw new Error('Add-on já está instalado');
    }
    const newAddon = {
      ...addonData,
      enabled: true,
      installedAt: new Date().toISOString()
    };
    const updatedAddons = [...addons, newAddon];
    localStorage.setItem(ADDONS_KEY, JSON.stringify(updatedAddons));
    return updatedAddons;
  } catch (error) {
    console.error('Error installing addon:', error);
    throw error;
  }
};
export const uninstallAddon = (addonId) => {
  try {
    const addons = getInstalledAddons();
    const defaultAddonIds = getDefaultAddons().map(addon => addon.id);
    if (defaultAddonIds.includes(addonId)) {
      throw new Error('Não é possível desinstalar add-ons padrão');
    }
    const updatedAddons = addons.filter(addon => addon.id !== addonId);
    localStorage.setItem(ADDONS_KEY, JSON.stringify(updatedAddons));
    return updatedAddons;
  } catch (error) {
    console.error('Error uninstalling addon:', error);
    throw error;
  }
};
export const getAddonsByType = (type) => {
  const addons = getInstalledAddons();
  return addons.filter(addon => addon.type === type && addon.enabled);
};
export const isAddonEnabled = (addonId) => {
  const addons = getInstalledAddons();
  const addon = addons.find(a => a.id === addonId);
  return addon ? addon.enabled : false;
}; 
