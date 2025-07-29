// Script de debug para verificar carregamento do dashboard
console.log('🔍 DEBUG: Script de debug carregado');

// Função para verificar dados do localStorage
function checkLocalStorageData() {
    console.log('📊 Verificando dados do localStorage...');
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    
    console.log('👥 Usuários:', users.length);
    console.log('📖 Meditações:', meditations.length);
    console.log('📂 Categorias:', categories.length);
    console.log('👤 Dados do usuário:', userData);
    
    if (users.length > 0) {
        console.log('👤 Primeiro usuário:', users[0]);
    }
    
    return { users, meditations, categories, userData };
}

// Função para verificar SessionManager
function checkSessionManager() {
    console.log('🔍 Verificando SessionManager...');
    
    if (window.sessionManager) {
        console.log('✅ SessionManager encontrado');
        console.log('🆔 ID da sessão:', window.sessionManager.currentSessionId);
        
        const currentUser = window.sessionManager.getCurrentUser();
        console.log('👤 Usuário atual:', currentUser);
        
        const isLoggedIn = window.sessionManager.isLoggedIn();
        console.log('🔐 Está logado:', isLoggedIn);
        
        return { sessionManager: window.sessionManager, currentUser, isLoggedIn };
    } else {
        console.log('❌ SessionManager não encontrado');
        return null;
    }
}

// Função para verificar elementos do DOM
function checkDOMElements() {
    console.log('🔍 Verificando elementos do DOM...');
    
    const elements = {
        userName: document.getElementById('userName'),
        userAvatar: document.getElementById('userAvatar'),
        heroGreeting: document.getElementById('heroGreeting'),
        consecutiveDays: document.getElementById('consecutiveDays'),
        completedMeditations: document.getElementById('completedMeditations'),
        totalTime: document.getElementById('totalTime')
    };
    
    console.log('📊 Elementos encontrados:');
    Object.entries(elements).forEach(([name, element]) => {
        if (element) {
            console.log(`✅ ${name}:`, element.textContent);
        } else {
            console.log(`❌ ${name}: não encontrado`);
        }
    });
    
    return elements;
}

// Função para forçar carregamento de dados
async function forceLoadData() {
    console.log('🔄 Forçando carregamento de dados...');
    
    try {
        // Verificar se há dados no localStorage
        const { users } = checkLocalStorageData();
        
        if (users.length === 0) {
            console.log('📦 Nenhum usuário encontrado, carregando backup...');
            
            // Carregar dados do backup
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
                    }
                ]
            };
            
            // Salvar dados no localStorage
            localStorage.setItem('users', JSON.stringify(backupData.users));
            localStorage.setItem('meditations', JSON.stringify(backupData.meditations));
            localStorage.setItem('categories', JSON.stringify(backupData.categories));
            
            console.log('✅ Dados do backup carregados');
        }
        
        // Verificar SessionManager
        const sessionData = checkSessionManager();
        
        if (sessionData && sessionData.sessionManager) {
            // Tentar fazer login
            const loginResult = await sessionData.sessionManager.loginUser({
                email: 'rodrigo@exemplo.com'
            });
            
            if (loginResult) {
                console.log('✅ Login realizado:', loginResult.name);
                
                // Atualizar elementos do DOM
                const elements = checkDOMElements();
                
                if (elements.userName) {
                    elements.userName.textContent = loginResult.name;
                    console.log('✅ Nome atualizado:', loginResult.name);
                }
                
                if (elements.consecutiveDays) {
                    elements.consecutiveDays.textContent = loginResult.stats.consecutiveDays || 0;
                    console.log('✅ Dias consecutivos atualizados:', loginResult.stats.consecutiveDays);
                }
                
                if (elements.completedMeditations) {
                    elements.completedMeditations.textContent = loginResult.stats.completedMeditations || 0;
                    console.log('✅ Meditações completadas atualizadas:', loginResult.stats.completedMeditations);
                }
                
                if (elements.totalTime) {
                    elements.totalTime.textContent = loginResult.stats.totalTime || '0h 0min';
                    console.log('✅ Tempo total atualizado:', loginResult.stats.totalTime);
                }
                
                return loginResult;
            }
        }
        
        console.log('❌ Falha no carregamento de dados');
        return null;
        
    } catch (error) {
        console.error('❌ Erro ao forçar carregamento:', error);
        return null;
    }
}

// Executar verificação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DEBUG: DOM carregado, iniciando verificação...');
    
    // Aguardar um pouco para os scripts carregarem
    setTimeout(async () => {
        console.log('⏰ Iniciando verificação completa...');
        
        // Verificar dados do localStorage
        checkLocalStorageData();
        
        // Verificar SessionManager
        checkSessionManager();
        
        // Verificar elementos do DOM
        checkDOMElements();
        
        // Forçar carregamento se necessário
        await forceLoadData();
        
        console.log('✅ Verificação completa concluída');
    }, 2000);
});

// Expor funções globalmente para debug
window.debugDashboard = {
    checkLocalStorageData,
    checkSessionManager,
    checkDOMElements,
    forceLoadData
}; 