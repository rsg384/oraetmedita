# Script de Deploy Seguro para GitHub
# ⚠️ IMPORTANTE: Este script NÃO envia arquivos com chaves sensíveis

param(
    [string]$CommitMessage = "",
    [switch]$Status,
    [switch]$Help
)

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Cyan = "Cyan"

function Write-Log {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Show-Help {
    Write-Log "📚 Script de Deploy Seguro - Ora et Medita" $Cyan
    Write-Log ""
    Write-Log "Uso:" $Yellow
    Write-Log "  .\deploy-seguro.ps1 [opções]" $Yellow
    Write-Log ""
    Write-Log "Opções:" $Yellow
    Write-Log "  -CommitMessage 'mensagem'  - Mensagem do commit" $Yellow
    Write-Log "  -Status                    - Mostrar status do repositório" $Yellow
    Write-Log "  -Help                      - Mostrar esta ajuda" $Yellow
    Write-Log ""
    Write-Log "Exemplos:" $Yellow
    Write-Log "  .\deploy-seguro.ps1 -CommitMessage 'Atualização da API'" $Yellow
    Write-Log "  .\deploy-seguro.ps1 -Status" $Yellow
}

function Test-GitConfig {
    Write-Log "🔧 Verificando configuração do Git..." $Cyan
    
    try {
        $userName = & "C:\Program Files\Git\bin\git.exe" config --global user.name
        $userEmail = & "C:\Program Files\Git\bin\git.exe" config --global user.email
        
        if ($userName -and $userEmail) {
            Write-Log "✅ Git configurado: $userName <$userEmail>" $Green
            return $true
        } else {
            Write-Log "❌ Git não configurado" $Red
            Write-Log "💡 Configure com:" $Yellow
            Write-Log "   git config --global user.name 'Seu Nome'" $Yellow
            Write-Log "   git config --global user.email 'seu@email.com'" $Yellow
            return $false
        }
    } catch {
        Write-Log "❌ Erro ao verificar Git: $_" $Red
        return $false
    }
}

function Test-RepoStatus {
    Write-Log "📋 Verificando status do repositório..." $Cyan
    
    try {
        $status = & "C:\Program Files\Git\bin\git.exe" status --porcelain
        if ($status) {
            Write-Log "📝 Mudanças detectadas:" $Yellow
            $status | ForEach-Object { Write-Log "   $_" $Yellow }
            return $true
        } else {
            Write-Log "✅ Nenhuma mudança pendente" $Green
            return $false
        }
    } catch {
        Write-Log "❌ Erro ao verificar status: $_" $Red
        return $false
    }
}

function Start-SecureDeploy {
    Write-Log "🚀 Iniciando deploy seguro..." $Cyan
    
    # Verificar se api-config-local.js existe e tem chave real
    if (Test-Path "api-config-local.js") {
        $content = Get-Content "api-config-local.js" -Raw
        if ($content -match "sk-proj-[A-Za-z0-9_-]+") {
            Write-Log "⚠️  ATENÇÃO: Arquivo api-config-local.js contém chave real!" $Red
            Write-Log "🔒 Este arquivo será IGNORADO pelo .gitignore" $Yellow
            Write-Log "💡 A chave será salva apenas localmente" $Yellow
        }
    }
    
    try {
        # Adicionar arquivos (exceto os protegidos pelo .gitignore)
        Write-Log "📦 Adicionando arquivos..." $Cyan
        & "C:\Program Files\Git\bin\git.exe" add .
        
        # Verificar o que será commitado
        $staged = & "C:\Program Files\Git\bin\git.exe" diff --cached --name-only
        Write-Log "📋 Arquivos que serão commitados:" $Yellow
        $staged | ForEach-Object { Write-Log "   $_" $Yellow }
        
        # Verificar se api-config-local.js está sendo commitado
        if ($staged -contains "api-config-local.js") {
            Write-Log "❌ ERRO: api-config-local.js está sendo commitado!" $Red
            Write-Log "🔒 Removendo do commit por segurança..." $Yellow
            & "C:\Program Files\Git\bin\git.exe" reset HEAD api-config-local.js
            & "C:\Program Files\Git\bin\git.exe" checkout -- api-config-local.js
        }
        
        # Fazer commit
        $commitMsg = if ($CommitMessage) { $CommitMessage } else { "📝 [AUTO] Deploy seguro - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" }
        Write-Log "💾 Fazendo commit: $commitMsg" $Cyan
        & "C:\Program Files\Git\bin\git.exe" commit -m $commitMsg
        
        # Push para GitHub
        Write-Log "🚀 Enviando para GitHub..." $Cyan
        & "C:\Program Files\Git\bin\git.exe" push origin main
        
        Write-Log "✅ Deploy seguro concluído!" $Green
        Write-Log "🔒 Chave da API protegida e não enviada" $Green
        
    } catch {
        Write-Log "❌ Erro no deploy: $_" $Red
        return $false
    }
    
    return $true
}

# Execução principal
if ($Help) {
    Show-Help
    exit
}

if ($Status) {
    Test-GitConfig
    Test-RepoStatus
    exit
}

# Deploy principal
Write-Log "🔒 DEPLOY SEGURO - Ora et Medita" $Cyan
Write-Log "⚠️  Arquivos sensíveis serão protegidos" $Yellow

if (-not (Test-GitConfig)) {
    Write-Log "❌ Git não configurado. Execute primeiro:" $Red
    Write-Log "   git config --global user.name 'Seu Nome'" $Yellow
    Write-Log "   git config --global user.email 'seu@email.com'" $Yellow
    exit 1
}

if (-not (Test-RepoStatus)) {
    Write-Log "ℹ️  Nenhuma mudança para fazer deploy" $Yellow
    exit 0
}

Start-SecureDeploy 