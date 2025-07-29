// Script para renderizar cards de categorias no dashboard
console.log('🔄 Carregando funções de categorias para o dashboard...');

// Função para obter dados das categorias (igual à página de categorias)
function getCategoriesDataForDashboard() {
    try {
        console.log('🔄 Carregando dados das categorias para o dashboard...');
        
        // Carregar categorias do admin
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

// Função para renderizar cards de categorias no dashboard
function renderDashboardCategoriesCards() {
    const categoriesGrid = document.getElementById('dashboardCategoriesGrid');
    if (!categoriesGrid) {
        console.log('⚠️ Elemento dashboardCategoriesGrid não encontrado');
        return;
    }

    const categories = getCategoriesDataForDashboard();
    
    // Limpar grid
    categoriesGrid.innerHTML = '';
    
    // Limitar a 2 categorias principais
    const limitedCategories = categories.slice(0, 2);
    console.log('📝 Exibindo', limitedCategories.length, 'categorias principais (limitado a 2)');
    
    // Renderizar os 2 primeiros cards de categoria
    limitedCategories.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.onclick = () => window.location.href = `meditacoes-categoria.html?category=${category.id}`;
        
        card.innerHTML = `
            <div class="category-card-content">
                <div class="category-card-header">
                    <div class="category-icon" style="background: ${category.color}20; color: ${category.color};">
                        ${category.icon}
                    </div>
                    <div class="category-info">
                        <h3 class="category-title">${category.name}</h3>
                        <p class="category-description">${category.description}</p>
                    </div>
                </div>
                
                <div class="category-stats">
                    <div class="stat-item">
                        <div class="stat-number">${category.total}</div>
                        <div class="stat-label">Total</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${category.completed}</div>
                        <div class="stat-label">Concluídas</div>
                    </div>
                </div>
                
                <div class="category-actions">
                    <a href="meditacoes-categoria.html?category=${category.id}" class="btn btn-primary" onclick="event.stopPropagation();">
                        Ver Meditações
                    </a>
                </div>
            </div>
        `;
        
        categoriesGrid.appendChild(card);
    });
    
    // Adicionar card "Ver mais categorias" se houver mais de 2 categorias
    if (categories.length > 2) {
        console.log('➕ Adicionando botão "Ver mais" para', categories.length - 2, 'categorias adicionais');
        const moreCard = document.createElement('div');
        moreCard.className = 'category-card more-button';
        moreCard.onclick = () => window.location.href = 'categorias.html';
        
        moreCard.innerHTML = `
            <div class="category-card-content">
                <div class="category-card-header">
                    <div class="category-icon" style="background: rgba(126, 231, 135, 0.2); color: #7ee787;">
                        📚
                    </div>
                    <div class="category-info">
                        <h3 class="category-title">Ver mais categorias</h3>
                        <p class="category-description">Explore todas as categorias de meditação disponíveis</p>
                    </div>
                </div>
                
                <div class="category-stats">
                    <div class="stat-item">
                        <div class="stat-number">${categories.length}</div>
                        <div class="stat-label">Categorias</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${categories.reduce((sum, cat) => sum + cat.total, 0)}</div>
                        <div class="stat-label">Total Meditações</div>
                    </div>
                </div>
                
                <div class="category-actions">
                    <a href="categorias.html" class="btn btn-primary">
                        Ver Todas
                    </a>
                </div>
            </div>
        `;
        
        categoriesGrid.appendChild(moreCard);
    }
    
    console.log('✅ Cards de categorias do dashboard renderizados com sucesso (máximo 3: 2 principais + 1 ver mais)');
}

// Função para atualizar cards de categorias
function updateDashboardCategoriesCards() {
    console.log('🔄 Atualizando cards de categorias do dashboard...');
    renderDashboardCategoriesCards();
}

// Exportar funções para uso global
window.renderDashboardCategoriesCards = renderDashboardCategoriesCards;
window.updateDashboardCategoriesCards = updateDashboardCategoriesCards; 