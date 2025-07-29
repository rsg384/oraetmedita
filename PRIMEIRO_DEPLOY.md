# 🚀 Primeiro Deploy para GitHub

## ✅ Repositório Criado
**URL**: https://github.com/rsg384/oraetemedita.git

## 📋 Passos para Conectar

### Opção 1: Script Automático (Recomendado)

```bash
# Executar o script de configuração
./setup-github.sh
```

### Opção 2: Comandos Manuais

```bash
# 1. Configurar Git
git config --global user.name "Rodrigo Silva Goes"
git config --global user.email "seu@email.com"

# 2. Inicializar repositório
git init

# 3. Adicionar arquivos
git add .

# 4. Fazer primeiro commit
git commit -m "🎉 Initial commit: Ora et Medita"

# 5. Conectar com GitHub
git remote add origin https://github.com/rsg384/oraetemedita.git

# 6. Enviar para GitHub
git branch -M main
git push -u origin main
```

## 🔍 Verificar se Funcionou

Após executar os comandos, acesse:
https://github.com/rsg384/oraetemedita

Você deve ver todos os arquivos do projeto lá.

## 🚀 Deploy Futuro

Depois que estiver conectado, use:

```bash
./cursor-deploy.sh
```

## ❓ Se Der Erro

### Erro de Autenticação:
1. Vá para GitHub.com
2. Settings → Developer settings → Personal access tokens
3. Generate new token
4. Use o token como senha

### Erro de Permissão:
```bash
chmod +x setup-github.sh
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o repositório existe
2. Verifique suas credenciais do GitHub
3. Execute os comandos um por vez

---

**🎯 Execute o script e seu projeto estará no GitHub!** 