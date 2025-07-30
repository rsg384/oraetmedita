// Script para corrigir busca da chave da API do ChatGPT no Supabase
console.log('🔧 Corrigindo busca da chave da API do ChatGPT...');

// Função para buscar chave da API no Supabase
async function getApiKeyFromSupabase() {
    console.log('🔍 Buscando chave da API no Supabase...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/api_configs?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📋 Configurações de API encontradas:', data);
        
        if (data && data.length > 0) {
            const apiConfig = data[0]; // Pega a primeira configuração
            const apiKey = apiConfig.openai_api_key || apiConfig.api_key;
            
            if (apiKey) {
                console.log('✅ Chave da API encontrada no Supabase');
                return apiKey;
            } else {
                console.warn('⚠️ Chave da API não encontrada na configuração');
                return null;
            }
        } else {
            console.warn('⚠️ Nenhuma configuração de API encontrada no Supabase');
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erro ao buscar chave da API no Supabase:', error);
        return null;
    }
}

// Função para sobrescrever a função de geração de meditações
function fixChatGptApiGeneration() {
    console.log('🔧 Corrigindo geração de meditações via ChatGPT...');
    
    // Sobrescrever a função de geração de meditações
    if (window.generateMeditationWithChatGPT) {
        const originalFunction = window.generateMeditationWithChatGPT;
        
        window.generateMeditationWithChatGPT = async function(category, title, description) {
            console.log('🔄 Gerando meditação com ChatGPT (versão corrigida)...');
            
            try {
                // Buscar chave da API no Supabase
                const apiKey = await getApiKeyFromSupabase();
                
                if (!apiKey) {
                    throw new Error('Chave da API do ChatGPT não encontrada no Supabase');
                }
                
                console.log('✅ Usando chave da API do Supabase');
                
                // Configurar headers com a chave do Supabase
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                };
                
                // Preparar prompt para o ChatGPT
                const prompt = `
                Crie uma meditação católica baseada na categoria "${category}" com o título "${title}".
                
                Descrição da categoria: ${description}
                
                A meditação deve incluir:
                1. Uma introdução espiritual
                2. Um texto bíblico relevante
                3. Reflexões profundas sobre o tema
                4. Uma oração final
                5. Uma aplicação prática para a vida diária
                
                Formato da resposta:
                {
                    "title": "Título da Meditação",
                    "content": "Conteúdo completo da meditação",
                    "bible_verse": "Versículo bíblico",
                    "prayer": "Oração final",
                    "practical_application": "Aplicação prática"
                }
                `;
                
                // Fazer requisição para a API do ChatGPT
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'Você é um assistente especializado em criar meditações católicas profundas e inspiradoras.'
                            },
                            {
                                role: 'user',
                                content: prompt
                            }
                        ],
                        max_tokens: 1500,
                        temperature: 0.7
                    })
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Erro na API do ChatGPT: ${errorData.error?.message || response.statusText}`);
                }
                
                const data = await response.json();
                const content = data.choices[0]?.message?.content;
                
                if (!content) {
                    throw new Error('Resposta vazia da API do ChatGPT');
                }
                
                // Tentar fazer parse do JSON da resposta
                try {
                    const meditationData = JSON.parse(content);
                    console.log('✅ Meditação gerada com sucesso via ChatGPT');
                    return meditationData;
                } catch (parseError) {
                    console.log('⚠️ Resposta não é JSON válido, usando como texto simples');
                    return {
                        title: title,
                        content: content,
                        bible_verse: 'Versículo será adicionado manualmente',
                        prayer: 'Oração será adicionada manualmente',
                        practical_application: 'Aplicação prática será adicionada manualmente'
                    };
                }
                
            } catch (error) {
                console.error('❌ Erro ao gerar meditação com ChatGPT:', error);
                throw error;
            }
        };
        
        console.log('✅ Função de geração de meditações corrigida');
    } else {
        console.warn('⚠️ Função generateMeditationWithChatGPT não encontrada');
    }
}

// Função para verificar se a tabela api_configs existe
async function checkApiConfigsTable() {
    console.log('🔍 Verificando tabela api_configs...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/api_configs?select=count`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Tabela api_configs existe');
            return true;
        } else {
            console.warn('⚠️ Tabela api_configs não existe ou não acessível');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar tabela api_configs:', error);
        return false;
    }
}

// Função para criar tabela api_configs se não existir
async function createApiConfigsTable() {
    console.log('🔧 Criando tabela api_configs...');
    
    try {
        // SQL para criar a tabela (será executado via Supabase)
        const createTableSQL = `
        CREATE TABLE IF NOT EXISTS api_configs (
            id SERIAL PRIMARY KEY,
            openai_api_key TEXT,
            api_key TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        `;
        
        console.log('📋 SQL para criar tabela:', createTableSQL);
        console.log('ℹ️ Execute este SQL no painel do Supabase se a tabela não existir');
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao criar tabela api_configs:', error);
        return false;
    }
}

// Função para inserir chave da API de exemplo
async function insertSampleApiKey() {
    console.log('🔧 Inserindo chave de API de exemplo...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/api_configs`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                openai_api_key: 'sua-chave-api-aqui',
                api_key: 'sua-chave-api-aqui'
            })
        });
        
        if (response.ok) {
            console.log('✅ Chave de API de exemplo inserida');
            return true;
        } else {
            console.warn('⚠️ Erro ao inserir chave de API:', response.status);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao inserir chave de API:', error);
        return false;
    }
}

// Função principal para corrigir a API do ChatGPT
async function fixChatGptApi() {
    console.log('🔧 Iniciando correção da API do ChatGPT...');
    
    // 1. Verificar se a tabela existe
    const tableExists = await checkApiConfigsTable();
    
    if (!tableExists) {
        console.log('📋 Tabela api_configs não existe, criando...');
        await createApiConfigsTable();
        console.log('ℹ️ Execute o SQL no painel do Supabase para criar a tabela');
    }
    
    // 2. Tentar inserir chave de exemplo
    await insertSampleApiKey();
    
    // 3. Corrigir função de geração
    fixChatGptApiGeneration();
    
    // 4. Testar busca da chave
    const apiKey = await getApiKeyFromSupabase();
    if (apiKey) {
        console.log('✅ Configuração da API do ChatGPT corrigida');
    } else {
        console.warn('⚠️ Configure a chave da API no Supabase');
    }
}

// Exportar funções
window.fixChatGptApi = fixChatGptApi;
window.getApiKeyFromSupabase = getApiKeyFromSupabase;
window.checkApiConfigsTable = checkApiConfigsTable;
window.createApiConfigsTable = createApiConfigsTable;
window.insertSampleApiKey = insertSampleApiKey;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção da API do ChatGPT carregado');
    
    // Aguardar um pouco e executar correção
    setTimeout(async () => {
        console.log('🔧 Executando correção automática da API do ChatGPT...');
        await fixChatGptApi();
    }, 1000);
});

console.log('✅ Script de correção da API do ChatGPT carregado'); 