'use client';

import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { GamificationProvider, UserStatsDisplay } from '@/components/gamification/GamificationSystemImproved';
import LessonLayoutImproved from '@/components/lessons/LessonLayoutImproved';
import CodeEditorImproved from '@/components/editor/CodeEditorImproved';
import ExerciseComponentImproved from '@/components/lessons/ExerciseComponentImproved';

// Données de test
const testLesson = {
  id: 'test-1',
  title: 'Test des composants améliorés',
  description: 'Une leçon de démonstration pour tester tous les nouveaux composants.',
  difficulty: 'easy',
  duration: '10 min',
  tags: ['Test', 'Demo'],
  prerequisites: [],
  
  steps: [
    {
      id: 'theory-test',
      type: 'theory',
      title: 'Théorie de test',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Composants améliorés</h2>
          <p className="text-lg mb-4">
            Cette page de test démontre tous les composants améliorés du projet Mimo clone.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
                🎯 Éditeur de code
              </h3>
              <ul className="space-y-1 text-sm">
                <li>• Coloration syntaxique améliorée</li>
                <li>• Interface responsive</li>
                <li>• Mode plein écran</li>
                <li>• Ajustement de la taille de police</li>
              </ul>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                🏆 Gamification
              </h3>
              <ul className="space-y-1 text-sm">
                <li>• Système XP et niveaux</li>
                <li>• Badges et achievements</li>
                <li>• Notifications animées</li>
                <li>• Suivi de progression</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      hint: "Cette section présente les améliorations apportées aux composants."
    },
    
    {
      id: 'exercise-test',
      type: 'exercise',
      title: 'Test de l\'éditeur de code',
      description: 'Testez l\'éditeur de code amélioré avec cet exercice simple.',
      language: 'javascript',
      initialCode: `// Test de l'éditeur de code amélioré
console.log("Hello, Mimo Clone!");

// Créez une fonction qui calcule la somme de deux nombres
function addNumbers(a, b) {
  // Votre code ici
  return a + b;
}

// Testez votre fonction
console.log("5 + 3 =", addNumbers(5, 3));
console.log("10 + 7 =", addNumbers(10, 7));`,
      solution: `// Test de l'éditeur de code amélioré
console.log("Hello, Mimo Clone!");

// Créez une fonction qui calcule la somme de deux nombres
function addNumbers(a, b) {
  return a + b;
}

// Testez votre fonction
console.log("5 + 3 =", addNumbers(5, 3));
console.log("10 + 7 =", addNumbers(10, 7));`,
      hint: "La fonction addNumbers doit simplement retourner la somme de a et b."
    },
    
    {
      id: 'quiz-test',
      type: 'quiz',
      title: 'Quiz de test',
      description: 'Testez le composant de quiz amélioré.',
      options: [
        { 
          id: 1, 
          text: 'L\'éditeur de code supporte la coloration syntaxique', 
          correct: true,
          explanation: 'Correct ! L\'éditeur utilise Prism.js pour la coloration syntaxique.'
        },
        { 
          id: 2, 
          text: 'Le système de gamification inclut des badges', 
          correct: true,
          explanation: 'Exact ! Les utilisateurs peuvent gagner des badges pour leurs accomplissements.'
        },
        { 
          id: 3, 
          text: 'L\'interface n\'est pas responsive', 
          correct: false,
          explanation: 'Faux. L\'interface a été entièrement repensée pour être responsive.'
        },
        { 
          id: 4, 
          text: 'Les leçons sont structurées en étapes', 
          correct: true,
          explanation: 'Correct ! Chaque leçon est divisée en étapes (théorie, exercices, quiz).'
        }
      ],
      type: 'multiple',
      explanation: `
        Les améliorations apportées incluent :
        - Éditeur de code avec coloration syntaxique et interface responsive
        - Système de gamification complet avec XP, niveaux et badges
        - Interface utilisateur harmonieuse et responsive
        - Leçons structurées en étapes progressives
      `,
      maxAttempts: 3
    }
  ],
  
  metadata: {
    estimatedTime: 10,
    xpReward: 100,
    badges: ['tester', 'explorer'],
    nextLesson: null,
    previousLesson: null
  }
};

const testExercise = {
  id: 'standalone-test',
  title: 'Test du composant d\'exercice',
  description: 'Sélectionnez les bonnes réponses pour tester le composant d\'exercice amélioré.',
  type: 'multiple',
  difficulty: 'easy',
  maxAttempts: 3,
  options: [
    { 
      id: 1, 
      text: 'React est une bibliothèque JavaScript', 
      correct: true,
      description: 'Pour créer des interfaces utilisateur'
    },
    { 
      id: 2, 
      text: 'Next.js est un framework React', 
      correct: true,
      description: 'Qui ajoute des fonctionnalités comme le SSR'
    },
    { 
      id: 3, 
      text: 'JavaScript est un langage de programmation', 
      correct: true,
      description: 'Principalement utilisé pour le web'
    },
    { 
      id: 4, 
      text: 'HTML est un langage de programmation', 
      correct: false,
      description: 'HTML est un langage de balisage, pas de programmation'
    }
  ],
  explanation: `
    React est effectivement une bibliothèque JavaScript pour créer des interfaces utilisateur.
    Next.js est un framework qui s'appuie sur React pour ajouter des fonctionnalités avancées.
    JavaScript est un langage de programmation, tandis que HTML est un langage de balisage.
  `
};

export default function TestLessonPage() {
  const [currentTest, setCurrentTest] = useState('lesson');
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeProvider attribute="class" defaultTheme={theme} forcedTheme={theme}>
      <GamificationProvider>
        <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
          <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Header de test */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Test des composants améliorés
                </h1>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentTest('lesson')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentTest === 'lesson'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      Leçon complète
                    </button>
                    
                    <button
                      onClick={() => setCurrentTest('editor')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentTest === 'editor'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      Éditeur seul
                    </button>
                    
                    <button
                      onClick={() => setCurrentTest('exercise')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentTest === 'exercise'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      Exercice seul
                    </button>
                    
                    <button
                      onClick={() => setCurrentTest('stats')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        currentTest === 'stats'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      Stats
                    </button>
                  </div>
                  
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    {theme === 'light' ? '🌙' : '☀️'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Contenu de test */}
            <div className="flex-1">
              {currentTest === 'lesson' && (
                <LessonLayoutImproved
                  lesson={testLesson}
                  theme={theme}
                  progress={33}
                  onComplete={() => console.log('Leçon terminée!')}
                />
              )}
              
              {currentTest === 'editor' && (
                <div className="p-6">
                  <div className="max-w-6xl mx-auto">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                      Test de l'éditeur de code amélioré
                    </h2>
                    <div className="h-96">
                      <CodeEditorImproved
                        initialCode={`// Éditeur de code amélioré
console.log("Hello, World!");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculer les 10 premiers nombres de Fibonacci
for (let i = 0; i < 10; i++) {
  console.log(\`F(\${i}) = \${fibonacci(i)}\`);
}`}
                        language="javascript"
                        height="100%"
                        theme={theme}
                        onCodeChange={(code) => console.log('Code changé:', code)}
                        onCodeRun={(code) => console.log('Code exécuté:', code)}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {currentTest === 'exercise' && (
                <div className="p-6">
                  <div className="max-w-4xl mx-auto">
                    <ExerciseComponentImproved
                      exercise={testExercise}
                      theme={theme}
                      onComplete={() => console.log('Exercice terminé!')}
                      onProgress={(data) => console.log('Progression:', data)}
                    />
                  </div>
                </div>
              )}
              
              {currentTest === 'stats' && (
                <div className="p-6">
                  <div className="max-w-4xl mx-auto space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Test du système de gamification
                    </h2>
                    
                    <UserStatsDisplay theme={theme} />
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        Version compacte
                      </h3>
                      <UserStatsDisplay theme={theme} compact={true} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </GamificationProvider>
    </ThemeProvider>
  );
}

