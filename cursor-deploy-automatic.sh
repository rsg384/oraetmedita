#!/bin/bash

# 🚀 Script de Deploy Automático para GitHub
# Projeto: Ora et Medita
# Repositório: https://github.com/rsg384/oraetmedita.git

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERRO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[AVISO]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Configurações
REPO_URL="https://github.com/rsg384/oraetmedita.git"
BRANCH="main"
AUTHOR_NAME="Rodrigo Silva Goes"
AUTHOR_EMAIL="rodrigo@oraetmedita.com"

# Função para verificar se o Git está configurado
check_git_config() {
    log "🔧 Verificando configuração do Git..."
    
    if ! git config --global user.name > /dev/null 2>&1; then
        log "📝 Configurando nome do usuário..."
        git config --global user.name "$AUTHOR_NAME"
    fi
    
    if ! git config --global user.email > /dev/null 2>&1; then
        log "📧 Configurando email do usuário..."
        git config --global user.email "$AUTHOR_EMAIL"
    fi
    
    log "✅ Configuração do Git verificada"
}

# Função para verificar status do repositório
check_repo_status() {
    log "📋 Verificando status do repositório..."
    
    if [ ! -d ".git" ]; then
        error "❌ Repositório Git não inicializado"
        log "🔧 Inicializando repositório..."
        git init
    fi
    
    # Verificar se o remote origin existe
    if ! git remote get-url origin > /dev/null 2>&1; then
        log "🔗 Adicionando remote origin..."
        git remote add origin "$REPO_URL"
    fi
    
    log "✅ Status do repositório verificado"
}

# Função para verificar mudanças
check_changes() {
    log "📊 Verificando mudanças..."
    
    if git diff-index --quiet HEAD --; then
        warning "⚠️ Nenhuma mudança detectada"
        return 1
    else
        log "✅ Mudanças detectadas"
        return 0
    fi
}

# Função para gerar mensagem de commit
generate_commit_message() {
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')
    local files_changed=$(git diff --name-only --cached | wc -l)
    
    echo "📝 [AUTO] Deploy automático - $timestamp

✨ Mudanças:
- $files_changed arquivo(s) modificado(s)
- Deploy automático via Cursor IDE

🛠️ Tecnologias:
- HTML5, CSS3, JavaScript
- Supabase (PostgreSQL)
- ChatGPT API

👨‍💻 Autor: $AUTHOR_NAME"
}

# Função para fazer deploy
deploy() {
    log "🚀 Iniciando deploy automático..."
    
    # Verificar configurações
    check_git_config
    check_repo_status
    
    # Verificar se há mudanças
    if ! check_changes; then
        warning "⚠️ Nenhuma mudança para fazer deploy"
        return 0
    fi
    
    # Adicionar todos os arquivos
    log "📁 Adicionando arquivos..."
    git add .
    
    # Gerar mensagem de commit
    local commit_message=$(generate_commit_message)
    
    # Fazer commit
    log "💾 Fazendo commit..."
    echo "$commit_message" | git commit -F -
    
    # Fazer push
    log "📤 Enviando para GitHub..."
    git push origin "$BRANCH"
    
    log "✅ Deploy concluído com sucesso!"
    log "🌐 Repositório: $REPO_URL"
}

# Função para mostrar status
show_status() {
    log "📊 Status do repositório:"
    echo ""
    git status --short
    echo ""
    log "📋 Últimos commits:"
    git log --oneline -5
}

# Função para mostrar ajuda
show_help() {
    echo "🚀 Script de Deploy Automático - Ora et Medita"
    echo ""
    echo "Uso: $0 [opção]"
    echo ""
    echo "Opções:"
    echo "  deploy     - Fazer deploy automático"
    echo "  status     - Mostrar status do repositório"
    echo "  config     - Verificar configuração"
    echo "  help       - Mostrar esta ajuda"
    echo ""
    echo "Exemplos:"
    echo "  $0 deploy    # Fazer deploy"
    echo "  $0 status    # Ver status"
    echo ""
    echo "Repositório: $REPO_URL"
    echo "Autor: $AUTHOR_NAME"
}

# Função principal
main() {
    case "${1:-deploy}" in
        "deploy")
            deploy
            ;;
        "status")
            show_status
            ;;
        "config")
            check_git_config
            check_repo_status
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            error "❌ Opção inválida: $1"
            show_help
            exit 1
            ;;
    esac
}

# Executar função principal
main "$@" 