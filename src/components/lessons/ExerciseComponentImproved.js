'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExerciseComponentImproved({ 
  exercise, 
  theme = 'light',
  onComplete = () => {},
  onProgress = () => {}
}) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  
  // Valeurs par défaut pour éviter les erreurs
  const safeExercise = {
    title: 'Exercice',
    description: '',
    type: 'single',
    options: [],
    explanation: '',
    maxAttempts: 3,
    ...exercise
  };
  
  // S'assurer que options est toujours un tableau
  safeExercise.options = Array.isArray(safeExercise.options) ? safeExercise.options : [];
  
  // Timer pour mesurer le temps passé
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const handleOptionToggle = (optionId) => {
    if (isSubmitted) return;
    
    if (safeExercise.type === 'single') {
      setSelectedOptions([optionId]);
    } else {
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      );
    }
  };
  
  const handleSubmit = () => {
    if (selectedOptions.length === 0) return;
    
    const correctOptions = safeExercise.options
      .filter(option => option.correct)
      .map(option => option.id);
    
    const isCorrect = selectedOptions.length === correctOptions.length && 
                     selectedOptions.every(id => correctOptions.includes(id));
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    setFeedback({
      isCorrect,
      message: isCorrect 
        ? getSuccessMessage(newAttempts)
        : getErrorMessage(newAttempts, safeExercise.maxAttempts),
      attempts: newAttempts
    });
    
    setIsSubmitted(true);
    
    // Appeler les callbacks
    onProgress({
      correct: isCorrect,
      attempts: newAttempts,
      timeSpent,
      exerciseId: safeExercise.id
    });
    
    if (isCorrect) {
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };
  
  const handleRetry = () => {
    if (attempts >= safeExercise.maxAttempts) return;
    
    setSelectedOptions([]);
    setIsSubmitted(false);
    setFeedback(null);
    setShowExplanation(false);
  };
  
  const getSuccessMessage = (attemptCount) => {
    if (attemptCount === 1) {
      return "🎉 Parfait ! Vous avez trouvé la bonne réponse du premier coup !";
    } else if (attemptCount === 2) {
      return "✅ Bien joué ! Vous avez trouvé la bonne réponse !";
    } else {
      return "👍 Correct ! Vous avez persévéré et trouvé la bonne réponse !";
    }
  };
  
  const getErrorMessage = (attemptCount, maxAttempts) => {
    const remaining = maxAttempts - attemptCount;
    if (remaining > 0) {
      return `❌ Ce n'est pas correct. Il vous reste ${remaining} tentative${remaining > 1 ? 's' : ''}.`;
    } else {
      return "❌ Vous avez épuisé toutes vos tentatives. Consultez l'explication pour comprendre.";
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const canRetry = attempts < safeExercise.maxAttempts && !feedback?.isCorrect;
  const showExplanationButton = safeExercise.explanation && (feedback?.isCorrect || attempts >= safeExercise.maxAttempts);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              {safeExercise.title}
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {safeExercise.description}
            </p>
          </div>
          
          {/* Stats */}
          <div className={`
            flex flex-col items-end space-y-1 text-sm
            ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          `}>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>{formatTime(timeSpent)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>{attempts}/{safeExercise.maxAttempts}</span>
            </div>
          </div>
        </div>
        
        {/* Type indicator */}
        <div className="flex items-center space-x-2">
          <div className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${theme === 'dark' 
              ? 'bg-blue-900 text-blue-200' 
              : 'bg-blue-100 text-blue-700'
            }
          `}>
            {safeExercise.type === 'single' ? 'Choix unique' : 'Choix multiples'}
          </div>
          
          {safeExercise.difficulty && (
            <div className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${safeExercise.difficulty === 'easy'
                ? (theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700')
                : safeExercise.difficulty === 'medium'
                  ? (theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700')
                  : (theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700')
              }
            `}>
              {safeExercise.difficulty === 'easy' ? 'Facile' : 
               safeExercise.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
            </div>
          )}
        </div>
      </div>
      
      {/* Options */}
      <div className="space-y-3">
        {safeExercise.options.length === 0 ? (
          <div className={`
            p-4 rounded-lg border-2 border-dashed text-center
            ${theme === 'dark' 
              ? 'border-gray-600 bg-gray-800 text-gray-400' 
              : 'border-gray-300 bg-gray-50 text-gray-600'
            }
          `}>
            <svg className="w-8 h-8 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>Aucune option disponible pour cet exercice.</p>
          </div>
        ) : (
          <AnimatePresence>
            {safeExercise.options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleOptionToggle(option.id)}
                className={`
                  group relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${selectedOptions.includes(option.id)
                    ? (theme === 'dark' 
                        ? 'bg-blue-900/30 border-blue-600 shadow-lg' 
                        : 'bg-blue-50 border-blue-300 shadow-lg')
                    : (theme === 'dark'
                        ? 'bg-gray-800 border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50')
                  }
                  ${isSubmitted && option.correct
                    ? (theme === 'dark'
                        ? 'border-green-600 bg-green-900/30'
                        : 'border-green-500 bg-green-50')
                    : isSubmitted && selectedOptions.includes(option.id) && !option.correct
                      ? (theme === 'dark'
                          ? 'border-red-600 bg-red-900/30'
                          : 'border-red-500 bg-red-50')
                      : ''
                  }
                `}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkbox/Radio */}
                  <div className={`
                    relative w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                    ${selectedOptions.includes(option.id)
                      ? 'bg-blue-600 border-blue-600'
                      : (theme === 'dark' ? 'border-gray-500' : 'border-gray-300')
                    }
                    ${isSubmitted && option.correct
                      ? 'bg-green-600 border-green-600'
                      : isSubmitted && selectedOptions.includes(option.id) && !option.correct
                        ? 'bg-red-600 border-red-600'
                        : ''
                    }
                  `}>
                    {(selectedOptions.includes(option.id) || (isSubmitted && option.correct)) && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    
                    {isSubmitted && selectedOptions.includes(option.id) && !option.correct && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Option content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {option.text}
                    </p>
                    
                    {option.description && (
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {option.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Status indicator */}
                  {isSubmitted && (
                    <div className="flex-shrink-0">
                      {option.correct ? (
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${theme === 'dark' ? 'bg-green-800' : 'bg-green-100'}
                        `}>
                          <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : selectedOptions.includes(option.id) ? (
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center
                          ${theme === 'dark' ? 'bg-red-800' : 'bg-red-100'}
                        `}>
                          <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`
              p-4 rounded-lg border
              ${feedback.isCorrect
                ? (theme === 'dark' 
                    ? 'bg-green-900/30 border-green-600 text-green-200' 
                    : 'bg-green-50 border-green-200 text-green-800')
                : (theme === 'dark'
                    ? 'bg-red-900/30 border-red-600 text-red-200'
                    : 'bg-red-50 border-red-200 text-red-800')
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {feedback.isCorrect ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{feedback.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && safeExercise.explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`
              p-4 rounded-lg border
              ${theme === 'dark' 
                ? 'bg-blue-900/20 border-blue-600 text-blue-200' 
                : 'bg-blue-50 border-blue-200 text-blue-800'
              }
            `}
          >
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold mb-2">Explication</h4>
                <p className="text-sm leading-relaxed">{safeExercise.explanation}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex items-center space-x-3">
          {!isSubmitted ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={selectedOptions.length === 0}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200
                ${selectedOptions.length === 0
                  ? (theme === 'dark'
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed')
                  : (theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg')
                }
              `}
            >
              Valider ma réponse
            </motion.button>
          ) : (
            <div className="flex items-center space-x-3">
              {canRetry && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleRetry}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${theme === 'dark'
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }
                  `}
                >
                  Réessayer
                </motion.button>
              )}
              
              {feedback?.isCorrect && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onComplete}
                  className={`
                    px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                    }
                  `}
                >
                  Continuer
                </motion.button>
              )}
            </div>
          )}
        </div>
        
        {showExplanationButton && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowExplanation(!showExplanation)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }
            `}
          >
            {showExplanation ? 'Masquer' : 'Voir'} l'explication
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

