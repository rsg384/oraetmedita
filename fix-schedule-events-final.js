// Script final para corrigir eventos do modal de agendamento
console.log('🔧 Iniciando fix-schedule-events-final.js...');

// Função para adicionar eventos aos botões de dias da semana
function addWeekdayButtonEvents() {
    console.log('🔧 Adicionando eventos aos botões de dias da semana...');
    
    const weekdayButtons = document.querySelectorAll('.weekday-btn');
    console.log('📅 Botões encontrados:', weekdayButtons.length);
    
    if (weekdayButtons.length === 0) {
        console.error('❌ Nenhum botão de dia da semana encontrado');
        return false;
    }
    
    weekdayButtons.forEach((btn, index) => {
        // Remover todos os event listeners existentes
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Adicionar novo event listener
        newBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('📅 Dia clicado:', this.dataset.day);
            this.classList.toggle('active');
            console.log('✅ Classe active toggleada para:', this.dataset.day);
        });
        
        console.log(`✅ Evento adicionado ao botão ${index + 1}: ${btn.dataset.day}`);
    });
    
    console.log('✅ Todos os eventos dos botões de dias adicionados');
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
    
    // Remover todos os event listeners existentes
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Adicionar novo event listener
    newForm.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();
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

// Função para adicionar eventos aos botões do modal
function addModalButtonEvents() {
    console.log('🔧 Adicionando eventos aos botões do modal...');
    
    // Botão de fechar (X)
    const closeBtn = document.querySelector('#scheduleModal .close-btn');
    if (closeBtn) {
        // Remover event listeners existentes
        const newCloseBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
        
        newCloseBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
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
        // Remover event listeners existentes
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        
        newCancelBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            console.log('❌ Botão cancelar clicado');
            if (typeof closeScheduleModal === 'function') {
                closeScheduleModal();
            }
        });
        console.log('✅ Evento do botão cancelar adicionado');
    }
    
    return true;
}

// Função para forçar a adição de eventos
function forceAddEvents() {
    console.log('🔧 === FORÇANDO ADIÇÃO DE EVENTOS ===');
    
    // Tentar múltiplas vezes para garantir que funcione
    let attempts = 0;
    const maxAttempts = 5;
    
    const tryAddEvents = () => {
        attempts++;
        console.log(`🔄 Tentativa ${attempts} de adicionar eventos...`);
        
        const weekdaySuccess = addWeekdayButtonEvents();
        const formSuccess = addFormSubmitEvent();
        const modalSuccess = addModalButtonEvents();
        
        if (weekdaySuccess && formSuccess && modalSuccess) {
            console.log('✅ Todos os eventos foram adicionados com sucesso!');
            return true;
        } else {
            console.warn(`⚠️ Alguns eventos não foram adicionados na tentativa ${attempts}`);
            if (attempts < maxAttempts) {
                setTimeout(tryAddEvents, 500);
            } else {
                console.error('❌ Falha ao adicionar eventos após múltiplas tentativas');
                return false;
            }
        }
    };
    
    tryAddEvents();
}

// Função principal
function initializeEvents() {
    console.log('🔧 === INICIANDO EVENTOS DO MODAL ===');
    
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
        forceAddEvents();
    }, 1000);
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEvents);
} else {
    initializeEvents();
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
                        setTimeout(forceAddEvents, 100);
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

// Expor funções para teste
window.initializeEvents = initializeEvents;
window.testScheduleModal = testScheduleModal;
window.forceAddEvents = forceAddEvents;

console.log('✅ fix-schedule-events-final.js inicializado'); 