#!/bin/bash

# Script para configurar repositório GitHub
# Repositório: https://github.com/rsg384/oraetemedita.git

echo "🚀 Configurando repositório GitHub..."
echo "📁 Diretório: $(pwd)"
echo "🔗 Repositório: https://github.com/rsg384/oraetemedita.git"
echo ""

# Configurar Git
echo "⚙️ Configurando Git..."
git config --global user.name "Rodrigo Silva Goes"
git config --global user.email "rodrigo@oraetmedita.com"

# Inicializar repositório
echo "📦 Inicializando repositório Git..."
git init

# Adicionar arquivos
echo "📝 Adicionando arquivos..."
git add .

# Fazer primeiro commit
echo "💾 Fazendo primeiro commit..."
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

# Conectar com GitHub
echo "🔗 Conectando com GitHub..."
git remote add origin https://github.com/rsg384/oraetemedita.git

# Enviar para GitHub
echo "📤 Enviando para GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Repositório configurado com sucesso!"
echo "🌐 Acesse: https://github.com/rsg384/oraetemedita"
echo ""
echo "🔧 Para futuros deploys, use:"
echo "   ./cursor-deploy.sh"
echo ""
echo "📋 Comandos úteis:"
echo "   git status                    # Ver status"
echo "   git add .                     # Adicionar mudanças"
echo "   git commit -m 'mensagem'      # Fazer commit"
echo "   git push                      # Enviar para GitHub" 