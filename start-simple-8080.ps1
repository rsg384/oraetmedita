# Servidor Simples na Porta 8080
# Projeto: Ora et Medita

Write-Host "Servidor Simples - Porta 8080" -ForegroundColor Green
Write-Host "Projeto: Ora et Medita" -ForegroundColor Yellow
Write-Host ""

# Verificar se a porta está livre
Write-Host "Verificando porta 8080..." -ForegroundColor Cyan
$portInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "Porta 8080 ja esta em uso!" -ForegroundColor Red
    Write-Host "Encerre o processo ou use outra porta." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "Porta 8080 esta livre!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Iniciando servidor na porta 8080..." -ForegroundColor Green
Write-Host "URL: http://localhost:8080" -ForegroundColor Blue
Write-Host "Para parar: Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor HTTP simples
try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:8080/")
    $listener.Start()
    
    Write-Host "Servidor iniciado com sucesso!" -ForegroundColor Green
    Write-Host "Acesse: http://localhost:8080" -ForegroundColor Blue
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        $filePath = Join-Path (Get-Location) $localPath.TrimStart('/')
        
        if ($localPath -eq "/" -or $localPath -eq "") {
            $filePath = Join-Path (Get-Location) "index.html"
        }
        
        if (Test-Path $filePath) {
            $fileInfo = Get-Item $filePath
            if ($fileInfo -is [System.IO.FileInfo]) {
                $content = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $content.Length
                $response.OutputStream.Write($content, 0, $content.Length)
                Write-Host "Served: $localPath" -ForegroundColor Green
            } else {
                $response.StatusCode = 404
                $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found")
                $response.OutputStream.Write($notFound, 0, $notFound.Length)
                Write-Host "404: $localPath" -ForegroundColor Red
            }
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found")
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
            Write-Host "404: $localPath" -ForegroundColor Red
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Erro ao iniciar servidor: $_" -ForegroundColor Red
} finally {
    if ($listener) {
        $listener.Stop()
    }
} 