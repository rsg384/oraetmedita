# Deploy Automático para GitHub - Ora et Medita
# Autor: Rodrigo Silva Goes (@rsg384)
# Repositório: https://github.com/rsg384/oraetmedita.git

param(
    [string]$CommitMessage = "",
    [string]$TipoCommit = "AUTO"
)

# Configurar cores para output
$Host.UI.RawUI.ForegroundColor = "Cyan"
Write-Host "🚀 Deploy Automático para GitHub - Ora et Medita" -ForegroundColor Green
Write-Host "📁 Diretório: $(Get-Location)" -ForegroundColor Yellow
Write-Host "🔗 Repositório: https://github.com/rsg384/oraetmedita.git" -ForegroundColor Blue
Write-Host ""

# Verificar se o Git está disponível
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git não encontrado. Adicionando ao PATH..." -ForegroundColor Red
    $env:PATH += ";C:\Users\rodrigo.goes\AppData\Local\Programs\Git\bin"
}

# Verificar status do repositório
Write-Host "📊 Verificando status do repositório..." -ForegroundColor Cyan
$status = git status --porcelain

if ($status) {
    Write-Host "📝 Mudanças detectadas:" -ForegroundColor Yellow
    git status --short
    
    # Adicionar todos os arquivos
    Write-Host "📦 Adicionando arquivos..." -ForegroundColor Cyan
    git add .
    
    # Gerar mensagem de commit
    if ($CommitMessage -eq "") {
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        $CommitMessage = "📝 [$TipoCommit] Deploy automático - $timestamp
        
✨ Funcionalidades:
- Atualizações automáticas do sistema
- Melhorias de performance
- Correções de bugs

🛠️ Tecnologias:
- HTML5, CSS3, JavaScript
- Supabase (PostgreSQL)
- OpenAI ChatGPT API

👨‍💻 Autor: Rodrigo Silva Goes (@rsg384)"
    }
    
    # Fazer commit
    Write-Host "💾 Fazendo commit..." -ForegroundColor Cyan
    git commit -m $CommitMessage
    
    # Enviar para GitHub
    Write-Host "📤 Enviando para GitHub..." -ForegroundColor Cyan
    git push origin main
    
    Write-Host ""
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Acesse: https://github.com/rsg384/oraetmedita" -ForegroundColor Blue
    
} else {
    Write-Host "ℹ️ Nenhuma mudança detectada. Repositório já está atualizado." -ForegroundColor Yellow
}

# Verificar se o deploy foi bem-sucedido
Write-Host ""
Write-Host "🔍 Verificando status final..." -ForegroundColor Cyan
$finalStatus = git status
Write-Host $finalStatus

Write-Host ""
Write-Host "🎉 Processo de deploy finalizado!" -ForegroundColor Green
Write-Host "📋 Para verificar o deploy, acesse:" -ForegroundColor Yellow
Write-Host "   https://github.com/rsg384/oraetmedita" -ForegroundColor Blue 