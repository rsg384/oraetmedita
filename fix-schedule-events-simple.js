// Script simples para corrigir eventos do modal de agendamento
console.log('🔧 Iniciando fix-schedule-events-simple.js...');

// Função para adicionar eventos aos botões de dias da semana
function addWeekdayEvents() {
    console.log('🔧 Adicionando eventos aos botões de dias da semana...');
    
    const weekdayButtons = document.querySelectorAll('.weekday-btn');
    console.log('📅 Botões encontrados:', weekdayButtons.length);
    
    weekdayButtons.forEach((btn, index) => {
        // Remover eventos existentes
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Adicionar novo evento
        newBtn.addEventListener('click', function() {
            console.log('📅 Dia clicado:', this.dataset.day);
            this.classList.toggle('active');
            console.log('✅ Classe active toggleada para:', this.dataset.day);
        });
        
        console.log(`✅ Evento adicionado ao botão ${index + 1}:`, this.dataset.day);
    });
    
    console.log('✅ Todos os eventos dos botões de dias adicionados');
}

// Função para adicionar evento ao formulário
function addFormEvent() {
    console.log('🔧 Adicionando evento ao formulário...');
    
    const form = document.getElementById('scheduleForm');
    if (!form) {
        console.error('❌ Formulário não encontrado');
        return;
    }
    
    // Remover eventos existentes
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Adicionar novo evento
    newForm.addEventListener('submit', function(event) {
        event.preventDefault();
        console.log('📝 Formulário submetido');
        
        if (typeof saveSchedule === 'function') {
            saveSchedule(event);
        } else {
            console.error('❌ Função saveSchedule não encontrada');
            alert('Erro: Função de salvar não encontrada');
        }
    });
    
    console.log('✅ Evento de submit adicionado ao formulário');
}

// Função para adicionar eventos aos botões do modal
function addModalButtonEvents() {
    console.log('🔧 Adicionando eventos aos botões do modal...');
    
    // Botão de fechar (X)
    const closeBtn = document.querySelector('#scheduleModal .close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('❌ Botão fechar clicado');
            if (typeof closeScheduleModal === 'function') {
                closeScheduleModal();
            }
        });
        console.log('✅ Evento do botão fechar adicionado');
    }
    
    // Botão de cancelar
    const cancelBtn = document.querySelector('#scheduleModal .btn-secondary');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            console.log('❌ Botão cancelar clicado');
            if (typeof closeScheduleModal === 'function') {
                closeScheduleModal();
            }
        });
        console.log('✅ Evento do botão cancelar adicionado');
    }
}

// Função principal
function initializeEvents() {
    console.log('🔧 === INICIANDO EVENTOS DO MODAL ===');
    
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        addWeekdayEvents();
        addFormEvent();
        addModalButtonEvents();
        
        console.log('✅ Todos os eventos foram adicionados');
    }, 1000);
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEvents);
} else {
    initializeEvents();
}

// Observar mudanças no modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (modal.classList.contains('active')) {
                        console.log('👁️ Modal ativo detectado, re-adicionando eventos...');
                        setTimeout(initializeEvents, 100);
                    }
                }
            });
        });
        
        observer.observe(modal, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

console.log('✅ fix-schedule-events-simple.js inicializado'); 