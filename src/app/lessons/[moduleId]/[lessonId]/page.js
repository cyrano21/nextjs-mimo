'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LessonLayoutImproved from '@/components/lessons/LessonLayoutImproved';
import { useTheme } from 'next-themes';

// Import des leçons (à adapter selon la structure)
import lesson1Improved from '@/data/lessons/module1/lesson1-improved';

// Mapping des leçons disponibles
const lessonsMap = {
  '1': {
    '1': lesson1Improved,
    // Ajouter d'autres leçons ici
  }
  // Ajouter d'autres modules ici
};

export default function LessonPage() {
  const params = useParams();
  const { theme } = useTheme();
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const { moduleId, lessonId } = params;
    
    // Récupérer la leçon depuis le mapping
    const moduleData = lessonsMap[moduleId];
    if (moduleData && moduleData[lessonId]) {
      setLesson(moduleData[lessonId]);
    } else {
      // Leçon non trouvée, créer une leçon par défaut
      setLesson(createDefaultLesson(moduleId, lessonId));
    }
    
    setLoading(false);
  }, [params]);
  
  const createDefaultLesson = (moduleId, lessonId) => {
    return {
      id: `${moduleId}-${lessonId}`,
      title: `Leçon ${moduleId}.${lessonId}`,
      description: 'Cette leçon est en cours de développement.',
      difficulty: 'medium',
      duration: '10 min',
      tags: ['Next.js'],
      prerequisites: [],
      steps: [
        {
          id: 'default-theory',
          type: 'theory',
          title: 'Contenu en développement',
          content: (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Leçon en cours de développement</h2>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Contenu en préparation
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Cette leçon fait partie du module {moduleId} et sera bientôt disponible. 
                      En attendant, vous pouvez explorer les autres leçons disponibles.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-blue-800 dark:text-blue-200">
                  🚀 Ce que vous apprendrez bientôt :
                </h3>
                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                  <li>• Concepts avancés de Next.js</li>
                  <li>• Exercices pratiques interactifs</li>
                  <li>• Projets concrets à réaliser</li>
                  <li>• Quiz pour valider vos connaissances</li>
                </ul>
              </div>
            </div>
          ),
          hint: "Cette leçon sera bientôt disponible avec du contenu interactif complet."
        },
        
        {
          id: 'default-exercise',
          type: 'exercise',
          title: 'Exercice de démonstration',
          description: 'Un exemple d\'exercice pour tester l\'interface.',
          language: 'javascript',
          initialCode: `// Exemple d'exercice Next.js
console.log("Hello, Next.js!");

// Créez une fonction qui retourne un message de bienvenue
function welcome(name) {
  // Votre code ici
  return \`Bienvenue \${name} dans Next.js!\`;
}

// Testez votre fonction
console.log(welcome("Développeur"));`,
          solution: `// Exemple d'exercice Next.js
console.log("Hello, Next.js!");

// Créez une fonction qui retourne un message de bienvenue
function welcome(name) {
  return \`Bienvenue \${name} dans Next.js!\`;
}

// Testez votre fonction
console.log(welcome("Développeur"));`,
          hint: "Utilisez les template literals (backticks) pour créer le message de bienvenue."
        }
      ],
      metadata: {
        estimatedTime: 10,
        xpReward: 25,
        badges: [],
        nextLesson: null,
        previousLesson: null
      }
    };
  };
  
  const handleLessonComplete = () => {
    setProgress(100);
    // Ici vous pourriez sauvegarder la progression dans une base de données
    console.log('Leçon terminée !');
  };
  
  const handleNext = () => {
    if (lesson?.metadata?.nextLesson) {
      // Navigation vers la leçon suivante
      const [nextModule, nextLesson] = lesson.metadata.nextLesson.split('-');
      window.location.href = `/lessons/${nextModule}/${nextLesson}`;
    }
  };
  
  const handlePrevious = () => {
    if (lesson?.metadata?.previousLesson) {
      // Navigation vers la leçon précédente
      const [prevModule, prevLesson] = lesson.metadata.previousLesson.split('-');
      window.location.href = `/lessons/${prevModule}/${prevLesson}`;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-lg">Chargement de la leçon...</span>
        </div>
      </div>
    );
  }
  
  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">Leçon non trouvée</h1>
          <p className="text-gray-600">La leçon demandée n'existe pas.</p>
          <button
            onClick={() => window.location.href = '/learning-path'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour au parcours d'apprentissage
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <LessonLayoutImproved
      lesson={lesson}
      theme={theme || 'light'}
      progress={progress}
      onComplete={handleLessonComplete}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
}

