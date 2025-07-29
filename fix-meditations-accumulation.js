// Script para corrigir acumulação de meditações
console.log('🔧 Iniciando correção de acumulação de meditações...');

// Função para verificar e corrigir meditações
function checkAndFixMeditations() {
    try {
        console.log('🔍 Verificando meditações personalizadas...');
        
        const personalizedMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
        console.log('📋 Total de meditações:', personalizedMeditations.length);
        
        if (personalizedMeditations.length > 0) {
            personalizedMeditations.forEach((meditation, index) => {
                console.log(`📝 ${index + 1}. ${meditation.title} (${meditation.userId || 'sem userId'})`);
            });
        }
        
        // Verificar se há duplicatas
        const uniqueIds = new Set();
        const duplicates = [];
        
        personalizedMeditations.forEach((meditation, index) => {
            if (uniqueIds.has(meditation.id)) {
                duplicates.push({ index, meditation });
            } else {
                uniqueIds.add(meditation.id);
            }
        });
        
        if (duplicates.length > 0) {
            console.log('⚠️ Encontradas meditações duplicadas:', duplicates.length);
            // Remover duplicatas
            const uniqueMeditations = personalizedMeditations.filter((meditation, index) => {
                return !duplicates.some(dup => dup.index === index);
            });
            localStorage.setItem('personalized_meditations', JSON.stringify(uniqueMeditations));
            console.log('✅ Duplicatas removidas');
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar meditações:', error);
    }
}

// Função para forçar atualização dos cards de meditações
function forceUpdateMeditationCards() {
    try {
        console.log('🔄 Forçando atualização dos cards de meditações...');
        
        if (window.updateDashboardMeditationCards) {
            window.updateDashboardMeditationCards();
            console.log('✅ Cards de meditações atualizados');
        } else {
            console.warn('⚠️ Função updateDashboardMeditationCards não disponível');
        }
        
    } catch (error) {
        console.error('❌ Erro ao atualizar cards de meditações:', error);
    }
}

// Função para verificar e corrigir agendamentos no dashboard
function checkAndFixDashboardSchedules() {
    try {
        console.log('🔍 Verificando agendamentos no dashboard...');
        
        if (typeof loadDashboardSchedules === 'function') {
            loadDashboardSchedules();
            console.log('✅ Agendamentos carregados');
            
            if (typeof updateDashboardSchedulesList === 'function') {
                updateDashboardSchedulesList();
                console.log('✅ Lista de agendamentos atualizada');
            } else {
                console.warn('⚠️ Função updateDashboardSchedulesList não disponível');
            }
        } else {
            console.warn('⚠️ Função loadDashboardSchedules não disponível');
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar agendamentos:', error);
    }
}

// Função para simular criação de meditação
function simulateMeditationCreation() {
    try {
        console.log('🧪 Simulando criação de meditação...');
        
        const testMeditation = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            title: 'Meditação de Teste',
            topic: 'Teste',
            content: 'Conteúdo de teste da meditação...',
            duration: '15 min',
            status: 'pending',
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            source: 'chatgpt',
            type: 'simple',
            userId: JSON.parse(localStorage.getItem('userData') || '{}').id || 'anonymous',
            userName: JSON.parse(localStorage.getItem('userData') || '{}').name || 'Usuário'
        };
        
        const existingMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
        const updatedMeditations = [...existingMeditations, testMeditation];
        localStorage.setItem('personalized_meditations', JSON.stringify(updatedMeditations));
        
        console.log('✅ Meditação de teste criada');
        
        // Forçar atualização
        setTimeout(() => {
            forceUpdateMeditationCards();
        }, 100);
        
    } catch (error) {
        console.error('❌ Erro ao simular criação:', error);
    }
}

// Função para limpar e recarregar tudo
function refreshAllData() {
    try {
        console.log('🔄 Recarregando todos os dados...');
        
        // Verificar meditações
        checkAndFixMeditations();
        
        // Verificar agendamentos
        checkAndFixDashboardSchedules();
        
        // Forçar atualização dos cards
        setTimeout(() => {
            forceUpdateMeditationCards();
        }, 500);
        
    } catch (error) {
        console.error('❌ Erro ao recarregar dados:', error);
    }
}

// Tornar funções globais
window.checkAndFixMeditations = checkAndFixMeditations;
window.forceUpdateMeditationCards = forceUpdateMeditationCards;
window.checkAndFixDashboardSchedules = checkAndFixDashboardSchedules;
window.simulateMeditationCreation = simulateMeditationCreation;
window.refreshAllData = refreshAllData;

// Executar verificação automática
setTimeout(() => {
    console.log('🔧 Script de correção de meditações carregado');
    checkAndFixMeditations();
    checkAndFixDashboardSchedules();
}, 2000);

console.log('✅ Script de correção de acumulação de meditações carregado'); 