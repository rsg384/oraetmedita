# Deploy Rapido - Ora et Medita
# Uso: .\deploy-rapido.ps1

Write-Host "Deploy Rapido - Ora et Medita" -ForegroundColor Green

# Adicionar Git ao PATH se necessario
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    $env:PATH += ";C:\Users\rodrigo.goes\AppData\Local\Programs\Git\bin"
}

# Verificar mudancas
$changes = git status --porcelain
if ($changes) {
    Write-Host "Mudancas detectadas, fazendo deploy..." -ForegroundColor Yellow
    
    # Deploy automatico
    git add .
    git commit -m "AUTO: Deploy automatico - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    git push origin main
    
    Write-Host "Deploy concluido!" -ForegroundColor Green
} else {
    Write-Host "Nenhuma mudanca para deploy." -ForegroundColor Cyan
} 