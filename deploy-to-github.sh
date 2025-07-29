#!/bin/bash

# Script para enviar o projeto Ora et Medita para o GitHub
# Autor: Rodrigo Silva Goes
# Data: 2025-07-29

echo "🚀 Iniciando deploy para GitHub..."
echo "📁 Diretório atual: $(pwd)"

# Verificar se o Git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git não está instalado. Por favor, instale o Git primeiro."
    echo "💡 Você pode instalar via Homebrew: brew install git"
    exit 1
fi

# Verificar se já existe um repositório Git
if [ -d ".git" ]; then
    echo "✅ Repositório Git já existe"
else
    echo "📦 Inicializando repositório Git..."
    git init
fi

# Adicionar todos os arquivos
echo "📝 Adicionando arquivos ao Git..."
git add .

# Fazer commit inicial
echo "💾 Fazendo commit inicial..."
git commit -m "🎉 Initial commit: Ora et Medita - Sistema de Meditações Católicas

✨ Funcionalidades implementadas:
- Geração de meditações via ChatGPT
- Sincronização com Supabase
- Interface responsiva
- Sistema de categorias
- Painel administrativo
- Progresso espiritual
- Agendamentos

🛠️ Tecnologias:
- HTML5, CSS3, JavaScript
- Supabase (PostgreSQL)
- OpenAI ChatGPT API
- LocalStorage + Supabase

📊 Banco de dados:
- users, categories, meditations, personalized_meditations

🎨 Interface:
- Modo escuro/claro
- Design responsivo
- Animações suaves

👨‍💻 Autor: Rodrigo Silva Goes (@rsg384)"

# Configurar repositório remoto
echo "🔗 Configurando repositório remoto..."
git remote add origin https://github.com/rsg384/oraetmedita.git

# Verificar se o remote foi adicionado corretamente
if git remote -v | grep -q "origin"; then
    echo "✅ Repositório remoto configurado"
else
    echo "❌ Erro ao configurar repositório remoto"
    exit 1
fi

# Fazer push para o GitHub
echo "📤 Enviando para o GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "🎉 Deploy realizado com sucesso!"
    echo "🌐 Acesse: https://github.com/rsg384/oraetmedita"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Configure o GitHub Pages se desejar"
    echo "2. Adicione colaboradores se necessário"
    echo "3. Configure as chaves de API no ambiente de produção"
    echo "4. Configure o Supabase para produção"
else
    echo "❌ Erro ao fazer push para o GitHub"
    echo "💡 Verifique se você tem permissão para o repositório"
    echo "💡 Verifique se você está logado no Git: git config --global user.name 'Seu Nome'"
    echo "💡 Verifique se você está logado no Git: git config --global user.email 'seu@email.com'"
fi

echo ""
echo "🔧 Comandos úteis para o futuro:"
echo "git add .                    # Adicionar mudanças"
echo "git commit -m 'mensagem'     # Fazer commit"
echo "git push                     # Enviar para GitHub"
echo "git pull                     # Baixar mudanças"
echo "git status                   # Ver status"
echo "git log                      # Ver histórico" 