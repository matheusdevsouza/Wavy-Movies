const PROFILE_PICTURE_KEY = 'wavy_profile_picture';

export const profilePictureOptions = [
  {
    id: 'action',
    name: 'Action Hero',
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face',
    category: 'action'
  },
  {
    id: 'action2',
    name: 'Warrior',
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
    category: 'action'
  },
  
  {
    id: 'comedy',
    name: 'Comedy Star',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    category: 'comedy'
  },
  {
    id: 'comedy2',
    name: 'Joyful',
    url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face',
    category: 'comedy'
  },
  
  {
    id: 'drama',
    name: 'Drama Queen',
    url: 'https://images.unsplash.com/photo-1494790108755-2616b332c7d2-4b33-9e63-c83b96a9fe4f?w=150&h=150&fit=crop&crop=face',
    category: 'drama'
  },
  {
    id: 'drama2',
    name: 'Elegant',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
    category: 'drama'
  },
  
  {
    id: 'scifi',
    name: 'Sci-Fi Explorer',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    category: 'science fiction'
  },
  {
    id: 'scifi2',
    name: 'Tech Genius',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    category: 'science fiction'
  },
  
  {
    id: 'horror',
    name: 'Mystery Master',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    category: 'horror'
  },
  {
    id: 'horror2',
    name: 'Dark Hero',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    category: 'horror'
  },
  
  {
    id: 'romance',
    name: 'Romantic Lead',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    category: 'romance'
  },
  {
    id: 'romance2',
    name: 'Charming',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    category: 'romance'
  },
  
  {
    id: 'adventure',
    name: 'Adventurer',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face',
    category: 'adventure'
  },
  {
    id: 'adventure2',
    name: 'Explorer',
    url: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
    category: 'adventure'
  },
  
  {
    id: 'fantasy',
    name: 'Fantasy Hero',
    url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
    category: 'fantasy'
  },
  {
    id: 'fantasy2',
    name: 'Mystical',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    category: 'fantasy'
  }
];

export const getSelectedProfilePicture = () => {
  try {
    const saved = localStorage.getItem(PROFILE_PICTURE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return profilePictureOptions.find(option => option.id === data.selectedId) || profilePictureOptions[0];
    }
    return profilePictureOptions[0]; 
  } catch (error) {
    console.error('Error getting profile picture:', error);
    return profilePictureOptions[0];
  }
};

export const setSelectedProfilePicture = (pictureId) => {
  try {
    const selectedPicture = profilePictureOptions.find(option => option.id === pictureId);
    if (selectedPicture) {
      localStorage.setItem(PROFILE_PICTURE_KEY, JSON.stringify({
        selectedId: pictureId,
        timestamp: new Date().toISOString()
      }));
      return selectedPicture;
    }
    throw new Error('Invalid picture ID');
  } catch (error) {
    console.error('Error setting profile picture:', error);
    throw error;
  }
};

export const getUserAvatar = (userId) => {
  const selectedPicture = getSelectedProfilePicture();
  return selectedPicture.url;
};

export default {
  profilePictureOptions,
  getSelectedProfilePicture,
  setSelectedProfilePicture,
  getUserAvatar
}; 