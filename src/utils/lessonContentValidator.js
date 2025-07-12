/**
 * Validateur de contenu des leçons
 * Détecte les variables non échappées et autres problèmes potentiels
 */

/**
 * Patterns problématiques à détecter dans le contenu des leçons
 */
const PROBLEMATIC_PATTERNS = [
  {
    pattern: /\{[^"'][^}]*\}/g,
    description: 'Variable non échappée détectée',
    severity: 'error',
    suggestion: 'Encapsuler dans des guillemets: "{variable}"'
  },
  {
    pattern: /src=\{[^"'][^}]*\}/g,
    description: 'Attribut src avec variable non échappée',
    severity: 'error',
    suggestion: 'Utiliser src="{variable}" au lieu de src={variable}'
  },
  {
    pattern: /href=\{[^"'][^}]*\}/g,
    description: 'Attribut href avec variable non échappée',
    severity: 'warning',
    suggestion: 'Utiliser href="{variable}" au lieu de href={variable}'
  },
  {
    pattern: /\{\s*session\.[^}]*\s*&&/g,
    description: 'Condition avec session non échappée',
    severity: 'error',
    suggestion: 'Utiliser {"session.property" &&} pour les conditions'
  }
];

/**
 * Valide le contenu d'une leçon
 * @param {string} content - Le contenu de la leçon à valider
 * @param {string} lessonPath - Le chemin du fichier de leçon
 * @returns {Object} Résultat de la validation
 */
function validateLessonContent(content, lessonPath = '') {
  const issues = [];
  let hasErrors = false;
  let hasWarnings = false;

  // Vérifier chaque pattern problématique
  PROBLEMATIC_PATTERNS.forEach(({ pattern, description, severity, suggestion }) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const issue = {
          type: severity,
          description,
          match,
          suggestion,
          lessonPath
        };
        issues.push(issue);
        
        if (severity === 'error') hasErrors = true;
        if (severity === 'warning') hasWarnings = true;
      });
    }
  });

  return {
    isValid: !hasErrors,
    hasWarnings,
    issues,
    summary: {
      errors: issues.filter(i => i.type === 'error').length,
      warnings: issues.filter(i => i.type === 'warning').length,
      total: issues.length
    }
  };
}

/**
 * Valide tous les fichiers de leçons dans un répertoire
 * @param {string} lessonsDir - Répertoire contenant les leçons
 * @returns {Promise<Object>} Résultat de la validation globale
 */
async function validateAllLessons(lessonsDir) {
  const fs = require('fs').promises;
  const path = require('path');
  
  const results = {
    totalFiles: 0,
    validFiles: 0,
    filesWithErrors: 0,
    filesWithWarnings: 0,
    allIssues: []
  };

  try {
    // Lire récursivement tous les fichiers .js dans le répertoire des leçons
    async function scanDirectory(dir) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.name.endsWith('.js')) {
          results.totalFiles++;
          
          try {
            const content = await fs.readFile(fullPath, 'utf8');
            const validation = validateLessonContent(content, fullPath);
            
            if (validation.isValid && !validation.hasWarnings) {
              results.validFiles++;
            } else {
              if (!validation.isValid) results.filesWithErrors++;
              if (validation.hasWarnings) results.filesWithWarnings++;
              
              results.allIssues.push(...validation.issues);
            }
          } catch (error) {
            results.allIssues.push({
              type: 'error',
              description: `Erreur de lecture du fichier: ${error.message}`,
              lessonPath: fullPath
            });
          }
        }
      }
    }
    
    await scanDirectory(lessonsDir);
  } catch (error) {
    throw new Error(`Erreur lors de la validation: ${error.message}`);
  }

  return results;
}

/**
 * Génère un rapport de validation formaté
 * @param {Object} validationResults - Résultats de la validation
 * @returns {string} Rapport formaté
 */
function generateValidationReport(validationResults) {
  const { totalFiles, validFiles, filesWithErrors, filesWithWarnings, allIssues } = validationResults;
  
  let report = `\n📊 RAPPORT DE VALIDATION DES LEÇONS\n`;
  report += `${'='.repeat(50)}\n`;
  report += `📁 Fichiers analysés: ${totalFiles}\n`;
  report += `✅ Fichiers valides: ${validFiles}\n`;
  report += `❌ Fichiers avec erreurs: ${filesWithErrors}\n`;
  report += `⚠️  Fichiers avec avertissements: ${filesWithWarnings}\n\n`;
  
  if (allIssues.length > 0) {
    report += `🔍 PROBLÈMES DÉTECTÉS:\n`;
    report += `${'-'.repeat(30)}\n`;
    
    // Grouper par fichier
    const issuesByFile = {};
    allIssues.forEach(issue => {
      if (!issuesByFile[issue.lessonPath]) {
        issuesByFile[issue.lessonPath] = [];
      }
      issuesByFile[issue.lessonPath].push(issue);
    });
    
    Object.entries(issuesByFile).forEach(([filePath, issues]) => {
      report += `\n📄 ${filePath}:\n`;
      issues.forEach((issue, index) => {
        const icon = issue.type === 'error' ? '❌' : '⚠️';
        report += `  ${icon} ${issue.description}\n`;
        if (issue.match) report += `     Trouvé: "${issue.match}"\n`;
        if (issue.suggestion) report += `     💡 ${issue.suggestion}\n`;
        if (index < issues.length - 1) report += `\n`;
      });
    });
  } else {
    report += `🎉 Aucun problème détecté !\n`;
  }
  
  return report;
}

/**
 * Corrige automatiquement certains problèmes simples
 * @param {string} content - Contenu à corriger
 * @returns {Object} Contenu corrigé et liste des corrections appliquées
 */
function autoFixContent(content) {
  let fixedContent = content;
  const appliedFixes = [];
  
  // Correction 1: src={variable} -> src="{variable}"
  const srcMatches = fixedContent.match(/src=\{([^"'][^}]*)\}/g);
  if (srcMatches) {
    srcMatches.forEach(match => {
      const variable = match.match(/src=\{([^}]*)\}/)[1];
      const fixed = `src="{${variable}}"`;
      fixedContent = fixedContent.replace(match, fixed);
      appliedFixes.push(`Corrigé: ${match} -> ${fixed}`);
    });
  }
  
  // Correction 2: {session.property && -> {"session.property" &&
  const sessionMatches = fixedContent.match(/\{\s*(session\.[^}]*)\s*&&/g);
  if (sessionMatches) {
    sessionMatches.forEach(match => {
      const sessionVar = match.match(/\{\s*(session\.[^}]*)\s*&&/)[1];
      const fixed = `{"${sessionVar}" &&`;
      fixedContent = fixedContent.replace(match, fixed);
      appliedFixes.push(`Corrigé: ${match} -> ${fixed}`);
    });
  }
  
  return {
    content: fixedContent,
    fixes: appliedFixes,
    hasChanges: appliedFixes.length > 0
  };
}

module.exports = {
  validateLessonContent,
  validateAllLessons,
  generateValidationReport,
  autoFixContent,
  PROBLEMATIC_PATTERNS
};