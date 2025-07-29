// Script para forçar atualização dos agendamentos no dashboard
console.log('🔧 Iniciando força atualização do dashboard...');

// Função para forçar atualização completa
function forceDashboardUpdate() {
    try {
        console.log('🔄 Forçando atualização completa do dashboard...');
        
        // Verificar se estamos no dashboard
        if (!window.location.pathname.includes('dashboard.html')) {
            console.log('⚠️ Não estamos na página do dashboard');
            return;
        }
        
        // Forçar carregamento de agendamentos
        if (typeof loadDashboardSchedules === 'function') {
            console.log('📋 Carregando agendamentos...');
            loadDashboardSchedules();
        } else {
            console.warn('⚠️ Função loadDashboardSchedules não disponível');
        }
        
        // Forçar atualização da lista
        if (typeof updateDashboardSchedulesList === 'function') {
            console.log('📝 Atualizando lista de agendamentos...');
            updateDashboardSchedulesList();
        } else {
            console.warn('⚠️ Função updateDashboardSchedulesList não disponível');
        }
        
        // Verificar se os agendamentos foram carregados
        setTimeout(() => {
            const scheduleList = document.getElementById('dashboardScheduleList');
            if (scheduleList) {
                console.log('✅ Elemento dashboardScheduleList encontrado');
                console.log('📋 Conteúdo atual:', scheduleList.innerHTML.substring(0, 200) + '...');
            } else {
                console.error('❌ Elemento dashboardScheduleList não encontrado');
            }
        }, 500);
        
    } catch (error) {
        console.error('❌ Erro ao forçar atualização:', error);
    }
}

// Função para verificar estado dos agendamentos
function checkSchedulesState() {
    try {
        console.log('🔍 Verificando estado dos agendamentos...');
        
        // Verificar localStorage
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 Total de agendamentos no localStorage:', allSchedules.length);
        
        if (allSchedules.length > 0) {
            allSchedules.forEach((schedule, index) => {
                console.log(`📅 ${index + 1}. ${schedule.title} (${schedule.userId || 'sem userId'})`);
            });
        }
        
        // Verificar se loadUserSchedules funciona
        if (window.loadUserSchedules) {
            const userSchedules = window.loadUserSchedules();
            console.log('👤 Agendamentos do usuário atual:', userSchedules.length);
        }
        
        // Verificar se as funções do dashboard estão disponíveis
        console.log('🔧 Funções disponíveis:');
        console.log('  - loadDashboardSchedules:', typeof loadDashboardSchedules === 'function');
        console.log('  - updateDashboardSchedulesList:', typeof updateDashboardSchedulesList === 'function');
        console.log('  - loadUserSchedules:', typeof window.loadUserSchedules === 'function');
        
    } catch (error) {
        console.error('❌ Erro ao verificar estado:', error);
    }
}

// Função para simular criação de agendamento
function simulateScheduleCreation() {
    try {
        console.log('🧪 Simulando criação de agendamento...');
        
        const testSchedule = {
            title: 'Agendamento de Teste Dashboard',
            category: 'Evangelho',
            time: '08:00',
            days: ['seg', 'qua', 'sex'],
            notifications: true,
            createdAt: new Date().toISOString()
        };
        
        if (window.saveScheduleWithUser) {
            const savedSchedule = window.saveScheduleWithUser(testSchedule);
            console.log('✅ Agendamento simulado salvo:', savedSchedule.title);
            
            // Forçar atualização após salvar
            setTimeout(() => {
                forceDashboardUpdate();
            }, 500);
            
        } else {
            console.error('❌ Função saveScheduleWithUser não disponível');
        }
        
    } catch (error) {
        console.error('❌ Erro ao simular criação:', error);
    }
}

// Tornar funções globais
window.forceDashboardUpdate = forceDashboardUpdate;
window.checkSchedulesState = checkSchedulesState;
window.simulateScheduleCreation = simulateScheduleCreation;

// Executar verificação automática
setTimeout(() => {
    console.log('🔧 Script de força atualização carregado');
    checkSchedulesState();
    
    // Se estivermos no dashboard, forçar atualização
    if (window.location.pathname.includes('dashboard.html')) {
        setTimeout(forceDashboardUpdate, 1000);
    }
}, 2000);

console.log('✅ Script de força atualização do dashboard carregado'); 