// Script para corrigir a exibição de agendamentos
console.log('🔧 Iniciando correção de exibição de agendamentos...');

// Função para forçar atualização da lista de agendamentos
function forceUpdateSchedulesList() {
    try {
        console.log('🔄 Forçando atualização da lista de agendamentos...');
        
        // Verificar se estamos na página de agendamentos
        if (window.location.pathname.includes('agendamentos.html')) {
            console.log('📄 Página de agendamentos detectada');
            
            // Recarregar agendamentos
            if (typeof loadSchedules === 'function') {
                loadSchedules();
                console.log('✅ Função loadSchedules chamada');
            } else {
                console.warn('⚠️ Função loadSchedules não encontrada');
            }
            
            // Forçar atualização da lista
            if (typeof updateSchedulesList === 'function') {
                updateSchedulesList();
                console.log('✅ Função updateSchedulesList chamada');
            } else {
                console.warn('⚠️ Função updateSchedulesList não encontrada');
            }
        }
        
        // Verificar se estamos no dashboard
        if (window.location.pathname.includes('dashboard.html')) {
            console.log('📊 Dashboard detectado');
            
            // Forçar atualização dos agendamentos do dashboard
            if (typeof loadDashboardSchedules === 'function') {
                loadDashboardSchedules();
                console.log('✅ Função loadDashboardSchedules chamada');
            } else {
                console.warn('⚠️ Função loadDashboardSchedules não encontrada');
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao forçar atualização:', error);
    }
}

// Função para verificar se os agendamentos estão sendo salvos corretamente
function checkScheduleSaving() {
    try {
        console.log('🔍 Verificando salvamento de agendamentos...');
        
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 Total de agendamentos no localStorage:', allSchedules.length);
        
        if (allSchedules.length > 0) {
            allSchedules.forEach((schedule, index) => {
                console.log(`📅 Agendamento ${index + 1}:`, {
                    id: schedule.id,
                    title: schedule.title,
                    userId: schedule.userId,
                    userName: schedule.userName,
                    category: schedule.category,
                    time: schedule.time
                });
            });
        } else {
            console.log('📭 Nenhum agendamento encontrado no localStorage');
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar agendamentos:', error);
    }
}

// Função para simular criação de um agendamento
function simulateScheduleCreation() {
    try {
        console.log('🧪 Simulando criação de agendamento...');
        
        const testSchedule = {
            title: 'Meditação de Teste',
            category: 'Evangelho',
            time: '08:00',
            days: ['seg', 'qua', 'sex'],
            notifications: true,
            createdAt: new Date().toISOString()
        };
        
        if (window.saveScheduleWithUser) {
            const savedSchedule = window.saveScheduleWithUser(testSchedule);
            console.log('✅ Agendamento simulado salvo:', savedSchedule);
            
            // Forçar atualização após salvar
            setTimeout(() => {
                forceUpdateSchedulesList();
            }, 500);
            
        } else {
            console.error('❌ Função saveScheduleWithUser não disponível');
        }
        
    } catch (error) {
        console.error('❌ Erro ao simular criação:', error);
    }
}

// Função para limpar e recarregar agendamentos
function refreshSchedules() {
    try {
        console.log('🔄 Recarregando agendamentos...');
        
        // Limpar cache de agendamentos
        if (typeof schedules !== 'undefined') {
            schedules = [];
            console.log('🧹 Cache de agendamentos limpo');
        }
        
        // Forçar recarregamento
        forceUpdateSchedulesList();
        
    } catch (error) {
        console.error('❌ Erro ao recarregar agendamentos:', error);
    }
}

// Tornar funções globais
window.forceUpdateSchedulesList = forceUpdateSchedulesList;
window.checkScheduleSaving = checkScheduleSaving;
window.simulateScheduleCreation = simulateScheduleCreation;
window.refreshSchedules = refreshSchedules;

// Listener para detectar mudanças no localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'user_schedules') {
        console.log('🔄 Mudança detectada em user_schedules, atualizando...');
        setTimeout(() => {
            forceUpdateSchedulesList();
        }, 100);
    }
});

// Executar verificação automática
setTimeout(() => {
    console.log('🔧 Script de correção de agendamentos carregado');
    checkScheduleSaving();
}, 2000);

console.log('✅ Script de correção de exibição de agendamentos carregado'); 