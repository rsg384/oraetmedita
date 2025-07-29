#!/bin/bash

# 🚀 Script de Push para GitHub
# Projeto: Ora et Medita

echo "🚀 Iniciando push para GitHub..."
echo "📋 Repositório: https://github.com/rsg384/oraetmedita.git"
echo ""

# Verificar se há mudanças
if git diff-index --quiet HEAD --; then
    echo "✅ Nenhuma mudança para fazer push"
    echo "📊 Status atual:"
    git status --short
else
    echo "📁 Adicionando arquivos..."
    git add .
    
    echo "💾 Fazendo commit..."
    git commit -m "📝 [AUTO] Deploy automático - $(date)"
    
    echo "📤 Fazendo push..."
    echo ""
    echo "🔐 Quando solicitado:"
    echo "   Username: rsg384"
    echo "   Password: Use seu token de acesso pessoal"
    echo ""
    
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Push concluído com sucesso!"
        echo "🌐 Repositório: https://github.com/rsg384/oraetmedita.git"
    else
        echo ""
        echo "❌ Erro no push. Verifique suas credenciais."
        echo "💡 Dica: Use um token de acesso pessoal como senha"
    fi
fi 