'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import CodePreviewSandbox from './CodePreviewSandbox';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Thème sombre par défaut
import 'prismjs/themes/prism.css'; // Thème clair

// Importer les langages nécessaires
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

// Mappage des langages Prism
const PRISM_LANGUAGES = {
  javascript: 'javascript',
  js: 'javascript',
  jsx: 'jsx',
  typescript: 'typescript',
  ts: 'typescript',
  tsx: 'tsx',
  css: 'css',
  html: 'markup',
  markup: 'markup',
  react: 'jsx',
  default: 'javascript'
};

export default function CodeEditor({ 
  initialCode = '', 
  language = 'javascript',
  height = '400px',
  onCodeChange,
  onCodeRun,
  readOnly = false,
  showPreview = true,
  autoPreview = true,
  theme: parentTheme = 'light'
}) {
  const [code, setCode] = useState(initialCode);
  const [previewCode, setPreviewCode] = useState(initialCode);
  const [previewVisible, setPreviewVisible] = useState(showPreview);
  const [splitView, setSplitView] = useState(true);
  const [localTheme, setLocalTheme] = useState(parentTheme);
  const codeElementRef = useRef(null);
  const preElementRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Synchroniser le thème avec le thème parent lorsqu'il change
  useEffect(() => {
    setLocalTheme(parentTheme);
    // Re-syntax highlighting lorsque le thème change
    if (codeElementRef.current) {
      Prism.highlightElement(codeElementRef.current);
    }
  }, [parentTheme, code]);
  
  // Mettre à jour la coloration syntaxique lorsque le code ou le langage change
  useEffect(() => {
    if (codeElementRef.current) {
      Prism.highlightElement(codeElementRef.current);
    }
  }, [code, language]);
  
  // Gérer le défilement synchronisé entre le textarea et le code mis en surbrillance
  const handleScroll = (e) => {
    if (preElementRef.current && textareaRef.current) {
      preElementRef.current.scrollTop = e.target.scrollTop;
      preElementRef.current.scrollLeft = e.target.scrollLeft;
    }
  };
  
  // Gérer la mise en forme du code lors de la frappe de tabulation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      // Insérer deux espaces à la position du curseur
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      // Déplacer le curseur après les espaces insérés
      setTimeout(() => {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
      }, 0);
    }
  };
  
  // Fonction pour obtenir la classe de langage Prism appropriée
  const getPrismLanguage = (lang) => {
    return PRISM_LANGUAGES[lang] || PRISM_LANGUAGES.default;
  };
  
  const prismLanguage = getPrismLanguage(language);
  
  // Mettre à jour le code de prévisualisation automatiquement ou lors de l'exécution manuelle
  useEffect(() => {
    if (autoPreview) {
      const timer = setTimeout(() => {
        setPreviewCode(code);
      }, 1000); // Délai pour éviter trop de rendus pendant la frappe
      
      return () => clearTimeout(timer);
    }
  }, [code, autoPreview]);
  
  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCode(newCode);
    if (onCodeChange) onCodeChange(newCode);
  };
  
  const handleRunCode = () => {
    setPreviewCode(code);
    if (onCodeRun) onCodeRun(code);
  };
  
  const handleReset = () => {
    setCode(initialCode);
    setPreviewCode(initialCode);
    if (onCodeChange) onCodeChange(initialCode);
  };
  
  const togglePreview = () => {
    setPreviewVisible(!previewVisible);
  };
  
  const toggleSplitView = () => {
    setSplitView(!splitView);
  };
  
  const toggleTheme = () => {
    const newTheme = localTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(newTheme);
    
    // Si l'application utilise localStorage pour le thème, optionnel
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
      
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  
  return (
    <div className={`w-full rounded-lg border code-editor-container ${localTheme === 'dark' ? 'border-gray-600' : 'border-gray-300'} overflow-hidden shadow-lg`}>
      {/* Barre d'outils */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        localTheme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'
      }`}>
        <div className="flex items-center space-x-3">
          <span className={`text-sm font-semibold ${
            localTheme === 'dark' ? 'text-gray-200' : 'text-gray-700'
          }`}>
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </span>
          
          {!readOnly && (
            <>
              <button
                onClick={handleRunCode}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors font-medium shadow-sm"
              >
                ▶ Exécuter
              </button>
              
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 transition-colors font-medium shadow-sm"
              >
                ↻ Réinitialiser
              </button>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={togglePreview}
            className={`p-2 rounded-md transition-colors ${
              localTheme === 'dark'
                ? (previewVisible ? 'bg-blue-700 text-blue-200' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
                : (previewVisible ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')
            }`}
            title={previewVisible ? 'Masquer la prévisualisation' : 'Afficher la prévisualisation'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          {previewVisible && (
            <button
              onClick={toggleSplitView}
              className={`p-2 rounded-md transition-colors ${
                localTheme === 'dark'
                  ? (splitView ? 'bg-blue-700 text-blue-200' : 'bg-gray-700 text-gray-300 hover:bg-gray-600')
                  : (splitView ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600 hover:bg-gray-300')
              }`}
              title={splitView ? 'Vue plein écran' : 'Vue partagée'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm3 0v12h10V4H6z" clipRule="evenodd" />
              </svg>
            </button>
          )}
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md transition-colors ${
              localTheme === 'dark' 
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={localTheme === 'light' ? 'Thème sombre' : 'Thème clair'}
          >
            {localTheme === 'light' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Contenu de l'éditeur */}
      <div className={`flex ${splitView && previewVisible ? 'flex-col lg:flex-row' : 'flex-col'}`}>
        {/* Zone d'édition de code */}
        <div className={`${splitView && previewVisible ? 'lg:w-1/2' : 'w-full'} ${!previewVisible || !splitView ? 'block' : ''}`}>
          <div className="relative" style={{ height }}>
            <div className="absolute inset-0 flex">
              {/* Numéros de ligne */}
              <div className={`w-12 text-right pr-3 pt-3 select-none font-mono text-sm border-r ${
                localTheme === 'dark' 
                  ? 'bg-gray-800 text-gray-400 border-gray-600' 
                  : 'bg-gray-100 text-gray-500 border-gray-300'
              }`}>
                {code.split('\n').map((_, i) => (
                  <div key={i} className="leading-6 h-6">
                    {i + 1}
                  </div>
                ))}
              </div>
              
              {/* Conteneur de l'éditeur avec superposition */}
              <div className="relative flex-1 overflow-hidden">
                {/* Zone de texte pour la saisie */}
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={handleCodeChange}
                  onScroll={handleScroll}
                  onKeyDown={handleKeyDown}
                  className={`absolute inset-0 p-3 font-mono text-sm resize-none focus:outline-none leading-6 z-10 ${
                    localTheme === 'dark' 
                      ? 'bg-gray-900 text-gray-100 caret-white' + (readOnly ? ' cursor-default opacity-70' : ' cursor-text')
                      : 'bg-white text-gray-900 caret-gray-800' + (readOnly ? ' cursor-default opacity-70' : ' cursor-text')
                  }`}
                  style={{
                    height: '100%',
                    width: '100%',
                    whiteSpace: 'pre',
                    overflow: 'auto',
                    tabSize: 2,
                    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  }}
                  placeholder="Écrivez votre code ici..."
                  readOnly={readOnly}
                  spellCheck="false"
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  data-gramm="false"
                />
                
                {/* Affichage du code avec coloration syntaxique - masqué car le textarea est maintenant visible */}
                {false && (
                  <pre 
                    ref={preElementRef}
                    className={`absolute inset-0 p-3 font-mono text-sm leading-6 overflow-hidden m-0 ${
                      localTheme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}
                    style={{
                      pointerEvents: 'none',
                      height: '100%',
                      width: '100%',
                      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                    }}
                  >
                    <code 
                      ref={codeElementRef}
                      className={`language-${prismLanguage}`}
                      style={{
                        background: 'transparent',
                        color: localTheme === 'dark' ? '#f8f8f2' : '#24292e',
                      }}
                    >
                      {code}
                    </code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Zone de prévisualisation */}
        {previewVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${splitView ? 'lg:w-1/2 lg:border-l' : 'w-full'} ${
              localTheme === 'dark' ? 'border-gray-600' : 'border-gray-300'
            } border-t lg:border-t-0`}
            style={{ height: splitView ? height : 'auto' }}
          >
            <div className={`p-4 h-full ${localTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <CodePreviewSandbox 
                code={previewCode} 
                language={language} 
                height={splitView ? '100%' : '300px'}
                theme={localTheme}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

