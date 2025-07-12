"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CodePreviewSandboxImproved({ 
  code, 
  language, 
  height = "400px", 
  theme = "light",
  onError,
  onSuccess 
}) {
  const [iframeContent, setIframeContent] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const iframeRef = useRef(null);
  
  useEffect(() => {
    if (!code?.trim()) {
      setIframeContent('');
      setError(null);
      setConsoleOutput([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let content = '';
      
      if (language === 'html' || language === 'markup') {
        content = generateHTMLContent(code);
      } else if (language === 'css') {
        content = generateCSSContent(code);
      } else if (language === 'javascript' || language === 'js') {
        content = generateJavaScriptContent(code);
      } else if (language === 'jsx' || language === 'react') {
        content = generateReactContent(code);
      } else if (language === 'typescript' || language === 'ts') {
        content = generateTypeScriptContent(code);
      } else {
        content = generateDefaultContent(code, language);
      }
      
      setIframeContent(content);
      setIsLoading(false);
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      if (onError) onError(err);
    }
  }, [code, language, onError, onSuccess]);
  
  const generateHTMLContent = (htmlCode) => {
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Prévisualisation HTML</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 16px;
              line-height: 1.6;
              color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
              background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
            }
            * {
              box-sizing: border-box;
            }
          </style>
        </head>
        <body>
          ${htmlCode}
          <script>
            window.addEventListener('error', function(e) {
              console.error('Erreur:', e.error?.message || e.message);
            });
          </script>
        </body>
      </html>
    `;
  };
  
  const generateCSSContent = (cssCode) => {
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Prévisualisation CSS</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: ${theme === 'dark' ? '#1f2937' : '#f9fafb'};
              color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
            }
            .demo-container {
              background: ${theme === 'dark' ? '#374151' : '#ffffff'};
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            }
            .demo-title {
              margin: 0 0 16px 0;
              font-size: 18px;
              font-weight: 600;
              color: ${theme === 'dark' ? '#f3f4f6' : '#1f2937'};
            }
            ${cssCode}
          </style>
        </head>
        <body>
          <div class="demo-container">
            <h2 class="demo-title">Prévisualisation CSS</h2>
            <div class="demo-element">
              <p>Paragraphe de démonstration</p>
              <button class="demo-button">Bouton de test</button>
              <div class="demo-box">Boîte de démonstration</div>
              <ul class="demo-list">
                <li>Élément de liste 1</li>
                <li>Élément de liste 2</li>
                <li>Élément de liste 3</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `;
  };
  
  const generateJavaScriptContent = (jsCode) => {
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Prévisualisation JavaScript</title>
          <style>
            body {
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              margin: 0;
              padding: 20px;
              background-color: ${theme === 'dark' ? '#1f2937' : '#f9fafb'};
              color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
            }
            #output {
              background: ${theme === 'dark' ? '#374151' : '#ffffff'};
              border: 1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'};
              border-radius: 8px;
              padding: 16px;
              min-height: 100px;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 14px;
              line-height: 1.5;
              white-space: pre-wrap;
              overflow-wrap: break-word;
            }
            .output-line {
              margin: 4px 0;
              padding: 2px 0;
            }
            .output-log {
              color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
            }
            .output-error {
              color: #ef4444;
              background-color: ${theme === 'dark' ? '#7f1d1d' : '#fef2f2'};
              padding: 4px 8px;
              border-radius: 4px;
              border-left: 3px solid #ef4444;
            }
            .output-warn {
              color: #f59e0b;
              background-color: ${theme === 'dark' ? '#78350f' : '#fffbeb'};
              padding: 4px 8px;
              border-radius: 4px;
              border-left: 3px solid #f59e0b;
            }
            .output-info {
              color: #3b82f6;
              background-color: ${theme === 'dark' ? '#1e3a8a' : '#eff6ff'};
              padding: 4px 8px;
              border-radius: 4px;
              border-left: 3px solid #3b82f6;
            }
          </style>
        </head>
        <body>
          <div id="output"></div>
          <script>
            const output = document.getElementById('output');
            
            function addOutput(content, type = 'log') {
              const line = document.createElement('div');
              line.className = \`output-line output-\${type}\`;
              line.textContent = content;
              output.appendChild(line);
              output.scrollTop = output.scrollHeight;
            }
            
            // Rediriger console
            const originalConsole = {
              log: console.log,
              error: console.error,
              warn: console.warn,
              info: console.info
            };
            
            console.log = function(...args) {
              originalConsole.log.apply(console, args);
              const text = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' ');
              addOutput(text, 'log');
            };
            
            console.error = function(...args) {
              originalConsole.error.apply(console, args);
              const text = args.map(arg => String(arg)).join(' ');
              addOutput('❌ ' + text, 'error');
            };
            
            console.warn = function(...args) {
              originalConsole.warn.apply(console, args);
              const text = args.map(arg => String(arg)).join(' ');
              addOutput('⚠️ ' + text, 'warn');
            };
            
            console.info = function(...args) {
              originalConsole.info.apply(console, args);
              const text = args.map(arg => String(arg)).join(' ');
              addOutput('ℹ️ ' + text, 'info');
            };
            
            // Fonction utilitaire pour afficher des résultats
            window.show = function(value) {
              console.log(value);
            };
            
            // Gérer les erreurs globales
            window.addEventListener('error', function(e) {
              console.error('Erreur d\\'exécution:', e.error?.message || e.message);
            });
            
            window.addEventListener('unhandledrejection', function(e) {
              console.error('Promise rejetée:', e.reason);
            });
            
            try {
              // Exécuter le code utilisateur
              ${jsCode}
            } catch (error) {
              console.error('Erreur dans le code:', error.message);
            }
          </script>
        </body>
      </html>
    `;
  };
  
  const generateReactContent = (reactCode) => {
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Prévisualisation React</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              margin: 0;
              padding: 20px;
              background-color: ${theme === 'dark' ? '#1f2937' : '#ffffff'};
              color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
            }
            #root {
              min-height: 200px;
            }
            .error-container {
              background-color: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 8px;
              padding: 16px;
              margin: 16px 0;
            }
            .error-title {
              color: #dc2626;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .error-message {
              color: #7f1d1d;
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              font-size: 14px;
              white-space: pre-wrap;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            const { useState, useEffect, useRef } = React;
            
            function ErrorBoundary({ children }) {
              const [hasError, setHasError] = useState(false);
              const [error, setError] = useState(null);
              
              useEffect(() => {
                const handleError = (event) => {
                  setHasError(true);
                  setError(event.error?.message || event.message);
                };
                
                window.addEventListener('error', handleError);
                return () => window.removeEventListener('error', handleError);
              }, []);
              
              if (hasError) {
                return (
                  <div className="error-container">
                    <div className="error-title">Erreur React</div>
                    <div className="error-message">{error}</div>
                  </div>
                );
              }
              
              return children;
            }
            
            try {
              ${reactCode}
              
              // Essayer de rendre le composant automatiquement
              const componentMatch = \`${reactCode}\`.match(/(?:function|const)\\s+([A-Z][a-zA-Z0-9]*)/);
              if (componentMatch && !${reactCode.includes('ReactDOM.render')} && !${reactCode.includes('createRoot')}) {
                const ComponentName = componentMatch[1];
                const Component = eval(ComponentName);
                
                if (Component) {
                  const root = ReactDOM.createRoot(document.getElementById('root'));
                  root.render(
                    React.createElement(ErrorBoundary, null,
                      React.createElement(Component)
                    )
                  );
                }
              }
            } catch (error) {
              document.getElementById('root').innerHTML = \`
                <div class="error-container">
                  <div class="error-title">Erreur de compilation</div>
                  <div class="error-message">\${error.message}</div>
                </div>
              \`;
            }
          </script>
        </body>
      </html>
    `;
  };
  
  const generateTypeScriptContent = (tsCode) => {
    // Pour TypeScript, on utilise la même approche que JavaScript
    // mais avec des annotations de type supprimées pour la démo
    const jsCode = tsCode
      .replace(/:\s*\w+(\[\])?/g, '') // Supprimer les annotations de type simples
      .replace(/interface\s+\w+\s*{[^}]*}/g, '') // Supprimer les interfaces
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, ''); // Supprimer les alias de type
    
    return generateJavaScriptContent(jsCode);
  };
  
  const generateDefaultContent = (code, lang) => {
    return `
      <!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Prévisualisation ${lang}</title>
          <style>
            body {
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
              margin: 0;
              padding: 20px;
              background-color: ${theme === 'dark' ? '#1f2937' : '#f9fafb'};
              color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
            }
            .code-display {
              background: ${theme === 'dark' ? '#374151' : '#ffffff'};
              border: 1px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'};
              border-radius: 8px;
              padding: 16px;
              white-space: pre-wrap;
              overflow-wrap: break-word;
              font-size: 14px;
              line-height: 1.5;
            }
            .language-label {
              background: ${theme === 'dark' ? '#6b7280' : '#e5e7eb'};
              color: ${theme === 'dark' ? '#f9fafb' : '#374151'};
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: 600;
              margin-bottom: 12px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="language-label">${lang.toUpperCase()}</div>
          <div class="code-display">${code}</div>
        </body>
      </html>
    `;
  };
  
  return (
    <div className="w-full h-full relative overflow-hidden rounded-md">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`
              absolute inset-0 flex items-center justify-center z-10
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`
                animate-spin rounded-full h-6 w-6 border-2 border-t-transparent
                ${theme === 'dark' ? 'border-gray-400' : 'border-gray-600'}
              `}></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Chargement...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {error ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            h-full p-4 overflow-auto
            ${theme === 'dark' ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-600'}
          `}
        >
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-semibold mb-2">Erreur de prévisualisation</p>
              <p className="text-sm font-mono whitespace-pre-wrap">{error}</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.iframe
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          ref={iframeRef}
          srcDoc={iframeContent}
          title="Prévisualisation du code"
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          style={{ height }}
        />
      )}
    </div>
  );
}

