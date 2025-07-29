# 🚀 Execute Estes Comandos Manualmente

## ⚠️ Problema Detectado
As ferramentas de desenvolvimento do macOS não estão instaladas. Execute estes comandos manualmente no Terminal:

## 📋 Comandos para Executar

### 1. Abrir Terminal
- Pressione `Cmd + Space`
- Digite "Terminal"
- Pressione Enter

### 2. Navegar para o Projeto
```bash
cd "/Users/rodrigogoes/Desktop/Projeto-OraetMedita 5"
```

### 3. Configurar Git
```bash
git config --global user.name "Rodrigo Silva Goes"
git config --global user.email "seu@email.com"
```

### 4. Inicializar Repositório
```bash
git init
```

### 5. Adicionar Arquivos
```bash
git add .
```

### 6. Fazer Primeiro Commit
```bash
git commit -m "🎉 Initial commit: Ora et Medita - Sistema de Meditações Católicas"
```

### 7. Conectar com GitHub
```bash
git remote add origin https://github.com/rsg384/oraetemedita.git
```

### 8. Enviar para GitHub
```bash
git branch -M main
git push -u origin main
```

## 🔍 Verificar se Funcionou

Após executar os comandos, acesse:
https://github.com/rsg384/oraetemedita

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
chmod +x cursor-deploy.sh
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o repositório existe
2. Verifique suas credenciais do GitHub
3. Execute os comandos um por vez

---

**🎯 Execute os comandos acima e seu projeto estará no GitHub!** 