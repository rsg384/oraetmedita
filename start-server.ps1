# Script para iniciar servidor na porta 3173
# Projeto: Ora et Medita
# Autor: Rodrigo Silva Goes

param(
    [switch]$Help,
    [switch]$CheckPort
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
$Port = 3173
$ProjectName = "Ora et Medita"

# Função para verificar se a porta está em uso
function Test-Port {
    Write-Log "🔍 Verificando porta $Port..." $Green
    
    try {
        $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet
        if ($connection) {
            Write-Warning "Porta $Port já está em uso"
            return $true
        } else {
            Write-Log "✅ Porta $Port está livre" $Green
            return $false
        }
    } catch {
        Write-Log "✅ Porta $Port está livre" $Green
        return $false
    }
}

# Função para verificar se Python está instalado
function Test-Python {
    Write-Log "🔍 Verificando Python..." $Green
    
    try {
        $pythonVersion = python --version 2>$null
        if ($pythonVersion) {
            Write-Log "✅ Python encontrado: $pythonVersion" $Green
            return $true
        } else {
            Write-Warning "Python não encontrado"
            return $false
        }
    } catch {
        Write-Warning "Python não encontrado"
        return $false
    }
}

# Função para verificar se Node.js está instalado
function Test-Node {
    Write-Log "🔍 Verificando Node.js..." $Green
    
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Log "✅ Node.js encontrado: $nodeVersion" $Green
            return $true
        } else {
            Write-Warning "Node.js não encontrado"
            return $false
        }
    } catch {
        Write-Warning "Node.js não encontrado"
        return $false
    }
}

# Função para iniciar servidor Python
function Start-PythonServer {
    Write-Log "🚀 Iniciando servidor Python na porta $Port..." $Green
    
    if (Test-Port) {
        Write-Error "Porta $Port já está em uso. Encerre o processo ou use outra porta."
        return $false
    }
    
    Write-Log "📁 Diretório: $(Get-Location)" $Green
    Write-Log "🌐 URL: http://localhost:$Port" $Green
    Write-Log "🛑 Para parar o servidor: Ctrl+C" $Yellow
    
    try {
        python -m http.server $Port
    } catch {
        Write-Error "Erro ao iniciar servidor Python: $_"
        return $false
    }
}

# Função para iniciar servidor Node.js
function Start-NodeServer {
    Write-Log "🚀 Iniciando servidor Node.js na porta $Port..." $Green
    
    if (Test-Port) {
        Write-Error "Porta $Port já está em uso. Encerre o processo ou use outra porta."
        return $false
    }
    
    Write-Log "📁 Diretório: $(Get-Location)" $Green
    Write-Log "🌐 URL: http://localhost:$Port" $Green
    Write-Log "🛑 Para parar o servidor: Ctrl+C" $Yellow
    
    try {
        npx http-server -p $Port
    } catch {
        Write-Error "Erro ao iniciar servidor Node.js: $_"
        return $false
    }
}

# Função para mostrar ajuda
function Show-Help {
    Write-Host "🚀 Script de Inicialização do Servidor - $ProjectName" -ForegroundColor $Green
    Write-Host ""
    Write-Host "Uso: .\start-server.ps1 [OPÇÕES]"
    Write-Host ""
    Write-Host "Opções:"
    Write-Host "  -CheckPort              Verificar se a porta 3173 está em uso"
    Write-Host "  -Help                   Mostrar esta ajuda"
    Write-Host ""
    Write-Host "Funcionalidades:"
    Write-Host "  • Verifica se Python ou Node.js estão instalados"
    Write-Host "  • Verifica se a porta 3173 está livre"
    Write-Host "  • Inicia servidor HTTP na porta 3173"
    Write-Host "  • Abre o projeto no navegador"
    Write-Host ""
    Write-Host "URL: http://localhost:3173"
    Write-Host ""
    Write-Host "Exemplos:"
    Write-Host "  .\start-server.ps1                    Iniciar servidor"
    Write-Host "  .\start-server.ps1 -CheckPort         Verificar porta"
    Write-Host "  .\start-server.ps1 -Help              Mostrar ajuda"
}

# Função para verificar porta
function Show-PortStatus {
    Write-Log "📊 Status da porta $Port:" $Green
    Write-Host ""
    
    if (Test-Port) {
        Write-Host "❌ Porta $Port está em uso" -ForegroundColor $Red
        Write-Host ""
        Write-Host "💡 Para liberar a porta:"
        Write-Host "  1. Abra o Gerenciador de Tarefas"
        Write-Host "  2. Procure por processos usando a porta $Port"
        Write-Host "  3. Encerre o processo"
        Write-Host ""
        Write-Host "💡 Ou use outra porta modificando o script"
    } else {
        Write-Host "✅ Porta $Port está livre" -ForegroundColor $Green
        Write-Host ""
        Write-Host "🚀 Pronto para iniciar o servidor!"
    }
}

# Função principal
function Start-Server {
    Write-Log "🚀 Iniciando $ProjectName na porta $Port..." $Green
    
    # Verificar se a porta está livre
    if (Test-Port) {
        Write-Error "Porta $Port já está em uso"
        Write-Info "Use: .\start-server.ps1 -CheckPort para verificar"
        return
    }
    
    # Verificar se Python está disponível
    if (Test-Python) {
        Start-PythonServer
        return
    }
    
    # Verificar se Node.js está disponível
    if (Test-Node) {
        Start-NodeServer
        return
    }
    
    # Nenhum servidor disponível
    Write-Error "Nenhum servidor HTTP encontrado"
    Write-Info "Instale Python ou Node.js para continuar"
    Write-Info ""
    Write-Info "Python: https://www.python.org/downloads/"
    Write-Info "Node.js: https://nodejs.org/"
}

# Processar argumentos
if ($Help) {
    Show-Help
    exit 0
}

if ($CheckPort) {
    Show-PortStatus
    exit 0
}

# Executar servidor
Start-Server 