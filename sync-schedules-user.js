// Script para sincronizar agendamentos entre dashboard e página de agendamentos
console.log('🔄 Iniciando sync-schedules-user.js...');

// Função para obter usuário atual de forma consistente
function getCurrentUser() {
    try {
        // Tentar obter do sessionManager primeiro
        if (window.sessionManager && window.sessionManager.getCurrentUser) {
            const user = window.sessionManager.getCurrentUser();
            if (user && user.id) {
                return user;
            }
        }
        
        // Fallback para localStorage
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            if (user && user.id) {
                return user;
            }
        }
        
        // Último fallback
        return { id: 'anonymous', name: 'Usuário' };
    } catch (error) {
        console.error('❌ Erro ao obter usuário atual:', error);
        return { id: 'anonymous', name: 'Usuário' };
    }
}

// Função para salvar agendamento com usuário atual
function saveScheduleWithUser(scheduleData) {
    try {
        console.log('💾 Salvando agendamento com usuário atual...');
        
        const currentUser = getCurrentUser();
        const userId = currentUser.id;
        const userName = currentUser.name;
        
        console.log('👤 Usuário atual:', userName, 'ID:', userId);
        
        // Garantir que o agendamento tenha userId e userName
        const scheduleWithUser = {
            ...scheduleData,
            userId: userId,
            userName: userName,
            createdAt: scheduleData.createdAt || new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        // Carregar todos os agendamentos existentes
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 Total de agendamentos existentes:', allSchedules.length);
        
        // Verificar se já existe um agendamento com o mesmo ID (edição)
        const existingScheduleIndex = allSchedules.findIndex(schedule => 
            schedule.id === scheduleData.id
        );
        
        let updatedAllSchedules;
        if (existingScheduleIndex !== -1) {
            // Atualizar agendamento existente
            allSchedules[existingScheduleIndex] = scheduleWithUser;
            updatedAllSchedules = allSchedules;
            console.log('🔄 Agendamento existente atualizado');
        } else {
            // Adicionar novo agendamento ao array existente
            updatedAllSchedules = [...allSchedules, scheduleWithUser];
            console.log('➕ Novo agendamento adicionado');
        }
        
        // Salvar no localStorage
        localStorage.setItem('user_schedules', JSON.stringify(updatedAllSchedules));
        
        console.log('✅ Agendamento salvo com sucesso para usuário:', userName);
        
        // Disparar evento de sincronização
        window.dispatchEvent(new CustomEvent('schedulesUpdated', {
            detail: { userId, scheduleData: scheduleWithUser }
        }));
        
        return scheduleWithUser;
        
    } catch (error) {
        console.error('❌ Erro ao salvar agendamento:', error);
        throw error;
    }
}

// Função para carregar agendamentos do usuário atual
function loadUserSchedules() {
    try {
        console.log('🔄 Carregando agendamentos do usuário atual...');
        
        const currentUser = getCurrentUser();
        const userId = currentUser.id;
        
        console.log('👤 Carregando agendamentos para usuário:', currentUser.name, 'ID:', userId);
        
        // Carregar todos os agendamentos
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 Total de agendamentos no sistema:', allSchedules.length);
        
        // Filtrar apenas agendamentos do usuário atual
        const userSchedules = allSchedules.filter(schedule => {
            // Se o agendamento não tem userId, associar ao usuário atual (migração)
            if (!schedule.userId) {
                schedule.userId = userId;
                schedule.userName = currentUser.name;
                return true;
            }
            return schedule.userId === userId;
        });
        
        console.log('📋 Agendamentos do usuário atual:', userSchedules.length);
        
        // Salvar correções no localStorage se necessário
        const hasChanges = allSchedules.some(s => !s.userId || s.userId === 'anonymous') && userId !== 'anonymous';
        
        if (hasChanges || allSchedules.length !== userSchedules.length) {
            const otherUsersSchedules = allSchedules.filter(schedule => schedule.userId !== userId);
            const updatedAllSchedules = [...otherUsersSchedules, ...userSchedules];
            localStorage.setItem('user_schedules', JSON.stringify(updatedAllSchedules));
            console.log('✅ Agendamentos corrigidos e salvos no localStorage');
        }
        
        return userSchedules;
        
    } catch (error) {
        console.error('❌ Erro ao carregar agendamentos:', error);
        return [];
    }
}

// Função para deletar agendamento do usuário atual
function deleteUserSchedule(scheduleId) {
    try {
        console.log('🗑️ Deletando agendamento:', scheduleId);
        
        const currentUser = getCurrentUser();
        const userId = currentUser.id;
        
        console.log('👤 Deletando agendamento para usuário:', currentUser.name, 'ID:', userId);
        
        // Carregar todos os agendamentos
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        
        // Filtrar agendamentos de outros usuários e remover o agendamento específico
        const updatedSchedules = allSchedules.filter(schedule => {
            if (schedule.userId === userId && String(schedule.id) === String(scheduleId)) {
                console.log('🗑️ Removendo agendamento:', schedule.title);
                return false; // Remover este agendamento
            }
            return true; // Manter outros agendamentos
        });
        
        // Salvar no localStorage
        localStorage.setItem('user_schedules', JSON.stringify(updatedSchedules));
        
        console.log('✅ Agendamento deletado com sucesso');
        
        // Disparar evento de sincronização
        window.dispatchEvent(new CustomEvent('schedulesUpdated', {
            detail: { userId, deletedScheduleId: scheduleId }
        }));
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao deletar agendamento:', error);
        return false;
    }
}

// Função para sincronizar agendamentos entre páginas
function syncSchedulesBetweenPages() {
    console.log('🔄 Sincronizando agendamentos entre páginas...');
    
    // Escutar eventos de mudança no localStorage
    window.addEventListener('storage', function(event) {
        if (event.key === 'user_schedules') {
            console.log('📡 Detectada mudança nos agendamentos, atualizando...');
            
            // Recarregar agendamentos na página atual
            if (typeof loadDashboardSchedules === 'function') {
                loadDashboardSchedules();
                updateDashboardSchedulesList();
            }
            
            if (typeof loadSchedulesForCurrentUser === 'function') {
                loadSchedulesForCurrentUser();
                updateSchedulesList();
            }
        }
    });
    
    // Escutar eventos customizados
    window.addEventListener('schedulesUpdated', function(event) {
        console.log('📡 Evento de agendamento atualizado recebido:', event.detail);
        
        // Recarregar agendamentos na página atual
        if (typeof loadDashboardSchedules === 'function') {
            loadDashboardSchedules();
            updateDashboardSchedulesList();
        }
        
        if (typeof loadSchedulesForCurrentUser === 'function') {
            loadSchedulesForCurrentUser();
            updateSchedulesList();
        }
    });
}

// Função para verificar e corrigir agendamentos sem userId
function fixSchedulesWithoutUserId() {
    try {
        console.log('🔧 Verificando agendamentos sem userId...');
        
        const currentUser = getCurrentUser();
        const userId = currentUser.id;
        
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        let needsUpdate = false;
        
        const fixedSchedules = allSchedules.map(schedule => {
            if (!schedule.userId) {
                console.log('🔧 Corrigindo agendamento sem userId:', schedule.title);
                needsUpdate = true;
                return {
                    ...schedule,
                    userId: userId,
                    userName: currentUser.name,
                    lastUpdated: new Date().toISOString()
                };
            }
            return schedule;
        });
        
        if (needsUpdate) {
            localStorage.setItem('user_schedules', JSON.stringify(fixedSchedules));
            console.log('✅ Agendamentos corrigidos com userId');
        }
        
        return fixedSchedules;
        
    } catch (error) {
        console.error('❌ Erro ao corrigir agendamentos:', error);
        return [];
    }
}

// Inicializar sincronização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando sincronização de agendamentos...');
    
    // Corrigir agendamentos existentes
    fixSchedulesWithoutUserId();
    
    // Iniciar sincronização
    syncSchedulesBetweenPages();
    
    console.log('✅ Sincronização de agendamentos inicializada');
});

// Exportar funções para uso global
window.saveScheduleWithUser = saveScheduleWithUser;
window.loadUserSchedules = loadUserSchedules;
window.deleteUserSchedule = deleteUserSchedule;
window.getCurrentUser = getCurrentUser;
window.fixSchedulesWithoutUserId = fixSchedulesWithoutUserId;

console.log('✅ Script sync-schedules-user.js carregado'); 