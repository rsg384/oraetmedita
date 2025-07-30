// Script para renderizar cards de progresso por categoria no dashboard
console.log('🔄 Carregando funções de progresso por categoria para o dashboard...');

// Lista de tópicos que NÃO são categorias (para excluir da seção de progresso)
const NON_CATEGORY_TOPICS = [
    'O amor de Deus',
    'O perdão de Deus',
    'Santa Igreja Católica',
    'Igreja Católica',
    'O Pecado', 
    'A fé em Deus',
    'A misericordia',
    'a paz',
    'Minhas meditações',
    'Os dons do Espírito Santo',
    'Amor',
    'Fé',
    'Misericórdia',
    'Paz',
    'Pecado',
    'Dons do Espírito Santo',
    'esperança',
    'Esperança',
    'A esperança',
    'a esperança',
    'Esperanca',
    'esperanca',
    'perdao',
    'Perdao',
    'O perdão',
    'o perdão',
    'Perdão',
    'perdão'
];

// Função para verificar se um tópico é uma categoria válida
function isValidCategory(topic) {
    return !NON_CATEGORY_TOPICS.includes(topic);
}

// Função para obter dados das categorias do Supabase
async function getCategoriesDataForDashboard() {
    try {
        console.log('🔄 Carregando dados das categorias do Supabase para o dashboard...');
        
        // Usar o DashboardProgressSync se disponível
        if (window.dashboardProgressSync && window.dashboardProgressSync.isInitialized) {
            const progressData = window.dashboardProgressSync.userProgress;
            const categories = Object.values(progressData).filter(cat => cat.total > 0);
            
            console.log('✅ Dados de progresso carregados do DashboardProgressSync:', categories.length);
            return categories;
        }
        
        // Fallback: carregar do localStorage
        let adminCategories = JSON.parse(localStorage.getItem('categories') || '[]');
        const adminMeditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        
        console.log('📊 Categorias encontradas:', adminCategories.length);
        console.log('📊 Meditações encontradas:', adminMeditations.length);
        
        // Se não há categorias, criar categorias padrão
        if (adminCategories.length === 0) {
            console.log('⚠️ Nenhuma categoria encontrada, criando categorias padrão...');
            adminCategories = createDefaultCategories();
            localStorage.setItem('categories', JSON.stringify(adminCategories));
            console.log('✅ Categorias padrão criadas:', adminCategories.length);
        }
        
        // Carregar meditações personalizadas
        let personalizedMeditations = [];
        if (typeof getPersonalizedMeditationsForCurrentUser === 'function') {
            personalizedMeditations = getPersonalizedMeditationsForCurrentUser();
        } else {
            console.log('⚠️ Função getPersonalizedMeditationsForCurrentUser não encontrada, usando localStorage');
            personalizedMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
        }
        console.log('📊 Meditações personalizadas:', personalizedMeditations.length);
        
        let allCategories = [];
        
        // Processar categorias do admin
        adminCategories.forEach(category => {
            const categoryMeditations = adminMeditations.filter(m => m.categoryId === category.id);
            const completedMeditations = categoryMeditations.filter(m => m.status === 'completed').length;
            const inProgressMeditations = categoryMeditations.filter(m => 
                m.status === 'in_progress' || m.status === 'pending'
            ).length;
            
            allCategories.push({
                id: category.id,
                name: category.name,
                description: category.description,
                icon: category.icon || '📖',
                color: category.color || '#7ee787',
                total: categoryMeditations.length,
                completed: completedMeditations,
                inProgress: inProgressMeditations,
                locked: 0
            });
        });
        
        // Processar meditações personalizadas - APENAS se forem categorias reais
        const personalizedByTopic = {};
        personalizedMeditations.forEach(meditation => {
            const topic = meditation.topic || 'Meditações Personalizadas';
            if (!personalizedByTopic[topic]) {
                personalizedByTopic[topic] = [];
            }
            personalizedByTopic[topic].push(meditation);
        });
        
        Object.entries(personalizedByTopic).forEach(([topic, meditations]) => {
            // Verificar se o tópico é uma categoria válida
            if (isValidCategory(topic)) {
                const completedCount = meditations.filter(m => m.status === 'completed').length;
                const inProgressCount = meditations.filter(m => 
                    m.status === 'in_progress' || m.status === 'pending'
                ).length;
                
                allCategories.push({
                    id: `personalized_${topic}`,
                    name: topic,
                    description: 'Meditações personalizadas criadas especialmente para você',
                    icon: '✨',
                    color: '#8b5cf6',
                    total: meditations.length,
                    completed: completedCount,
                    inProgress: inProgressCount,
                    locked: 0
                });
                console.log('✅ Tópico válido adicionado:', topic);
            } else {
                console.log('🚫 Excluindo tópico não-categoria da seção de progresso:', topic);
            }
        });
        
        console.log('✅ Total de categorias processadas:', allCategories.length);
        return allCategories;
    } catch (error) {
        console.error('❌ Erro ao carregar dados das categorias:', error);
        return [];
    }
}

// Função para criar categorias padrão
function createDefaultCategories() {
    const defaultCategories = [
        {
            id: 'cat_default_1',
            name: 'Salmos',
            description: 'Meditações baseadas nos Salmos da Bíblia',
            icon: '📖',
            color: '#7ee787'
        },
        {
            id: 'cat_default_2',
            name: 'Evangelho',
            description: 'Meditações dos Evangelhos de Jesus Cristo',
            icon: '✝️',
            color: '#58a6ff'
        },
        {
            id: 'cat_default_3',
            name: 'Imitação de Cristo',
            description: 'Meditações baseadas na obra de Tomás de Kempis',
            icon: '🕊️',
            color: '#8b5cf6'
        },
        {
            id: 'cat_default_4',
            name: 'Jaculatórias',
            description: 'Orações curtas e fervorosas',
            icon: '🙏',
            color: '#f59e0b'
        },
        {
            id: 'cat_default_5',
            name: 'Princípios Espirituais',
            description: 'Fundamentos da vida espiritual cristã',
            icon: '⭐',
            color: '#ec4899'
        }
    ];
    
    console.log('📝 Criando categorias padrão:', defaultCategories.length);
    return defaultCategories;
}

// Função para renderizar cards de progresso por categoria no dashboard
async function renderDashboardProgressCards() {
    const progressGrid = document.getElementById('dashboardProgressGrid');
    if (!progressGrid) {
        console.log('⚠️ Elemento dashboardProgressGrid não encontrado');
        return;
    }

    const categories = await getCategoriesDataForDashboard();
    
    // Limpar grid
    progressGrid.innerHTML = '';
    
    if (categories.length === 0) {
        progressGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nenhuma categoria encontrada</p>
                <p style="font-size: 0.9rem;">Comece criando meditações para ver seu progresso</p>
            </div>
        `;
        return;
    }
    
    // Ordenar por número de meditações completadas (decrescente) e pegar apenas os 2 primeiros
    const topCategories = categories
        .sort((a, b) => b.completed - a.completed)
        .slice(0, 2);
    
    console.log('📊 Exibindo', topCategories.length, 'categorias principais (limitado a 2)');
    
    // Renderizar os 3 cards principais
    topCategories.forEach(category => {
        const percentage = category.total > 0 ? Math.round((category.completed / category.total) * 100) : 0;
        
        const progressCard = document.createElement('div');
        progressCard.className = 'progress-card';
        progressCard.setAttribute('data-category', category.id);
        
        progressCard.innerHTML = `
            <div class="progress-header">
                <span class="progress-title">${category.name}</span>
                <span class="progress-percentage">${percentage}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="progress-text">${category.completed} de ${category.total} meditações completadas</div>
        `;
        
        progressGrid.appendChild(progressCard);
    });
    
    // Adicionar card "Ver + categorias" se há mais de 2 categorias
    if (categories.length > 2) {
        const remainingCount = categories.length - 2;
        console.log('➕ Adicionando card "Ver mais" para', remainingCount, 'categorias adicionais');
        
        const viewMoreCard = document.createElement('div');
        viewMoreCard.className = 'progress-card view-more-card';
        viewMoreCard.style.cursor = 'pointer';
        viewMoreCard.onclick = function() {
            window.location.href = 'progresso.html';
        };
        
        viewMoreCard.innerHTML = `
            <div class="progress-header">
                <span class="progress-title">Ver + categorias</span>
                <span class="progress-percentage" style="color: var(--accent-blue);">+${remainingCount}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 100%; background: var(--accent-blue);"></div>
            </div>
            <div class="progress-text" style="color: var(--accent-blue);">Clique para ver todas as ${categories.length} categorias</div>
        `;
        
        progressGrid.appendChild(viewMoreCard);
    } else {
        console.log('📋 Não há categorias adicionais para mostrar (total:', categories.length, ')');
    }
    
    const totalCards = topCategories.length + (categories.length > 2 ? 1 : 0);
    console.log('✅ Cards de progresso por categoria renderizados no dashboard:', totalCards, 'cards (máximo 3: 2 principais + 1 ver mais)');
    
    // Verificação de segurança: nunca mais de 3 cards (2 principais + 1 ver mais)
    if (totalCards > 3) {
        console.warn('⚠️ Aviso: Total de cards excedeu o limite esperado:', totalCards);
    }
}

// Função para atualizar progresso por categoria (chamada junto com outras atualizações)
async function updateDashboardProgressCards() {
    console.log('🔄 Atualizando cards de progresso por categoria...');
    await renderDashboardProgressCards();
}

// Interceptar chamadas para updateDashboardStats para incluir atualização dos cards de progresso
const originalUpdateDashboardStats = window.updateDashboardStats;
if (originalUpdateDashboardStats) {
    window.updateDashboardStats = function() {
        originalUpdateDashboardStats.apply(this, arguments);
        updateDashboardProgressCards();
    };
}

// Interceptar chamadas para updateProgressStatsRow para incluir atualização dos cards de progresso
const originalUpdateProgressStatsRow = window.updateProgressStatsRow;
if (originalUpdateProgressStatsRow) {
    window.updateProgressStatsRow = function() {
        originalUpdateProgressStatsRow.apply(this, arguments);
        updateDashboardProgressCards();
    };
}

// Executar após carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(updateDashboardProgressCards, 1000);
    });
} else {
    setTimeout(updateDashboardProgressCards, 1000);
}

// Tornar funções globais
window.renderDashboardProgressCards = renderDashboardProgressCards;
window.updateDashboardProgressCards = updateDashboardProgressCards;
window.isValidCategory = isValidCategory;
window.NON_CATEGORY_TOPICS = NON_CATEGORY_TOPICS;

console.log('✅ Funções de progresso por categoria carregadas'); 