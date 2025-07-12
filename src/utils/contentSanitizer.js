/**
 * Système de sanitisation du contenu des leçons
 * Prévient les problèmes de rendu et sécurise le contenu HTML
 */

/**
 * Sanitise le contenu HTML d'une leçon
 * @param {string} htmlContent - Le contenu HTML à sanitiser
 * @returns {string} Contenu HTML sanitisé
 */
function sanitizeLessonContent(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  let sanitized = htmlContent;

  // 1. Échapper les variables non protégées dans les attributs src et href
  sanitized = sanitized.replace(
    /\b(src|href)=\{([^"'][^}]*)\}/g,
    (match, attr, variable) => {
      console.warn(`⚠️ Variable non échappée détectée: ${match}`);
      return `${attr}="{${variable}}"`;
    }
  );

  // 2. Échapper les conditions avec session non protégées
  sanitized = sanitized.replace(
    /\{\s*(session\.[^}]*)\s*&&/g,
    (match, sessionVar) => {
      console.warn(`⚠️ Condition session non échappée: ${match}`);
      return `{"${sessionVar}" &&`;
    }
  );

  // 3. Protéger les autres variables potentiellement problématiques
  sanitized = sanitized.replace(
    /\{([^"'\s][^}]*[^"'\s])\}/g,
    (match, variable) => {
      // Ignorer les variables déjà échappées ou les expressions valides
      if (
        variable.startsWith('"') || 
        variable.startsWith("'") ||
        variable.includes('(') || 
        variable.includes('?') ||
        variable.includes(':') ||
        /^\d+$/.test(variable) // nombres
      ) {
        return match;
      }
      
      console.warn(`⚠️ Variable potentiellement problématique: ${match}`);
      return `{"${variable}"}`;
    }
  );

  // 4. Nettoyer les scripts potentiellement dangereux
  sanitized = sanitized.replace(
    /<script[^>]*>.*?<\/script>/gis,
    '<!-- Script supprimé pour sécurité -->'
  );

  // 5. Nettoyer les événements inline potentiellement dangereux
  sanitized = sanitized.replace(
    /\s+on\w+\s*=\s*["'][^"']*["']/gi,
    ''
  );

  return sanitized;
}

/**
 * Valide et sanitise le contenu d'une leçon complète
 * @param {Object} lesson - Objet leçon avec theoryContent, exerciseContent, etc.
 * @returns {Object} Leçon avec contenu sanitisé
 */
function sanitizeLesson(lesson) {
  if (!lesson || typeof lesson !== 'object') {
    return lesson;
  }

  const sanitized = { ...lesson };
  const contentFields = ['theoryContent', 'exerciseContent', 'paragraphContent', 'example'];

  contentFields.forEach(field => {
    if (sanitized[field]) {
      if (typeof sanitized[field] === 'string') {
        sanitized[field] = sanitizeLessonContent(sanitized[field]);
      } else if (sanitized[field].code) {
        // Pour les objets avec propriété code (comme example)
        sanitized[field] = {
          ...sanitized[field],
          code: sanitizeLessonContent(sanitized[field].code)
        };
      }
    }
  });

  return sanitized;
}

/**
 * Crée un wrapper sécurisé pour dangerouslySetInnerHTML
 * @param {string} htmlContent - Contenu HTML à rendre
 * @returns {Object} Objet compatible avec dangerouslySetInnerHTML
 */
function createSafeHTML(htmlContent) {
  const sanitized = sanitizeLessonContent(htmlContent);
  return { __html: sanitized };
}

/**
 * Détecte les URLs potentiellement problématiques dans le contenu
 * @param {string} content - Contenu à analyser
 * @returns {Array} Liste des URLs suspectes détectées
 */
function detectSuspiciousUrls(content) {
  const suspiciousPatterns = [
    /\{[^}]*\}/g, // Variables non échappées
    /%7B[^%]*%7D/g, // Variables encodées en URL
    /\$\{[^}]*\}/g, // Template literals
  ];

  const suspiciousUrls = [];
  
  suspiciousPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        suspiciousUrls.push({
          pattern: match,
          type: 'suspicious_variable',
          suggestion: 'Vérifier que cette variable est correctement échappée'
        });
      });
    }
  });

  return suspiciousUrls;
}

/**
 * Middleware de logging pour les problèmes de sanitisation
 */
class SanitizationLogger {
  constructor() {
    this.issues = [];
    this.enabled = process.env.NODE_ENV === 'development';
  }

  log(type, message, context = {}) {
    if (!this.enabled) return;

    const issue = {
      timestamp: new Date().toISOString(),
      type,
      message,
      context
    };

    this.issues.push(issue);
    
    // Log en console en développement
    if (type === 'error') {
      console.error(`🚨 Sanitization Error: ${message}`, context);
    } else if (type === 'warning') {
      console.warn(`⚠️ Sanitization Warning: ${message}`, context);
    } else {
      console.log(`ℹ️ Sanitization Info: ${message}`, context);
    }
  }

  getIssues() {
    return this.issues;
  }

  clearIssues() {
    this.issues = [];
  }

  generateReport() {
    if (this.issues.length === 0) {
      return 'Aucun problème de sanitisation détecté.';
    }

    let report = `Rapport de Sanitisation (${this.issues.length} problèmes):\n`;
    report += '='.repeat(50) + '\n';

    this.issues.forEach((issue, index) => {
      report += `${index + 1}. [${issue.type.toUpperCase()}] ${issue.message}\n`;
      if (Object.keys(issue.context).length > 0) {
        report += `   Contexte: ${JSON.stringify(issue.context, null, 2)}\n`;
      }
      report += `   Timestamp: ${issue.timestamp}\n\n`;
    });

    return report;
  }
}

// Instance globale du logger
const sanitizationLogger = new SanitizationLogger();

/**
 * Hook React pour utiliser la sanitisation avec logging
 * @param {string} content - Contenu à sanitiser
 * @param {string} context - Contexte pour le logging
 * @returns {string} Contenu sanitisé
 */
function useSanitizedContent(content, context = 'unknown') {
  if (!content) return '';

  try {
    const sanitized = sanitizeLessonContent(content);
    
    // Log si des modifications ont été apportées
    if (sanitized !== content) {
      sanitizationLogger.log('info', 'Contenu sanitisé', {
        context,
        originalLength: content.length,
        sanitizedLength: sanitized.length,
        hasChanges: true
      });
    }

    return sanitized;
  } catch (error) {
    sanitizationLogger.log('error', 'Erreur lors de la sanitisation', {
      context,
      error: error.message
    });
    return content; // Retourner le contenu original en cas d'erreur
  }
}

module.exports = {
  sanitizeLessonContent,
  sanitizeLesson,
  createSafeHTML,
  detectSuspiciousUrls,
  SanitizationLogger,
  sanitizationLogger,
  useSanitizedContent
};