// Script para debugar problemas de sincronização de meditações
console.log('🔍 Iniciando debug de sincronização de meditações...');

// Função para verificar estrutura dos dados
function validateMeditationData(meditation) {
    console.log('🔍 Validando dados da meditação:', meditation);
    
    const requiredFields = ['title', 'categoryId', 'duration', 'status', 'type'];
    const missingFields = requiredFields.filter(field => !meditation[field]);
    
    if (missingFields.length > 0) {
        console.error('❌ Campos obrigatórios ausentes:', missingFields);
        return false;
    }
    
    // Verificar se categoryId existe nas categorias
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const categoryExists = categories.some(cat => cat.id === meditation.categoryId);
    
    if (!categoryExists) {
        console.error('❌ Categoria não encontrada:', meditation.categoryId);
        return false;
    }
    
    console.log('✅ Dados da meditação válidos');
    return true;
}

// Função para testar sincronização passo a passo
async function testSyncStepByStep() {
    console.log('🧪 Testando sincronização passo a passo...');
    
    try {
        // 1. Verificar se adminSupabaseSync está disponível
        if (!window.adminSupabaseSync) {
            console.error('❌ adminSupabaseSync não disponível');
            return false;
        }
        
        // 2. Verificar se supabaseManager está disponível
        if (!window.supabaseManager) {
            console.error('❌ supabaseManager não disponível');
            return false;
        }
        
        // 3. Criar dados de teste
        const testMeditation = {
            title: 'Meditação Debug Test',
            categoryId: 'cat_test',
            duration: 15,
            status: 'available',
            type: 'free',
            icon: '📖',
            lectio: 'Conteúdo de teste',
            meditatio: 'Meditação de teste',
            oratio: 'Oração de teste',
            contemplatio: 'Contemplação de teste'
        };
        
        // 4. Validar dados
        if (!validateMeditationData(testMeditation)) {
            return false;
        }
        
        // 5. Testar criação local
        console.log('📝 Criando meditação localmente...');
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        const newMeditation = {
            id: 'med_debug_' + Date.now(),
            ...testMeditation,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            total: 0,
            completed: 0,
            inProgress: 0,
            locked: 0
        };
        
        meditations.push(newMeditation);
        localStorage.setItem('meditations', JSON.stringify(meditations));
        console.log('✅ Meditação criada localmente');
        
        // 6. Testar sincronização direta com Supabase
        console.log('🔄 Testando sincronização direta...');
        try {
            const result = await window.supabaseManager.createMeditation({
                title: newMeditation.title,
                category_id: newMeditation.categoryId,
                duration: newMeditation.duration,
                status: newMeditation.status,
                type: newMeditation.type,
                icon: newMeditation.icon,
                lectio: newMeditation.lectio,
                meditatio: newMeditation.meditatio,
                oratio: newMeditation.oratio,
                contemplatio: newMeditation.contemplatio
            });
            
            console.log('✅ Sincronização direta bem-sucedida:', result);
            return true;
            
        } catch (directError) {
            console.error('❌ Erro na sincronização direta:', directError);
            
            // 7. Testar sincronização via adminSupabaseSync
            console.log('🔄 Testando sincronização via adminSupabaseSync...');
            try {
                await window.adminSupabaseSync.syncMeditation(newMeditation, 'create');
                console.log('✅ Sincronização via adminSupabaseSync bem-sucedida');
                return true;
            } catch (syncError) {
                console.error('❌ Erro na sincronização via adminSupabaseSync:', syncError);
                return false;
            }
        }
        
    } catch (error) {
        console.error('❌ Erro geral no teste:', error);
        return false;
    }
}

// Função para verificar conexão com Supabase
async function testSupabaseConnection() {
    console.log('🌐 Testando conexão com Supabase...');
    
    try {
        if (!window.supabaseManager) {
            console.error('❌ supabaseManager não disponível');
            return false;
        }
        
        const testResult = await window.supabaseManager.testConnection();
        console.log('✅ Conexão com Supabase:', testResult);
        return true;
        
    } catch (error) {
        console.error('❌ Erro na conexão com Supabase:', error);
        return false;
    }
}

// Função para verificar estrutura da tabela meditations
async function checkMeditationsTable() {
    console.log('📊 Verificando estrutura da tabela meditations...');
    
    try {
        if (!window.supabaseManager) {
            console.error('❌ supabaseManager não disponível');
            return false;
        }
        
        const meditations = await window.supabaseManager.getMeditations();
        console.log('✅ Estrutura da tabela meditations:', {
            count: meditations.length,
            sample: meditations[0] || 'Nenhuma meditação encontrada'
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao verificar tabela meditations:', error);
        return false;
    }
}

// Função para verificar estrutura da tabela categories
async function checkCategoriesTable() {
    console.log('📋 Verificando estrutura da tabela categories...');
    
    try {
        if (!window.supabaseManager) {
            console.error('❌ supabaseManager não disponível');
            return false;
        }
        
        const categories = await window.supabaseManager.getCategories();
        console.log('✅ Estrutura da tabela categories:', {
            count: categories.length,
            sample: categories[0] || 'Nenhuma categoria encontrada'
        });
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao verificar tabela categories:', error);
        return false;
    }
}

// Função principal de debug
async function debugSyncIssue() {
    console.log('🔍 Iniciando debug completo de sincronização...');
    
    const results = {
        connection: false,
        categoriesTable: false,
        meditationsTable: false,
        syncTest: false
    };
    
    try {
        // 1. Testar conexão
        results.connection = await testSupabaseConnection();
        
        // 2. Verificar tabela categories
        results.categoriesTable = await checkCategoriesTable();
        
        // 3. Verificar tabela meditations
        results.meditationsTable = await checkMeditationsTable();
        
        // 4. Testar sincronização
        results.syncTest = await testSyncStepByStep();
        
        console.log('📊 Resultado do debug:', results);
        
        // Análise dos resultados
        if (!results.connection) {
            console.error('❌ Problema: Conexão com Supabase falhou');
        }
        
        if (!results.categoriesTable) {
            console.error('❌ Problema: Tabela categories não acessível');
        }
        
        if (!results.meditationsTable) {
            console.error('❌ Problema: Tabela meditations não acessível');
        }
        
        if (!results.syncTest) {
            console.error('❌ Problema: Sincronização falhou');
        }
        
        if (results.connection && results.categoriesTable && results.meditationsTable && results.syncTest) {
            console.log('✅ Todos os testes passaram - sistema funcionando corretamente');
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ Erro no debug:', error);
        return results;
    }
}

// Função para limpar dados de debug
function clearDebugData() {
    console.log('🧹 Limpando dados de debug...');
    
    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
    const filteredMeditations = meditations.filter(m => 
        !m.title.includes('Debug') && !m.title.includes('Test')
    );
    
    localStorage.setItem('meditations', JSON.stringify(filteredMeditations));
    
    console.log('✅ Dados de debug removidos');
}

// Exportar funções para uso global
window.debugSyncIssue = debugSyncIssue;
window.testSyncStepByStep = testSyncStepByStep;
window.testSupabaseConnection = testSupabaseConnection;
window.checkMeditationsTable = checkMeditationsTable;
window.checkCategoriesTable = checkCategoriesTable;
window.validateMeditationData = validateMeditationData;
window.clearDebugData = clearDebugData;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de debug carregado');
    
    // Aguardar um pouco e executar debug
    setTimeout(async () => {
        console.log('🔍 Executando debug automático...');
        await debugSyncIssue();
    }, 3000);
});

console.log('✅ Script de debug de sincronização carregado'); 