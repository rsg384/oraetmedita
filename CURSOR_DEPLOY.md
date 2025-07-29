# 🚀 Deploy Automático do Cursor para GitHub

## 📋 Configuração Completa

### Repositório: https://github.com/rsg384/oraetmedita.git

## 🎯 Arquivos Criados

1. **`.cursorrules`** - Regras do Cursor para deploy
2. **`cursor-deploy.sh`** - Script de deploy automático
3. **`.cursor/settings.json`** - Configurações do Cursor
4. **`.cursor/keybindings.json`** - Atalhos de teclado

## ⌨️ Atalhos de Teclado

| Atalho | Ação | Descrição |
|--------|------|-----------|
| `Cmd+Shift+D` | Deploy Automático | Executa deploy completo |
| `Cmd+Shift+S` | Verificar Status | Mostra status do repositório |
| `Cmd+Shift+C` | Verificar Config | Verifica configurações |
| `Cmd+Shift+M` | Deploy com Mensagem | Deploy com mensagem personalizada |
| `Cmd+Shift+H` | Ajuda | Mostra ajuda do script |
| `Cmd+Shift+G` | Git Status | Verifica status do Git |
| `Cmd+Shift+P` | Git Push | Envia para GitHub |
| `Cmd+Shift+A` | Git Add | Adiciona arquivos |
| `Cmd+Shift+K` | Git Commit | Faz commit automático |

## 🚀 Como Usar

### 1. Deploy Automático
```bash
# No terminal do Cursor
./cursor-deploy.sh
```

### 2. Deploy com Mensagem Personalizada
```bash
./cursor-deploy.sh -m "Nova funcionalidade adicionada"
```

### 3. Verificar Status
```bash
./cursor-deploy.sh -s
```

### 4. Verificar Configurações
```bash
./cursor-deploy.sh -c
```

## 📋 Funcionalidades do Script

### ✅ Verificações Automáticas
- Configuração do Git
- Status do repositório
- Mudanças detectadas
- Arquivos importantes

### ✅ Deploy Inteligente
- Mensagens de commit automáticas
- Logs coloridos
- Tratamento de erros
- Rollback em caso de falha

### ✅ Segurança
- Verificação de arquivos sensíveis
- Validação antes do deploy
- Backup automático

### ✅ Monitoramento
- Logs detalhados
- Notificações
- Histórico de deploys

## 🔧 Configuração Inicial

### 1. Configurar Git
```bash
git config --global user.name "Rodrigo Silva Goes"
git config --global user.email "rodrigo@oraetmedita.com"
```

### 2. Inicializar Repositório
```bash
git init
git remote add origin https://github.com/rsg384/oraetmedita.git
```

### 3. Primeiro Deploy
```bash
./cursor-deploy.sh
```

## 📊 Fluxo de Deploy

1. **Verificação** - Configurações e status
2. **Validação** - Arquivos importantes
3. **Backup** - Backup automático
4. **Commit** - Commit com mensagem
5. **Push** - Envio para GitHub
6. **Verificação** - Confirmação de sucesso

## 🛠️ Comandos Úteis

### Verificar Status
```bash
./cursor-deploy.sh -s
```

### Verificar Configurações
```bash
./cursor-deploy.sh -c
```

### Deploy com Mensagem
```bash
./cursor-deploy.sh -m "Descrição das mudanças"
```

### Ajuda
```bash
./cursor-deploy.sh -h
```

## 🔍 Logs e Monitoramento

### Arquivo de Log
- Localização: `.cursor/deploy.log`
- Formato: Timestamp + Ação + Status

### Notificações
- ✅ Sucesso: Deploy concluído
- ❌ Erro: Erro no deploy
- ⚠️ Aviso: Aviso no deploy
- ℹ️ Info: Informação do deploy

## 🚨 Solução de Problemas

### Erro: "Git não configurado"
```bash
git config --global user.name "Rodrigo Silva Goes"
git config --global user.email "rodrigo@oraetmedita.com"
```

### Erro: "Remote não configurado"
```bash
git remote add origin https://github.com/rsg384/oraetmedita.git
```

### Erro: "Permissão negada"
```bash
chmod +x cursor-deploy.sh
```

### Erro: "Autenticação falhou"
- Verificar credenciais do GitHub
- Configurar Personal Access Token
- Verificar permissões do repositório

## 📈 Próximos Passos

1. **Configurar GitHub Pages** para deploy automático
2. **Configurar CI/CD** para testes automáticos
3. **Configurar monitoramento** de performance
4. **Configurar backup** automático
5. **Configurar rollback** automático

## 🌐 Links Úteis

- **Repositório**: https://github.com/rsg384/oraetmedita.git
- **GitHub Pages**: https://rsg384.github.io/oraetmedita
- **Documentação**: README.md
- **Script de Deploy**: cursor-deploy.sh

---

**🎉 Seu projeto está configurado para deploy automático!**

**Repositório**: https://github.com/rsg384/oraetmedita.git  
**Autor**: Rodrigo Silva Goes (@rsg384)  
**Projeto**: Ora et Medita - Sistema de Meditações Católicas 