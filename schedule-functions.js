// Funções para o modal de agendamento
function openScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.style.display = 'block';
        loadCategoriesForSchedule();
    }
}

function closeScheduleModal() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function loadCategoriesForSchedule() {
    const select = document.querySelector('#scheduleForm select[name="category"]');
    if (!select) return;

    // Limpar opções existentes
    select.innerHTML = '<option value="">Selecione uma categoria</option>';

    // Carregar categorias do localStorage
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function saveSchedule() {
    const form = document.getElementById('scheduleForm');
    const formData = new FormData(form);
    
    const selectedDays = [];
    document.querySelectorAll('.weekday-btn.active').forEach(btn => {
        selectedDays.push(btn.dataset.day);
    });

    const schedule = {
        id: Date.now(),
        category: formData.get('category'),
        time: formData.get('time'),
        days: selectedDays,
        notifications: formData.get('notifications') === 'on',
        userId: getCurrentUserId()
    };

    // Salvar no localStorage
    const schedules = JSON.parse(localStorage.getItem('user_schedules')) || [];
    schedules.push(schedule);
    localStorage.setItem('user_schedules', JSON.stringify(schedules));

    // Fechar modal e atualizar lista
    closeScheduleModal();
    updateScheduleList();
    
    // Limpar formulário
    form.reset();
    document.querySelectorAll('.weekday-btn.active').forEach(btn => {
        btn.classList.remove('active');
    });
}

function updateScheduleList() {
    const scheduleList = document.getElementById('scheduleList');
    if (!scheduleList) return;

    const schedules = JSON.parse(localStorage.getItem('user_schedules')) || [];
    const userSchedules = schedules.filter(s => s.userId === getCurrentUserId());

    if (userSchedules.length === 0) {
        scheduleList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📅</div>
                <h3 class="empty-state-title">Nenhum agendamento</h3>
                <p class="empty-state-description">Crie seu primeiro agendamento para começar a meditar regularmente.</p>
            </div>
        `;
        return;
    }

    scheduleList.innerHTML = userSchedules.map(schedule => `
        <div class="schedule-card">
            <div class="schedule-card-header">
                <h4 class="schedule-card-title">${schedule.category}</h4>
                <div class="schedule-card-actions">
                    <button class="schedule-action-btn edit" onclick="editSchedule(${schedule.id})" title="Editar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="schedule-action-btn delete" onclick="deleteSchedule(${schedule.id})" title="Excluir">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="schedule-card-content">
                <div class="schedule-card-info">
                    <div class="schedule-card-time">
                        <span class="time-icon">🕐</span>
                        <span class="time-text">${schedule.time}</span>
                    </div>
                    <div class="schedule-card-days">
                        ${schedule.days.map(day => `<span class="day-badge">${day}</span>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function editSchedule(id) {
    // Implementar edição de agendamento
    console.log('Editar agendamento:', id);
}

function deleteSchedule(id) {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
        const schedules = JSON.parse(localStorage.getItem('user_schedules')) || [];
        const updatedSchedules = schedules.filter(s => s.id !== id);
        localStorage.setItem('user_schedules', JSON.stringify(updatedSchedules));
        updateScheduleList();
    }
}

function getCurrentUserId() {
    // Retornar ID do usuário atual (pode ser implementado conforme necessário)
    return 'user_' + Date.now();
}

// Configurar eventos quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar eventos dos botões de dias da semana
    const weekdayButtons = document.querySelectorAll('.weekday-btn');
    weekdayButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Configurar formulário de agendamento
    const scheduleForm = document.getElementById('scheduleForm');
    if (scheduleForm) {
        scheduleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSchedule();
        });
    }

    // Inicializar lista de agendamentos
    updateScheduleList();
}); 