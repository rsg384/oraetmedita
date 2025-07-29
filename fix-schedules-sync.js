// Script para corrigir sincronização de agendamentos entre páginas
console.log('🔧 Iniciando correção de sincronização de agendamentos...');

// Função para verificar e corrigir agendamentos
function fixSchedulesSync() {
    try {
        console.log('🔍 Verificando estado atual dos agendamentos...');
        
        // Obter usuário atual
        const currentUser = window.sessionManager ? window.sessionManager.getCurrentUser() : null;
        const userId = currentUser ? currentUser.id : 'anonymous';
        
        console.log('👤 Usuário atual:', currentUser ? currentUser.name : 'N/A', 'ID:', userId);
        
        // Carregar todos os agendamentos
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 Total de agendamentos no sistema:', allSchedules.length);
        
        if (allSchedules.length === 0) {
            console.log('📭 Nenhum agendamento encontrado no sistema');
            return;
        }
        
        // Verificar problemas
        const issues = [];
        let fixedCount = 0;
        
        // 1. Verificar agendamentos sem userId
        const schedulesWithoutUserId = allSchedules.filter(s => !s.userId);
        if (schedulesWithoutUserId.length > 0) {
            issues.push(`${schedulesWithoutUserId.length} agendamentos sem userId`);
        }
        
        // 2. Verificar agendamentos com userId 'anonymous'
        const anonymousSchedules = allSchedules.filter(s => s.userId === 'anonymous');
        if (anonymousSchedules.length > 0) {
            issues.push(`${anonymousSchedules.length} agendamentos com userId 'anonymous'`);
        }
        
        // 3. Verificar agendamentos do usuário atual
        const userSchedules = allSchedules.filter(s => s.userId === userId);
        console.log('📅 Agendamentos do usuário atual:', userSchedules.length);
        
        // Corrigir problemas se necessário
        if (userId !== 'anonymous' && currentUser && currentUser.name) {
            const correctedSchedules = allSchedules.map(schedule => {
                let needsFix = false;
                
                // Corrigir agendamentos sem userId ou com userId 'anonymous'
                if (!schedule.userId || schedule.userId === 'anonymous') {
                    console.log('🔧 Corrigindo agendamento:', schedule.title || 'Sem título');
                    needsFix = true;
                    fixedCount++;
                    
                    return {
                        ...schedule,
                        userId: userId,
                        userName: currentUser.name
                    };
                }
                
                return schedule;
            });
            
            if (fixedCount > 0) {
                localStorage.setItem('user_schedules', JSON.stringify(correctedSchedules));
                console.log('✅ Agendamentos corrigidos e salvos:', fixedCount);
                
                // Atualizar dados do usuário se disponível
                if (currentUser.schedules) {
                    currentUser.schedules = correctedSchedules.filter(s => s.userId === userId);
                    if (window.sessionManager) {
                        window.sessionManager.updateUserData(currentUser);
                    }
                }
            }
        }
        
        // Relatório final
        console.log('📊 Relatório de correção:');
        console.log('- Total de agendamentos:', allSchedules.length);
        console.log('- Agendamentos do usuário atual:', userSchedules.length);
        console.log('- Problemas encontrados:', issues.length > 0 ? issues.join(', ') : 'Nenhum');
        console.log('- Agendamentos corrigidos:', fixedCount);
        
        // Forçar atualização das interfaces
        forceUpdateInterfaces();
        
    } catch (error) {
        console.error('❌ Erro durante correção:', error);
    }
}

// Função para forçar atualização das interfaces
function forceUpdateInterfaces() {
    console.log('🔄 Forçando atualização das interfaces...');
    
    // Atualizar dashboard se estivermos na página do dashboard
    if (window.updateSchedulesList) {
        console.log('📊 Atualizando lista de agendamentos do dashboard...');
        window.updateSchedulesList();
    }
    
    // Atualizar página de agendamentos se estivermos nela
    if (window.updateSchedulesList && document.getElementById('scheduleList')) {
        console.log('📅 Atualizando lista de agendamentos da página de agendamentos...');
        window.updateSchedulesList();
    }
    
    // Disparar evento customizado para notificar outras partes da aplicação
    const event = new CustomEvent('schedulesUpdated', {
        detail: {
            timestamp: new Date().toISOString(),
            source: 'fix-schedules-sync.js'
        }
    });
    window.dispatchEvent(event);
    
    console.log('✅ Interfaces atualizadas');
}

// Função para verificar se há problemas de sincronização
function checkSyncIssues() {
    try {
        const currentUser = window.sessionManager ? window.sessionManager.getCurrentUser() : null;
        const userId = currentUser ? currentUser.id : 'anonymous';
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        const userSchedules = allSchedules.filter(s => s.userId === userId);
        
        const issues = [];
        
        if (allSchedules.length > 0 && userSchedules.length === 0) {
            issues.push('Usuário não tem agendamentos apesar de existirem agendamentos no sistema');
        }
        
        if (allSchedules.some(s => !s.userId)) {
            issues.push('Existem agendamentos sem userId');
        }
        
        if (allSchedules.some(s => s.userId === 'anonymous')) {
            issues.push('Existem agendamentos com userId "anonymous"');
        }
        
        return {
            hasIssues: issues.length > 0,
            issues: issues,
            totalSchedules: allSchedules.length,
            userSchedules: userSchedules.length,
            userId: userId
        };
    } catch (error) {
        console.error('❌ Erro ao verificar problemas:', error);
        return {
            hasIssues: true,
            issues: ['Erro ao verificar problemas: ' + error.message],
            totalSchedules: 0,
            userSchedules: 0,
            userId: 'error'
        };
    }
}

// Função para criar um agendamento de teste para verificar sincronização
function createTestSchedule() {
    try {
        const currentUser = window.sessionManager ? window.sessionManager.getCurrentUser() : null;
        const userId = currentUser ? currentUser.id : 'anonymous';
        
        if (!currentUser || userId === 'anonymous') {
            console.error('❌ Usuário não está logado. Não é possível criar agendamento de teste.');
            return false;
        }
        
        const testSchedule = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            title: 'Meditação de Teste - Sincronização',
            time: '08:00',
            category: 'Teste',
            days: ['seg', 'qua', 'sex'],
            notifications: true,
            date: new Date().toISOString().split('T')[0],
            duration: 15,
            status: 'agendado',
            createdAt: new Date().toISOString(),
            description: 'Agendamento de teste para verificar sincronização',
            userId: userId,
            userName: currentUser.name
        };
        
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        allSchedules.push(testSchedule);
        localStorage.setItem('user_schedules', JSON.stringify(allSchedules));
        
        console.log('✅ Agendamento de teste criado:', testSchedule.title);
        
        // Forçar atualização das interfaces
        forceUpdateInterfaces();
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao criar agendamento de teste:', error);
        return false;
    }
}

// Função para limpar todos os agendamentos (útil para testes)
function clearAllSchedules() {
    if (confirm('Tem certeza que deseja limpar TODOS os agendamentos? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('user_schedules');
        console.log('🗑️ Todos os agendamentos foram removidos');
        forceUpdateInterfaces();
    }
}

// Executar correção automaticamente quando o script for carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(fixSchedulesSync, 1000);
    });
} else {
    setTimeout(fixSchedulesSync, 1000);
}

// Monitorar mudanças no localStorage para detectar problemas
window.addEventListener('storage', function(e) {
    if (e.key === 'user_schedules') {
        console.log('🔄 Mudança detectada nos agendamentos, verificando sincronização...');
        setTimeout(() => {
            const issues = checkSyncIssues();
            if (issues.hasIssues) {
                console.warn('⚠️ Problemas de sincronização detectados:', issues.issues);
                fixSchedulesSync();
            }
        }, 500);
    }
});

// Tornar funções globais para uso em outras páginas
window.fixSchedulesSync = fixSchedulesSync;
window.checkSyncIssues = checkSyncIssues;
window.createTestSchedule = createTestSchedule;
window.clearAllSchedules = clearAllSchedules;
window.forceUpdateInterfaces = forceUpdateInterfaces;

console.log('✅ Script de correção de sincronização carregado'); 