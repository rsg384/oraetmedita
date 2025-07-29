// Script para corrigir eventos do modal de agendamento
console.log('🔧 Iniciando fix-schedule-events.js...');

// Função para adicionar eventos aos botões de dias da semana
function addWeekdayButtonEvents() {
    console.log('🔧 Adicionando eventos aos botões de dias da semana...');
    
    const weekdayButtons = document.querySelectorAll('.weekday-btn');
    if (weekdayButtons.length === 0) {
        console.error('❌ Botões de dias da semana não encontrados');
        return false;
    }
    
    weekdayButtons.forEach(btn => {
        // Remover eventos existentes para evitar duplicação
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Adicionar evento de clique
        newBtn.addEventListener('click', function() {
            console.log('📅 Dia clicado:', this.dataset.day);
            this.classList.toggle('active');
            console.log('✅ Classe active toggleada para:', this.dataset.day);
        });
    });
    
    console.log('✅ Eventos dos botões de dias da semana adicionados');
    return true;
}

// Função para adicionar evento ao formulário
function addFormSubmitEvent() {
    console.log('🔧 Adicionando evento de submit ao formulário...');
    
    const form = document.getElementById('scheduleForm');
    if (!form) {
        console.error('❌ Formulário não encontrado');
        return false;
    }
    
    // Remover eventos existentes para evitar duplicação
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Adicionar evento de submit
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
    return true;
}

// Função para adicionar eventos aos botões de cancelar e fechar
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
    }
    
    console.log('✅ Eventos dos botões do modal adicionados');
    return true;
}

// Função para inicializar todos os eventos
function initializeScheduleEvents() {
    console.log('🔧 === INICIANDO EVENTOS DO MODAL DE AGENDAMENTO ===');
    
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        const weekdayEvents = addWeekdayButtonEvents();
        const formEvents = addFormSubmitEvent();
        const modalEvents = addModalButtonEvents();
        
        console.log('📊 === RESUMO DOS EVENTOS ===');
        console.log('Botões de dias da semana:', weekdayEvents);
        console.log('Formulário:', formEvents);
        console.log('Botões do modal:', modalEvents);
        
        if (weekdayEvents && formEvents && modalEvents) {
            console.log('✅ Todos os eventos do modal de agendamento foram adicionados com sucesso!');
        } else {
            console.error('❌ Alguns eventos não foram adicionados corretamente');
        }
    }, 500);
}

// Função para testar o modal
function testScheduleModal() {
    console.log('🧪 === TESTANDO MODAL DE AGENDAMENTO ===');
    
    // Abrir modal
    if (typeof openScheduleModal === 'function') {
        openScheduleModal();
        console.log('✅ Modal aberto');
        
        // Testar botões de dias da semana após um delay
        setTimeout(() => {
            const weekdayButtons = document.querySelectorAll('.weekday-btn');
            console.log('📅 Botões de dias encontrados:', weekdayButtons.length);
            
            if (weekdayButtons.length > 0) {
                // Simular clique no primeiro botão
                weekdayButtons[0].click();
                console.log('✅ Clique simulado no primeiro botão');
            }
        }, 1000);
    } else {
        console.error('❌ Função openScheduleModal não encontrada');
    }
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScheduleEvents);
} else {
    initializeScheduleEvents();
}

// Observar mudanças no modal para re-adicionar eventos quando necessário
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (modal.classList.contains('active')) {
                        console.log('👁️ Modal ativo detectado, re-adicionando eventos...');
                        setTimeout(initializeScheduleEvents, 100);
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

// Expor funções para teste
window.initializeScheduleEvents = initializeScheduleEvents;
window.testScheduleModal = testScheduleModal;

console.log('✅ fix-schedule-events.js inicializado'); 