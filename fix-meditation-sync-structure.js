// Script para corrigir estrutura de dados das meditações para sincronização
console.log('🔧 Corrigindo estrutura de dados das meditações...');

// Função para corrigir estrutura de dados da meditação
function fixMeditationDataStructure(meditation) {
    console.log('🔧 Corrigindo estrutura da meditação:', meditation.title);
    
    // Estrutura correta para Supabase
    const fixedMeditation = {
        id: meditation.id || meditation.meditation_id,
        title: meditation.title || meditation.name,
        content: meditation.content || meditation.description || '',
        category_id: meditation.category_id || meditation.categoryId,
        duration: meditation.duration || 10,
        difficulty: meditation.difficulty || 'intermediate',
        tags: meditation.tags || [],
        is_active: meditation.is_active !== undefined ? meditation.is_active : true,
        created_at: meditation.created_at || meditation.createdAt || new Date().toISOString(),
        updated_at: meditation.updated_at || meditation.updatedAt || new Date().toISOString(),
        created_by: meditation.created_by || meditation.createdBy,
        bible_verse: meditation.bible_verse || meditation.bibleVerse || '',
        prayer: meditation.prayer || '',
        practical_application: meditation.practical_application || meditation.practicalApplication || '',
        sort_order: meditation.sort_order || meditation.sortOrder || 0
    };
    
    console.log('✅ Estrutura corrigida:', fixedMeditation);
    return fixedMeditation;
}

// Função para corrigir função de sincronização de meditações
function fixMeditationSyncFunction() {
    console.log('🔧 Corrigindo função de sincronização de meditações...');
    
    if (window.adminSupabaseSync && window.adminSupabaseSync.syncMeditationToSupabase) {
        const originalFunction = window.adminSupabaseSync.syncMeditationToSupabase;
        
        window.adminSupabaseSync.syncMeditationToSupabase = async function(meditation, operation = 'create') {
            console.log('🔄 Sincronizando meditação para Supabase (versão corrigida)...');
            
            try {
                // Corrigir estrutura dos dados
                const fixedMeditation = fixMeditationDataStructure(meditation);
                
                console.log('📋 Dados corrigidos para sincronização:', fixedMeditation);
                
                // Remover campos que não existem na tabela
                const { id, title, content, category_id, duration, difficulty, tags, is_active, created_at, updated_at, created_by, bible_verse, prayer, practical_application, sort_order } = fixedMeditation;
                
                const supabaseData = {
                    title,
                    content,
                    category_id,
                    duration,
                    difficulty,
                    tags,
                    is_active,
                    created_at,
                    updated_at,
                    created_by,
                    bible_verse,
                    prayer,
                    practical_application,
                    sort_order
                };
                
                console.log('📤 Dados para enviar ao Supabase:', supabaseData);
                
                let response;
                if (operation === 'create') {
                    response = await this.supabaseManager.createMeditation(supabaseData);
                } else if (operation === 'update') {
                    response = await this.supabaseManager.updateMeditation(id, supabaseData);
                } else if (operation === 'delete') {
                    response = await this.supabaseManager.deleteMeditation(id);
                }
                
                console.log('✅ Meditação sincronizada com sucesso:', response);
                return response;
                
            } catch (error) {
                console.error('❌ Erro ao sincronizar meditação:', error);
                throw error;
            }
        };
        
        console.log('✅ Função de sincronização de meditações corrigida');
    } else {
        console.warn('⚠️ Função syncMeditationToSupabase não encontrada');
    }
}

// Função para corrigir função de criação de meditações no Supabase
function fixSupabaseCreateMeditation() {
    console.log('🔧 Corrigindo função de criação de meditações no Supabase...');
    
    if (window.supabaseManager && window.supabaseManager.createMeditation) {
        const originalFunction = window.supabaseManager.createMeditation;
        
        window.supabaseManager.createMeditation = async function(meditationData) {
            console.log('🔄 Criando meditação no Supabase (versão corrigida)...');
            
            try {
                // Garantir que os dados estão na estrutura correta
                const fixedData = fixMeditationDataStructure(meditationData);
                
                // Remover campos que não devem ser enviados na criação
                const { id, created_at, updated_at, ...createData } = fixedData;
                
                console.log('📤 Dados para criação:', createData);
                
                const response = await this.request('/meditations', {
                    method: 'POST',
                    body: createData
                });
                
                console.log('✅ Meditação criada no Supabase:', response);
                return response;
                
            } catch (error) {
                console.error('❌ Erro ao criar meditação no Supabase:', error);
                throw error;
            }
        };
        
        console.log('✅ Função de criação de meditações no Supabase corrigida');
    } else {
        console.warn('⚠️ Função createMeditation não encontrada');
    }
}

// Função para corrigir função de atualização de meditações no Supabase
function fixSupabaseUpdateMeditation() {
    console.log('🔧 Corrigindo função de atualização de meditações no Supabase...');
    
    if (window.supabaseManager && window.supabaseManager.updateMeditation) {
        const originalFunction = window.supabaseManager.updateMeditation;
        
        window.supabaseManager.updateMeditation = async function(id, meditationData) {
            console.log('🔄 Atualizando meditação no Supabase (versão corrigida)...');
            
            try {
                // Garantir que os dados estão na estrutura correta
                const fixedData = fixMeditationDataStructure(meditationData);
                
                // Remover campos que não devem ser atualizados
                const { id: _, created_at, ...updateData } = fixedData;
                updateData.updated_at = new Date().toISOString();
                
                console.log('📤 Dados para atualização:', updateData);
                
                const response = await this.request(`/meditations?id=eq.${id}`, {
                    method: 'PATCH',
                    body: updateData
                });
                
                console.log('✅ Meditação atualizada no Supabase:', response);
                return response;
                
            } catch (error) {
                console.error('❌ Erro ao atualizar meditação no Supabase:', error);
                throw error;
            }
        };
        
        console.log('✅ Função de atualização de meditações no Supabase corrigida');
    } else {
        console.warn('⚠️ Função updateMeditation não encontrada');
    }
}

// Função para verificar estrutura da tabela meditations
async function checkMeditationsTableStructure() {
    console.log('🔍 Verificando estrutura da tabela meditations...');
    
    try {
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
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar estrutura da tabela meditations:', error);
        return false;
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

// Função principal para corrigir estrutura de meditações
async function fixMeditationStructure() {
    console.log('🔧 Iniciando correção da estrutura de meditações...');
    
    // 1. Verificar estrutura da tabela
    const tableExists = await checkMeditationsTableStructure();
    
    if (!tableExists) {
        console.error('❌ Tabela meditations não está acessível');
        console.log('ℹ️ Execute o script fix-meditations-table.sql no Supabase');
        return;
    }
    
    // 2. Corrigir funções de sincronização
    fixMeditationSyncFunction();
    fixSupabaseCreateMeditation();
    fixSupabaseUpdateMeditation();
    
    // 3. Testar criação
    const testResult = await testMeditationCreation();
    
    if (testResult) {
        console.log('✅ Estrutura de meditações corrigida com sucesso');
    } else {
        console.warn('⚠️ Problemas na correção da estrutura');
    }
}

// Exportar funções
window.fixMeditationStructure = fixMeditationStructure;
window.fixMeditationDataStructure = fixMeditationDataStructure;
window.checkMeditationsTableStructure = checkMeditationsTableStructure;
window.testMeditationCreation = testMeditationCreation;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção da estrutura de meditações carregado');
    
    // Aguardar um pouco e executar correção
    setTimeout(async () => {
        console.log('🔧 Executando correção automática da estrutura de meditações...');
        await fixMeditationStructure();
    }, 1000);
});

console.log('✅ Script de correção da estrutura de meditações carregado'); 