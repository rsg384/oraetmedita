# 🚀 Configuração da API do ChatGPT

## 📋 Pré-requisitos

### 1. Conta OpenAI
- Crie uma conta em [OpenAI](https://platform.openai.com/)
- Obtenha sua chave de API

### 2. Configuração da Chave API

#### Opção A: Variável de Ambiente (Recomendado)
```bash
# No terminal
export OPENAI_API_KEY="sua-chave-api-aqui"

# Ou adicione ao seu arquivo .bashrc ou .zshrc
echo 'export OPENAI_API_KEY="sua-chave-api-aqui"' >> ~/.bashrc
source ~/.bashrc
```

#### Opção B: Configuração Direta
Edite o arquivo `api-config.js`:
```javascript
const API_CONFIG = {
    OPENAI: {
        API_KEY: 'sua-chave-api-aqui', // Substitua aqui
        BASE_URL: 'https://api.openai.com/v1',
        MODEL: 'gpt-4o-mini',
        MAX_TOKENS: 4000,
        TEMPERATURE: 0.7
    },
    // ... resto da configuração
};
```

## 🔧 Configurações Avançadas

### Modelo de IA
```javascript
MODEL: 'gpt-4o-mini', // Modelo recomendado (mais barato)
// Alternativas:
// 'gpt-4o' - Mais poderoso, mais caro
// 'gpt-3.5-turbo' - Mais rápido, menos preciso
```

### Parâmetros de Geração
```javascript
MAX_TOKENS: 4000,    // Máximo de tokens por resposta
TEMPERATURE: 0.7,    // Criatividade (0.0 = determinístico, 1.0 = muito criativo)
```

### Sistema de Cache
```javascript
CACHE: {
    ENABLED: true,
    TTL: 24 * 60 * 60 * 1000, // 24 horas
    MAX_SIZE: 100,             // Máximo de itens no cache
    STORAGE_KEY: 'meditation_cache'
}
```

### Validação de Conteúdo
```javascript
VALIDATION: {
    ENABLED: true,
    MIN_CONTENT_LENGTH: 100,   // Mínimo de caracteres por seção
    MAX_CONTENT_LENGTH: 5000,  // Máximo de caracteres por seção
    REQUIRED_SECTIONS: ['reading', 'meditation', 'prayer', 'contemplation'],
    FORBIDDEN_WORDS: ['erro', 'teste', 'placeholder']
}
```

### Backup Automático
```javascript
BACKUP: {
    ENABLED: true,
    AUTO_BACKUP_INTERVAL: 60 * 60 * 1000, // 1 hora
    MAX_BACKUPS: 10,                      // Máximo de backups mantidos
    STORAGE_KEY: 'meditation_backups'
}
```

## 🧪 Testando a Configuração

### 1. Verificar Status da API
```javascript
// No console do navegador
const status = await chatGPTAPI.checkAPIStatus();
console.log('API Status:', status);
```

### 2. Testar Geração de Meditações
1. Acesse `http://localhost:3113`
2. Digite um tema (ex: "amor", "fé")
3. Faça login/cadastro
4. Verifique se as meditações são geradas pela IA

### 3. Verificar Cache
```javascript
// No console do navegador
console.log('Cache size:', meditationCache.cache.size);
console.log('Cache items:', Array.from(meditationCache.cache.keys()));
```

## 🔍 Monitoramento

### Estatísticas de Uso
```javascript
// Obter estatísticas da API
const stats = await chatGPTAPI.getUsageStats();
console.log('Usage Stats:', stats);
```

### Painel de Administração
1. Acesse o dashboard
2. Clique em "🔧 Admin"
3. Visualize estatísticas de cache e backups
4. Gerencie backups e cache

## 🛠️ Solução de Problemas

### Erro: "API Error: 401 Unauthorized"
- Verifique se a chave API está correta
- Confirme se a conta tem créditos disponíveis

### Erro: "API Error: 429 Too Many Requests"
- Aguarde alguns minutos
- Reduza a frequência de chamadas
- Considere aumentar o cache

### Erro: "Model not found"
- Verifique se o modelo especificado está disponível
- Use 'gpt-4o-mini' como padrão

### Cache não funcionando
```javascript
// Limpar cache manualmente
meditationCache.clear();
console.log('Cache cleared');
```

### Backup não sendo criado
```javascript
// Criar backup manualmente
const success = backupManager.createBackup();
console.log('Backup created:', success);
```

## 💰 Custos da API

### Estimativa de Custos (GPT-4o-mini)
- **Input**: $0.15 por 1M tokens
- **Output**: $0.60 por 1M tokens
- **Meditação típica**: ~2,000 tokens
- **Custo por meditação**: ~$0.0015

### Otimização de Custos
1. **Use cache**: Evite regenerar o mesmo conteúdo
2. **Limite tokens**: Ajuste MAX_TOKENS conforme necessário
3. **Monitore uso**: Verifique estatísticas regularmente

## 🔒 Segurança

### Proteção da Chave API
- ✅ Nunca exponha a chave no código frontend
- ✅ Use variáveis de ambiente
- ✅ Implemente rate limiting
- ✅ Monitore uso da API

### Validação de Conteúdo
- ✅ Verifique seções obrigatórias
- ✅ Valide tamanho do conteúdo
- ✅ Filtre palavras proibidas
- ✅ Verifique referências

## 📚 Recursos Adicionais

### Documentação OpenAI
- [API Reference](https://platform.openai.com/docs/api-reference)
- [Models](https://platform.openai.com/docs/models)
- [Best Practices](https://platform.openai.com/docs/guides/prompt-engineering)

### Exemplos de Prompts
```javascript
// Prompt para análise de documentos
const prompt = `Você é um especialista em teologia católica...
[Seu prompt personalizado aqui]`;
```

### Integração com Backend
Para produção, considere:
- Implementar backend para proteger a chave API
- Adicionar autenticação de usuários
- Implementar rate limiting
- Adicionar logs de uso

## 🎯 Próximos Passos

1. **Configure a chave API**
2. **Teste a geração de meditações**
3. **Monitore o uso e custos**
4. **Ajuste configurações conforme necessário**
5. **Implemente validação por especialistas**

---

**⚠️ Importante**: Mantenha sua chave API segura e nunca a compartilhe publicamente! 