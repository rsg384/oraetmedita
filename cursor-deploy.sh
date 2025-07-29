#!/bin/bash

# Script de Deploy Automático para Cursor
# Repositório: https://github.com/rsg384/oraetmedita.git
# Autor: Rodrigo Silva Goes

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Configurações
REPO_URL="https://github.com/rsg384/oraetmedita.git"
BRANCH="main"
COMMIT_MESSAGE=""

# Função para verificar se o Git está configurado
check_git_config() {
    log "🔍 Verificando configuração do Git..."
    
    if ! git config --global user.name > /dev/null 2>&1; then
        error "Git user.name não configurado"
        info "Configurando Git..."
        git config --global user.name "Rodrigo Silva Goes"
    fi
    
    if ! git config --global user.email > /dev/null 2>&1; then
        error "Git user.email não configurado"
        info "Configurando Git..."
        git config --global user.email "rodrigo@oraetmedita.com"
    fi
    
    log "✅ Git configurado corretamente"
}

# Função para verificar status do repositório
check_repo_status() {
    log "🔍 Verificando status do repositório..."
    
    if [ ! -d ".git" ]; then
        log "📦 Inicializando repositório Git..."
        git init
    fi
    
    # Verificar se o remote existe
    if ! git remote get-url origin > /dev/null 2>&1; then
        log "🔗 Adicionando remote origin..."
        git remote add origin "$REPO_URL"
    fi
    
    log "✅ Repositório configurado"
}

# Função para verificar mudanças
check_changes() {
    log "🔍 Verificando mudanças..."
    
    if git diff --quiet && git diff --cached --quiet; then
        warning "Nenhuma mudança detectada"
        return 1
    fi
    
    log "📝 Mudanças detectadas:"
    git status --short
    return 0
}

# Função para gerar mensagem de commit
generate_commit_message() {
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    local changes=$(git diff --name-only --cached | head -5 | tr '\n' ', ' | sed 's/,$//')
    
    if [ -z "$COMMIT_MESSAGE" ]; then
        COMMIT_MESSAGE="📝 [AUTO] Deploy automático - $timestamp

✨ Mudanças:
- $changes

🛠️ Tecnologias:
- HTML5, CSS3, JavaScript
- Supabase (PostgreSQL)
- OpenAI ChatGPT API

👨‍💻 Autor: Rodrigo Silva Goes"
    fi
}

# Função para fazer deploy
deploy() {
    log "🚀 Iniciando deploy automático..."
    
    # Verificar configurações
    check_git_config
    check_repo_status
    
    # Verificar mudanças
    if ! check_changes; then
        warning "Nenhuma mudança para fazer deploy"
        return 0
    fi
    
    # Adicionar todos os arquivos
    log "📝 Adicionando arquivos..."
    git add .
    
    # Gerar mensagem de commit
    generate_commit_message
    
    # Fazer commit
    log "💾 Fazendo commit..."
    git commit -m "$COMMIT_MESSAGE"
    
    # Fazer push
    log "📤 Enviando para GitHub..."
    git push origin "$BRANCH"
    
    log "✅ Deploy concluído com sucesso!"
    log "🌐 Repositório: $REPO_URL"
}

# Função para mostrar ajuda
show_help() {
    echo "🚀 Script de Deploy Automático - Ora et Medita"
    echo ""
    echo "Uso: $0 [OPÇÕES]"
    echo ""
    echo "Opções:"
    echo "  -m, --message MENSAGEM  Mensagem de commit personalizada"
    echo "  -h, --help              Mostrar esta ajuda"
    echo "  -s, --status            Verificar status do repositório"
    echo "  -c, --check             Verificar configurações"
    echo ""
    echo "Exemplos:"
    echo "  $0                      Deploy automático"
    echo "  $0 -m 'Nova funcionalidade'  Deploy com mensagem personalizada"
    echo "  $0 -s                   Verificar status"
    echo ""
    echo "Repositório: $REPO_URL"
}

# Função para verificar status
show_status() {
    log "📊 Status do repositório:"
    echo ""
    echo "📁 Diretório: $(pwd)"
    echo "🔗 Remote: $(git remote get-url origin 2>/dev/null || echo 'Não configurado')"
    echo "🌿 Branch atual: $(git branch --show-current 2>/dev/null || echo 'Não inicializado')"
    echo ""
    
    if [ -d ".git" ]; then
        echo "📝 Últimos commits:"
        git log --oneline -5 2>/dev/null || echo "Nenhum commit encontrado"
        echo ""
        
        echo "📋 Status dos arquivos:"
        git status --short 2>/dev/null || echo "Repositório não inicializado"
    else
        echo "❌ Repositório Git não inicializado"
    fi
}

# Função para verificar configurações
check_config() {
    log "🔍 Verificando configurações..."
    
    echo "📋 Configurações do Git:"
    echo "  Nome: $(git config --global user.name 2>/dev/null || echo 'Não configurado')"
    echo "  Email: $(git config --global user.email 2>/dev/null || echo 'Não configurado')"
    echo ""
    
    echo "📋 Configurações do repositório:"
    echo "  Remote: $(git remote get-url origin 2>/dev/null || echo 'Não configurado')"
    echo "  Branch: $(git branch --show-current 2>/dev/null || echo 'Não inicializado')"
    echo ""
    
    echo "📋 Arquivos importantes:"
    for file in index.html dashboard.html minhas-meditacoes.html supabase-config.js chatgpt-api.js; do
        if [ -f "$file" ]; then
            echo "  ✅ $file"
        else
            echo "  ❌ $file"
        fi
    done
}

# Processar argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--message)
            COMMIT_MESSAGE="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        -s|--status)
            show_status
            exit 0
            ;;
        -c|--check)
            check_config
            exit 0
            ;;
        *)
            error "Opção desconhecida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Executar deploy
deploy 