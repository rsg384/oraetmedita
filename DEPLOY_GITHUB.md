# 🚀 Deploy para GitHub - Ora et Medita

## 📋 Status Atual

✅ **Git configurado** - Versão 2.50.1.windows.1  
✅ **Repositório conectado** - https://github.com/rsg384/oraetmedita.git  
✅ **Scripts de deploy criados** - Automatização completa  

## 🔧 Scripts Disponíveis

### 1. **deploy-automatico.ps1** - Deploy Completo
```powershell
# Deploy com mensagem personalizada
.\deploy-automatico.ps1 -CommitMessage "Minha mensagem" -TipoCommit "FEAT"

# Deploy automático
.\deploy-automatico.ps1
```

### 2. **deploy-rapido.ps1** - Deploy Rápido
```powershell
# Deploy rápido para mudanças simples
.\deploy-rapido.ps1
```

## 📝 Tipos de Commit

- `📝 [FEAT]` - Nova funcionalidade
- `🔧 [FIX]` - Correção de bug
- `📚 [DOCS]` - Documentação
- `🎨 [STYLE]` - Melhorias de interface
- `⚡ [PERF]` - Melhorias de performance
- `🧪 [TEST]` - Testes
- `🔧 [CONFIG]` - Configurações
- `📝 [AUTO]` - Deploy automático

## 🎯 Como Usar

### Deploy Diário (Recomendado)
```powershell
.\deploy-rapido.ps1
```

### Deploy com Mensagem Personalizada
```powershell
.\deploy-automatico.ps1 -CommitMessage "Adicionada nova funcionalidade de meditação" -TipoCommit "FEAT"
```

### Verificar Status
```powershell
git status
git log --oneline -5
```

## 🔗 Links Úteis

- **Repositório**: https://github.com/rsg384/oraetmedita
- **Autor**: Rodrigo Silva Goes (@rsg384)
- **Projeto**: Ora et Medita - Sistema de Meditações Católicas

## 📊 Verificações Automáticas

O script `deploy-automatico.ps1` inclui:

1. ✅ Verificação do Git
2. ✅ Configuração automática do PATH
3. ✅ Detecção de mudanças
4. ✅ Commit automático
5. ✅ Push para GitHub
6. ✅ Verificação final do status

## 🛠️ Comandos Manuais

Se precisar fazer deploy manualmente:

```powershell
# Adicionar mudanças
git add .

# Fazer commit
git commit -m "📝 [TIPO] Descrição da mudança"

# Enviar para GitHub
git push origin main
```

## 📈 Monitoramento

Após cada deploy, verifique:

1. **GitHub**: https://github.com/rsg384/oraetmedita
2. **Status local**: `git status`
3. **Log de commits**: `git log --oneline -5`

## 🔄 Sincronização

Para sincronizar com mudanças do GitHub:

```powershell
git pull origin main
```

---

**Autor**: Rodrigo Silva Goes (@rsg384)  
**Projeto**: Ora et Medita  
**Última atualização**: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') 