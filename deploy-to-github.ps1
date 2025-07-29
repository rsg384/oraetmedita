# Script de Deploy Automático para GitHub - Ora et Medita
# Repositório: https://github.com/rsg384/oraetmedita.git
# Autor: Rodrigo Silva Goes

param(
    [string]$CommitMessage = "",
    [switch]$Status,
    [switch]$Help
)

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Função para log colorido
function Write-Log {
    param([string]$Message, [string]$Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message" -ForegroundColor $Color
}

function Write-Error {
    param([string]$Message)
    Write-Log "[ERRO] $Message" $Red
}

function Write-Warning {
    param([string]$Message)
    Write-Log "[AVISO] $Message" $Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Log "[INFO] $Message" $Blue
}

# Configurações
$RepoUrl = "https://github.com/rsg384/oraetmedita.git"
$Branch = "main"
$GitPath = "C:\Program Files\Git\bin\git.exe"

# Função para verificar se o Git está configurado
function Test-GitConfig {
    Write-Log "🔍 Verificando configuração do Git..." $Green
    
    $userName = & $GitPath config --global user.name 2>$null
    if (-not $userName) {
        Write-Warning "Git user.name não configurado"
        Write-Info "Configurando Git..."
        & $GitPath config --global user.name "Rodrigo Silva Goes"
    }
    
    $userEmail = & $GitPath config --global user.email 2>$null
    if (-not $userEmail) {
        Write-Warning "Git user.email não configurado"
        Write-Info "Configurando Git..."
        & $GitPath config --global user.email "rodrigo@oraetmedita.com"
    }
    
    Write-Log "✅ Git configurado corretamente" $Green
}

# Função para verificar status do repositório
function Test-RepoStatus {
    Write-Log "🔍 Verificando status do repositório..." $Green
    
    if (-not (Test-Path ".git")) {
        Write-Log "📦 Inicializando repositório Git..." $Green
        & $GitPath init
    }
    
    # Verificar se o remote existe
    $remoteUrl = & $GitPath remote get-url origin 2>$null
    if (-not $remoteUrl) {
        Write-Log "🔗 Adicionando remote origin..." $Green
        & $GitPath remote add origin $RepoUrl
    }
    
    Write-Log "✅ Repositório configurado" $Green
}

# Função para verificar mudanças
function Test-Changes {
    Write-Log "🔍 Verificando mudanças..." $Green
    
    $status = & $GitPath status --porcelain
    if (-not $status) {
        Write-Warning "Nenhuma mudança detectada"
        return $false
    }
    
    Write-Log "📝 Mudanças detectadas:" $Green
    & $GitPath status --short
    return $true
}

# Função para gerar mensagem de commit
function New-CommitMessage {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $changes = & $GitPath diff --name-only --cached | Select-Object -First 5
    $changesList = $changes -join ", "
    
    if (-not $CommitMessage) {
        $CommitMessage = @"
📝 [AUTO] Deploy automático - $timestamp

✨ Mudanças:
- $changesList

🛠️ Tecnologias:
- HTML5, CSS3, JavaScript
- Supabase (PostgreSQL)
- OpenAI ChatGPT API

👨‍💻 Autor: Rodrigo Silva Goes
"@
    }
    
    return $CommitMessage
}

# Função para fazer deploy
function Start-Deploy {
    Write-Log "🚀 Iniciando deploy automático..." $Green
    
    # Verificar configurações
    Test-GitConfig
    Test-RepoStatus
    
    # Verificar mudanças
    if (-not (Test-Changes)) {
        Write-Warning "Nenhuma mudança para fazer deploy"
        return
    }
    
    # Adicionar todos os arquivos
    Write-Log "📝 Adicionando arquivos..." $Green
    & $GitPath add .
    
    # Gerar mensagem de commit
    $commitMsg = New-CommitMessage
    
    # Fazer commit
    Write-Log "💾 Fazendo commit..." $Green
    & $GitPath commit -m $commitMsg
    
    # Fazer push
    Write-Log "📤 Enviando para GitHub..." $Green
    & $GitPath push origin $Branch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "✅ Deploy concluído com sucesso!" $Green
        Write-Log "🌐 Repositório: $RepoUrl" $Green
    } else {
        Write-Error "❌ Erro ao fazer push para o GitHub"
        Write-Info "💡 Verifique se você tem permissão para o repositório"
        Write-Info "💡 Verifique se você está logado no Git"
    }
}

# Função para mostrar ajuda
function Show-Help {
    Write-Host "🚀 Script de Deploy Automático - Ora et Medita" -ForegroundColor $Green
    Write-Host ""
    Write-Host "Uso: .\deploy-to-github.ps1 [OPÇÕES]"
    Write-Host ""
    Write-Host "Opções:"
    Write-Host "  -CommitMessage 'MENSAGEM'  Mensagem de commit personalizada"
    Write-Host "  -Status                     Verificar status do repositório"
    Write-Host "  -Help                       Mostrar esta ajuda"
    Write-Host ""
    Write-Host "Exemplos:"
    Write-Host "  .\deploy-to-github.ps1                    Deploy automático"
    Write-Host "  .\deploy-to-github.ps1 -CommitMessage 'Nova funcionalidade'  Deploy com mensagem personalizada"
    Write-Host "  .\deploy-to-github.ps1 -Status            Verificar status"
    Write-Host ""
    Write-Host "Repositório: $RepoUrl"
}

# Função para verificar status
function Show-Status {
    Write-Log "📊 Status do repositório:" $Green
    Write-Host ""
    Write-Host "📁 Diretório: $(Get-Location)"
    $remoteUrl = & $GitPath remote get-url origin 2>$null
    Write-Host "🔗 Remote: $(if ($remoteUrl) { $remoteUrl } else { 'Não configurado' })"
    $currentBranch = & $GitPath branch --show-current 2>$null
    Write-Host "🌿 Branch atual: $(if ($currentBranch) { $currentBranch } else { 'Não inicializado' })"
    Write-Host ""
    
    if (Test-Path ".git") {
        Write-Host "📝 Últimos commits:"
        & $GitPath log --oneline -5 2>$null
        Write-Host ""
        
        Write-Host "📋 Status dos arquivos:"
        & $GitPath status --short 2>$null
    } else {
        Write-Host "❌ Repositório Git não inicializado" -ForegroundColor $Red
    }
}

# Função para verificar configurações
function Test-Config {
    Write-Log "🔍 Verificando configurações..." $Green
    
    Write-Host "📋 Configurações do Git:"
    $userName = & $GitPath config --global user.name 2>$null
    Write-Host "  Nome: $(if ($userName) { $userName } else { 'Não configurado' })"
    $userEmail = & $GitPath config --global user.email 2>$null
    Write-Host "  Email: $(if ($userEmail) { $userEmail } else { 'Não configurado' })"
    Write-Host ""
    
    Write-Host "📋 Configurações do repositório:"
    $remoteUrl = & $GitPath remote get-url origin 2>$null
    Write-Host "  Remote: $(if ($remoteUrl) { $remoteUrl } else { 'Não configurado' })"
    $currentBranch = & $GitPath branch --show-current 2>$null
    Write-Host "  Branch: $(if ($currentBranch) { $currentBranch } else { 'Não inicializado' })"
    Write-Host ""
    
    Write-Host "📋 Arquivos importantes:"
    $importantFiles = @("index.html", "dashboard.html", "minhas-meditacoes.html", "supabase-config.js", "chatgpt-api.js")
    foreach ($file in $importantFiles) {
        if (Test-Path $file) {
            Write-Host "  ✅ $file" -ForegroundColor $Green
        } else {
            Write-Host "  ❌ $file" -ForegroundColor $Red
        }
    }
}

# Processar argumentos
if ($Help) {
    Show-Help
    exit 0
}

if ($Status) {
    Show-Status
    exit 0
}

# Executar deploy
Start-Deploy 