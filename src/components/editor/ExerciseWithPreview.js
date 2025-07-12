"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CodeEditorImproved from '../editor/CodeEditorImproved';

export default function ExerciseWithPreview({ 
  exercise = {},
  onComplete = () => {}
}) {
  // Déstructuration avec valeurs par défaut
  const {
    id = 1,
    title = 'Exercice',
    description = 'Complétez cet exercice pour mettre en pratique vos connaissances.',
    instructions = [
      'Suivez les instructions pour compléter cet exercice.',
      'Utilisez le code fourni comme point de départ.'
    ],
    initialCode = '// Écrivez votre code ici\n',
    solutionCode = exercise.solution || exercise.solutionCode || '// Solution de l\'exercice\n',
    language = 'javascript',
    difficulty = 'débutant',
    xpReward = 0,
    contributeToPortfolio = false
  } = exercise;

  // États du composant
  const [userCode, setUserCode] = useState(initialCode);
  const [isCorrect, setIsCorrect] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showSolution, setShowSolution] = useState(false);
  
  // Toujours utiliser le thème clair
  const theme = 'light';
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: 'beforeChildren',
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  // Données de l'exercice avec les valeurs par défaut
  const exerciseData = {
    id,
    title,
    description,
    instructions,
    initialCode,
    solutionCode,
    language,
    difficulty,
    xpReward,
    contributeToPortfolio
  };
  
  const handleCodeChange = (newCode) => {
    setUserCode(newCode);
    // Réinitialiser les états lorsque le code change
    setIsCorrect(false);
    setFeedback(null);
  };
  
  const checkSolution = () => {
    // Logique de vérification adaptée au type d'exercice
    // Détecte automatiquement le type d'exercice basé sur le contenu
    
    // Vérification pour les API Routes Next.js
    if (userCode.includes('req.method') || userCode.includes('export default function handler')) {
      return checkAPIRouteExercise();
    }
    
    // Vérification pour les composants React
    if (userCode.includes('<') && userCode.includes('>')) {
      return checkReactComponentExercise();
    }
    
    // Vérification générique JavaScript
    return checkJavaScriptExercise();
  };
  
  const checkAPIRouteExercise = () => {
    const hasHandler = userCode.includes('export default function handler');
    const hasMethodCheck = userCode.includes('req.method');
    const hasGetImplementation = userCode.includes("req.method === 'GET'") && !userCode.includes('res.status(501)');
    const hasPutImplementation = userCode.includes("req.method === 'PUT'") && !userCode.includes('res.status(501)');
    const hasDeleteImplementation = userCode.includes("req.method === 'DELETE'") && !userCode.includes('res.status(501)');
    const hasErrorHandling = userCode.includes('404') || userCode.includes('400');
    
    const implementedMethods = [hasGetImplementation, hasPutImplementation, hasDeleteImplementation].filter(Boolean).length;
    
    if (hasHandler && hasMethodCheck && implementedMethods >= 2 && hasErrorHandling) {
      setIsCorrect(true);
      setFeedback({
        type: 'success',
        message: 'Excellent ! Votre API Route implémente correctement les méthodes CRUD avec gestion d\'erreurs.'
      });
      
      if (onComplete) {
        onComplete(exerciseData.id, exerciseData.xpReward);
      }
    } else {
      setIsCorrect(false);
      
      let feedbackMessage = "Votre solution n'est pas encore complète. ";
      
      if (!hasHandler) {
        feedbackMessage += "Assurez-vous d'exporter une fonction handler par défaut. ";
      }
      
      if (!hasMethodCheck) {
        feedbackMessage += "N'oubliez pas de vérifier req.method. ";
      }
      
      if (implementedMethods < 2) {
        feedbackMessage += "Implémentez au moins 2 méthodes HTTP (GET, PUT, DELETE). ";
      }
      
      if (!hasErrorHandling) {
        feedbackMessage += "Ajoutez la gestion d'erreurs (404, 400). ";
      }
      
      setFeedback({
        type: 'error',
        message: feedbackMessage
      });
    }
  };
  
  const checkReactComponentExercise = () => {
    const containsButton = userCode.includes('<button');
    const containsTextProp = userCode.includes('{ text }') || userCode.includes('{text}') || userCode.includes('props.text');
    const containsReturnStatement = userCode.includes('return');
    
    if (containsButton && containsTextProp && containsReturnStatement) {
      setIsCorrect(true);
      setFeedback({
        type: 'success',
        message: 'Bravo ! Votre composant React est correct.'
      });
      
      if (onComplete) {
        onComplete(exerciseData.id, exerciseData.xpReward);
      }
    } else {
      setIsCorrect(false);
      
      let feedbackMessage = "Votre solution n'est pas encore correcte. ";
      
      if (!containsButton) {
        feedbackMessage += "N'oubliez pas d'utiliser un élément button. ";
      }
      
      if (!containsTextProp) {
        feedbackMessage += "Assurez-vous d'utiliser la prop 'text'. ";
      }
      
      if (!containsReturnStatement) {
        feedbackMessage += "Votre composant doit retourner (return) quelque chose. ";
      }
      
      setFeedback({
        type: 'error',
        message: feedbackMessage
      });
    }
  };
  
  const checkJavaScriptExercise = () => {
    // Vérification générique pour du JavaScript
    const hasFunction = userCode.includes('function') || userCode.includes('=>');
    const hasReturn = userCode.includes('return');
    
    if (hasFunction && hasReturn) {
      setIsCorrect(true);
      setFeedback({
        type: 'success',
        message: 'Bien joué ! Votre code JavaScript semble correct.'
      });
      
      if (onComplete) {
        onComplete(exerciseData.id, exerciseData.xpReward);
      }
    } else {
      setIsCorrect(false);
      setFeedback({
        type: 'error',
        message: 'Votre code doit contenir une fonction qui retourne une valeur.'
      });
    }
  };
  
  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      {/* En-tête de l'exercice */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <motion.h3 
          variants={itemVariants}
          className="text-xl font-semibold text-white"
        >
          {exerciseData.title}
        </motion.h3>
        <motion.div 
          variants={itemVariants}
          className="flex items-center text-purple-100 text-sm mt-1"
        >
          <span className="mr-3">Difficulté: {exerciseData.difficulty}</span>
          <span className="mr-3">•</span>
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            {exerciseData.xpReward} XP
          </span>
          
          {exerciseData.contributeToPortfolio && (
            <>
              <span className="mx-3">•</span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Contribue au portfolio
              </span>
            </>
          )}
        </motion.div>
      </div>
      
      {/* Contenu de l'exercice */}
      <div className="p-6">
        <motion.div variants={itemVariants} className="mb-6">
          <p className="text-gray-700">{exerciseData.description}</p>
        </motion.div>
        
        {exerciseData.instructions && exerciseData.instructions.length > 0 && (
          <motion.div variants={itemVariants} className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Instructions</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              {exerciseData.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </motion.div>
        )}
        
        <motion.div variants={itemVariants} className="mb-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Votre code - Éditez et voyez le résultat en temps réel</h4>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-800 text-sm">
                <strong>💡 Conseil :</strong> Modifiez le code dans l'éditeur et observez les changements dans la prévisualisation. 
                Utilisez les boutons "Exécuter" pour tester votre code et "Vérifier ma solution" pour valider votre travail.
              </p>
            </div>
          </div>
          <CodeEditorImproved
            initialCode={exerciseData.initialCode}
            language={exerciseData.language}
            onCodeChange={handleCodeChange}
            height="400px"
            showPreview={true}
            autoPreview={true}
            readOnly={false}
            theme="light"
          />
        </motion.div>
        
        {feedback && (
          <motion.div 
            variants={itemVariants}
            className={`p-4 rounded-md mb-6 ${
              feedback.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {feedback.message}
          </motion.div>
        )}
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          <button
            onClick={checkSolution}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Vérifier ma solution
          </button>
          
          <button
            onClick={toggleSolution}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            {showSolution ? 'Masquer la solution' : 'Voir la solution'}
          </button>
        </motion.div>
        
        {showSolution && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Solution</h4>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {exerciseData.solutionCode}
              </pre>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
