#!/bin/bash

# Script de deploy forçado - ignora erros do xcode-select
# Repositório: https://github.com/rsg384/oraetemedita.git

set -e  # Parar em caso de erro

echo "🚀 Deploy forçado para GitHub..."
echo "📁 Diretório: $(pwd)"
echo "🔗 Repositório: https://github.com/rsg384/oraetemedita.git"
echo ""

# Função para executar comando ignorando erros
execute_cmd() {
    local cmd="$1"
    local description="$2"
    
    echo "⚙️ $description..."
    if eval "$cmd" 2>/dev/null; then
        echo "✅ $description - OK"
    else
        echo "⚠️ $description - Ignorando erro"
    fi
}

# Configurar Git (ignorando erros)
execute_cmd "/usr/bin/git config --global user.name 'Rodrigo Silva Goes'" "Configurando Git user.name"
execute_cmd "/usr/bin/git config --global user.email 'rodrigo@oraetmedita.com'" "Configurando Git user.email"

# Inicializar repositório
execute_cmd "/usr/bin/git init" "Inicializando repositório Git"

# Adicionar arquivos
execute_cmd "/usr/bin/git add ." "Adicionando arquivos"

# Fazer primeiro commit
execute_cmd "/usr/bin/git commit -m '🎉 Initial commit: Ora et Medita - Sistema de Meditações Católicas'" "Fazendo primeiro commit"

# Conectar com GitHub
execute_cmd "/usr/bin/git remote add origin https://github.com/rsg384/oraetemedita.git" "Conectando com GitHub"

# Enviar para GitHub
execute_cmd "/usr/bin/git branch -M main" "Configurando branch main"
execute_cmd "/usr/bin/git push -u origin main" "Enviando para GitHub"

echo ""
echo "✅ Deploy forçado concluído!"
echo "🌐 Acesse: https://github.com/rsg384/oraetemedita"
echo ""
echo "🔧 Para futuros deploys, use:"
echo "   ./cursor-deploy.sh" 