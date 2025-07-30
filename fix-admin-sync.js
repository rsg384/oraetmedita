// Script para corrigir problemas de sincronização do painel administrativo
console.log('🔧 Iniciando correção do sistema de sincronização do painel administrativo...');

// Aguardar inicialização dos sistemas
async function waitForSystems() {
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos
    
    while (attempts < maxAttempts) {
        if (window.supabaseManager && window.adminSupabaseSync) {
            console.log('✅ Sistemas carregados:', {
                supabaseManager: !!window.supabaseManager,
                adminSupabaseSync: !!window.adminSupabaseSync
            });
            return true;
        }
        
        console.log(`⏳ Aguardando sistemas... (tentativa ${attempts + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }
    
    console.error('❌ Timeout: Sistemas não carregados');
    return false;
}

// Função para forçar inicialização do adminSupabaseSync
async function forceAdminSyncInit() {
    try {
        console.log('🔄 Forçando inicialização do AdminSupabaseSync...');
        
        if (window.adminSupabaseSync) {
            await window.adminSupabaseSync.initialize();
            console.log('✅ AdminSupabaseSync inicializado com sucesso');
        } else {
            console.error('❌ AdminSupabaseSync não encontrado');
        }
    } catch (error) {
        console.error('❌ Erro ao inicializar AdminSupabaseSync:', error);
    }
}

// Função para testar criação de meditação
async function testMeditationCreation() {
    try {
        console.log('🧪 Testando criação de meditação...');
        
        // Dados de teste
        const testMeditation = {
            title: 'Meditação Teste Fix',
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
        
        // Criar localmente
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        const newMeditation = {
            id: 'med_test_' + Date.now(),
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
        
        console.log('✅ Meditação criada localmente:', newMeditation.id);
        
        // Sincronizar com Supabase
        if (window.adminSupabaseSync) {
            try {
                await window.adminSupabaseSync.syncMeditation(newMeditation, 'create');
                console.log('✅ Meditação sincronizada com Supabase');
                return true;
            } catch (syncError) {
                console.error('⚠️ Erro na sincronização:', syncError);
                return false;
            }
        } else {
            console.log('⚠️ Sistema de sincronização não disponível');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro no teste de criação:', error);
        return false;
    }
}

// Função para verificar status dos dados
function checkDataStatus() {
    console.log('📊 Verificando status dos dados...');
    
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
    
    console.log('📋 Categorias locais:', categories.length);
    console.log('📖 Meditações locais:', meditations.length);
    
    if (categories.length === 0) {
        console.warn('⚠️ Nenhuma categoria encontrada - isso pode causar problemas');
    }
    
    if (meditations.length === 0) {
        console.warn('⚠️ Nenhuma meditação encontrada');
    }
    
    return {
        categories: categories.length,
        meditations: meditations.length
    };
}

// Função para corrigir problemas comuns
async function fixCommonIssues() {
    console.log('🔧 Aplicando correções comuns...');
    
    try {
        // 1. Verificar se há categorias
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        if (categories.length === 0) {
            console.log('➕ Criando categoria de teste...');
            const testCategory = {
                id: 'cat_test',
                name: 'Categoria Teste',
                icon: '📚',
                description: 'Categoria para testes',
                color: '#007bff',
                status: 'active'
            };
            categories.push(testCategory);
            localStorage.setItem('categories', JSON.stringify(categories));
            console.log('✅ Categoria de teste criada');
        }
        
        // 2. Verificar se o adminSupabaseSync está inicializado
        if (window.adminSupabaseSync && !window.adminSupabaseSync.initialized) {
            console.log('🔄 Inicializando AdminSupabaseSync...');
            await window.adminSupabaseSync.initialize();
        }
        
        // 3. Forçar sincronização inicial
        if (window.adminSupabaseSync) {
            console.log('🔄 Forçando sincronização inicial...');
            await window.adminSupabaseSync.forceSync();
        }
        
        console.log('✅ Correções aplicadas');
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao aplicar correções:', error);
        return false;
    }
}

// Função principal de diagnóstico
async function diagnoseAndFix() {
    console.log('🔍 Iniciando diagnóstico e correção...');
    
    // 1. Aguardar sistemas
    const systemsReady = await waitForSystems();
    if (!systemsReady) {
        console.error('❌ Sistemas não carregados - diagnóstico abortado');
        return false;
    }
    
    // 2. Verificar status dos dados
    const dataStatus = checkDataStatus();
    
    // 3. Aplicar correções
    const fixesApplied = await fixCommonIssues();
    
    // 4. Testar criação de meditação
    const testResult = await testMeditationCreation();
    
    console.log('📊 Resultado do diagnóstico:', {
        systemsReady,
        dataStatus,
        fixesApplied,
        testResult
    });
    
    return testResult;
}

// Função para limpar dados de teste
function clearTestData() {
    console.log('🧹 Limpando dados de teste...');
    
    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
    const filteredMeditations = meditations.filter(m => 
        !m.title.includes('Teste') && !m.title.includes('Fix')
    );
    
    localStorage.setItem('meditations', JSON.stringify(filteredMeditations));
    
    console.log('✅ Dados de teste removidos');
}

// Exportar funções para uso global
window.diagnoseAndFix = diagnoseAndFix;
window.forceAdminSyncInit = forceAdminSyncInit;
window.testMeditationCreation = testMeditationCreation;
window.checkDataStatus = checkDataStatus;
window.fixCommonIssues = fixCommonIssues;
window.clearTestData = clearTestData;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção carregado');
    
    // Aguardar um pouco e executar diagnóstico
    setTimeout(async () => {
        console.log('🔍 Executando diagnóstico automático...');
        await diagnoseAndFix();
    }, 2000);
});

console.log('✅ Script de correção do painel administrativo carregado'); 