// Script para corrigir problemas de persistência de agendamentos
console.log('🔧 Iniciando correção de persistência de agendamentos...');

// Função para forçar persistência correta
function forceSchedulePersistence() {
    try {
        console.log('🔄 Forçando persistência correta de agendamentos...');
        
        // Verificar se há agendamentos no localStorage
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 Agendamentos encontrados:', allSchedules.length);
        
        if (allSchedules.length > 0) {
            // Verificar usuário atual
            const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = currentUser.id;
            
            console.log('👤 Usuário atual:', currentUser.name, 'ID:', userId);
            
            // Garantir que todos os agendamentos tenham userId
            let hasChanges = false;
            const correctedSchedules = allSchedules.map(schedule => {
                if (!schedule.userId || schedule.userId === 'anonymous') {
                    schedule.userId = userId;
                    schedule.userName = currentUser.name;
                    hasChanges = true;
                    console.log('🔧 Corrigindo agendamento:', schedule.title);
                }
                return schedule;
            });
            
            if (hasChanges) {
                localStorage.setItem('user_schedules', JSON.stringify(correctedSchedules));
                console.log('✅ Agendamentos corrigidos e salvos');
            }
            
            // Verificar se os agendamentos estão sendo carregados corretamente
            if (window.loadUserSchedules) {
                const userSchedules = window.loadUserSchedules();
                console.log('📋 Agendamentos do usuário atual:', userSchedules.length);
                
                if (userSchedules.length !== correctedSchedules.filter(s => s.userId === userId).length) {
                    console.warn('⚠️ Discrepância no número de agendamentos');
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao forçar persistência:', error);
    }
}

// Função para verificar se os agendamentos estão sendo salvos corretamente
function verifyScheduleSaving() {
    try {
        console.log('🔍 Verificando salvamento de agendamentos...');
        
        // Criar agendamento de teste
        const testSchedule = {
            title: `Verificação ${Date.now()}`,
            category: 'Evangelho',
            time: '08:00',
            days: ['seg', 'qua', 'sex'],
            notifications: true,
            createdAt: new Date().toISOString()
        };
        
        console.log('📝 Criando agendamento de verificação:', testSchedule.title);
        
        // Salvar agendamento
        if (window.saveScheduleWithUser) {
            const savedSchedule = window.saveScheduleWithUser(testSchedule);
            console.log('✅ Agendamento salvo:', savedSchedule.title);
            
            // Verificar se foi salvo no localStorage
            setTimeout(() => {
                const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
                const savedInStorage = allSchedules.find(s => s.id === savedSchedule.id);
                
                if (savedInStorage) {
                    console.log('✅ Agendamento encontrado no localStorage');
                    
                    // Verificar se pode ser carregado
                    if (window.loadUserSchedules) {
                        const userSchedules = window.loadUserSchedules();
                        const loadedSchedule = userSchedules.find(s => s.id === savedSchedule.id);
                        
                        if (loadedSchedule) {
                            console.log('✅ Agendamento carregado corretamente');
                        } else {
                            console.error('❌ Agendamento NÃO carregado');
                        }
                    }
                } else {
                    console.error('❌ Agendamento NÃO encontrado no localStorage');
                }
                
            }, 200);
            
        } else {
            console.error('❌ Função saveScheduleWithUser não disponível');
        }
        
    } catch (error) {
        console.error('❌ Erro na verificação:', error);
    }
}

// Função para limpar agendamentos duplicados
function cleanDuplicateSchedules() {
    try {
        console.log('🧹 Limpando agendamentos duplicados...');
        
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 Total antes da limpeza:', allSchedules.length);
        
        // Remover duplicatas baseado no ID
        const uniqueSchedules = [];
        const seenIds = new Set();
        
        allSchedules.forEach(schedule => {
            if (!seenIds.has(schedule.id)) {
                seenIds.add(schedule.id);
                uniqueSchedules.push(schedule);
            } else {
                console.log('🗑️ Removendo duplicata:', schedule.title);
            }
        });
        
        if (uniqueSchedules.length !== allSchedules.length) {
            localStorage.setItem('user_schedules', JSON.stringify(uniqueSchedules));
            console.log('✅ Duplicatas removidas. Novo total:', uniqueSchedules.length);
        } else {
            console.log('✅ Nenhuma duplicata encontrada');
        }
        
    } catch (error) {
        console.error('❌ Erro ao limpar duplicatas:', error);
    }
}

// Função para recarregar agendamentos no dashboard
function reloadDashboardSchedules() {
    try {
        console.log('🔄 Recarregando agendamentos no dashboard...');
        
        if (typeof loadDashboardSchedules === 'function') {
            loadDashboardSchedules();
            console.log('✅ Agendamentos recarregados');
            
            if (typeof updateDashboardSchedulesList === 'function') {
                updateDashboardSchedulesList();
                console.log('✅ Lista atualizada');
            }
        } else {
            console.warn('⚠️ Função loadDashboardSchedules não disponível');
        }
        
    } catch (error) {
        console.error('❌ Erro ao recarregar:', error);
    }
}

// Tornar funções globais
window.forceSchedulePersistence = forceSchedulePersistence;
window.verifyScheduleSaving = verifyScheduleSaving;
window.cleanDuplicateSchedules = cleanDuplicateSchedules;
window.reloadDashboardSchedules = reloadDashboardSchedules;

// Executar correção automática
setTimeout(() => {
    console.log('🔧 Executando correção automática...');
    forceSchedulePersistence();
    cleanDuplicateSchedules();
    
    // Se estivermos no dashboard, recarregar
    if (window.location.pathname.includes('dashboard.html')) {
        setTimeout(reloadDashboardSchedules, 1000);
    }
}, 2000);

console.log('✅ Script de correção de persistência carregado'); 