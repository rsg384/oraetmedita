// Script para configurar imediatamente a chave da API do ChatGPT
console.log('🔧 Script de configuração imediata da API carregado');

// Função para configurar a chave da API imediatamente
async function configureAPIKeyImmediately() {
    console.log('🔧 Configurando chave da API imediatamente...');
    
    try {
        // 1. Verificar se a tabela api_configs existe
        console.log('🔍 Verificando tabela api_configs...');
        const supabaseVars = getSupabaseVariables();
        
        const checkResponse = await fetch(`${supabaseVars.url}/rest/v1/api_configs?select=count`, {
            method: 'GET',
            headers: {
                'apikey': supabaseVars.key,
                'Authorization': `Bearer ${supabaseVars.key}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!checkResponse.ok) {
            console.log('❌ Tabela api_configs não existe. Criando...');
            await createAPIConfigsTable();
        } else {
            console.log('✅ Tabela api_configs existe');
        }
        
        // 2. Solicitar chave da API
        const apiKey = prompt('🔑 Digite sua chave da API do ChatGPT (sk-...):\n\nPara obter sua chave:\n1. Acesse: https://platform.openai.com/account/api-keys\n2. Faça login\n3. Clique em "Create new secret key"\n4. Copie a chave (começa com "sk-")');
        
        if (!apiKey || apiKey.trim() === '') {
            console.log('❌ Chave da API não fornecida');
            return false;
        }
        
        // 3. Testar a chave
        console.log('🧪 Testando chave da API...');
        const isValid = await testAPIKey(apiKey);
        
        if (!isValid) {
            console.log('❌ Chave da API inválida');
            alert('❌ Chave da API inválida. Verifique se a chave está correta.');
            return false;
        }
        
        console.log('✅ Chave da API válida');
        
        // 4. Inserir no Supabase
        console.log('📤 Salvando chave no Supabase...');
        const inserted = await insertAPIKeyToSupabase(apiKey);
        
        if (inserted) {
            console.log('✅ Chave da API configurada com sucesso');
            alert('✅ Chave da API configurada com sucesso!');
            
            // 5. Testar configuração completa
            await testCompleteSetup();
            
            return true;
        } else {
            console.log('❌ Erro ao configurar chave da API');
            alert('❌ Erro ao configurar chave da API. Verifique a conexão com o Supabase.');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro na configuração:', error);
        alert('❌ Erro na configuração: ' + error.message);
        return false;
    }
}

// Função para testar a configuração atual
async function testCurrentConfiguration() {
    console.log('🧪 Testando configuração atual...');
    
    try {
        // 1. Testar busca da chave do Supabase
        const apiKey = await getAPIKeyFromSupabase();
        if (!apiKey) {
            console.log('❌ Nenhuma chave configurada no Supabase');
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
            if (testKey && testKey !== 'sk-proj-...') {
                console.log('✅ Configuração completa funcionando');
                return true;
            }
        }
        
        console.log('❌ Função de busca não funcionando');
        return false;
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
        return false;
    }
}

// Função para forçar a substituição da função de busca
function forceReplaceAPIKeyFunction() {
    console.log('🔧 Forçando substituição da função de busca da chave...');
    
    if (window.chatGPTAPI && window.chatGPTAPI.getAPIKey) {
        const originalGetAPIKey = window.chatGPTAPI.getAPIKey;
        
        window.chatGPTAPI.getAPIKey = async function() {
            console.log('🔍 Buscando chave da API (função forçada)...');
            
            // 1. Tentar buscar do Supabase
            const supabaseKey = await getAPIKeyFromSupabase();
            if (supabaseKey && supabaseKey !== 'sua_chave_aqui' && supabaseKey !== 'sk-proj-...') {
                console.log('✅ Usando chave do Supabase');
                return supabaseKey;
            }
            
            // 2. Tentar buscar do localStorage
            const localKey = localStorage.getItem('chatgpt_api_key');
            if (localKey && localKey !== 'sk-proj-...') {
                console.log('✅ Usando chave do localStorage');
                return localKey;
            }
            
            // 3. Usar função original como fallback
            console.log('⚠️ Usando função original como fallback');
            return originalGetAPIKey.call(this);
        };
        
        console.log('✅ Função de busca da chave forçada');
    } else {
        console.log('❌ chatGPTAPI.getAPIKey não encontrada');
    }
}

// Função para limpar chaves inválidas
function clearInvalidAPIKeys() {
    console.log('🧹 Limpando chaves inválidas...');
    
    // Limpar localStorage
    const localKey = localStorage.getItem('chatgpt_api_key');
    if (localKey && localKey.includes('sk-proj-...')) {
        localStorage.removeItem('chatgpt_api_key');
        console.log('✅ Chave inválida removida do localStorage');
    }
    
    // Limpar variáveis globais
    if (window.chatGPTAPI && window.chatGPTAPI.apiKey) {
        if (window.chatGPTAPI.apiKey.includes('sk-proj-...')) {
            delete window.chatGPTAPI.apiKey;
            console.log('✅ Chave inválida removida do chatGPTAPI');
        }
    }
    
    console.log('✅ Limpeza concluída');
}

// Função para mostrar status da configuração
function showConfigurationStatus() {
    console.log('📊 Status da configuração da API:');
    console.log('1. Verificando chave no Supabase...');
    getAPIKeyFromSupabase().then(apiKey => {
        if (apiKey) {
            console.log('✅ Chave encontrada no Supabase');
            testAPIKey(apiKey).then(isValid => {
                if (isValid) {
                    console.log('✅ Chave válida');
                } else {
                    console.log('❌ Chave inválida');
                }
            });
        } else {
            console.log('❌ Nenhuma chave no Supabase');
        }
    });
    
    console.log('2. Verificando localStorage...');
    const localKey = localStorage.getItem('chatgpt_api_key');
    if (localKey) {
        console.log('✅ Chave encontrada no localStorage');
    } else {
        console.log('❌ Nenhuma chave no localStorage');
    }
    
    console.log('3. Verificando chatGPTAPI...');
    if (window.chatGPTAPI) {
        console.log('✅ chatGPTAPI disponível');
    } else {
        console.log('❌ chatGPTAPI não disponível');
    }
}

// Exportar funções
window.configureAPIKeyImmediately = configureAPIKeyImmediately;
window.testCurrentConfiguration = testCurrentConfiguration;
window.forceReplaceAPIKeyFunction = forceReplaceAPIKeyFunction;
window.clearInvalidAPIKeys = clearInvalidAPIKeys;
window.showConfigurationStatus = showConfigurationStatus;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de configuração imediata carregado');
    
    setTimeout(async () => {
        console.log('🔧 Aplicando configurações imediatas...');
        
        // Limpar chaves inválidas
        clearInvalidAPIKeys();
        
        // Forçar substituição da função
        forceReplaceAPIKeyFunction();
        
        // Mostrar status
        showConfigurationStatus();
        
        // Testar configuração atual
        const isWorking = await testCurrentConfiguration();
        
        if (!isWorking) {
            console.log('⚠️ Configuração não funcionando. Use configureAPIKeyImmediately() para configurar.');
        } else {
            console.log('✅ Configuração funcionando corretamente');
        }
    }, 1000);
});

console.log('✅ Script de configuração imediata da API carregado'); 