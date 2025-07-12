// src/data/lessons/module1/lesson1-improved.js
const lesson1Improved = {
  id: '1-1',
  title: "Qu'est-ce que Next.js",
  description: 'Introduction à Next.js et ses concepts fondamentaux',
  difficulty: 'easy',
  duration: '15 min',
  tags: ['Next.js', 'React', 'SSR', 'Débutant'],
  prerequisites: ['Connaissance de base de React'],
  
  steps: [
    {
      id: 'theory-1',
      type: 'theory',
      title: 'Introduction à Next.js',
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Qu'est-ce que Next.js ?</h2>
            <p className="text-lg mb-4">
              Next.js est un framework React qui permet de créer des applications web complètes 
              avec des fonctionnalités avancées comme le rendu côté serveur (SSR), 
              la génération de sites statiques (SSG), et bien plus encore.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Histoire de Next.js</h3>
            <p className="mb-4">
              Lancé en 2016 par Vercel (anciennement Zeit), Next.js a révolutionné 
              le développement d'applications React en fournissant une structure 
              et des outils qui résolvent de nombreux problèmes courants.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-3">Next.js dans l'écosystème React</h3>
            <p className="mb-4">
              Alors que React est une bibliothèque pour construire des interfaces utilisateur, 
              Next.js est un framework complet qui s'appuie sur React et ajoute des 
              fonctionnalités supplémentaires pour faciliter le développement 
              d'applications web complètes.
            </p>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Point clé</h4>
            <p>
              Next.js ne remplace pas React, il l'améliore en ajoutant des fonctionnalités 
              comme le routage automatique, l'optimisation des performances, et le rendu côté serveur.
            </p>
          </div>
        </div>
      ),
      hint: "Next.js est construit sur React et ajoute des fonctionnalités pour le développement web complet."
    },
    
    {
      id: 'theory-2',
      type: 'theory',
      title: 'Avantages de Next.js',
      content: (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Pourquoi utiliser Next.js ?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-800 dark:text-green-200">
                🚀 Performance
              </h3>
              <ul className="space-y-1 text-sm">
                <li>• Rendu côté serveur (SSR)</li>
                <li>• Génération statique (SSG)</li>
                <li>• Optimisation automatique</li>
                <li>• Code splitting automatique</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200">
                🛠️ Développement
              </h3>
              <ul className="space-y-1 text-sm">
                <li>• Routage basé sur les fichiers</li>
                <li>• Hot reloading</li>
                <li>• Support TypeScript intégré</li>
                <li>• API routes intégrées</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-200">
                🎨 Optimisation
              </h3>
              <ul className="space-y-1 text-sm">
                <li>• Optimisation des images</li>
                <li>• Optimisation des polices</li>
                <li>• Minification automatique</li>
                <li>• Compression gzip</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-orange-800 dark:text-orange-200">
                📈 SEO
              </h3>
              <ul className="space-y-1 text-sm">
                <li>• Rendu côté serveur</li>
                <li>• Meta tags dynamiques</li>
                <li>• Sitemap automatique</li>
                <li>• Structured data</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      hint: "Next.js apporte des améliorations dans quatre domaines principaux : performance, développement, optimisation et SEO."
    },
    
    {
      id: 'exercise-1',
      type: 'exercise',
      title: 'Premier composant Next.js',
      description: 'Créez votre premier composant Next.js qui affiche un message de bienvenue.',
      language: 'jsx',
      initialCode: `// pages/index.js
export default function Home() {
  // Créez un composant qui affiche :
  // - Un titre "Bienvenue sur Next.js"
  // - Un paragraphe expliquant ce qu'est Next.js
  // - Une liste de 3 avantages de Next.js
  
  return (
    <div>
      {/* Votre code ici */}
    </div>
  );
}`,
      solution: `// pages/index.js
export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Bienvenue sur Next.js</h1>
      <p>
        Next.js est un framework React qui permet de créer des applications 
        web modernes avec des fonctionnalités avancées.
      </p>
      <h2>Avantages de Next.js :</h2>
      <ul>
        <li>Rendu côté serveur (SSR)</li>
        <li>Routage automatique basé sur les fichiers</li>
        <li>Optimisation des performances</li>
      </ul>
    </div>
  );
}`,
      hint: "Utilisez les balises HTML classiques comme <h1>, <p>, <ul> et <li> dans votre JSX."
    },
    
    {
      id: 'quiz-1',
      type: 'quiz',
      title: 'Quiz : Concepts de base',
      description: 'Testez vos connaissances sur les concepts fondamentaux de Next.js.',
      options: [
        { 
          id: 1, 
          text: 'Next.js est un framework basé sur React', 
          correct: true,
          explanation: 'Correct ! Next.js est effectivement un framework qui s\'appuie sur React.'
        },
        { 
          id: 2, 
          text: 'Next.js remplace complètement React', 
          correct: false,
          explanation: 'Faux. Next.js utilise React comme base et ajoute des fonctionnalités supplémentaires.'
        },
        { 
          id: 3, 
          text: 'Next.js permet le rendu côté serveur', 
          correct: true,
          explanation: 'Correct ! Le SSR (Server-Side Rendering) est une fonctionnalité clé de Next.js.'
        },
        { 
          id: 4, 
          text: 'Next.js ne peut pas générer de sites statiques', 
          correct: false,
          explanation: 'Faux. Next.js supporte la génération de sites statiques (SSG).'
        }
      ],
      type: 'multiple',
      explanation: `
        Next.js est un framework React qui ajoute de nombreuses fonctionnalités :
        - Rendu côté serveur (SSR) pour améliorer le SEO
        - Génération de sites statiques (SSG) pour les performances
        - Routage automatique basé sur la structure des fichiers
        - Optimisations automatiques pour les images, polices, etc.
      `,
      maxAttempts: 3
    },
    
    {
      id: 'exercise-2',
      type: 'exercise',
      title: 'Composant avec état',
      description: 'Créez un composant Next.js interactif avec un compteur.',
      language: 'jsx',
      initialCode: `// pages/counter.js
import { useState } from 'react';

export default function Counter() {
  // Utilisez useState pour créer un état 'count' initialisé à 0
  
  // Créez une fonction pour incrémenter le compteur
  
  // Créez une fonction pour décrémenter le compteur
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Compteur Next.js</h1>
      {/* Affichez la valeur du compteur */}
      <div style={{ margin: '20px 0' }}>
        {/* Bouton pour décrémenter */}
        {/* Bouton pour incrémenter */}
      </div>
    </div>
  );
}`,
      solution: `// pages/counter.js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Compteur Next.js</h1>
      <p style={{ fontSize: '24px', margin: '20px 0' }}>
        Compteur : {count}
      </p>
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={decrement}
          style={{ margin: '0 10px', padding: '10px 20px' }}
        >
          -
        </button>
        <button 
          onClick={increment}
          style={{ margin: '0 10px', padding: '10px 20px' }}
        >
          +
        </button>
      </div>
    </div>
  );
}`,
      hint: "Utilisez useState pour gérer l'état et créez des fonctions pour modifier la valeur du compteur."
    }
  ],
  
  // Métadonnées pour le suivi de progression
  metadata: {
    estimatedTime: 15,
    xpReward: 50,
    badges: ['first-component', 'react-basics'],
    nextLesson: '1-2',
    previousLesson: null
  }
};

export default lesson1Improved;

