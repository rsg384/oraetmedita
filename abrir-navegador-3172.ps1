# Abrir Navegador - Porta 3172
# Projeto: Ora et Medita

Write-Host "Abrindo navegador..." -ForegroundColor Green
Write-Host "URL: http://localhost:3172" -ForegroundColor Blue

# Verificar se o servidor está rodando
$portInUse = Get-NetTCPConnection -LocalPort 3172 -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "Servidor detectado na porta 3172!" -ForegroundColor Green
    
    # Abrir navegador
    try {
        Start-Process "http://localhost:3172"
        Write-Host "Navegador aberto com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "Erro ao abrir navegador: $_" -ForegroundColor Red
        Write-Host "Abra manualmente: http://localhost:3172" -ForegroundColor Yellow
    }
} else {
    Write-Host "Servidor nao encontrado na porta 3172!" -ForegroundColor Red
    Write-Host "Execute primeiro: .\start-simple-3172.ps1" -ForegroundColor Yellow
} 