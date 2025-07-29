// Script desabilitado para não interferir no dashboard principal
// console.log('🔧 Iniciando correção do botão de novo agendamento...');
// Todas as funções e execuções deste arquivo foram desabilitadas para evitar conflitos.

// Função para verificar e corrigir o botão
function fixScheduleButton() {
    // console.log('🔍 Verificando botão de novo agendamento...');
    
    const button = document.querySelector('.add-schedule-btn');
    if (!button) {
        // console.error('❌ Botão de novo agendamento não encontrado');
        return false;
    }
    
    // console.log('✅ Botão encontrado:', button);
    
    // Remover eventos existentes para evitar duplicação
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    
    // Adicionar novo evento de clique
    newButton.addEventListener('click', function(event) {
        event.preventDefault();
        // console.log('🎯 Botão de novo agendamento clicado');
        
        // Verificar se a função existe
        if (typeof openScheduleModal === 'function') {
            // console.log('✅ Chamando openScheduleModal...');
            openScheduleModal();
        } else {
            // console.error('❌ Função openScheduleModal não encontrada');
            
            // Tentar recriar a função
            // console.log('🔧 Recriando função openScheduleModal...');
            window.openScheduleModal = function() {
                // console.log('🎯 openScheduleModal (recriada) chamada');
                
                const modal = document.getElementById('scheduleModal');
                if (!modal) {
                    // console.error('❌ Modal não encontrado');
                    alert('Erro: Modal não encontrado');
                    return;
                }
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Carregar categorias se a função existir
                if (typeof updateCategorySelect === 'function') {
                    updateCategorySelect();
                }
                
                // console.log('✅ Modal aberto com sucesso');
            };
            
            // Chamar a função recriada
            openScheduleModal();
        }
    });
    
    // console.log('✅ Evento de clique adicionado ao botão');
    return true;
}

// Função para verificar se o modal está funcionando
function checkModalFunctionality() {
    // console.log('🔍 Verificando funcionalidade do modal...');
    
    const modal = document.getElementById('scheduleModal');
    if (!modal) {
        // console.error('❌ Modal não encontrado');
        return false;
    }
    
    const form = document.getElementById('scheduleForm');
    if (!form) {
        // console.error('❌ Formulário não encontrado');
        return false;
    }
    
    // Verificar botões de dias da semana
    const weekdayButtons = document.querySelectorAll('.weekday-btn');
    if (weekdayButtons.length === 0) {
        // console.error('❌ Botões de dias da semana não encontrados');
        return false;
    }
    
    // console.log('✅ Modal e componentes encontrados');
    return true;
}

// Função para adicionar eventos aos botões de dias da semana
function addWeekdayEvents() {
    // console.log('🔧 Adicionando eventos aos botões de dias da semana...');
    
    const weekdayButtons = document.querySelectorAll('.weekday-btn');
    weekdayButtons.forEach(btn => {
        // Remover eventos existentes
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Adicionar novo evento
        newBtn.addEventListener('click', function() {
            // console.log('📅 Dia clicado:', this.dataset.day);
            this.classList.toggle('active');
        });
    });
    
    // console.log('✅ Eventos dos botões de dias da semana adicionados');
}

// Função para adicionar evento ao formulário
function addFormEvent() {
    // console.log('🔧 Adicionando evento ao formulário...');
    
    const form = document.getElementById('scheduleForm');
    if (!form) {
        // console.error('❌ Formulário não encontrado');
        return;
    }
    
    // Remover eventos existentes
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Adicionar novo evento
    newForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // console.log('📝 Formulário submetido');
        
        if (typeof saveSchedule === 'function') {
            saveSchedule(event);
        } else {
            // console.error('❌ Função saveSchedule não encontrada');
            alert('Erro: Função de salvar não encontrada');
        }
    });
    
    // console.log('✅ Evento de submit adicionado ao formulário');
}

// Função para testar o botão
function testScheduleButton() {
    // console.log('🧪 === TESTANDO BOTÃO DE NOVO AGENDAMENTO ===');
    
    const button = document.querySelector('.add-schedule-btn');
    if (button) {
        // console.log('✅ Botão encontrado, simulando clique...');
        button.click();
        
        setTimeout(() => {
            const modal = document.getElementById('scheduleModal');
            if (modal && modal.classList.contains('active')) {
                // console.log('✅ Modal abriu com sucesso!');
                
                // Testar fechamento
                setTimeout(() => {
                    const closeBtn = modal.querySelector('.close-btn');
                    if (closeBtn) {
                        closeBtn.click();
                        // console.log('✅ Modal fechou com sucesso!');
                    }
                }, 2000);
            } else {
                // console.error('❌ Modal não abriu');
            }
        }, 1000);
    } else {
        // console.error('❌ Botão não encontrado');
    }
}

// Função principal
function initializeScheduleButton() {
    // console.log('🔧 === INICIANDO CORREÇÃO DO BOTÃO DE AGENDAMENTO ===');
    
    // Corrigir botão
    const buttonFixed = fixScheduleButton();
    
    // Verificar modal
    const modalWorking = checkModalFunctionality();
    
    // Adicionar eventos
    addWeekdayEvents();
    addFormEvent();
    
    // console.log('📊 === RESUMO ===');
    // console.log('Botão corrigido:', buttonFixed);
    // console.log('Modal funcionando:', modalWorking);
    
    if (buttonFixed && modalWorking) {
        // console.log('✅ Botão de novo agendamento corrigido com sucesso!');
        return true;
    } else {
        // console.error('❌ Falha na correção do botão');
        return false;
    }
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScheduleButton);
} else {
    initializeScheduleButton();
}

// Expor funções para teste
window.fixScheduleButton = fixScheduleButton;
window.testScheduleButton = testScheduleButton;
window.initializeScheduleButton = initializeScheduleButton; 