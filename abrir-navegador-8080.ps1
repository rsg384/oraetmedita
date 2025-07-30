# Abrir Navegador - Porta 8080
# Projeto: Ora et Medita

Write-Host "Abrindo navegador..." -ForegroundColor Green
Write-Host "URL: http://localhost:8080" -ForegroundColor Blue

# Verificar se o servidor está rodando
$portInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "Servidor detectado na porta 8080!" -ForegroundColor Green
    
    # Abrir navegador
    try {
        Start-Process "http://localhost:8080"
        Write-Host "Navegador aberto com sucesso!" -ForegroundColor Green
    } catch {
        Write-Host "Erro ao abrir navegador: $_" -ForegroundColor Red
        Write-Host "Abra manualmente: http://localhost:8080" -ForegroundColor Yellow
    }
} else {
    Write-Host "Servidor nao encontrado na porta 8080!" -ForegroundColor Red
    Write-Host "Execute primeiro: .\start-simple-8080.ps1" -ForegroundColor Yellow
} 