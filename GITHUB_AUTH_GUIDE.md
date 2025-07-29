# 🔐 Guia de Autenticação GitHub

## 🚀 Push do Projeto Ora et Medita

### 📋 Repositório
- **URL**: https://github.com/rsg384/oraetmedita.git
- **Username**: rsg384

### 🔑 Método 1: Token de Acesso Pessoal (Recomendado)

#### 1. Criar Token no GitHub
1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token (classic)"
3. Selecione as permissões:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `workflow` (Update GitHub Action workflows)
4. Clique em "Generate token"
5. **Copie o token** (você só verá uma vez!)

#### 2. Usar o Token
```bash
# Executar o script
./push-to-github.sh

# Quando solicitado:
Username: rsg384
Password: [COLE SEU TOKEN AQUI]
```

### 🔑 Método 2: SSH Key (Alternativo)

#### 1. Gerar SSH Key
```bash
ssh-keygen -t ed25519 -C "rodrigo@oraetmedita.com"
```

#### 2. Adicionar ao GitHub
1. Copie a chave pública:
```bash
cat ~/.ssh/id_ed25519.pub
```

2. Vá para: https://github.com/settings/keys
3. Clique em "New SSH key"
4. Cole a chave e salve

#### 3. Usar SSH
```bash
git remote set-url origin git@github.com:rsg384/oraetmedita.git
git push -u origin main
```

### 🔑 Método 3: GitHub CLI (Mais Fácil)

#### 1. Instalar GitHub CLI
```bash
# macOS
brew install gh

# Ou baixar de: https://cli.github.com/
```

#### 2. Fazer Login
```bash
gh auth login
```

#### 3. Fazer Push
```bash
gh repo create rsg384/oraetmedita --public --source=. --remote=origin --push
```

### 🚀 Scripts Disponíveis

#### 1. Push Simples
```bash
./push-to-github.sh
```

#### 2. Deploy Automático
```bash
./cursor-deploy-automatic.sh deploy
```

#### 3. Status do Repositório
```bash
./cursor-deploy-automatic.sh status
```

### 📊 Status Atual
- ✅ Git configurado
- ✅ Repositório inicializado
- ✅ Commits feitos
- ⏳ Aguardando autenticação

### 🔧 Configurações Atuais
```bash
# Verificar configuração
git config --list | grep user

# Verificar remote
git remote -v

# Verificar status
git status
```

### 🆘 Solução de Problemas

#### Erro: "Authentication failed"
- Verifique se o token está correto
- Certifique-se de que o token tem permissões `repo`

#### Erro: "Repository not found"
- Verifique se o repositório existe no GitHub
- Confirme se você tem acesso ao repositório

#### Erro: "Permission denied"
- Use um token de acesso pessoal
- Ou configure SSH keys

### 📞 Suporte
- **GitHub**: https://github.com/rsg384/oraetmedita
- **Email**: rodrigo@oraetmedita.com
- **Documentação**: DEPLOY_AUTOMATICO.md

---

**Próximo passo**: Escolha um método de autenticação e execute o push! 🚀 