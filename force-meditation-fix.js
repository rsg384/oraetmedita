// Script para forçar correção da tabela meditations
console.log('🚀 Script de correção forçada da tabela meditations carregado');

// Função para forçar correção imediata
async function forceMeditationFix() {
    console.log('🔧 Forçando correção da tabela meditations...');
    
    try {
        // 1. Verificar se as variáveis do Supabase estão disponíveis
        if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
            console.error('❌ Variáveis do Supabase não encontradas');
            console.log('ℹ️ Verifique se supabase-config.js está carregado');
            return false;
        }
        
        console.log('✅ Variáveis do Supabase encontradas');
        
        // 2. Testar acesso à tabela meditations
        console.log('🔍 Testando acesso à tabela meditations...');
        const testResponse = await fetch(`${SUPABASE_URL}/rest/v1/meditations?select=*&limit=1`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (testResponse.ok) {
            console.log('✅ Tabela meditations acessível');
        } else {
            const errorData = await testResponse.json();
            console.error('❌ Erro ao acessar tabela meditations:', errorData);
            
            if (errorData.message && errorData.message.includes('duration')) {
                console.error('❌ ERRO: Coluna duration não encontrada na tabela meditations');
                console.log('📋 Execute este SQL no painel do Supabase:');
                console.log(`
                    CREATE TABLE IF NOT EXISTS meditations (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        title TEXT NOT NULL,
                        content TEXT NOT NULL,
                        category_id UUID REFERENCES categories(id),
                        duration INTEGER DEFAULT 10,
                        difficulty TEXT DEFAULT 'intermediate',
                        tags TEXT[] DEFAULT '{}',
                        is_active BOOLEAN DEFAULT true,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        created_by UUID,
                        bible_verse TEXT,
                        prayer TEXT,
                        practical_application TEXT,
                        sort_order INTEGER DEFAULT 0
                    );
                `);
                return false;
            }
        }
        
        // 3. Corrigir função de criação de meditações
        console.log('🔧 Corrigindo função de criação de meditações...');
        
        if (window.supabaseManager && window.supabaseManager.createMeditation) {
            const originalFunction = window.supabaseManager.createMeditation;
            
            window.supabaseManager.createMeditation = async function(meditationData) {
                console.log('🔄 Criando meditação no Supabase (versão corrigida)...');
                
                try {
                    // Estrutura correta para Supabase
                    const supabaseData = {
                        title: meditationData.title || meditationData.name,
                        content: meditationData.content || meditationData.description || '',
                        category_id: meditationData.category_id || meditationData.categoryId,
                        duration: meditationData.duration || 10,
                        difficulty: meditationData.difficulty || 'intermediate',
                        tags: meditationData.tags || [],
                        is_active: meditationData.is_active !== undefined ? meditationData.is_active : true,
                        bible_verse: meditationData.bible_verse || meditationData.bibleVerse || '',
                        prayer: meditationData.prayer || '',
                        practical_application: meditationData.practical_application || meditationData.practicalApplication || '',
                        sort_order: meditationData.sort_order || meditationData.sortOrder || 0
                    };
                    
                    console.log('📤 Dados para enviar ao Supabase:', supabaseData);
                    
                    const response = await this.request('/meditations', {
                        method: 'POST',
                        body: supabaseData
                    });
                    
                    console.log('✅ Meditação criada no Supabase:', response);
                    return response;
                    
                } catch (error) {
                    console.error('❌ Erro ao criar meditação no Supabase:', error);
                    throw error;
                }
            };
            
            console.log('✅ Função de criação de meditações corrigida');
        } else {
            console.warn('⚠️ Função createMeditation não encontrada');
        }
        
        // 4. Corrigir função de sincronização do admin
        console.log('🔧 Corrigindo função de sincronização do admin...');
        
        if (window.adminSupabaseSync && window.adminSupabaseSync.syncMeditationToSupabase) {
            const originalFunction = window.adminSupabaseSync.syncMeditationToSupabase;
            
            window.adminSupabaseSync.syncMeditationToSupabase = async function(meditation, operation = 'create') {
                console.log('🔄 Sincronizando meditação para Supabase (versão corrigida)...');
                
                try {
                    // Estrutura correta para Supabase
                    const supabaseData = {
                        title: meditation.title || meditation.name,
                        content: meditation.content || meditation.description || '',
                        category_id: meditation.category_id || meditation.categoryId,
                        duration: meditation.duration || 10,
                        difficulty: meditation.difficulty || 'intermediate',
                        tags: meditation.tags || [],
                        is_active: meditation.is_active !== undefined ? meditation.is_active : true,
                        bible_verse: meditation.bible_verse || meditation.bibleVerse || '',
                        prayer: meditation.prayer || '',
                        practical_application: meditation.practical_application || meditation.practicalApplication || '',
                        sort_order: meditation.sort_order || meditation.sortOrder || 0
                    };
                    
                    console.log('📤 Dados para enviar ao Supabase:', supabaseData);
                    
                    let response;
                    if (operation === 'create') {
                        response = await this.supabaseManager.createMeditation(supabaseData);
                    } else if (operation === 'update') {
                        response = await this.supabaseManager.updateMeditation(meditation.id, supabaseData);
                    } else if (operation === 'delete') {
                        response = await this.supabaseManager.deleteMeditation(meditation.id);
                    }
                    
                    console.log('✅ Meditação sincronizada com sucesso:', response);
                    return response;
                    
                } catch (error) {
                    console.error('❌ Erro ao sincronizar meditação:', error);
                    throw error;
                }
            };
            
            console.log('✅ Função de sincronização do admin corrigida');
        } else {
            console.warn('⚠️ Função syncMeditationToSupabase não encontrada');
        }
        
        // 5. Testar criação de meditação
        console.log('🧪 Testando criação de meditação...');
        
        const testMeditation = {
            title: 'Teste de Meditação Forçada',
            content: 'Conteúdo de teste para verificar sincronização forçada',
            category_id: 'c7293f33-a9fd-4986-ab51-f164d2ab9cfa', // ID da categoria Salmos
            duration: 15,
            difficulty: 'intermediate',
            tags: ['teste', 'forçado'],
            is_active: true,
            bible_verse: 'Salmo 1:1-2',
            prayer: 'Oração de teste forçada',
            practical_application: 'Aplicação prática de teste forçada'
        };
        
        console.log('📋 Meditação de teste:', testMeditation);
        
        if (window.supabaseManager && window.supabaseManager.createMeditation) {
            const result = await window.supabaseManager.createMeditation(testMeditation);
            console.log('✅ Teste de criação forçada bem-sucedido:', result);
            return true;
        } else {
            console.warn('⚠️ Função createMeditation não disponível');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro na correção forçada:', error);
        return false;
    }
}

// Função para testar sincronização manual
async function testManualSync() {
    console.log('🧪 Testando sincronização manual...');
    
    try {
        // Simular criação de meditação
        const testMeditation = {
            title: 'Teste Manual de Sincronização',
            content: 'Conteúdo de teste para sincronização manual',
            category_id: 'c7293f33-a9fd-4986-ab51-f164d2ab9cfa',
            duration: 20,
            difficulty: 'beginner',
            tags: ['manual', 'teste'],
            is_active: true,
            bible_verse: 'João 3:16',
            prayer: 'Oração de teste manual',
            practical_application: 'Aplicação prática manual'
        };
        
        console.log('📋 Testando sincronização manual:', testMeditation);
        
        if (window.adminSupabaseSync && window.adminSupabaseSync.syncMeditationToSupabase) {
            const result = await window.adminSupabaseSync.syncMeditationToSupabase(testMeditation, 'create');
            console.log('✅ Sincronização manual bem-sucedida:', result);
            return true;
        } else {
            console.warn('⚠️ Função syncMeditationToSupabase não disponível');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro na sincronização manual:', error);
        return false;
    }
}

// Exportar funções
window.forceMeditationFix = forceMeditationFix;
window.testManualSync = testManualSync;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção forçada carregado');
    
    // Aguardar um pouco e executar correção
    setTimeout(async () => {
        console.log('🔧 Executando correção forçada da tabela meditations...');
        await forceMeditationFix();
    }, 2000);
});

// Executar imediatamente se já carregado
if (document.readyState === 'loading') {
    console.log('📋 Documento ainda carregando, aguardando...');
} else {
    console.log('🚀 Documento já carregado, executando correção imediatamente...');
    setTimeout(async () => {
        await forceMeditationFix();
    }, 1000);
}

console.log('✅ Script de correção forçada da tabela meditations carregado'); 