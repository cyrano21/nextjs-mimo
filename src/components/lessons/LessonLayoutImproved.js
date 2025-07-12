'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResponsiveLayout from '../layouts/ResponsiveLayout';
import CodeEditorImproved from '../editor/CodeEditorImproved';
import ExerciseComponentImproved from './ExerciseComponentImproved';

export default function LessonLayoutImproved({
  lesson,
  theme = 'light',
  onComplete,
  onNext,
  onPrevious,
  progress = 0
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showHint, setShowHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const handleStepComplete = (stepIndex) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
    
    if (stepIndex === lesson.steps?.length - 1) {
      if (onComplete) onComplete();
    }
  };
  
  const goToStep = (stepIndex) => {
    if (stepIndex >= 0 && stepIndex < lesson.steps?.length) {
      setCurrentStep(stepIndex);
      setShowHint(false);
    }
  };
  
  const currentStepData = lesson.steps?.[currentStep];
  
  // Sidebar avec navigation des étapes
  const sidebar = (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Progression
          </h3>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className={`
          w-full h-2 rounded-full overflow-hidden
          ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}
        `}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
          />
        </div>
      </div>
      
      {/* Steps navigation */}
      {lesson.steps && (
        <div className="space-y-3">
          <h3 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Étapes
          </h3>
          
          <div className="space-y-2">
            {lesson.steps.map((step, index) => (
              <motion.button
                key={index}
                onClick={() => goToStep(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  ${currentStep === index
                    ? (theme === 'dark' 
                        ? 'bg-blue-900 text-blue-200 border border-blue-700' 
                        : 'bg-blue-50 text-blue-700 border border-blue-200')
                    : completedSteps.has(index)
                      ? (theme === 'dark'
                          ? 'bg-green-900 text-green-200 border border-green-700'
                          : 'bg-green-50 text-green-700 border border-green-200')
                      : (theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50')
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${currentStep === index
                      ? 'bg-blue-600 text-white'
                      : completedSteps.has(index)
                        ? 'bg-green-600 text-white'
                        : (theme === 'dark' ? 'bg-gray-600 text-gray-300' : 'bg-gray-300 text-gray-600')
                    }
                  `}>
                    {completedSteps.has(index) ? (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{step.title}</p>
                    <p className={`text-xs truncate ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {step.type === 'theory' ? 'Théorie' : 
                       step.type === 'exercise' ? 'Exercice' : 
                       step.type === 'quiz' ? 'Quiz' : 'Pratique'}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}
      
      {/* Lesson info */}
      <div className={`
        p-4 rounded-lg border
        ${theme === 'dark' 
          ? 'bg-gray-700 border-gray-600' 
          : 'bg-gray-50 border-gray-200'
        }
      `}>
        <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          {lesson.title}
        </h4>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {lesson.description}
        </p>
        
        {lesson.duration && (
          <div className={`flex items-center mt-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {lesson.duration}
          </div>
        )}
      </div>
    </div>
  );
  
  // Header avec navigation
  const header = (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        <h1 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {lesson.title}
        </h1>
        
        {!isMobile && (
          <div className={`
            px-3 py-1 rounded-full text-sm font-medium
            ${theme === 'dark' 
              ? 'bg-blue-900 text-blue-200' 
              : 'bg-blue-100 text-blue-700'
            }
          `}>
            Étape {currentStep + 1} sur {lesson.steps?.length || 1}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Hint button */}
        {currentStepData?.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className={`
              p-2 rounded-lg transition-colors
              ${showHint
                ? (theme === 'dark' ? 'bg-yellow-900 text-yellow-200' : 'bg-yellow-100 text-yellow-700')
                : (theme === 'dark' ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600')
              }
            `}
            title="Afficher l'indice"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {/* Navigation buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => goToStep(currentStep - 1)}
            disabled={currentStep === 0}
            className={`
              p-2 rounded-lg transition-colors
              ${currentStep === 0
                ? (theme === 'dark' ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed')
                : (theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600')
              }
            `}
            title="Étape précédente"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={() => goToStep(currentStep + 1)}
            disabled={currentStep === (lesson.steps?.length || 1) - 1}
            className={`
              p-2 rounded-lg transition-colors
              ${currentStep === (lesson.steps?.length || 1) - 1
                ? (theme === 'dark' ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed')
                : (theme === 'dark' ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600')
              }
            `}
            title="Étape suivante"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <ResponsiveLayout
      sidebar={sidebar}
      header={header}
      theme={theme}
      className="h-screen"
    >
      <div className="h-full flex flex-col">
        {/* Hint display */}
        <AnimatePresence>
          {showHint && currentStepData?.hint && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`
                border-b overflow-hidden
                ${theme === 'dark' 
                  ? 'bg-yellow-900/20 border-yellow-700' 
                  : 'bg-yellow-50 border-yellow-200'
                }
              `}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <svg className={`
                    w-5 h-5 mt-0.5 flex-shrink-0
                    ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}
                  `} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className={`font-medium mb-1 ${theme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}`}>
                      Indice
                    </h4>
                    <p className={`text-sm ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      {currentStepData.hint}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {currentStepData && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentStepData.type === 'theory' && (
                <div className="h-full overflow-y-auto p-6">
                  <div className="max-w-4xl mx-auto">
                    <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {currentStepData.title}
                    </h2>
                    <div className={`prose max-w-none ${theme === 'dark' ? 'prose-invert' : ''}`}>
                      {currentStepData.content}
                    </div>
                  </div>
                </div>
              )}
              
              {currentStepData.type === 'exercise' && (
                <div className="h-full p-6">
                  <div className="h-full max-w-7xl mx-auto">
                    <div className="mb-4">
                      <h2 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {currentStepData.title}
                      </h2>
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {currentStepData.description}
                      </p>
                    </div>
                    
                    <div className="h-[calc(100%-120px)]">
                      <CodeEditorImproved
                        initialCode={currentStepData.initialCode || ''}
                        language={currentStepData.language || 'javascript'}
                        height="100%"
                        theme={theme}
                        onCodeChange={(code) => {
                          // Handle code change
                        }}
                        onCodeRun={(code) => {
                          // Handle code run
                          handleStepComplete(currentStep);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {currentStepData.type === 'quiz' && (
                <div className="h-full overflow-y-auto p-6">
                  <div className="max-w-4xl mx-auto">
                    <ExerciseComponentImproved
                      exercise={currentStepData}
                      theme={theme}
                      onComplete={() => handleStepComplete(currentStep)}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
}

