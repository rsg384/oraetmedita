# 📋 Pasta Rules - Regras de Deploy

Esta pasta contém todas as regras, configurações e scripts relacionados ao deploy do projeto **Ora et Medita** no GitHub.

## 📁 **Estrutura da Pasta**

```
rules/
├── README.md                    # Este arquivo
├── github-deploy-rules.md       # Regras completas de deploy
├── deploy-config.json           # Configuração JSON do deploy
└── check-deploy-rules.ps1      # Script de verificação
```

## 🚀 **Como Usar**

### **1. Verificar Regras de Deploy**
```powershell
# Executar verificação completa
powershell -ExecutionPolicy Bypass -File "rules/check-deploy-rules.ps1"
```

### **2. Fazer Deploy**
```powershell
# Deploy automático
powershell -ExecutionPolicy Bypass -File "deploy-to-github.ps1"

# Deploy manual
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "🎉 Deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
& "C:\Program Files\Git\bin\git.exe" push origin main
```

### **3. Consultar Regras**
- **Regras completas:** `github-deploy-rules.md`
- **Configuração:** `deploy-config.json`
- **Checklist:** Ver seção "Checklist de Deploy" nas regras

## 🔒 **Segurança**

### **Arquivos Sensíveis**
- ❌ `api-config-local.js` - Contém placeholders
- ❌ `GUIA_CONFIGURACAO_API.md` - Contém exemplos
- ✅ `api-config.js` - Configuração global

### **Verificação de Segurança**
O script `check-deploy-rules.ps1` verifica automaticamente:
- ✅ Presença de chaves de API
- ✅ Arquivos obrigatórios
- ✅ Scripts de deploy
- ✅ Configuração do Git

## 📊 **Checklist Rápido**

### **Antes do Deploy**
- [ ] Executar `check-deploy-rules.ps1`
- [ ] Verificar se não há chaves de API
- [ ] Testar localmente (http://localhost:3172)
- [ ] Confirmar mensagem de commit

### **Durante o Deploy**
- [ ] Executar script de deploy
- [ ] Verificar se não há erros
- [ ] Confirmar push para GitHub

### **Após o Deploy**
- [ ] Verificar se o código está no GitHub
- [ ] Testar funcionalidades principais
- [ ] Verificar se as chaves estão seguras

## 🚨 **Problemas Comuns**

### **Erro: Push Protection**
```
remote: error: GH013: Repository rule violations found
```
**Solução:** Remover chaves de API e fazer novo commit

### **Erro: Git não encontrado**
```
git : O termo 'git' não é reconhecido
```
**Solução:** Usar caminho completo: `& "C:\Program Files\Git\bin\git.exe"`

### **Erro: Remote já existe**
```
error: remote origin already exists.
```
**Solução:** Usar `git remote set-url origin` ou continuar

## 📈 **Métricas**

### **Frequência de Deploy**
- **Desenvolvimento:** Diário
- **Correções:** Imediato
- **Funcionalidades:** Semanal

### **Tamanho dos Commits**
- **Pequeno:** < 10 arquivos
- **Médio:** 10-50 arquivos
- **Grande:** > 50 arquivos (evitar)

## 🔧 **Comandos Úteis**

```powershell
# Verificar status
& "C:\Program Files\Git\bin\git.exe" status

# Ver logs
& "C:\Program Files\Git\bin\git.exe" log --oneline -5

# Verificar regras
powershell -ExecutionPolicy Bypass -File "rules/check-deploy-rules.ps1"

# Fazer deploy
powershell -ExecutionPolicy Bypass -File "deploy-to-github.ps1"
```

## 📞 **Suporte**

### **Em caso de problemas:**
1. Executar `check-deploy-rules.ps1`
2. Verificar logs do PowerShell
3. Consultar `github-deploy-rules.md`
4. Verificar configuração do Git

### **Contatos:**
- **Desenvolvedor:** Rodrigo Silva Goes
- **Email:** rodrigo@oraetmedita.com
- **GitHub:** @rsg384
- **Repositório:** https://github.com/rsg384/oraetmedita

## 📝 **Notas**

- Esta pasta é essencial para manter a qualidade e segurança do deploy
- Sempre execute a verificação antes de fazer deploy
- Mantenha as regras atualizadas conforme necessário
- Documente qualquer mudança nas regras 