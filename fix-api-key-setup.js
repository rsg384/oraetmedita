// Script para configurar corretamente a chave da API do ChatGPT
console.log('🔧 Script de configuração da chave da API carregado');

// Função para criar a tabela api_configs se não existir
async function createAPIConfigsTable() {
    console.log('🔧 Criando tabela api_configs...');
    
    try {
        const supabaseVars = getSupabaseVariables();
        
        // SQL para criar a tabela
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
            
            -- Criar índice para busca por nome
            CREATE INDEX IF NOT EXISTS idx_api_configs_name ON api_configs(name);
            
            -- Trigger para atualizar updated_at
            CREATE OR REPLACE FUNCTION update_api_configs_updated_at()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = NOW();
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
            
            CREATE TRIGGER trigger_update_api_configs_updated_at
                BEFORE UPDATE ON api_configs
                FOR EACH ROW
                EXECUTE FUNCTION update_api_configs_updated_at();
        `;
        
        console.log('📋 SQL para criar tabela api_configs:');
        console.log(createTableSQL);
        console.log('⚠️ Execute este SQL no painel do Supabase');
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao preparar criação da tabela:', error);
        return false;
    }
}

// Função para inserir a chave da API no Supabase
async function insertAPIKeyToSupabase(apiKey) {
    console.log('🔧 Inserindo chave da API no Supabase...');
    
    try {
        const supabaseVars = getSupabaseVariables();
        
        const apiConfig = {
            name: 'chatgpt_api_key',
            value: apiKey,
            description: 'Chave da API do ChatGPT para geração de meditações',
            is_active: true
        };
        
        console.log('📋 Dados para inserir:', { name: apiConfig.name, value: '***', description: apiConfig.description });
        
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
            console.log('✅ Chave da API inserida no Supabase:', { id: result[0].id, name: result[0].name });
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

// Função para buscar a chave da API do Supabase
async function getAPIKeyFromSupabase() {
    console.log('🔍 Buscando chave da API do Supabase...');
    
    try {
        const supabaseVars = getSupabaseVariables();
        
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
            if (result && result.length > 0) {
                const apiKey = result[0].value;
                console.log('✅ Chave da API encontrada no Supabase');
                return apiKey;
            } else {
                console.log('⚠️ Chave da API não encontrada no Supabase');
                return null;
            }
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao buscar chave da API:', errorData);
            return null;
        }
        
    } catch (error) {
        console.error('❌ Erro ao buscar chave da API:', error);
        return null;
    }
}

// Função para testar a chave da API
async function testAPIKey(apiKey) {
    console.log('🧪 Testando chave da API...');
    
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('📊 Status da resposta de teste:', response.status);
        
        if (response.ok) {
            console.log('✅ Chave da API válida');
            return true;
        } else {
            const errorData = await response.json();
            console.error('❌ Chave da API inválida:', errorData);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao testar chave da API:', error);
        return false;
    }
}

// Função para configurar a chave da API corretamente
async function setupAPIKey() {
    console.log('🔧 Configurando chave da API...');
    
    // 1. Criar tabela se necessário
    await createAPIConfigsTable();
    
    // 2. Solicitar chave da API ao usuário
    const apiKey = prompt('🔑 Digite sua chave da API do ChatGPT (sk-...):');
    
    if (!apiKey || apiKey.trim() === '') {
        console.log('❌ Chave da API não fornecida');
        return false;
    }
    
    // 3. Testar a chave
    const isValid = await testAPIKey(apiKey);
    
    if (!isValid) {
        console.log('❌ Chave da API inválida');
        return false;
    }
    
    // 4. Inserir no Supabase
    const inserted = await insertAPIKeyToSupabase(apiKey);
    
    if (inserted) {
        console.log('✅ Chave da API configurada com sucesso');
        return true;
    } else {
        console.log('❌ Erro ao configurar chave da API');
        return false;
    }
}

// Função para substituir a função de busca da chave da API
function replaceAPIKeyFunction() {
    console.log('🔧 Substituindo função de busca da chave da API...');
    
    if (window.chatGPTAPI && window.chatGPTAPI.getAPIKey) {
        const originalGetAPIKey = window.chatGPTAPI.getAPIKey;
        
        window.chatGPTAPI.getAPIKey = async function() {
            console.log('🔍 Buscando chave da API (função substituída)...');
            
            // 1. Tentar buscar do Supabase
            const supabaseKey = await getAPIKeyFromSupabase();
            if (supabaseKey && supabaseKey !== 'sua_chave_aqui') {
                console.log('✅ Usando chave do Supabase');
                return supabaseKey;
            }
            
            // 2. Tentar buscar do localStorage
            const localKey = localStorage.getItem('chatgpt_api_key');
            if (localKey) {
                console.log('✅ Usando chave do localStorage');
                return localKey;
            }
            
            // 3. Usar função original como fallback
            console.log('⚠️ Usando função original como fallback');
            return originalGetAPIKey.call(this);
        };
        
        console.log('✅ Função de busca da chave substituída');
    } else {
        console.log('❌ chatGPTAPI.getAPIKey não encontrada');
    }
}

// Função para testar a configuração completa
async function testCompleteSetup() {
    console.log('🧪 Testando configuração completa da API...');
    
    try {
        // 1. Testar busca da chave
        const apiKey = await getAPIKeyFromSupabase();
        if (!apiKey) {
            console.log('❌ Chave da API não encontrada no Supabase');
            return false;
        }
        
        // 2. Testar validade da chave
        const isValid = await testAPIKey(apiKey);
        if (!isValid) {
            console.log('❌ Chave da API inválida');
            return false;
        }
        
        // 3. Testar função substituída
        if (window.chatGPTAPI && window.chatGPTAPI.getAPIKey) {
            const testKey = await window.chatGPTAPI.getAPIKey();
            if (testKey) {
                console.log('✅ Configuração completa funcionando');
                return true;
            }
        }
        
        console.log('❌ Função de busca não funcionando');
        return false;
        
    } catch (error) {
        console.error('❌ Erro no teste de configuração:', error);
        return false;
    }
}

// Exportar funções
window.createAPIConfigsTable = createAPIConfigsTable;
window.insertAPIKeyToSupabase = insertAPIKeyToSupabase;
window.getAPIKeyFromSupabase = getAPIKeyFromSupabase;
window.testAPIKey = testAPIKey;
window.setupAPIKey = setupAPIKey;
window.replaceAPIKeyFunction = replaceAPIKeyFunction;
window.testCompleteSetup = testCompleteSetup;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de configuração da API carregado');
    
    setTimeout(async () => {
        console.log('🔧 Aplicando configurações da API...');
        
        // Substituir função de busca da chave
        replaceAPIKeyFunction();
        
        // Testar configuração
        await testCompleteSetup();
        
        // Se não estiver funcionando, oferecer configuração
        const apiKey = await getAPIKeyFromSupabase();
        if (!apiKey) {
            console.log('⚠️ Chave da API não configurada. Use setupAPIKey() para configurar.');
        }
    }, 2000);
});

console.log('✅ Script de configuração da chave da API carregado'); 