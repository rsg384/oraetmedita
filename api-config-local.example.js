// Configuração Local da API do ChatGPT - EXEMPLO
// ⚠️ IMPORTANTE: Este é um arquivo de exemplo
// Copie este arquivo para api-config-local.js e configure sua chave real

const API_CONFIG_LOCAL = {
    // Configuração da API OpenAI
    OPENAI: {
        // 🔑 SUA CHAVE DA API AQUI
        // Obtenha em: https://platform.openai.com/api-keys
        API_KEY: "sk-proj-...", // ⚠️ Substitua pela sua chave real
        
        BASE_URL: 'https://api.openai.com/v1',
        MODEL: 'gpt-4o-mini',
        MAX_TOKENS: 4000,
        TEMPERATURE: 0.7
    },
    
    // Configuração do sistema de cache
    CACHE: {
        ENABLED: true,
        TTL: 24 * 60 * 60 * 1000, // 24 horas em ms
        MAX_SIZE: 100, // Máximo de itens no cache
        STORAGE_KEY: 'meditation_cache'
    },
    
    // Configuração de validação
    VALIDATION: {
        ENABLED: true,
        MIN_CONTENT_LENGTH: 100,
        MAX_CONTENT_LENGTH: 5000,
        REQUIRED_SECTIONS: ['reading', 'meditation', 'prayer', 'contemplation'],
        FORBIDDEN_WORDS: ['erro', 'teste', 'placeholder']
    },
    
    // Configuração de backup
    BACKUP: {
        ENABLED: true,
        AUTO_BACKUP_INTERVAL: 60 * 60 * 1000, // 1 hora
        MAX_BACKUPS: 10,
        STORAGE_KEY: 'meditation_backups'
    }
};

// Função para obter a chave da API de forma segura
function getApiKey() {
    // Primeiro, tentar obter do localStorage (para desenvolvimento)
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey && storedKey.startsWith('sk-')) {
        return storedKey;
    }
    
    // Depois, usar a chave do config local
    if (API_CONFIG_LOCAL.OPENAI.API_KEY && API_CONFIG_LOCAL.OPENAI.API_KEY.startsWith('sk-')) {
        return API_CONFIG_LOCAL.OPENAI.API_KEY;
    }
    
    // Por último, solicitar ao usuário
    return prompt('Por favor, insira sua chave da API OpenAI (sk-...):');
}

// Função para salvar a chave da API no localStorage
function saveApiKey(key) {
    if (key && key.startsWith('sk-')) {
        localStorage.setItem('openai_api_key', key);
        return true;
    }
    return false;
}

// Função para verificar se a API está configurada
function isApiConfigured() {
    const key = getApiKey();
    return key && key.startsWith('sk-') && key.length > 20;
}

// Função para configurar a API
function configureApi() {
    if (!isApiConfigured()) {
        const key = prompt('🔑 Configure sua chave da API OpenAI\n\n1. Acesse: https://platform.openai.com/api-keys\n2. Crie uma nova chave\n3. Cole a chave aqui (sk-...):');
        
        if (saveApiKey(key)) {
            alert('✅ Chave da API configurada com sucesso!');
            return true;
        } else {
            alert('❌ Chave inválida. Tente novamente.');
            return false;
        }
    }
    return true;
}

// Função para obter configuração completa
function getApiConfig() {
    return {
        ...API_CONFIG_LOCAL,
        OPENAI: {
            ...API_CONFIG_LOCAL.OPENAI,
            API_KEY: getApiKey()
        }
    };
}

// Exportar para uso global
window.API_CONFIG_LOCAL = API_CONFIG_LOCAL;
window.getApiKey = getApiKey;
window.saveApiKey = saveApiKey;
window.isApiConfigured = isApiConfigured;
window.configureApi = configureApi;
window.getApiConfig = getApiConfig;

// Configurar automaticamente se necessário
if (typeof window !== 'undefined' && !isApiConfigured()) {
    console.log('🔧 Configurando API do ChatGPT...');
    configureApi();
}

console.log('✅ API Config Local carregada'); 