# 🚀 Servidor na Porta 3172 - Ora et Medita

## 📋 Status Atual

✅ **Servidor rodando** - Porta 3172 ativa  
✅ **Navegador aberto** - http://localhost:3172  
✅ **Scripts criados** - Automatização completa  

## 🔧 Scripts Disponíveis

### 1. **start-simple-3172.ps1** - Servidor Simples
```powershell
# Iniciar servidor na porta 3172
.\start-simple-3172.ps1
```

### 2. **abrir-navegador-3172.ps1** - Abrir Navegador
```powershell
# Abrir navegador automaticamente
.\abrir-navegador-3172.ps1
```

### 3. **start-server-3172.ps1** - Servidor Avançado
```powershell
# Servidor com verificações (Python/Node.js)
.\start-server-3172.ps1
```

## 🎯 Como Usar

### Iniciar Servidor
```powershell
# Servidor simples (recomendado)
.\start-simple-3172.ps1

# Servidor avançado
.\start-server-3172.ps1
```

### Abrir Navegador
```powershell
# Abrir automaticamente
.\abrir-navegador-3172.ps1

# Ou acesse manualmente
# http://localhost:3172
```

### Verificar Status
```powershell
# Verificar se a porta está em uso
netstat -ano | findstr :3172

# Verificar servidor
.\start-server-3172.ps1 -CheckPort
```

## 🔗 URLs do Projeto

- **Página Principal**: http://localhost:3172
- **Dashboard**: http://localhost:3172/dashboard.html
- **Meditações**: http://localhost:3172/meditacao.html
- **Minhas Meditações**: http://localhost:3172/minhas-meditacoes.html
- **Categorias**: http://localhost:3172/categorias.html
- **Progresso**: http://localhost:3172/progresso.html

## 📊 Verificações Automáticas

O servidor inclui:

1. ✅ Verificação de porta disponível
2. ✅ Servidor HTTP nativo PowerShell
3. ✅ Servir arquivos estáticos
4. ✅ Log de requisições
5. ✅ Tratamento de erros 404

## 🛠️ Comandos Úteis

### Verificar Porta
```powershell
# Verificar se está em uso
Get-NetTCPConnection -LocalPort 3172

# Verificar processos
netstat -ano | findstr :3172
```

### Parar Servidor
```powershell
# Ctrl+C no terminal do servidor
# Ou encerrar processo manualmente
```

### Reiniciar Servidor
```powershell
# Parar (Ctrl+C) e executar novamente
.\start-simple-3172.ps1
```

## 📈 Monitoramento

Para monitorar o servidor:

1. **Logs**: Verificar saída do terminal
2. **Status**: `netstat -ano | findstr :3172`
3. **Navegador**: http://localhost:3172
4. **Console**: F12 no navegador

## 🔄 Deploy

Após mudanças no código:

```powershell
# Deploy para GitHub
.\deploy-rapido.ps1

# O servidor continuará rodando
# Recarregue a página no navegador
```

## 🎨 Funcionalidades

- ✅ Servidor HTTP nativo PowerShell
- ✅ Servir arquivos HTML, CSS, JS
- ✅ Suporte a imagens e recursos
- ✅ Log de requisições em tempo real
- ✅ Tratamento de erros 404
- ✅ Inicialização automática

---

**Autor**: Rodrigo Silva Goes (@rsg384)  
**Projeto**: Ora et Medita  
**Porta**: 3172  
**URL**: http://localhost:3172 