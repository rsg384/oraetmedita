// Script para corrigir problema das variáveis do Supabase
console.log('🔧 Script de correção das variáveis do Supabase carregado');

// Função para obter as variáveis do Supabase corretamente
function getSupabaseVariables() {
    console.log('🔍 Verificando variáveis do Supabase...');
    
    // Verificar se as variáveis estão disponíveis globalmente
    if (typeof SUPABASE_URL !== 'undefined' && typeof SUPABASE_ANON_KEY !== 'undefined') {
        console.log('✅ Variáveis do Supabase encontradas globalmente');
        return {
            url: SUPABASE_URL,
            key: SUPABASE_ANON_KEY
        };
    }
    
    // Verificar se estão no window
    if (window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
        console.log('✅ Variáveis do Supabase encontradas no window');
        return {
            url: window.SUPABASE_URL,
            key: window.SUPABASE_ANON_KEY
        };
    }
    
    // Tentar obter do supabase-config.js
    if (typeof supabaseConfig !== 'undefined') {
        console.log('✅ Variáveis do Supabase encontradas em supabaseConfig');
        return {
            url: supabaseConfig.url,
            key: supabaseConfig.anonKey
        };
    }
    
    // Verificar se existe uma função para obter as variáveis
    if (typeof getSupabaseConfig === 'function') {
        console.log('✅ Usando função getSupabaseConfig');
        const config = getSupabaseConfig();
        return {
            url: config.url,
            key: config.anonKey
        };
    }
    
    console.error('❌ Variáveis do Supabase não encontradas');
    return null;
}

// Função para criar meditação usando as variáveis corretas
async function createMeditationWithCorrectVariables(meditationData) {
    console.log('🔄 Criando meditação com variáveis corretas...');
    
    try {
        const supabaseVars = getSupabaseVariables();
        if (!supabaseVars) {
            throw new Error('Não foi possível obter as variáveis do Supabase');
        }
        
        console.log('📤 Dados para enviar ao Supabase:', meditationData);
        
        // Fazer requisição para criar meditação
        const response = await fetch(`${supabaseVars.url}/rest/v1/meditations`, {
            method: 'POST',
            headers: {
                'apikey': supabaseVars.key,
                'Authorization': `Bearer ${supabaseVars.key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(meditationData)
        });
        
        console.log('📊 Status da resposta:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Meditação criada no Supabase:', result);
            return result;
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao criar meditação no Supabase:', errorData);
            throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro desconhecido'}`);
        }
        
    } catch (error) {
        console.error('❌ Erro na criação da meditação:', error);
        throw error;
    }
}

// Função para testar a criação de meditação
async function testMeditationCreation() {
    console.log('🧪 Testando criação de meditação...');
    
    try {
        // Buscar primeira categoria disponível
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const testCategory = categories[0];
        
        if (!testCategory) {
            throw new Error('Nenhuma categoria disponível para teste');
        }
        
        // Criar meditação de teste
        const testMeditation = {
            title: 'Teste Variáveis Corrigidas',
            content: 'Esta é uma meditação de teste para verificar as variáveis corrigidas.',
            category_id: testCategory.id,
            duration: 15,
            status: 'available',
            type: 'free',
            difficulty: 'beginner',
            bible_verse: 'Salmo 1:1-2',
            prayer: 'Senhor, obrigado por este teste.',
            practical_application: 'Aplicar os ensinamentos do teste.',
            tags: ['teste', 'variaveis'],
            icon: '🧪',
            color: '#7ee787',
            is_active: true,
            sort_order: 0
        };
        
        console.log('📋 Meditação de teste:', testMeditation);
        
        // Tentar criar no Supabase
        const result = await createMeditationWithCorrectVariables(testMeditation);
        
        console.log('✅ Teste bem-sucedido:', result);
        return true;
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
        return false;
    }
}

// Função para substituir a função de criação no painel admin
function replaceAdminCreationFunction() {
    console.log('🔧 Substituindo função de criação no painel admin...');
    
    // Substituir a função de criação de meditações
    if (window.adminSupabaseSync && window.adminSupabaseSync.syncMeditationToSupabase) {
        const originalFunction = window.adminSupabaseSync.syncMeditationToSupabase;
        
        window.adminSupabaseSync.syncMeditationToSupabase = async function(meditation) {
            console.log('🔄 Sincronizando meditação com variáveis corrigidas...');
            
            try {
                const supabaseVars = getSupabaseVariables();
                if (!supabaseVars) {
                    console.error('❌ Variáveis do Supabase não encontradas');
                    return false;
                }
                
                // Mapear dados para estrutura do Supabase
                const supabaseData = {
                    title: meditation.title || meditation.name,
                    content: meditation.content || meditation.description || '',
                    category_id: meditation.category_id || meditation.categoryId,
                    duration: meditation.duration || 10,
                    status: meditation.status || 'available',
                    type: meditation.type || 'free',
                    difficulty: meditation.difficulty || 'intermediate',
                    is_active: meditation.is_active !== undefined ? meditation.is_active : true,
                    sort_order: meditation.sort_order || meditation.sortOrder || 0,
                    bible_verse: meditation.bible_verse || meditation.bibleVerse || '',
                    prayer: meditation.prayer || '',
                    practical_application: meditation.practical_application || meditation.practicalApplication || '',
                    tags: meditation.tags || [],
                    icon: meditation.icon || '',
                    color: meditation.color || '#7ee787',
                    created_by: meditation.created_by || meditation.createdBy || null,
                    version: meditation.version || 1
                };
                
                console.log('📤 Dados para enviar ao Supabase:', supabaseData);
                
                // Fazer requisição para criar meditação
                const response = await fetch(`${supabaseVars.url}/rest/v1/meditations`, {
                    method: 'POST',
                    headers: {
                        'apikey': supabaseVars.key,
                        'Authorization': `Bearer ${supabaseVars.key}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify(supabaseData)
                });
                
                console.log('📊 Status da resposta:', response.status);
                
                if (response.ok) {
                    const result = await response.json();
                    console.log('✅ Meditação criada no Supabase:', result);
                    
                    // Atualizar ID local com ID do Supabase
                    meditation.supabase_id = result[0].id;
                    
                    return true;
                } else {
                    const errorData = await response.json();
                    console.error('❌ Erro ao criar meditação no Supabase:', errorData);
                    return false;
                }
                
            } catch (error) {
                console.error('❌ Erro na sincronização:', error);
                return false;
            }
        };
        
        console.log('✅ Função de criação substituída');
    } else {
        console.error('❌ Função adminSupabaseSync.syncMeditationToSupabase não encontrada');
    }
}

// Exportar funções
window.getSupabaseVariables = getSupabaseVariables;
window.createMeditationWithCorrectVariables = createMeditationWithCorrectVariables;
window.testMeditationCreation = testMeditationCreation;
window.replaceAdminCreationFunction = replaceAdminCreationFunction;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção das variáveis carregado');
    
    setTimeout(async () => {
        console.log('🔧 Aplicando correções...');
        
        // Verificar variáveis
        const vars = getSupabaseVariables();
        if (vars) {
            console.log('✅ Variáveis do Supabase obtidas:', vars.url);
            
            // Substituir função de criação
            replaceAdminCreationFunction();
            
            // Testar criação
            await testMeditationCreation();
        } else {
            console.error('❌ Não foi possível obter as variáveis do Supabase');
        }
    }, 2000);
});

console.log('✅ Script de correção das variáveis do Supabase carregado'); 