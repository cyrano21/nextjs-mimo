"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function CodePreviewSandbox({ code, language, height = "300px" }) {
  const [iframeContent, setIframeContent] = useState('');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!code) return;
    
    try {
      let content = '';
      
      if (language === 'html' || language === 'jsx') {
        // Pour HTML ou JSX, on peut directement afficher le code
        content = code;
      } else if (language === 'css') {
        // Pour CSS, on l'enveloppe dans une balise style
        content = `
          <style>${code}</style>
          <div class="css-preview">
            <p>Prévisualisation CSS</p>
            <div class="demo-element">Élément avec style</div>
            <button class="demo-button">Bouton de démonstration</button>
          </div>
        `;
      } else if (language === 'javascript') {
        // Pour JavaScript, on l'enveloppe dans un script et on ajoute une div pour l'output
        content = `
          <div id="output"></div>
          <script>
            try {
              const originalConsoleLog = console.log;
              const output = document.getElementById('output');
              
              // Rediriger console.log vers notre div output
              console.log = function(...args) {
                originalConsoleLog.apply(console, args);
                const text = args.map(arg => 
                  typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
                ).join(' ');
                
                const p = document.createElement('p');
                p.textContent = text;
                output.appendChild(p);
              };
              
              // Fonction pour afficher le résultat d'une expression
              function show(result) {
                const p = document.createElement('p');
                p.textContent = result;
                output.appendChild(p);
              }
              
              // Exécuter le code utilisateur
              ${code}
            } catch (error) {
              const errorElement = document.createElement('div');
              errorElement.className = 'error';
              errorElement.textContent = 'Erreur: ' + error.message;
              document.body.appendChild(errorElement);
            }
          </script>
          <style>
            #output {
              font-family: monospace;
              padding: 10px;
              background-color: #f5f5f5;
              border-radius: 4px;
              margin-top: 10px;
            }
            .error {
              color: red;
              font-family: monospace;
              padding: 10px;
              background-color: #ffeeee;
              border-radius: 4px;
              margin-top: 10px;
            }
          </style>
        `;
      } else if (language === 'react') {
        // Pour React, on doit inclure React et ReactDOM via CDN
        content = `
          <div id="root"></div>
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <script type="text/babel">
            try {
              ${code}
              
              // Si le code ne contient pas de ReactDOM.render, on essaie de rendre le dernier composant défini
              if (!${code.includes('ReactDOM.render')}) {
                // Trouver le dernier composant défini (heuristique simple)
                const componentMatch = ${JSON.stringify(code)}.match(/function ([A-Z][a-zA-Z0-9]*)[^{]*{/g);
                if (componentMatch) {
                  const lastComponent = componentMatch[componentMatch.length - 1].match(/function ([A-Z][a-zA-Z0-9]*)/)[1];
                  ReactDOM.render(React.createElement(eval(lastComponent)), document.getElementById('root'));
                }
              }
            } catch (error) {
              const errorElement = document.createElement('div');
              errorElement.className = 'error';
              errorElement.textContent = 'Erreur: ' + error.message;
              document.body.appendChild(errorElement);
            }
          </script>
          <style>
            .error {
              color: red;
              font-family: monospace;
              padding: 10px;
              background-color: #ffeeee;
              border-radius: 4px;
              margin-top: 10px;
            }
          </style>
        `;
      }
      
      // Créer un document HTML complet
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                margin: 0;
                padding: 16px;
                color: #333;
              }
              .css-preview {
                display: flex;
                flex-direction: column;
                gap: 16px;
                align-items: center;
              }
              .demo-element {
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 4px;
              }
              .demo-button {
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `;
      
      setIframeContent(htmlContent);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [code, language]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full rounded-md overflow-hidden border border-gray-200"
      style={{ height }}
    >
      {error ? (
        <div className="bg-red-50 text-red-600 p-4 h-full overflow-auto">
          <p className="font-semibold">Erreur de prévisualisation :</p>
          <p>{error}</p>
        </div>
      ) : (
        <iframe
          srcDoc={iframeContent}
          title="Code Preview"
          className="w-full h-full"
          sandbox="allow-scripts"
        />
      )}
    </motion.div>
  );
}
