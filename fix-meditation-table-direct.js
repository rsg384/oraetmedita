// Script direto para corrigir tabela meditations e sincronização
console.log('🔧 Corrigindo tabela meditations diretamente...');

// Função para verificar e corrigir estrutura da tabela
async function checkAndFixMeditationsTable() {
    console.log('🔍 Verificando estrutura da tabela meditations...');
    
    try {
        // Tentar acessar a tabela
        const response = await fetch(`${SUPABASE_URL}/rest/v1/meditations?select=*&limit=1`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Tabela meditations acessível');
            return true;
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao acessar tabela meditations:', errorData);
            
            // Se o erro for sobre coluna duration, vamos corrigir
            if (errorData.message && errorData.message.includes('duration')) {
                console.log('🔧 Erro de coluna duration detectado, corrigindo...');
                return await fixDurationColumn();
            }
            
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar tabela meditations:', error);
        return false;
    }
}

// Função para corrigir coluna duration
async function fixDurationColumn() {
    console.log('🔧 Corrigindo coluna duration...');
    
    try {
        // Tentar criar a coluna duration
        const alterResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sql: 'ALTER TABLE meditations ADD COLUMN IF NOT EXISTS duration INTEGER DEFAULT 10;'
            })
        });
        
        if (alterResponse.ok) {
            console.log('✅ Coluna duration adicionada');
            return true;
        } else {
            console.warn('⚠️ Não foi possível adicionar coluna via RPC, tentando método alternativo');
            return await createMeditationsTableFromScratch();
        }
        
    } catch (error) {
        console.error('❌ Erro ao corrigir coluna duration:', error);
        return await createMeditationsTableFromScratch();
    }
}

// Função para criar tabela meditations do zero
async function createMeditationsTableFromScratch() {
    console.log('🔧 Criando tabela meditations do zero...');
    
    try {
        // SQL para criar a tabela corretamente
        const createTableSQL = `
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
        `;
        
        console.log('📋 SQL para criar tabela:', createTableSQL);
        console.log('ℹ️ Execute este SQL no painel do Supabase:');
        console.log('1. Vá para SQL Editor no painel do Supabase');
        console.log('2. Cole o SQL acima');
        console.log('3. Execute o comando');
        
        return false; // Retorna false para indicar que precisa de ação manual
        
    } catch (error) {
        console.error('❌ Erro ao criar tabela:', error);
        return false;
    }
}

// Função para corrigir função de criação de meditações
function fixCreateMeditationFunction() {
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
                
                // Se o erro for sobre estrutura da tabela, mostrar instruções
                if (error.message && error.message.includes('duration')) {
                    console.error('❌ Erro de estrutura da tabela. Execute o SQL no Supabase:');
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
                }
                
                throw error;
            }
        };
        
        console.log('✅ Função de criação de meditações corrigida');
    } else {
        console.warn('⚠️ Função createMeditation não encontrada');
    }
}

// Função para testar criação de meditação
async function testMeditationCreation() {
    console.log('🧪 Testando criação de meditação...');
    
    try {
        const testMeditation = {
            title: 'Teste de Meditação',
            content: 'Conteúdo de teste para verificar sincronização',
            category_id: 'c7293f33-a9fd-4986-ab51-f164d2ab9cfa', // ID da categoria Salmos
            duration: 15,
            difficulty: 'intermediate',
            tags: ['teste', 'sincronização'],
            is_active: true,
            bible_verse: 'Salmo 1:1-2',
            prayer: 'Oração de teste',
            practical_application: 'Aplicação prática de teste'
        };
        
        console.log('📋 Meditação de teste:', testMeditation);
        
        if (window.supabaseManager && window.supabaseManager.createMeditation) {
            const result = await window.supabaseManager.createMeditation(testMeditation);
            console.log('✅ Teste de criação bem-sucedido:', result);
            return true;
        } else {
            console.warn('⚠️ Função createMeditation não disponível');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro no teste de criação:', error);
        return false;
    }
}

// Função para corrigir função de sincronização do admin
function fixAdminSyncFunction() {
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
}

// Função principal para corrigir tudo
async function fixMeditationTableAndSync() {
    console.log('🔧 Iniciando correção completa da tabela meditations...');
    
    // 1. Verificar estrutura da tabela
    const tableExists = await checkAndFixMeditationsTable();
    
    if (!tableExists) {
        console.error('❌ Tabela meditations não está acessível');
        console.log('ℹ️ Execute o SQL no painel do Supabase para criar a tabela');
        return;
    }
    
    // 2. Corrigir funções
    fixCreateMeditationFunction();
    fixAdminSyncFunction();
    
    // 3. Testar criação
    const testResult = await testMeditationCreation();
    
    if (testResult) {
        console.log('✅ Tabela meditations e sincronização corrigidas com sucesso');
    } else {
        console.warn('⚠️ Problemas na correção da tabela meditations');
    }
}

// Exportar funções
window.fixMeditationTableAndSync = fixMeditationTableAndSync;
window.checkAndFixMeditationsTable = checkAndFixMeditationsTable;
window.testMeditationCreation = testMeditationCreation;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção direta da tabela meditations carregado');
    
    // Aguardar um pouco e executar correção
    setTimeout(async () => {
        console.log('🔧 Executando correção automática da tabela meditations...');
        await fixMeditationTableAndSync();
    }, 1000);
});

console.log('✅ Script de correção direta da tabela meditations carregado'); 