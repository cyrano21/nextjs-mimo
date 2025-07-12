'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Context pour la gamification
const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

// Provider pour la gamification
export function GamificationProvider({ children }) {
  const [userStats, setUserStats] = useState({
    level: 1,
    xp: 0,
    totalXp: 0,
    streak: 0,
    badges: [],
    completedLessons: [],
    achievements: []
  });
  
  const [notifications, setNotifications] = useState([]);
  
  // Calcul du XP nécessaire pour le niveau suivant
  const getXpForLevel = (level) => {
    return level * 100; // 100 XP par niveau
  };
  
  const getXpForNextLevel = () => {
    return getXpForLevel(userStats.level + 1) - userStats.totalXp;
  };
  
  const getCurrentLevelProgress = () => {
    const currentLevelXp = getXpForLevel(userStats.level);
    const nextLevelXp = getXpForLevel(userStats.level + 1);
    const progressXp = userStats.totalXp - (userStats.level > 1 ? getXpForLevel(userStats.level) : 0);
    const levelRange = nextLevelXp - currentLevelXp;
    
    return Math.min((progressXp / levelRange) * 100, 100);
  };
  
  // Ajouter de l'XP
  const addXp = (amount, source = 'lesson') => {
    setUserStats(prev => {
      const newTotalXp = prev.totalXp + amount;
      const newLevel = Math.floor(newTotalXp / 100) + 1;
      const leveledUp = newLevel > prev.level;
      
      if (leveledUp) {
        addNotification({
          type: 'level-up',
          title: 'Niveau supérieur !',
          message: `Félicitations ! Vous êtes maintenant niveau ${newLevel}`,
          icon: '🎉'
        });
      }
      
      addNotification({
        type: 'xp-gained',
        title: `+${amount} XP`,
        message: `XP gagné pour ${source}`,
        icon: '⭐'
      });
      
      return {
        ...prev,
        xp: prev.xp + amount,
        totalXp: newTotalXp,
        level: newLevel
      };
    });
  };
  
  // Ajouter un badge
  const addBadge = (badge) => {
    setUserStats(prev => {
      if (prev.badges.find(b => b.id === badge.id)) {
        return prev; // Badge déjà obtenu
      }
      
      addNotification({
        type: 'badge-earned',
        title: 'Nouveau badge !',
        message: `Vous avez obtenu le badge "${badge.name}"`,
        icon: badge.icon || '🏆'
      });
      
      return {
        ...prev,
        badges: [...prev.badges, { ...badge, earnedAt: new Date() }]
      };
    });
  };
  
  // Marquer une leçon comme terminée
  const completeLesson = (lessonId, xpReward = 50) => {
    setUserStats(prev => {
      if (prev.completedLessons.includes(lessonId)) {
        return prev; // Leçon déjà terminée
      }
      
      const newCompletedLessons = [...prev.completedLessons, lessonId];
      
      // Vérifier les achievements
      checkAchievements(newCompletedLessons);
      
      return {
        ...prev,
        completedLessons: newCompletedLessons,
        streak: prev.streak + 1
      };
    });
    
    addXp(xpReward, 'leçon terminée');
  };
  
  // Vérifier les achievements
  const checkAchievements = (completedLessons) => {
    const achievements = [
      {
        id: 'first-lesson',
        name: 'Premier pas',
        description: 'Terminer votre première leçon',
        icon: '🎯',
        condition: (lessons) => lessons.length >= 1
      },
      {
        id: 'five-lessons',
        name: 'En route !',
        description: 'Terminer 5 leçons',
        icon: '🚀',
        condition: (lessons) => lessons.length >= 5
      },
      {
        id: 'ten-lessons',
        name: 'Déterminé',
        description: 'Terminer 10 leçons',
        icon: '💪',
        condition: (lessons) => lessons.length >= 10
      },
      {
        id: 'module-complete',
        name: 'Maître du module',
        description: 'Terminer un module complet',
        icon: '🎓',
        condition: (lessons) => {
          // Vérifier si un module est complet (3 leçons par module)
          const modules = {};
          lessons.forEach(lessonId => {
            const [moduleId] = lessonId.split('-');
            modules[moduleId] = (modules[moduleId] || 0) + 1;
          });
          return Object.values(modules).some(count => count >= 3);
        }
      }
    ];
    
    achievements.forEach(achievement => {
      if (achievement.condition(completedLessons)) {
        addBadge(achievement);
      }
    });
  };
  
  // Ajouter une notification
  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Supprimer automatiquement après 5 secondes
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  };
  
  // Supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  // Sauvegarder dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gamification-stats', JSON.stringify(userStats));
    }
  }, [userStats]);
  
  // Charger depuis localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gamification-stats');
      if (saved) {
        try {
          setUserStats(JSON.parse(saved));
        } catch (error) {
          console.error('Erreur lors du chargement des stats:', error);
        }
      }
    }
  }, []);
  
  const value = {
    userStats,
    notifications,
    addXp,
    addBadge,
    completeLesson,
    removeNotification,
    getXpForNextLevel,
    getCurrentLevelProgress
  };
  
  return (
    <GamificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
    </GamificationContext.Provider>
  );
}

// Composant pour afficher les notifications
function NotificationContainer({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            className={`
              max-w-sm p-4 rounded-lg shadow-lg border cursor-pointer
              ${notification.type === 'level-up' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400'
                : notification.type === 'badge-earned'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-300'
                  : 'bg-blue-500 text-white border-blue-400'
              }
            `}
            onClick={() => onRemove(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{notification.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm">{notification.title}</h4>
                <p className="text-xs opacity-90">{notification.message}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Composant pour afficher les stats utilisateur
export function UserStatsDisplay({ theme = 'light', compact = false }) {
  const { userStats, getXpForNextLevel, getCurrentLevelProgress } = useGamification();
  
  if (compact) {
    return (
      <div className={`
        flex items-center space-x-4 p-3 rounded-lg
        ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}
      `}>
        <div className="flex items-center space-x-2">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
            ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}
          `}>
            {userStats.level}
          </div>
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Niveau {userStats.level}
          </span>
        </div>
        
        <div className="flex-1">
          <div className={`
            h-2 rounded-full overflow-hidden
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}
          `}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getCurrentLevelProgress()}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            />
          </div>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {getXpForNextLevel()} XP pour le niveau suivant
          </p>
        </div>
        
        <div className="text-right">
          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {userStats.totalXp} XP
          </p>
          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {userStats.badges.length} badges
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`
      p-6 rounded-lg border
      ${theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
      }
    `}>
      <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Vos statistiques
      </h3>
      
      <div className="space-y-4">
        {/* Niveau et progression */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Niveau {userStats.level}
            </span>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {getXpForNextLevel()} XP restants
            </span>
          </div>
          
          <div className={`
            h-3 rounded-full overflow-hidden
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
          `}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getCurrentLevelProgress()}%` }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
            />
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className={`
            p-3 rounded-lg text-center
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
          `}>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {userStats.totalXp}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              XP Total
            </p>
          </div>
          
          <div className={`
            p-3 rounded-lg text-center
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
          `}>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
              {userStats.completedLessons.length}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Leçons
            </p>
          </div>
          
          <div className={`
            p-3 rounded-lg text-center
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
          `}>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
              {userStats.streak}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Série
            </p>
          </div>
          
          <div className={`
            p-3 rounded-lg text-center
            ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}
          `}>
            <p className={`text-2xl font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
              {userStats.badges.length}
            </p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Badges
            </p>
          </div>
        </div>
        
        {/* Badges récents */}
        {userStats.badges.length > 0 && (
          <div>
            <h4 className={`font-medium mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              Badges récents
            </h4>
            <div className="flex flex-wrap gap-2">
              {userStats.badges.slice(-3).map(badge => (
                <div
                  key={badge.id}
                  className={`
                    flex items-center space-x-2 px-3 py-1 rounded-full text-sm
                    ${theme === 'dark' 
                      ? 'bg-yellow-900/30 text-yellow-200 border border-yellow-700' 
                      : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }
                  `}
                  title={badge.description}
                >
                  <span>{badge.icon}</span>
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

