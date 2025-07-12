# Chemin du script: G:\nextjs-mimo-clean\scripts\clean-rebuild.ps1

Write-Host "🧹 Nettoyage du cache Next.js et des fichiers de build..." -ForegroundColor Cyan


# Suppression complète des dossiers node_modules, .next et du package-lock.json
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "✓ Dossier node_modules supprimé" -ForegroundColor Green
}
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "✓ Dossier .next supprimé" -ForegroundColor Green
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "✓ package-lock.json supprimé" -ForegroundColor Green
}


Write-Host "📦 Réinstallation des dépendances..." -ForegroundColor Cyan
npm install

Write-Host "� Réinstallation forcée de Next.js (dernière version compatible)..." -ForegroundColor Cyan
npm install next@latest --force

Write-Host "🔨 Construction de l'application..." -ForegroundColor Cyan
$env:NEXT_FORCE_DYNAMIC = "true"
npm run build

Write-Host "✅ Nettoyage, réinstallation et build terminés !" -ForegroundColor Green
