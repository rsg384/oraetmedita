// Script para debugar problemas de sincronização de meditações
console.log('🔍 Script de debug de sincronização carregado');

// Função para validar dados da meditação
function validateMeditationData(meditation) {
    console.log('🔍 Validando dados da meditação:', meditation);
    
    // Verificar se a categoria existe
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const categoryExists = categories.some(cat => cat.id === meditation.categoryId);
    
    if (!categoryExists) {
        console.error('❌ Categoria não encontrada:', meditation.categoryId);
        console.log('📋 Categorias disponíveis:', categories.map(c => ({ id: c.id, name: c.name })));
        return false;
    }
    
    console.log('✅ Categoria encontrada:', meditation.categoryId);
    return true;
}

// Função para testar sincronização passo a passo
async function testSyncStepByStep() {
    console.log('🧪 Testando sincronização passo a passo...');
    
    try {
        // Usar uma categoria real existente
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const realCategory = categories[0]; // Primeira categoria disponível
        
        if (!realCategory) {
            console.error('❌ Nenhuma categoria encontrada');
            return false;
        }
        
        console.log('📋 Usando categoria real:', realCategory.name, realCategory.id);
        
        // Criar meditação de teste com categoria real
        const testMeditation = {
            title: 'Meditação Debug Test',
            content: 'Conteúdo de teste para debug',
            categoryId: realCategory.id, // Usar categoria real
            duration: 15,
            status: 'available',
            type: 'free',
            difficulty: 'intermediate',
            tags: ['debug', 'teste'],
            is_active: true,
            bible_verse: 'Salmo 1:1-2',
            prayer: 'Oração de teste',
            practical_application: 'Aplicação prática de teste'
        };
        
        console.log('📋 Meditação de teste:', testMeditation);
        
        // Validar dados
        if (!validateMeditationData(testMeditation)) {
            console.error('❌ Dados da meditação inválidos');
            return false;
        }
        
        // Testar criação no Supabase
        if (window.supabaseManager && window.supabaseManager.createMeditation) {
            console.log('🔄 Testando criação no Supabase...');
            
            const result = await window.supabaseManager.createMeditation(testMeditation);
            console.log('✅ Meditação criada no Supabase:', result);
            return true;
        } else {
            console.error('❌ Função createMeditation não disponível');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro no teste de sincronização:', error);
        return false;
    }
}

// Função para verificar estrutura das tabelas
async function checkTableStructure() {
    console.log('📊 Verificando estrutura das tabelas...');
    
    try {
        // Verificar tabela categories
        const categoriesResponse = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (categoriesResponse.ok) {
            const categories = await categoriesResponse.json();
            console.log('✅ Estrutura da tabela categories:', {
                count: categories.length,
                sample: categories[0] || 'Nenhuma categoria encontrada'
            });
        } else {
            console.error('❌ Erro ao acessar tabela categories');
        }
        
        // Verificar tabela meditations
        console.log('📊 Verificando estrutura da tabela meditations...');
        const meditationsResponse = await fetch(`${SUPABASE_URL}/rest/v1/meditations?select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (meditationsResponse.ok) {
            const meditations = await meditationsResponse.json();
            console.log('✅ Estrutura da tabela meditations:', {
                count: meditations.length,
                sample: meditations[0] || 'Nenhuma meditação encontrada'
            });
        } else {
            console.error('❌ Erro ao acessar tabela meditations');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao verificar estrutura das tabelas:', error);
        return false;
    }
}

// Função para testar conexão com Supabase
async function testSupabaseConnection() {
    console.log('🌐 Testando conexão com Supabase...');
    
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=*&limit=1`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Conexão com Supabase funcionando');
            return true;
        } else {
            console.error('❌ Erro na conexão com Supabase:', response.status);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao testar conexão:', error);
        return false;
    }
}

// Função principal de debug
async function debugSyncIssue() {
    console.log('🔍 Iniciando debug de sincronização...');
    
    const results = {
        connection: false,
        categoriesTable: false,
        meditationsTable: false,
        syncTest: false
    };
    
    try {
        // 1. Testar conexão
        results.connection = await testSupabaseConnection();
        
        // 2. Verificar estrutura das tabelas
        const tableStructure = await checkTableStructure();
        results.categoriesTable = tableStructure;
        results.meditationsTable = tableStructure;
        
        // 3. Testar sincronização
        results.syncTest = await testSyncStepByStep();
        
        console.log('📊 Resultado do debug:', results);
        
        if (results.syncTest) {
            console.log('✅ Sincronização funcionando corretamente');
        } else {
            console.log('❌ Problema: Sincronização falhou');
            
            if (!results.connection) {
                console.log('💡 Solução: Verificar configuração do Supabase');
            } else if (!results.categoriesTable) {
                console.log('💡 Solução: Verificar tabela categories');
            } else if (!results.meditationsTable) {
                console.log('💡 Solução: Verificar tabela meditations');
            } else {
                console.log('💡 Solução: Verificar função de sincronização');
            }
        }
        
        return results;
        
    } catch (error) {
        console.error('❌ Erro no debug:', error);
        return results;
    }
}

// Função para testar criação manual
async function testManualCreation() {
    console.log('🧪 Testando criação manual...');
    
    try {
        // Pegar primeira categoria disponível
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const realCategory = categories[0];
        
        if (!realCategory) {
            console.error('❌ Nenhuma categoria disponível');
            return false;
        }
        
        const testMeditation = {
            title: 'Teste Manual de Criação',
            content: 'Conteúdo de teste para criação manual',
            category_id: realCategory.id,
            duration: 20,
            difficulty: 'beginner',
            tags: ['manual', 'teste'],
            is_active: true,
            bible_verse: 'João 3:16',
            prayer: 'Oração de teste manual',
            practical_application: 'Aplicação prática manual'
        };
        
        console.log('📋 Testando criação manual:', testMeditation);
        
        if (window.supabaseManager && window.supabaseManager.createMeditation) {
            const result = await window.supabaseManager.createMeditation(testMeditation);
            console.log('✅ Criação manual bem-sucedida:', result);
            return true;
        } else {
            console.error('❌ Função createMeditation não disponível');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro na criação manual:', error);
        return false;
    }
}

// Exportar funções
window.debugSyncIssue = debugSyncIssue;
window.testManualCreation = testManualCreation;
window.testSyncStepByStep = testSyncStepByStep;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de debug carregado');
    
    // Aguardar um pouco e executar debug
    setTimeout(async () => {
        console.log('🔍 Executando debug automático...');
        await debugSyncIssue();
    }, 1000);
});

console.log('✅ Script de debug de sincronização carregado'); 