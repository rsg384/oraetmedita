// Script de sincronização completo para tabela meditations
console.log('🔄 Script de sincronização completa de meditações carregado');

// Função para mapear dados do frontend para a estrutura do Supabase
function mapMeditationToSupabase(meditation) {
    console.log('📋 Mapeando meditação para estrutura do Supabase:', meditation);
    
    return {
        // Campos principais
        title: meditation.title || meditation.name,
        content: meditation.content || meditation.description || '',
        category_id: meditation.category_id || meditation.categoryId,
        
        // Campos de configuração
        duration: meditation.duration || 10,
        status: meditation.status || 'available',
        type: meditation.type || 'free',
        difficulty: meditation.difficulty || 'intermediate',
        is_active: meditation.is_active !== undefined ? meditation.is_active : true,
        sort_order: meditation.sort_order || meditation.sortOrder || 0,
        
        // Campos de conteúdo espiritual
        bible_verse: meditation.bible_verse || meditation.bibleVerse || '',
        prayer: meditation.prayer || '',
        practical_application: meditation.practical_application || meditation.practicalApplication || '',
        
        // Campos de metadados
        tags: meditation.tags || [],
        icon: meditation.icon || '',
        color: meditation.color || '#7ee787',
        
        // Campos de controle
        created_by: meditation.created_by || meditation.createdBy || null,
        version: meditation.version || 1
    };
}

// Função para criar meditação no Supabase
async function createMeditationInSupabase(meditationData) {
    console.log('🔄 Criando meditação no Supabase...');
    
    try {
        // Mapear dados para estrutura do Supabase
        const supabaseData = mapMeditationToSupabase(meditationData);
        
        console.log('📤 Dados para enviar ao Supabase:', supabaseData);
        
        // Verificar se as variáveis do Supabase estão disponíveis
        if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
            throw new Error('Variáveis do Supabase não encontradas');
        }
        
        // Fazer requisição para criar meditação
        const response = await fetch(`${SUPABASE_URL}/rest/v1/meditations`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(supabaseData)
        });
        
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

// Função para atualizar meditação no Supabase
async function updateMeditationInSupabase(meditationId, meditationData) {
    console.log('🔄 Atualizando meditação no Supabase:', meditationId);
    
    try {
        // Mapear dados para estrutura do Supabase
        const supabaseData = mapMeditationToSupabase(meditationData);
        
        console.log('📤 Dados para atualizar no Supabase:', supabaseData);
        
        // Verificar se as variáveis do Supabase estão disponíveis
        if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
            throw new Error('Variáveis do Supabase não encontradas');
        }
        
        // Fazer requisição para atualizar meditação
        const response = await fetch(`${SUPABASE_URL}/rest/v1/meditations?id=eq.${meditationId}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(supabaseData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Meditação atualizada no Supabase:', result);
            return result;
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao atualizar meditação no Supabase:', errorData);
            throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro desconhecido'}`);
        }
        
    } catch (error) {
        console.error('❌ Erro na atualização da meditação:', error);
        throw error;
    }
}

// Função para deletar meditação no Supabase
async function deleteMeditationInSupabase(meditationId) {
    console.log('🔄 Deletando meditação no Supabase:', meditationId);
    
    try {
        // Verificar se as variáveis do Supabase estão disponíveis
        if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
            throw new Error('Variáveis do Supabase não encontradas');
        }
        
        // Fazer requisição para deletar meditação
        const response = await fetch(`${SUPABASE_URL}/rest/v1/meditations?id=eq.${meditationId}`, {
            method: 'DELETE',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Meditação deletada no Supabase');
            return true;
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao deletar meditação no Supabase:', errorData);
            throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro desconhecido'}`);
        }
        
    } catch (error) {
        console.error('❌ Erro na deleção da meditação:', error);
        throw error;
    }
}

// Função para buscar meditações do Supabase
async function getMeditationsFromSupabase() {
    console.log('🔄 Buscando meditações do Supabase...');
    
    try {
        // Verificar se as variáveis do Supabase estão disponíveis
        if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
            throw new Error('Variáveis do Supabase não encontradas');
        }
        
        // Fazer requisição para buscar meditações
        const response = await fetch(`${SUPABASE_URL}/rest/v1/meditations?select=*&is_active=eq.true&order=created_at.desc`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const meditations = await response.json();
            console.log('✅ Meditações carregadas do Supabase:', meditations.length);
            return meditations;
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao buscar meditações do Supabase:', errorData);
            throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro desconhecido'}`);
        }
        
    } catch (error) {
        console.error('❌ Erro ao buscar meditações:', error);
        throw error;
    }
}

// Função para sincronizar meditações locais com Supabase
async function syncLocalMeditationsToSupabase() {
    console.log('🔄 Sincronizando meditações locais com Supabase...');
    
    try {
        // Buscar meditações locais
        const localMeditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        console.log('📋 Meditações locais encontradas:', localMeditations.length);
        
        // Buscar meditações do Supabase
        const supabaseMeditations = await getMeditationsFromSupabase();
        console.log('📋 Meditações do Supabase encontradas:', supabaseMeditations.length);
        
        // Criar mapa de IDs do Supabase
        const supabaseIds = new Set(supabaseMeditations.map(m => m.id));
        
        // Filtrar meditações locais que não estão no Supabase
        const meditationsToSync = localMeditations.filter(meditation => {
            // Se a meditação tem ID do Supabase, não precisa sincronizar
            if (meditation.supabase_id) {
                return false;
            }
            return true;
        });
        
        console.log('📋 Meditações para sincronizar:', meditationsToSync.length);
        
        // Sincronizar cada meditação
        for (const meditation of meditationsToSync) {
            try {
                console.log('🔄 Sincronizando meditação:', meditation.title);
                
                const result = await createMeditationInSupabase(meditation);
                
                // Atualizar ID local com ID do Supabase
                meditation.supabase_id = result[0].id;
                
                console.log('✅ Meditação sincronizada:', meditation.title);
                
            } catch (error) {
                console.error('❌ Erro ao sincronizar meditação:', meditation.title, error);
            }
        }
        
        // Salvar meditações atualizadas no localStorage
        localStorage.setItem('meditations', JSON.stringify(localMeditations));
        
        console.log('✅ Sincronização concluída');
        return true;
        
    } catch (error) {
        console.error('❌ Erro na sincronização:', error);
        return false;
    }
}

// Função para testar a nova estrutura
async function testNewMeditationStructure() {
    console.log('🧪 Testando nova estrutura de meditações...');
    
    try {
        // Buscar primeira categoria disponível
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const testCategory = categories[0];
        
        if (!testCategory) {
            throw new Error('Nenhuma categoria disponível para teste');
        }
        
        // Criar meditação de teste
        const testMeditation = {
            title: 'Teste Nova Estrutura',
            content: 'Esta é uma meditação de teste para verificar a nova estrutura.',
            category_id: testCategory.id,
            duration: 20,
            status: 'available',
            type: 'free',
            difficulty: 'beginner',
            bible_verse: 'João 3:16',
            prayer: 'Senhor, obrigado por este teste.',
            practical_application: 'Aplicar os ensinamentos do teste.',
            tags: ['teste', 'nova-estrutura'],
            icon: '🧪',
            color: '#7ee787',
            is_active: true,
            sort_order: 0
        };
        
        console.log('📋 Meditação de teste:', testMeditation);
        
        // Tentar criar no Supabase
        const result = await createMeditationInSupabase(testMeditation);
        
        console.log('✅ Teste bem-sucedido:', result);
        return true;
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
        return false;
    }
}

// Exportar funções
window.createMeditationInSupabase = createMeditationInSupabase;
window.updateMeditationInSupabase = updateMeditationInSupabase;
window.deleteMeditationInSupabase = deleteMeditationInSupabase;
window.getMeditationsFromSupabase = getMeditationsFromSupabase;
window.syncLocalMeditationsToSupabase = syncLocalMeditationsToSupabase;
window.testNewMeditationStructure = testNewMeditationStructure;
window.mapMeditationToSupabase = mapMeditationToSupabase;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de sincronização completa carregado');
    
    // Testar estrutura automaticamente
    setTimeout(async () => {
        console.log('🧪 Testando estrutura automaticamente...');
        await testNewMeditationStructure();
    }, 2000);
});

console.log('✅ Script de sincronização completa de meditações carregado'); 