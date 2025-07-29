// Script para corrigir o carregamento de agendamentos no dashboard
console.log('🔧 Iniciando correção do carregamento de agendamentos no dashboard...');

// Função para forçar o carregamento correto dos agendamentos
function forceLoadDashboardSchedules() {
    try {
        console.log('🔄 Forçando carregamento de agendamentos no dashboard...');
        
        // Obter usuário atual
        const currentUser = window.sessionManager ? window.sessionManager.getCurrentUser() : null;
        const userId = currentUser ? currentUser.id : 'anonymous';
        
        console.log('👤 Usuário atual:', currentUser ? currentUser.name : 'N/A', 'ID:', userId);
        
        // Carregar todos os agendamentos do localStorage
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 Total de agendamentos no sistema:', allSchedules.length);
        
        // Filtrar apenas agendamentos do usuário atual
        let userSchedules = allSchedules.filter(schedule => {
            // Se o agendamento não tem userId, associar ao usuário atual (migração)
            if (!schedule.userId || schedule.userId === 'anonymous') {
                if (userId !== 'anonymous' && currentUser && currentUser.name) {
                    console.log('🔧 Corrigindo agendamento sem userId:', schedule.title || 'Sem título');
                    schedule.userId = userId;
                    schedule.userName = currentUser.name;
                    return true;
                }
                return false;
            }
            return schedule.userId === userId;
        });
        
        console.log('📅 Agendamentos do usuário atual:', userSchedules.length);
        
        // Salvar correções no localStorage se necessário
        if (allSchedules.length !== userSchedules.length) {
            const otherUsersSchedules = allSchedules.filter(schedule => 
                schedule.userId && schedule.userId !== userId && schedule.userId !== 'anonymous'
            );
            const updatedAllSchedules = [...otherUsersSchedules, ...userSchedules];
            localStorage.setItem('user_schedules', JSON.stringify(updatedAllSchedules));
            console.log('✅ Agendamentos corrigidos e salvos no localStorage');
        }
        
        // Atualizar a variável global schedules
        if (window.schedules !== undefined) {
            window.schedules = userSchedules;
            console.log('✅ Variável global schedules atualizada');
        }
        
        // Forçar atualização da interface
        forceUpdateDashboardSchedulesList(userSchedules);
        
        return userSchedules;
        
    } catch (error) {
        console.error('❌ Erro ao forçar carregamento de agendamentos:', error);
        return [];
    }
}

// Função para forçar atualização da lista de agendamentos no dashboard
function forceUpdateDashboardSchedulesList(schedules = null) {
    try {
        console.log('🔄 Forçando atualização da lista de agendamentos no dashboard...');
        
        // Usar schedules fornecidos ou carregar novamente
        const userSchedules = schedules || forceLoadDashboardSchedules();
        console.log('📋 Agendamentos para exibir:', userSchedules.length);
        
        const scheduleList = document.getElementById('dashboardScheduleList');
        if (!scheduleList) {
            console.error('❌ Elemento dashboardScheduleList não encontrado');
            return;
        }
        
        if (userSchedules.length === 0) {
            console.log('📭 Nenhum agendamento para exibir - mostrando estado vazio');
            scheduleList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📅</div>
                    <h3>Nenhum agendamento encontrado</h3>
                    <p>Crie seu primeiro agendamento para começar a meditar regularmente</p>
                </div>
            `;
            return;
        }
        
        // Limitar a 3 agendamentos
        const limitedSchedules = userSchedules.slice(0, 3);
        console.log('📝 Gerando HTML para', limitedSchedules.length, 'agendamentos (limitado a 3)');
        
        const scheduleHTML = limitedSchedules.map(schedule => {
            console.log('📋 Processando agendamento:', schedule.id, schedule.title);
            return `
                <div class="schedule-item" data-schedule-id="${schedule.id}">
                    <div class="schedule-info">
                        <span class="schedule-time">🕐 ${schedule.time}</span>
                        <span class="schedule-category">${schedule.category}</span>
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">
                            ${schedule.days.map(day => {
                                const days = { seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom' };
                                return days[day];
                            }).join(', ')}
                        </span>
                    </div>
                    <div class="schedule-actions">
                        <button class="action-btn" onclick="editSchedule('${schedule.id}')">✏️</button>
                        <button class="action-btn" onclick="deleteSchedule('${schedule.id}')">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
        
        // Adicionar botão "Ver mais" se houver mais de 3 agendamentos
        let finalHTML = scheduleHTML;
        if (userSchedules.length > 3) {
            console.log('➕ Adicionando botão "Ver mais" para', userSchedules.length - 3, 'agendamentos adicionais');
            finalHTML += `
                <div class="schedule-item more-button" onclick="showAllSchedules()" style="cursor: pointer; border: 2px dashed #7ee787; opacity: 0.8;">
                    <div class="schedule-info">
                        <span class="schedule-time">📅 Ver Mais</span>
                        <span class="schedule-category">+${userSchedules.length - 3} agendamentos</span>
                        <span style="font-size: 0.75rem; color: var(--text-secondary);">
                            Clique para ver todos os agendamentos
                        </span>
                    </div>
                    <div class="schedule-actions">
                        <button class="action-btn" style="background: transparent; border: none; color: #7ee787;">→</button>
                    </div>
                </div>
            `;
        }
        
        scheduleList.innerHTML = finalHTML;
        console.log('✅ Lista de agendamentos do dashboard atualizada com sucesso');
        
    } catch (error) {
        console.error('❌ Erro ao forçar atualização da lista:', error);
    }
}

// Função para verificar se há problemas de sincronização
function checkDashboardSyncIssues() {
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
        
        // Verificar se a variável global schedules está correta
        if (window.schedules && window.schedules.length !== userSchedules.length) {
            issues.push('Variável global schedules não está sincronizada');
        }
        
        return {
            hasIssues: issues.length > 0,
            issues: issues,
            totalSchedules: allSchedules.length,
            userSchedules: userSchedules.length,
            globalSchedules: window.schedules ? window.schedules.length : 0,
            userId: userId
        };
    } catch (error) {
        console.error('❌ Erro ao verificar problemas:', error);
        return {
            hasIssues: true,
            issues: ['Erro ao verificar problemas: ' + error.message],
            totalSchedules: 0,
            userSchedules: 0,
            globalSchedules: 0,
            userId: 'error'
        };
    }
}

// Função para corrigir problemas de sincronização
function fixDashboardSyncIssues() {
    console.log('🔧 Corrigindo problemas de sincronização do dashboard...');
    
    const issues = checkDashboardSyncIssues();
    console.log('📊 Problemas encontrados:', issues);
    
    if (issues.hasIssues) {
        console.log('🔧 Aplicando correções...');
        forceLoadDashboardSchedules();
    } else {
        console.log('✅ Nenhum problema encontrado');
    }
}

// Função para mostrar todos os agendamentos
function showAllSchedules() {
    console.log('📅 Redirecionando para página de agendamentos...');
    window.location.href = 'agendamentos.html';
}

// Executar correção automaticamente quando o script for carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            console.log('🔄 Executando correção automática do dashboard...');
            forceLoadDashboardSchedules();
        }, 1000);
    });
} else {
    setTimeout(() => {
        console.log('🔄 Executando correção automática do dashboard...');
        forceLoadDashboardSchedules();
    }, 1000);
}

// Monitorar mudanças no localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'user_schedules') {
        console.log('🔄 Mudança detectada nos agendamentos, atualizando dashboard...');
        setTimeout(() => {
            forceLoadDashboardSchedules();
        }, 500);
    }
});

// Tornar funções globais
window.forceLoadDashboardSchedules = forceLoadDashboardSchedules;
window.forceUpdateDashboardSchedulesList = forceUpdateDashboardSchedulesList;
window.checkDashboardSyncIssues = checkDashboardSyncIssues;
window.fixDashboardSyncIssues = fixDashboardSyncIssues;
window.showAllSchedules = showAllSchedules;

console.log('✅ Script de correção do dashboard carregado'); 