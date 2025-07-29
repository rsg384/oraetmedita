# Script simples para iniciar servidor na porta 3173
Write-Host "🚀 Iniciando Ora et Medita na porta 3173..." -ForegroundColor Green
Write-Host ""

# Tentar Python primeiro
try {
    $pythonVersion = python --version 2>$null
    if ($pythonVersion) {
        Write-Host "✅ Python encontrado: $pythonVersion" -ForegroundColor Green
        Write-Host "🌐 URL: http://localhost:3173" -ForegroundColor Cyan
        Write-Host "🛑 Para parar: Ctrl+C" -ForegroundColor Yellow
        Write-Host ""
        python -m http.server 3173
        exit
    }
} catch {
    # Python não encontrado, continuar
}

# Tentar Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
        Write-Host "🌐 URL: http://localhost:3173" -ForegroundColor Cyan
        Write-Host "🛑 Para parar: Ctrl+C" -ForegroundColor Yellow
        Write-Host ""
        npx http-server -p 3173
        exit
    }
} catch {
    # Node.js não encontrado
}

# Nenhum servidor encontrado
Write-Host "❌ Nenhum servidor HTTP encontrado" -ForegroundColor Red
Write-Host ""
Write-Host "💡 Instale Python ou Node.js:" -ForegroundColor Yellow
Write-Host "   Python: https://www.python.org/downloads/" -ForegroundColor Cyan
Write-Host "   Node.js: https://nodejs.org/" -ForegroundColor Cyan
Write-Host ""
Read-Host "Pressione Enter para sair" 