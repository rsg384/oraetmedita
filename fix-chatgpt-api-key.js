// Script para corrigir a busca da chave da API do ChatGPT
console.log('🔧 Script de correção da chave da API do ChatGPT carregado');

// Função para buscar a chave da API no Supabase
async function getChatGPTAPIKeyFromSupabase() {
    console.log('🔍 Buscando chave da API do ChatGPT no Supabase...');
    
    try {
        // Obter variáveis do Supabase
        const supabaseVars = getSupabaseVariables();
        console.log('📋 Variáveis do Supabase obtidas:', supabaseVars.url);
        
        // Fazer requisição para buscar a chave da API
        const response = await fetch(`${supabaseVars.url}/rest/v1/api_configs?select=*&name=eq.chatgpt_api_key`, {
            method: 'GET',
            headers: {
                'apikey': supabaseVars.key,
                'Authorization': `Bearer ${supabaseVars.key}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📊 Status da resposta:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Configuração da API encontrada:', result);
            
            if (result && result.length > 0) {
                const apiKey = result[0].value;
                console.log('🔑 Chave da API obtida do Supabase:', apiKey ? 'CONFIGURADA' : 'NÃO CONFIGURADA');
                return apiKey;
            } else {
                console.log('⚠️ Nenhuma configuração da API encontrada no Supabase');
                return null;
            }
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao buscar chave da API no Supabase:', errorData);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erro ao buscar chave da API:', error);
        return null;
    }
}

// Função para criar a tabela api_configs se não existir
async function createAPIConfigsTable() {
    console.log('🔧 Verificando/criando tabela api_configs...');
    
    try {
        const supabaseVars = getSupabaseVariables();
        
        // SQL para criar a tabela api_configs
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS api_configs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL UNIQUE,
                value TEXT NOT NULL,
                description TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Inserir chave da API do ChatGPT se não existir
            INSERT INTO api_configs (name, value, description) 
            VALUES ('chatgpt_api_key', 'sua_chave_aqui', 'Chave da API do ChatGPT')
            ON CONFLICT (name) DO NOTHING;
        `;
        
        console.log('📋 SQL para criar tabela api_configs preparado');
        console.log('⚠️ Execute este SQL no painel do Supabase:');
        console.log(createTableSQL);
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao preparar criação da tabela:', error);
        return false;
    }
}

// Função para substituir a função de busca da chave da API
function replaceAPIKeyFunction() {
    console.log('🔧 Substituindo função de busca da chave da API...');
    
    // Substituir a função de busca da chave da API
    if (window.chatGPTAPI && window.chatGPTAPI.getAPIKey) {
        const originalFunction = window.chatGPTAPI.getAPIKey;
        
        window.chatGPTAPI.getAPIKey = async function() {
            console.log('🔍 Buscando chave da API do ChatGPT...');
            
            // Primeiro tentar buscar do Supabase
            const supabaseKey = await getChatGPTAPIKeyFromSupabase();
            if (supabaseKey && supabaseKey !== 'sua_chave_aqui') {
                console.log('✅ Chave obtida do Supabase');
                return supabaseKey;
            }
            
            // Se não encontrar no Supabase, tentar localStorage
            const localKey = localStorage.getItem('chatgpt_api_key');
            if (localKey) {
                console.log('✅ Chave obtida do localStorage');
                return localKey;
            }
            
            // Se não encontrar em nenhum lugar, usar chave hardcoded
            console.log('⚠️ Usando chave hardcoded (pode estar inválida)');
            return 'sk-proj-...'; // Chave hardcoded (pode estar inválida)
        };
        
        console.log('✅ Função de busca da chave substituída');
    } else {
        console.error('❌ Função chatGPTAPI.getAPIKey não encontrada');
    }
}

// Função para testar a nova chave da API
async function testNewAPIKey() {
    console.log('🧪 Testando nova chave da API...');
    
    try {
        const apiKey = await getChatGPTAPIKeyFromSupabase();
        if (apiKey && apiKey !== 'sua_chave_aqui') {
            console.log('✅ Nova chave da API obtida:', apiKey ? 'CONFIGURADA' : 'NÃO CONFIGURADA');
            
            // Testar a API com a nova chave
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('📊 Status da resposta da API:', response.status);
            
            if (response.ok) {
                console.log('✅ API do ChatGPT funcionando com a nova chave');
                return true;
            } else {
                const errorData = await response.json();
                console.error('❌ Erro na API do ChatGPT:', errorData);
                return false;
            }
        } else {
            console.log('⚠️ Chave da API não encontrada ou inválida');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro no teste da API:', error);
        return false;
    }
}

// Função para inserir chave da API no Supabase
async function insertAPIKeyToSupabase(apiKey) {
    console.log('🔧 Inserindo chave da API no Supabase...');
    
    try {
        const supabaseVars = getSupabaseVariables();
        
        const apiConfig = {
            name: 'chatgpt_api_key',
            value: apiKey,
            description: 'Chave da API do ChatGPT',
            is_active: true
        };
        
        const response = await fetch(`${supabaseVars.url}/rest/v1/api_configs`, {
            method: 'POST',
            headers: {
                'apikey': supabaseVars.key,
                'Authorization': `Bearer ${supabaseVars.key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(apiConfig)
        });
        
        console.log('📊 Status da resposta:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Chave da API inserida no Supabase:', result);
            return true;
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao inserir chave da API:', errorData);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao inserir chave da API:', error);
        return false;
    }
}

// Exportar funções
window.getChatGPTAPIKeyFromSupabase = getChatGPTAPIKeyFromSupabase;
window.createAPIConfigsTable = createAPIConfigsTable;
window.replaceAPIKeyFunction = replaceAPIKeyFunction;
window.testNewAPIKey = testNewAPIKey;
window.insertAPIKeyToSupabase = insertAPIKeyToSupabase;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção da chave da API carregado');
    
    setTimeout(async () => {
        console.log('🔧 Aplicando correções da chave da API...');
        
        // Verificar se a tabela api_configs existe
        await createAPIConfigsTable();
        
        // Substituir função de busca da chave
        replaceAPIKeyFunction();
        
        // Testar nova chave
        await testNewAPIKey();
        
        console.log('📋 Para configurar a chave da API:');
        console.log('1. Acesse o painel do Supabase');
        console.log('2. Execute o SQL para criar a tabela api_configs');
        console.log('3. Insira sua chave da API do ChatGPT na tabela');
        console.log('4. Ou use: insertAPIKeyToSupabase("sua_chave_aqui")');
    }, 2000);
});

console.log('✅ Script de correção da chave da API do ChatGPT carregado'); 