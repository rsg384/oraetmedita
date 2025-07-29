// Script para testar o carregamento das seções do dashboard
console.log('🧪 TESTE: Script de teste das seções carregado');

// Função para testar carregamento de categorias
function testCategoriesLoading() {
    console.log('📂 Testando carregamento de categorias...');
    
    try {
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        console.log('📊 Categorias encontradas:', categories.length);
        
        if (categories.length > 0) {
            console.log('✅ Categorias carregadas com sucesso');
            categories.forEach((cat, index) => {
                console.log(`📂 Categoria ${index + 1}: ${cat.name} (${cat.id})`);
            });
            return true;
        } else {
            console.log('❌ Nenhuma categoria encontrada');
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar categorias:', error);
        return false;
    }
}

// Função para testar carregamento de meditações
function testMeditationsLoading() {
    console.log('📖 Testando carregamento de meditações...');
    
    try {
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        console.log('📊 Meditações encontradas:', meditations.length);
        
        if (meditations.length > 0) {
            console.log('✅ Meditações carregadas com sucesso');
            meditations.forEach((med, index) => {
                console.log(`📖 Meditação ${index + 1}: ${med.title} (${med.id})`);
            });
            return true;
        } else {
            console.log('❌ Nenhuma meditação encontrada');
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar meditações:', error);
        return false;
    }
}

// Função para testar carregamento de usuários
function testUsersLoading() {
    console.log('👥 Testando carregamento de usuários...');
    
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log('📊 Usuários encontrados:', users.length);
        
        if (users.length > 0) {
            console.log('✅ Usuários carregados com sucesso');
            users.forEach((user, index) => {
                console.log(`👤 Usuário ${index + 1}: ${user.name} (${user.email})`);
                console.log(`📊 Estatísticas: ${user.stats?.consecutiveDays || 0} dias, ${user.stats?.completedMeditations || 0} meditações`);
            });
            return true;
        } else {
            console.log('❌ Nenhum usuário encontrado');
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        return false;
    }
}

// Função para testar carregamento de agendamentos
function testSchedulesLoading() {
    console.log('📅 Testando carregamento de agendamentos...');
    
    try {
        const schedules = JSON.parse(localStorage.getItem('schedules') || '[]');
        console.log('📊 Agendamentos encontrados:', schedules.length);
        
        if (schedules.length > 0) {
            console.log('✅ Agendamentos carregados com sucesso');
            schedules.forEach((schedule, index) => {
                console.log(`📅 Agendamento ${index + 1}: ${schedule.title} (${schedule.date})`);
            });
            return true;
        } else {
            console.log('❌ Nenhum agendamento encontrado');
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar agendamentos:', error);
        return false;
    }
}

// Função para testar elementos do DOM
function testDOMElements() {
    console.log('🎯 Testando elementos do DOM...');
    
    const elements = {
        userName: document.getElementById('userName'),
        userAvatar: document.getElementById('userAvatar'),
        heroGreeting: document.getElementById('heroGreeting'),
        consecutiveDays: document.getElementById('consecutiveDays'),
        completedMeditations: document.getElementById('completedMeditations'),
        totalTime: document.getElementById('totalTime'),
        categoriesGrid: document.querySelector('.categories-grid'),
        myMeditationsGrid: document.querySelector('.my-meditations-grid'),
        scheduleList: document.getElementById('dashboardScheduleList')
    };
    
    console.log('📊 Elementos encontrados:');
    Object.entries(elements).forEach(([name, element]) => {
        if (element) {
            console.log(`✅ ${name}: encontrado`);
        } else {
            console.log(`❌ ${name}: não encontrado`);
        }
    });
    
    return elements;
}

// Função para testar carregamento completo
function testCompleteLoading() {
    console.log('🚀 Iniciando teste completo de carregamento...');
    
    const results = {
        categories: testCategoriesLoading(),
        meditations: testMeditationsLoading(),
        users: testUsersLoading(),
        schedules: testSchedulesLoading(),
        domElements: testDOMElements()
    };
    
    console.log('📊 Resultados do teste:');
    Object.entries(results).forEach(([test, result]) => {
        console.log(`${test}: ${result ? '✅ PASSOU' : '❌ FALHOU'}`);
    });
    
    const passedTests = Object.values(results).filter(r => r).length;
    const totalTests = Object.keys(results).length;
    
    console.log(`🎯 Resultado final: ${passedTests}/${totalTests} testes passaram`);
    
    return results;
}

// Função para forçar carregamento de dados
function forceLoadAllData() {
    console.log('🔄 Forçando carregamento de todos os dados...');
    
    // Carregar dados do backup se necessário
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    if (users.length === 0 || meditations.length === 0 || categories.length === 0) {
        console.log('📦 Dados incompletos, carregando backup...');
        
        const backupData = {
            "users": [
                {
                    "id": "user_1753519273275_vo9clmtxv",
                    "name": "Rodrigo Silva Goes",
                    "email": "rodrigo@exemplo.com",
                    "userNumber": 1,
                    "createdAt": "2025-07-26T08:00:00.000Z",
                    "lastLogin": "2025-07-26T08:00:00.000Z",
                    "preferences": {
                        "theme": "dark",
                        "notifications": true,
                        "language": "pt-BR"
                    },
                    "stats": {
                        "consecutiveDays": 5,
                        "completedMeditations": 12,
                        "totalTime": "2h 30min",
                        "totalMeditations": 15,
                        "inProgressMeditations": 3
                    }
                }
            ],
            "meditations": [
                {
                    "id": "1",
                    "title": "Princípios da Vida Sobrenatural",
                    "category": "vida-sobrenatural",
                    "duration": 12,
                    "scriptureReference": "João 15:1-8",
                    "scriptureText": "Eu sou a videira verdadeira, e meu Pai é o agricultor...",
                    "icon": "📖",
                    "lectio": "Neste texto, Jesus se apresenta como a videira verdadeira...",
                    "meditatio": "Reflita sobre o que significa 'permanecer em Cristo'...",
                    "oratio": "Senhor Jesus, videira verdadeira, eu quero permanecer em ti...",
                    "contemplatio": "Permaneça em silêncio na presença de Jesus...",
                    "createdAt": "2024-01-15T10:00:00.000Z",
                    "updatedAt": "2024-01-15T10:00:00.000Z"
                }
            ],
            "categories": [
                {
                    "id": "vida-sobrenatural",
                    "name": "Vida Sobrenatural",
                    "description": "Meditações sobre a vida espiritual e a graça de Deus",
                    "icon": "📖",
                    "color": "#8B5CF6",
                    "meditationCount": 1
                },
                {
                    "id": "mariologia",
                    "name": "Mariologia",
                    "description": "Meditações sobre Nossa Senhora e sua devoção",
                    "icon": "💝",
                    "color": "#EC4899",
                    "meditationCount": 1
                },
                {
                    "id": "oracao",
                    "name": "Oração",
                    "description": "Meditações sobre a vida de oração e intimidade com Deus",
                    "icon": "🙏",
                    "color": "#3B82F6",
                    "meditationCount": 1
                }
            ]
        };
        
        localStorage.setItem('users', JSON.stringify(backupData.users));
        localStorage.setItem('meditations', JSON.stringify(backupData.meditations));
        localStorage.setItem('categories', JSON.stringify(backupData.categories));
        
        console.log('✅ Dados do backup carregados');
    }
    
    // Forçar login se necessário
    if (window.sessionManager && !window.sessionManager.isLoggedIn()) {
        console.log('🔐 Forçando login...');
        window.sessionManager.loginUser({ email: 'rodrigo@exemplo.com' }).then(user => {
            if (user) {
                console.log('✅ Login realizado:', user.name);
            }
        });
    }
    
    // Executar teste completo
    setTimeout(() => {
        testCompleteLoading();
    }, 1000);
}

// Executar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 TESTE: DOM carregado, iniciando testes...');
    
    setTimeout(() => {
        forceLoadAllData();
    }, 2000);
});

// Expor funções globalmente para debug
window.testDashboard = {
    testCategoriesLoading,
    testMeditationsLoading,
    testUsersLoading,
    testSchedulesLoading,
    testDOMElements,
    testCompleteLoading,
    forceLoadAllData
}; 