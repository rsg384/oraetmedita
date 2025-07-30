// Script para adicionar dados de teste para o progresso espiritual
console.log('🔄 Adicionando dados de teste para progresso espiritual...');

// Dados de categorias de exemplo
const testCategories = [
    {
        id: 'cat_1',
        name: 'Oração',
        description: 'Meditações sobre oração e comunicação com Deus',
        icon: '🙏',
        color: '#7ee787',
        is_active: true,
        sort_order: 1
    },
    {
        id: 'cat_2',
        name: 'Fé',
        description: 'Meditações sobre fé e confiança em Deus',
        icon: '✝️',
        color: '#ffa28b',
        is_active: true,
        sort_order: 2
    },
    {
        id: 'cat_3',
        name: 'Caridade',
        description: 'Meditações sobre amor ao próximo',
        icon: '❤️',
        color: '#ffcb8b',
        is_active: true,
        sort_order: 3
    }
];

// Dados de meditações de exemplo
const testMeditations = [
    {
        id: 'med_1',
        title: 'Oração do Pai Nosso',
        content: 'Meditação sobre a oração ensinada por Jesus',
        categoryId: 'cat_1',
        status: 'completed',
        completedAt: new Date().toISOString(),
        duration: 15
    },
    {
        id: 'med_2',
        title: 'Ave Maria',
        content: 'Meditação sobre a oração mariana',
        categoryId: 'cat_1',
        status: 'completed',
        completedAt: new Date().toISOString(),
        duration: 15
    },
    {
        id: 'med_3',
        title: 'Fé em Deus',
        content: 'Meditação sobre confiar em Deus',
        categoryId: 'cat_2',
        status: 'completed',
        completedAt: new Date().toISOString(),
        duration: 15
    },
    {
        id: 'med_4',
        title: 'Amar o Próximo',
        content: 'Meditação sobre caridade',
        categoryId: 'cat_3',
        status: 'in_progress',
        duration: 15
    },
    {
        id: 'med_5',
        title: 'Oração da Serenidade',
        content: 'Meditação sobre aceitação',
        categoryId: 'cat_1',
        status: 'pending',
        duration: 15
    }
];

// Dados de meditações personalizadas de exemplo
const testPersonalizedMeditations = [
    {
        id: 'pmed_1',
        title: 'Minha Oração Pessoal',
        content: 'Meditação personalizada sobre oração',
        categoryId: 'cat_1',
        status: 'completed',
        completedAt: new Date().toISOString(),
        duration: 15
    }
];

// Função para adicionar dados de teste
function addTestData() {
    console.log('🔄 Adicionando dados de teste...');
    
    // Adicionar categorias
    localStorage.setItem('categories', JSON.stringify(testCategories));
    console.log('✅ Categorias de teste adicionadas');
    
    // Adicionar meditações
    localStorage.setItem('meditations', JSON.stringify(testMeditations));
    console.log('✅ Meditações de teste adicionadas');
    
    // Adicionar meditações personalizadas
    localStorage.setItem('personalized_meditations', JSON.stringify(testPersonalizedMeditations));
    console.log('✅ Meditações personalizadas de teste adicionadas');
    
    // Adicionar dados do usuário
    const userData = {
        id: 'test_user',
        name: 'Usuário Teste',
        email: 'teste@exemplo.com'
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('✅ Dados do usuário de teste adicionados');
    
    // Calcular e adicionar estatísticas
    const stats = {
        totalCompleted: 4,
        totalInProgress: 1,
        activeCategories: 3,
        completedCategories: 2,
        consecutiveDays: 7,
        totalTime: '75min'
    };
    localStorage.setItem('user_meditation_stats', JSON.stringify(stats));
    console.log('✅ Estatísticas de teste adicionadas');
    
    console.log('✅ Todos os dados de teste foram adicionados com sucesso!');
    
    // Forçar sincronização se o dashboard estiver carregado
    if (window.dashboardProgressSync) {
        console.log('🔄 Forçando sincronização do dashboard...');
        window.dashboardProgressSync.forceSync();
    }
}

// Função para limpar dados de teste
function clearTestData() {
    console.log('🔄 Limpando dados de teste...');
    
    const keys = [
        'categories',
        'meditations', 
        'personalized_meditations',
        'userData',
        'user_meditation_stats'
    ];
    
    keys.forEach(key => {
        localStorage.removeItem(key);
    });
    
    console.log('✅ Dados de teste removidos');
}

// Função para verificar dados atuais
function checkCurrentData() {
    console.log('📊 Verificando dados atuais...');
    
    const keys = [
        'categories',
        'meditations',
        'personalized_meditations',
        'userData',
        'user_meditation_stats'
    ];
    
    keys.forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
            try {
                const parsed = JSON.parse(value);
                const count = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
                console.log(`✅ ${key}: ${count} itens`);
            } catch (e) {
                console.log(`⚠️ ${key}: valor não é JSON válido`);
            }
        } else {
            console.log(`❌ ${key}: não encontrado`);
        }
    });
}

// Tornar funções globais
window.addTestData = addTestData;
window.clearTestData = clearTestData;
window.checkCurrentData = checkCurrentData;

console.log('✅ Script de dados de teste carregado');
console.log('📝 Funções disponíveis:');
console.log('  - addTestData(): Adiciona dados de teste');
console.log('  - clearTestData(): Remove dados de teste');
console.log('  - checkCurrentData(): Verifica dados atuais'); 