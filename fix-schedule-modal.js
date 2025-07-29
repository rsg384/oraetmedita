// Script para corrigir problemas do modal de agendamento
console.log('🔧 Iniciando fix-schedule-modal.js...');

// Função para forçar atualização das categorias no modal
function forceUpdateCategorySelect() {
    console.log('🔄 Forçando atualização das categorias no modal...');
    
    const categorySelect = document.querySelector('select[name="category"]');
    if (!categorySelect) {
        console.error('❌ Select de categoria não encontrado');
        return;
    }
    
    // Obter categorias do localStorage
    let categories = [];
    try {
        categories = JSON.parse(localStorage.getItem('categories') || '[]');
        console.log('📋 Categorias carregadas:', categories.length);
        
        // Se não houver categorias, criar algumas padrão
        if (categories.length === 0) {
            categories = [
                { id: 'oracao', name: 'Oração', description: 'Meditações sobre oração' },
                { id: 'contemplacao', name: 'Contemplação', description: 'Meditações contemplativas' },
                { id: 'lectio', name: 'Lectio Divina', description: 'Leitura orante da Palavra' }
            ];
            localStorage.setItem('categories', JSON.stringify(categories));
            console.log('✅ Categorias padrão criadas');
        }
    } catch (error) {
        console.error('❌ Erro ao carregar categorias:', error);
        categories = [];
    }
    
    // Limpar e recriar options
    categorySelect.innerHTML = '<option value="">Selecione uma categoria</option>';
    
    if (categories.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhuma categoria disponível';
        option.disabled = true;
        categorySelect.appendChild(option);
    } else {
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
        console.log('✅ Categorias adicionadas ao select:', categories.map(c => c.name));
    }
}

// Sobrescrever a função openScheduleModal para garantir que as categorias sejam carregadas
const originalOpenScheduleModal = window.openScheduleModal;
window.openScheduleModal = function() {
    console.log('🎯 openScheduleModal chamada (versão corrigida)');
    
    // Abrir o modal
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal aberto');
    }
    
    // Aguardar um pouco e então carregar as categorias
    setTimeout(() => {
        forceUpdateCategorySelect();
    }, 100);
    
    // Chamar função original se existir
    if (originalOpenScheduleModal && originalOpenScheduleModal !== window.openScheduleModal) {
        originalOpenScheduleModal();
    }
};

// Função para testar o modal
window.testScheduleModal = function() {
    console.log('🧪 Testando modal de agendamento...');
    openScheduleModal();
    
    setTimeout(() => {
        const categorySelect = document.querySelector('select[name="category"]');
        if (categorySelect) {
            console.log('📋 Opções no select:', categorySelect.options.length);
            for (let i = 0; i < categorySelect.options.length; i++) {
                console.log(`- ${i}: ${categorySelect.options[i].text}`);
            }
        }
    }, 200);
};

// Event listener para quando o modal for aberto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 fix-schedule-modal.js carregado');
    
    // Observar mudanças no modal
    const modal = document.getElementById('scheduleModal');
    if (modal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (modal.classList.contains('active')) {
                        console.log('👁️ Modal detectado como ativo, atualizando categorias...');
                        setTimeout(forceUpdateCategorySelect, 50);
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

console.log('✅ fix-schedule-modal.js inicializado'); 