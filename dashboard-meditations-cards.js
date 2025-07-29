// Script para implementar cards de meditações no dashboard
console.log('🔄 Iniciando dashboard-meditations-cards.js...');

// Atualizar estatísticas ao carregar o script
updateDashboardStatsWithPersonalized();

// Função para obter meditações personalizadas do usuário atual
function getPersonalizedMeditationsForDashboard() {
    try {
        console.log('🔄 Carregando meditações personalizadas para o dashboard...');
        
        // Obter usuário atual
        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = currentUser.id || 'anonymous';
        
        console.log('👤 Usuário atual:', currentUser.name, 'ID:', userId);
        
        // Carregar meditações do personalized_meditations
        const personalizedData = localStorage.getItem('personalized_meditations');
        
        if (!personalizedData) {
            console.log('📭 Nenhuma meditação personalizada encontrada');
            return [];
        }
        
        const allMeditations = JSON.parse(personalizedData);
        console.log('📚 Total de meditações carregadas:', allMeditations.length);
        
        // Filtrar apenas meditações do usuário atual e do tipo 'simple'
        const userMeditations = allMeditations.filter(med => 
            med.userId === userId && (med.type === 'simple' || !med.type)
        );
        
        console.log('📋 Meditações do usuário atual:', userMeditations.length);
        
        // Ordenar por data de criação (mais recentes primeiro)
        userMeditations.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
        
        return userMeditations;
    } catch (error) {
        console.error('❌ Erro ao carregar meditações personalizadas:', error);
        return [];
    }
}

// Função para criar um card de meditação
function createMeditationCard(meditation) {
    console.log('🎴 Criando card para meditação:', meditation.title);
    
    const card = document.createElement('div');
    card.className = 'meditation-card';
    card.dataset.meditationId = meditation.id;
    
    const title = meditation.title || 'Meditação';
    const category = 'Minhas Meditações'; // Categoria fixa
    const duration = meditation.duration || '15 min';
    const date = meditation.createdAt ? new Date(meditation.createdAt).toLocaleDateString('pt-BR') : 'Data não disponível';
    
    // Gerar cor baseada no título
    const colors = ['#7ee787', '#f87171', '#60a5fa', '#fbbf24', '#a78bfa', '#34d399', '#f59e0b', '#8b5cf6'];
    const colorIndex = title.length % colors.length;
    const meditationColor = colors[colorIndex];
    
    card.innerHTML = `
        <div class="meditation-card-content" onclick="window.location.href='minhas-meditacoes.html?topic=${encodeURIComponent(meditation.topic || category)}'">
            <div class="meditation-card-header">
                <div class="meditation-info">
                    <h4 class="meditation-title">${title}</h4>
                    <p class="meditation-topic">${category}</p>
                </div>
            </div>
            <div class="meditation-card-footer">
                <span class="meditation-date">${date}</span>
            </div>
        </div>
    `;
    
    console.log('✅ Card criado com sucesso para:', title);
    return card;
}

// Função para renderizar os cards de meditações no dashboard
function renderDashboardMeditationCards() {
    console.log('🔄 Renderizando cards de meditações no dashboard...');
    
    const grid = document.getElementById('my-meditations-grid');
    if (!grid) {
        console.warn('⚠️ Elemento my-meditations-grid não encontrado');
        return;
    }
    
    console.log('🔍 Elemento grid encontrado:', grid);
    console.log('🔍 Grid HTML antes:', grid.innerHTML.substring(0, 200));
    
    const meditations = getPersonalizedMeditationsForDashboard();
    console.log('📋 Meditações encontradas:', meditations.length);
    console.log('📋 Detalhes das meditações:', meditations.map(m => ({ id: m.id, title: m.title, userId: m.userId })));
    
    // Limpar grid
    grid.innerHTML = '';
    
    if (meditations.length === 0) {
        console.log('📭 Nenhuma meditação encontrada, ocultando seção');
        // Ocultar a seção quando não há meditações
        const myMeditationsSection = document.getElementById('my-meditations-section');
        if (myMeditationsSection) {
            myMeditationsSection.style.display = 'none';
        }
        return;
    }
    
    // Limitar a 2 cards principais
    const limitedMeditations = meditations.slice(0, 2);
    console.log('📋 Exibindo meditações limitadas:', limitedMeditations.length, '(máximo 2 principais)');
    
    // Criar cards
    limitedMeditations.forEach((meditation, index) => {
        console.log(`🎴 Criando card ${index + 1}:`, meditation.title);
        const card = createMeditationCard(meditation);
        console.log('🔍 Card criado:', card);
        grid.appendChild(card);
        console.log('✅ Card adicionado ao grid');
    });
    

    
    // Adicionar botão "Ver mais" se houver mais de 2 meditações
    if (meditations.length > 2) {
        console.log('➕ Adicionando botão "Ver mais" para', meditations.length - 2, 'meditações adicionais');
        const moreButton = document.createElement('div');
        moreButton.className = 'meditation-card more-button';
        moreButton.innerHTML = `
            <div class="meditation-card-content" onclick="window.location.href='minhas-meditacoes.html'">
                <div class="meditation-card-header">
                    <div class="meditation-info">
                        <h4 class="meditation-title">Ver mais meditações</h4>
                        <p class="meditation-topic">+${meditations.length - 2} meditações restantes</p>
                    </div>
                </div>
                <div class="meditation-card-footer">
                    <span class="meditation-date">Clique para ver todas</span>
                </div>
            </div>
        `;
        grid.appendChild(moreButton);
    }
    
    console.log('✅ Cards de meditações do dashboard renderizados com sucesso (máximo 3: 2 principais + 1 ver mais)');
    console.log('🔍 Grid HTML depois:', grid.innerHTML.substring(0, 500));
    
    // Atualizar estatísticas incluindo meditações personalizadas
    updateDashboardStatsWithPersonalized();
}

// Função para abrir meditação a partir do dashboard
function openMeditationFromDashboard(meditationId) {
    console.log('🚀 Abrindo meditação do dashboard:', meditationId);
    
    // Obter usuário atual
    const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = currentUser.id || 'anonymous';
    
    // Buscar dados da meditação
    let meditation = null;
    
    const personalizedData = localStorage.getItem('personalized_meditations');
    if (personalizedData) {
        try {
            const allMeditations = JSON.parse(personalizedData);
            const userMeditations = allMeditations.filter(med => med.userId === userId);
            meditation = userMeditations.find(med => med.id === meditationId);
            
            if (meditation) {
                console.log('✅ Meditação encontrada:', meditation.title);
                
                // Salvar a meditação no localStorage para a página minhas-meditacoes.html
                localStorage.setItem('current_meditation', JSON.stringify(meditation));
                
                // Redirecionar para minhas-meditacoes.html
                window.location.href = 'minhas-meditacoes.html';
            } else {
                console.error('❌ Meditação não encontrada:', meditationId);
                alert('Erro: Meditação não encontrada.');
            }
        } catch (error) {
            console.error('❌ Erro ao buscar meditação:', error);
            alert('Erro ao abrir meditação.');
        }
    }
}



// Função para formatar data
function formatDate(dateString) {
    if (!dateString) return 'Data não disponível';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return 'Data inválida';
    }
}

// Função para atualizar cards de meditações
function updateDashboardMeditationCards() {
    console.log('🔄 Atualizando cards de meditações do dashboard...');
    renderDashboardMeditationCards();
}

// Função para forçar renderização dos cards
function forceRenderDashboardMeditationCards() {
    console.log('🔄 Forçando renderização dos cards de meditações...');
    setTimeout(() => {
        renderDashboardMeditationCards();
    }, 100);
}

// Função para atualizar estatísticas incluindo meditações personalizadas
function updateDashboardStatsWithPersonalized() {
    try {
        console.log('🔄 Atualizando estatísticas com meditações personalizadas...');
        
        // Obter usuário atual
        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = currentUser.id || 'anonymous';
        
        // Carregar meditações personalizadas
        const personalizedData = localStorage.getItem('personalized_meditations');
        let personalizedCount = 0;
        
        if (personalizedData) {
            const allMeditations = JSON.parse(personalizedData);
            const userMeditations = allMeditations.filter(med => med.userId === userId);
            personalizedCount = userMeditations.length;
        }
        
        // Obter estatísticas atuais
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentCompleted = userData.stats?.completedMeditations || 0;
        
        // Adicionar meditações personalizadas ao total
        const totalCompleted = currentCompleted + personalizedCount;
        
        // Atualizar elemento no DOM
        const completedElement = document.getElementById('completedMeditations');
        if (completedElement) {
            completedElement.textContent = totalCompleted;
            console.log('✅ Estatísticas atualizadas:', totalCompleted, 'meditações completadas');
        }
        
        // Atualizar dados do usuário
        if (!userData.stats) userData.stats = {};
        userData.stats.completedMeditations = totalCompleted;
        localStorage.setItem('userData', JSON.stringify(userData));
        
    } catch (error) {
        console.error('❌ Erro ao atualizar estatísticas:', error);
    }
}

// Interceptar funções existentes para garantir atualização
if (window.updateDashboardStats) {
    const originalUpdateDashboardStats = window.updateDashboardStats;
    window.updateDashboardStats = function() {
        originalUpdateDashboardStats();
        updateDashboardMeditationCards();
    };
}

// Função de debug para testar manualmente
window.debugMeditationCards = function() {
    console.log('🔧 === DEBUG MEDITATION CARDS ===');
    console.log('🔧 Grid element:', document.getElementById('my-meditations-grid'));
    console.log('🔧 Personalized meditations:', localStorage.getItem('personalized_meditations'));
    console.log('🔧 Current user:', JSON.parse(localStorage.getItem('userData') || '{}'));
    console.log('🔧 Calling renderDashboardMeditationCards...');
    renderDashboardMeditationCards();
};

// Função para forçar renderização dos cards
window.forceRenderMeditationCards = function() {
    console.log('🚀 Forçando renderização dos cards de meditações...');
    setTimeout(() => {
        renderDashboardMeditationCards();
    }, 100);
};

// Tornar funções globais
window.renderDashboardMeditationCards = renderDashboardMeditationCards;
window.updateDashboardMeditationCards = updateDashboardMeditationCards;
window.openMeditationFromDashboard = openMeditationFromDashboard;

// Executar após carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔄 DOMContentLoaded disparado para meditation cards');
        setTimeout(renderDashboardMeditationCards, 1000);
        // Tentar novamente após 3 segundos para garantir
        setTimeout(renderDashboardMeditationCards, 3000);
        // Tentar uma terceira vez após 5 segundos
        setTimeout(renderDashboardMeditationCards, 5000);
    });
} else {
    console.log('🔄 Página já carregada, executando meditation cards');
    setTimeout(renderDashboardMeditationCards, 1000);
    // Tentar novamente após 3 segundos para garantir
    setTimeout(renderDashboardMeditationCards, 3000);
    // Tentar uma terceira vez após 5 segundos
    setTimeout(renderDashboardMeditationCards, 5000);
}

// Listener para detectar mudanças no localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'personalized_meditations') {
        console.log('🔄 Mudança detectada em personalized_meditations, atualizando cards...');
        setTimeout(() => {
            if (window.updateDashboardMeditationCards) {
                window.updateDashboardMeditationCards();
            }
        }, 100);
    }
});

console.log('✅ dashboard-meditations-cards.js carregado com sucesso'); 