// Script para implementar agendamentos no dashboard
console.log('🔄 Iniciando dashboard-schedules.js...');

// Variável para armazenar os agendamentos
let dashboardSchedules = [];

// Função para carregar agendamentos do usuário atual
function loadDashboardSchedules() {
    try {
        console.log('🔄 Carregando agendamentos para o dashboard...');
        
        // Usar o novo sistema de sincronização se disponível
        if (window.loadUserSchedules) {
            console.log('🔄 Chamando loadUserSchedules...');
            dashboardSchedules = window.loadUserSchedules();
            console.log('✅ Agendamentos carregados com sincronização:', dashboardSchedules.length);
            console.log('📋 Detalhes dos agendamentos:', dashboardSchedules.map(s => ({ id: s.id, title: s.title, userId: s.userId })));
        } else {
            console.warn('⚠️ Função loadUserSchedules não disponível, usando método antigo');
            
            // Obter usuário atual
            const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = currentUser.id || 'anonymous';
            
            console.log('👤 Usuário atual:', currentUser.name, 'ID:', userId);
            
            // Carregar todos os agendamentos do localStorage
            const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
            console.log('📋 Total de agendamentos no sistema:', allSchedules.length);
            
            // Filtrar apenas agendamentos do usuário atual
            dashboardSchedules = allSchedules.filter(schedule => {
                // Se o agendamento não tem userId, associar ao usuário atual (migração)
                if (!schedule.userId) {
                    schedule.userId = userId;
                    return true;
                }
                return schedule.userId === userId;
            });
            
            console.log('📋 Agendamentos do usuário atual:', dashboardSchedules.length);
            
            // Salvar correções no localStorage se necessário
            if (allSchedules.length !== dashboardSchedules.length) {
                const otherUsersSchedules = allSchedules.filter(schedule => schedule.userId !== userId);
                const updatedAllSchedules = [...otherUsersSchedules, ...dashboardSchedules];
                localStorage.setItem('user_schedules', JSON.stringify(updatedAllSchedules));
                console.log('✅ Agendamentos corrigidos e salvos no localStorage');
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar agendamentos:', error);
        dashboardSchedules = [];
    }
}

// Função para atualizar a lista de agendamentos no dashboard
function updateDashboardSchedulesList() {
    console.log('🔄 Atualizando lista de agendamentos no dashboard...');
    console.log('📋 Agendamentos para exibir:', dashboardSchedules.length);
    
    const scheduleList = document.getElementById('dashboardScheduleList');
    if (!scheduleList) {
        console.error('❌ Elemento dashboardScheduleList não encontrado');
        return;
    }

    if (dashboardSchedules.length === 0) {
        console.log('📭 Nenhum agendamento para exibir - mostrando estado vazio');
        scheduleList.innerHTML = `
            <div class="schedule-card empty-state">
                <div class="empty-state-icon">📅</div>
                <div class="empty-state-title">Nenhum agendamento encontrado</div>
                <div class="empty-state-description">Crie seu primeiro agendamento para começar a meditar regularmente</div>
                <button class="add-schedule-btn" onclick="openScheduleModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Criar Primeiro Agendamento
                </button>
            </div>
        `;
        return;
    }

    // Limitar a 3 agendamentos para seguir o padrão da imagem
    const limitedSchedules = dashboardSchedules.slice(0, 3);
    console.log('📝 Gerando HTML para', limitedSchedules.length, 'agendamentos (limitado a 3)');
    
    const scheduleHTML = limitedSchedules.map(schedule => {
        console.log('📋 Processando agendamento:', schedule.id, schedule.title);
        
        // Mapear nomes dos dias
        const dayNames = {
            'seg': 'Seg',
            'ter': 'Ter',
            'qua': 'Qua',
            'qui': 'Qui',
            'sex': 'Sex',
            'sab': 'Sáb',
            'dom': 'Dom'
        };
        
        // Formatar horário
        const timeFormatted = schedule.time || '00:00';
        
        return `
            <div class="schedule-card" data-schedule-id="${schedule.id}">
                <div class="schedule-card-header">
                    <h3 class="schedule-card-title">${schedule.category || schedule.title || 'Agendamento'}</h3>
                    <div class="schedule-card-actions">
                        <button class="schedule-action-btn" onclick="editSchedule('${schedule.id}')" title="Editar">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                        </button>
                        <button class="schedule-action-btn delete" onclick="deleteSchedule('${schedule.id}')" title="Excluir">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3,6 5,6 21,6"/>
                                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="schedule-card-content">
                    <div class="schedule-card-info">
                        <div class="schedule-card-time">
                            <span class="time-icon">🕐</span>
                            <span class="time-text">${timeFormatted}</span>
                        </div>
                        
                        <div class="schedule-card-days">
                            ${schedule.days.map(day => `
                                <span class="day-badge">${dayNames[day]}</span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Adicionar card "Ver mais" se houver mais de 3 agendamentos
    let finalHTML = scheduleHTML;
    if (dashboardSchedules.length > 3) {
        console.log('➕ Adicionando card "Ver mais" para', dashboardSchedules.length - 3, 'agendamentos adicionais');
        finalHTML += `
            <div class="schedule-card more-card" onclick="window.location.href='agendamentos.html'">
                <div class="schedule-card-header">
                    <h3 class="schedule-card-title">Ver mais agendamentos</h3>
                </div>
                <div class="schedule-card-content">
                    <div class="schedule-card-info">
                        <div class="schedule-card-description">
                            +${dashboardSchedules.length - 3} agendamentos restantes
                        </div>
                        <div class="schedule-card-explore">
                            <span class="explore-icon">→</span>
                            <span class="explore-text">EXPLORAR</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    scheduleList.innerHTML = finalHTML;
    console.log('✅ Lista de agendamentos do dashboard atualizada com sucesso');
}

// Função para deletar agendamento (cópia da função da página de agendamentos)
function deleteSchedule(scheduleId) {
    console.log('🗑️ === INÍCIO DA EXCLUSÃO NO DASHBOARD ===');
    console.log('🗑️ ID recebido:', scheduleId, 'Tipo:', typeof scheduleId);
    console.log('📋 Total de agendamentos antes:', dashboardSchedules.length);
    
    if (!scheduleId) {
        console.error('❌ ID do agendamento é inválido:', scheduleId);
        showNotification('Erro: ID do agendamento inválido', 'error');
        return;
    }
    
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        try {
            // Obter dados do usuário atual
            const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = currentUser ? currentUser.id : 'anonymous';
            
            console.log('👤 Usuário atual:', currentUser ? currentUser.name : 'N/A', 'ID:', userId);
            
            // Converter scheduleId para string para comparação consistente
            const scheduleIdStr = String(scheduleId);
            console.log('🔄 ID convertido para string:', scheduleIdStr);
            
            // Verificar se o agendamento existe antes de tentar remover
            const scheduleExists = dashboardSchedules.some(s => String(s.id) === scheduleIdStr);
            console.log('🔍 Agendamento existe?', scheduleExists);
            
            if (!scheduleExists) {
                console.error('❌ Agendamento não encontrado no array local');
                showNotification('Erro: Agendamento não encontrado', 'error');
                return;
            }
            
            // Remover do array local com comparação de string
            const originalLength = dashboardSchedules.length;
            const filteredSchedules = dashboardSchedules.filter(s => String(s.id) !== scheduleIdStr);
            dashboardSchedules = filteredSchedules;
            
            console.log('🔍 Resultado da filtragem:', {
                originalLength,
                newLength: dashboardSchedules.length,
                removed: originalLength - dashboardSchedules.length,
                success: originalLength - dashboardSchedules.length === 1
            });
            
            if (originalLength - dashboardSchedules.length !== 1) {
                console.error('❌ Erro na filtragem: número incorreto de itens removidos');
                showNotification('Erro: Falha ao remover agendamento', 'error');
                return;
            }
            
            // Salvar no localStorage - preservar agendamentos de outros usuários
            const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
            console.log('💾 Total de agendamentos no localStorage:', allSchedules.length);
            
            // Remover agendamentos antigos do usuário atual
            const otherUsersSchedules = allSchedules.filter(schedule => 
                schedule.userId !== userId
            );
            
            // Adicionar os agendamentos atualizados do usuário atual
            const updatedAllSchedules = [...otherUsersSchedules, ...dashboardSchedules];
            
            localStorage.setItem('user_schedules', JSON.stringify(updatedAllSchedules));
            console.log('✅ localStorage atualizado. Total final:', updatedAllSchedules.length);
            
            // Atualizar a interface
            updateDashboardSchedulesList();
            
            showNotification('Agendamento excluído com sucesso!', 'success');
            console.log('✅ === EXCLUSÃO NO DASHBOARD CONCLUÍDA COM SUCESSO ===');
            
        } catch (error) {
            console.error('❌ Erro durante a exclusão:', error);
            showNotification('Erro ao excluir agendamento: ' + error.message, 'error');
        }
    } else {
        console.log('❌ Exclusão cancelada pelo usuário');
    }
}

// Função para editar agendamento
function editSchedule(scheduleId) {
    console.log('✏️ Editando agendamento:', scheduleId);
    
    const schedule = dashboardSchedules.find(s => String(s.id) === String(scheduleId));
    if (!schedule) {
        console.error('❌ Agendamento não encontrado:', scheduleId);
        showNotification('Erro: Agendamento não encontrado', 'error');
        return;
    }
    
    // Preencher formulário com dados do agendamento
    const form = document.getElementById('scheduleForm');
    if (form) {
        form.dataset.editId = String(scheduleId);
        
        // Preencher campos
        form.querySelector('select[name="category"]').value = schedule.category;
        form.querySelector('input[name="time"]').value = schedule.time;
        
        // Marcar dias da semana
        document.querySelectorAll('.weekday-btn').forEach(btn => {
            btn.classList.remove('active');
            if (schedule.days.includes(btn.dataset.day)) {
                btn.classList.add('active');
            }
        });
        
        // Atualizar título do modal
        document.getElementById('scheduleModal').querySelector('.modal-title').textContent = 'Editar Agendamento';
        
        // Abrir modal
        openScheduleModal();
    }
}

// Função para mostrar notificação
function showNotification(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Criar elemento de notificação se não existir
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    // Definir cor baseada no tipo
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    
    // Mostrar notificação
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Esconder após 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
    }, 3000);
}

// Função para obter dados das categorias
function getCategoriesData() {
    try {
        let adminCategories = JSON.parse(localStorage.getItem('categories') || '[]');
        // Se não houver categorias, criar exemplos
        if (!adminCategories || adminCategories.length === 0) {
            adminCategories = [
                { id: 'principios', name: 'Princípios Básicos', completed: 0, total: 10 },
                { id: 'evangelho', name: 'Evangelho', completed: 0, total: 8 },
                { id: 'imitacao', name: 'Imitação de Cristo', completed: 0, total: 12 },
                { id: 'jaculatorias', name: 'Jaculatórias', completed: 0, total: 6 }
            ];
            localStorage.setItem('categories', JSON.stringify(adminCategories));
        }
        return adminCategories;
    } catch (error) {
        console.error('❌ Erro ao carregar categorias:', error);
        return [];
    }
}

// Função para atualizar agendamentos do dashboard
function updateDashboardSchedules() {
    console.log('🔄 Atualizando agendamentos do dashboard...');
    loadDashboardSchedules();
    updateDashboardSchedulesList();
}

// Interceptar funções existentes para garantir atualização
if (window.updateDashboardStats) {
    const originalUpdateDashboardStats = window.updateDashboardStats;
    window.updateDashboardStats = function() {
        originalUpdateDashboardStats();
        updateDashboardSchedules();
    };
}

// Função para forçar atualização dos agendamentos
window.forceUpdateDashboardSchedules = function() {
    console.log('🔄 Forçando atualização dos agendamentos do dashboard...');
    loadDashboardSchedules();
    updateDashboardSchedulesList();
};

// Tornar funções globais
window.updateDashboardSchedules = updateDashboardSchedules;
window.updateDashboardSchedulesList = updateDashboardSchedulesList;
window.deleteSchedule = deleteSchedule;
window.editSchedule = editSchedule;
window.showNotification = showNotification;

// Executar após carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateDashboardSchedules, 1000);
    });
} else {
    setTimeout(updateDashboardSchedules, 1000);
}

console.log('✅ dashboard-schedules.js carregado com sucesso'); 