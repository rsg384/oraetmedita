# Verificar Status - Ora et Medita
# Uso: .\verificar-status.ps1

Write-Host "=== STATUS DO REPOSITORIO ===" -ForegroundColor Green
Write-Host ""

# Configurar Git se necessario
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    $env:PATH += ";C:\Users\rodrigo.goes\AppData\Local\Programs\Git\bin"
}

# Informacoes do Git
Write-Host "Git Version:" -ForegroundColor Yellow
git --version
Write-Host ""

# Status do repositorio
Write-Host "Status do Repositorio:" -ForegroundColor Yellow
git status
Write-Host ""

# Repositorios remotos
Write-Host "Repositorios Remotos:" -ForegroundColor Yellow
git remote -v
Write-Host ""

# Ultimos commits
Write-Host "Ultimos 5 Commits:" -ForegroundColor Yellow
git log --oneline -5
Write-Host ""

# Informacoes do projeto
Write-Host "=== INFORMACOES DO PROJETO ===" -ForegroundColor Green
Write-Host "Repositorio: https://github.com/rsg384/oraetmedita" -ForegroundColor Blue
Write-Host "Autor: Rodrigo Silva Goes (@rsg384)" -ForegroundColor Blue
Write-Host "Projeto: Ora et Medita - Sistema de Meditacoes Catolicas" -ForegroundColor Blue
Write-Host ""

Write-Host "=== SCRIPTS DISPONIVEIS ===" -ForegroundColor Green
Write-Host "deploy-rapido.ps1 - Deploy rapido" -ForegroundColor Cyan
Write-Host "deploy-automatico.ps1 - Deploy completo" -ForegroundColor Cyan
Write-Host "verificar-status.ps1 - Este script" -ForegroundColor Cyan 