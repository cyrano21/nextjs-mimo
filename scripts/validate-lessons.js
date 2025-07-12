#!/usr/bin/env node
/**
 * Script de validation des leçons
 * Utilise le validateur pour analyser tous les fichiers de leçons
 */

const path = require('path');
const fs = require('fs').promises;

// Import du validateur (en utilisant require pour la compatibilité Node.js)
const {
  validateAllLessons,
  generateValidationReport,
  autoFixContent
} = require('../src/utils/lessonContentValidator.js');

/**
 * Configuration
 */
const CONFIG = {
  lessonsDir: path.join(__dirname, '..', 'src', 'data', 'lessons'),
  autoFix: process.argv.includes('--fix'),
  verbose: process.argv.includes('--verbose'),
  outputFile: process.argv.includes('--output') ? 'validation-report.txt' : null
};

/**
 * Fonction principale
 */
async function main() {
  console.log('🔍 Validation des leçons en cours...');
  console.log(`📁 Répertoire: ${CONFIG.lessonsDir}`);
  
  if (CONFIG.autoFix) {
    console.log('🔧 Mode correction automatique activé');
  }
  
  try {
    // Vérifier que le répertoire des leçons existe
    await fs.access(CONFIG.lessonsDir);
    
    // Validation globale
    const results = await validateAllLessons(CONFIG.lessonsDir);
    
    // Génération du rapport
    const report = generateValidationReport(results);
    
    // Affichage du rapport
    console.log(report);
    
    // Sauvegarde du rapport si demandé
    if (CONFIG.outputFile) {
      await fs.writeFile(CONFIG.outputFile, report, 'utf8');
      console.log(`\n📄 Rapport sauvegardé dans: ${CONFIG.outputFile}`);
    }
    
    // Correction automatique si demandée
    if (CONFIG.autoFix && results.allIssues.length > 0) {
      console.log('\n🔧 Application des corrections automatiques...');
      await applyAutoFixes(results.allIssues);
    }
    
    // Code de sortie
    if (results.filesWithErrors > 0) {
      console.log('\n❌ Validation échouée - Des erreurs ont été détectées');
      process.exit(1);
    } else if (results.filesWithWarnings > 0) {
      console.log('\n⚠️  Validation réussie avec avertissements');
      process.exit(0);
    } else {
      console.log('\n✅ Validation réussie - Aucun problème détecté');
      process.exit(0);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la validation:', error.message);
    if (CONFIG.verbose) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Applique les corrections automatiques
 */
async function applyAutoFixes(issues) {
  const filesToFix = new Set();
  
  // Identifier les fichiers à corriger
  issues.forEach(issue => {
    if (issue.lessonPath && issue.type === 'error') {
      filesToFix.add(issue.lessonPath);
    }
  });
  
  let fixedFiles = 0;
  let totalFixes = 0;
  
  for (const filePath of filesToFix) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const { content: fixedContent, fixes, hasChanges } = autoFixContent(content);
      
      if (hasChanges) {
        await fs.writeFile(filePath, fixedContent, 'utf8');
        fixedFiles++;
        totalFixes += fixes.length;
        
        console.log(`\n🔧 ${path.relative(CONFIG.lessonsDir, filePath)}:`);
        fixes.forEach(fix => console.log(`   ✅ ${fix}`));
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la correction de ${filePath}:`, error.message);
    }
  }
  
  console.log(`\n📊 Résumé des corrections:`);
  console.log(`   📁 Fichiers corrigés: ${fixedFiles}`);
  console.log(`   🔧 Total des corrections: ${totalFixes}`);
  
  if (fixedFiles > 0) {
    console.log('\n💡 Relancez la validation pour vérifier les corrections');
  }
}

/**
 * Affichage de l'aide
 */
function showHelp() {
  console.log(`
📚 Script de Validation des Leçons
`);
  console.log(`Usage: node scripts/validate-lessons.js [options]\n`);
  console.log(`Options:`);
  console.log(`  --fix      Applique les corrections automatiques`);
  console.log(`  --verbose  Affichage détaillé des erreurs`);
  console.log(`  --output   Sauvegarde le rapport dans validation-report.txt`);
  console.log(`  --help     Affiche cette aide\n`);
  console.log(`Exemples:`);
  console.log(`  node scripts/validate-lessons.js`);
  console.log(`  node scripts/validate-lessons.js --fix`);
  console.log(`  node scripts/validate-lessons.js --output --verbose`);
}

// Gestion des arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  showHelp();
  process.exit(0);
}

// Lancement du script
main().catch(error => {
  console.error('❌ Erreur fatale:', error.message);
  process.exit(1);
});