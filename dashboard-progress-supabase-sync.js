// Script para sincronizar progresso espiritual do dashboard com categorias do Supabase
console.log('🔄 Iniciando sincronização de progresso espiritual com Supabase...');

class DashboardProgressSync {
    constructor() {
        this.supabaseManager = null;
        this.isInitialized = false;
        this.categories = [];
        this.userProgress = {};
        this.syncInterval = 15000; // 15 segundos
    }

    async initialize() {
        if (this.isInitialized) return;
        
        console.log('🔄 Inicializando DashboardProgressSync...');
        
        // Aguardar SupabaseManager
        await this.waitForSupabaseManager();
        
        // Carregar categorias do Supabase
        await this.loadCategoriesFromSupabase();
        
        // Carregar progresso do usuário
        this.loadUserProgress();
        
        // Configurar sincronização automática
        this.startAutoSync();
        
        this.isInitialized = true;
        console.log('✅ DashboardProgressSync inicializado');
    }

    async waitForSupabaseManager() {
        let attempts = 0;
        const maxAttempts = 20;
        
        while (!window.supabaseManager && attempts < maxAttempts) {
            console.log(`⏳ Aguardando SupabaseManager... (${attempts + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }

        if (!window.supabaseManager) {
            throw new Error('SupabaseManager não encontrado');
        }

        this.supabaseManager = window.supabaseManager;
        console.log('✅ SupabaseManager conectado para progresso espiritual');
    }

    async loadCategoriesFromSupabase() {
        try {
            console.log('🔄 Carregando categorias do Supabase para progresso espiritual...');
            
            const supabaseCategories = await this.supabaseManager.getCategories();
            
            if (supabaseCategories && Array.isArray(supabaseCategories)) {
                this.categories = supabaseCategories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    description: cat.description || '',
                    icon: cat.icon || '📖',
                    color: cat.color || '#7ee787',
                    is_active: cat.is_active !== false,
                    sort_order: cat.sort_order || 0,
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    locked: 0
                }));

                // Salvar no localStorage
                localStorage.setItem('categories', JSON.stringify(this.categories));
                
                console.log(`✅ ${this.categories.length} categorias carregadas do Supabase para progresso espiritual`);
                console.log('📋 Categorias ativas:', this.categories.filter(c => c.is_active).map(c => c.name));
                
                return this.categories;
            } else {
                console.warn('⚠️ Nenhuma categoria encontrada no Supabase');
                return [];
            }
        } catch (error) {
            console.error('❌ Erro ao carregar categorias do Supabase:', error);
            
            // Fallback: carregar do localStorage
            const localCategories = JSON.parse(localStorage.getItem('categories') || '[]');
            this.categories = localCategories;
            console.log(`📦 Carregadas ${localCategories.length} categorias do localStorage`);
            
            return localCategories;
        }
    }

    loadUserProgress() {
        try {
            console.log('🔄 Carregando progresso do usuário para dashboard...');
            
            // Carregar dados do usuário
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
            const personalizedMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            
            // Calcular progresso por categoria
            this.userProgress = this.calculateProgressByCategory(meditations, personalizedMeditations);
            
            // Atualizar estatísticas gerais
            this.updateGeneralStats();
            
            console.log('✅ Progresso do usuário carregado para dashboard:', this.userProgress);
            
        } catch (error) {
            console.error('❌ Erro ao carregar progresso do usuário:', error);
        }
    }

    calculateProgressByCategory(meditations, personalizedMeditations) {
        const progress = {};
        
        // Processar categorias do Supabase
        this.categories.forEach(category => {
            if (!category.is_active) return;
            
            // Filtrar meditações por categoria
            const categoryMeditations = meditations.filter(m => m.categoryId === category.id);
            const completedMeditations = categoryMeditations.filter(m => m.status === 'completed');
            const inProgressMeditations = categoryMeditations.filter(m => 
                m.status === 'in_progress' || m.status === 'pending'
            );
            
            progress[category.id] = {
                id: category.id,
                name: category.name,
                icon: category.icon,
                color: category.color,
                total: categoryMeditations.length,
                completed: completedMeditations.length,
                inProgress: inProgressMeditations.length,
                percentage: categoryMeditations.length > 0 ? 
                    Math.round((completedMeditations.length / categoryMeditations.length) * 100) : 0
            };
        });
        
        return progress;
    }

    updateGeneralStats() {
        try {
            const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
            const personalizedMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            
            // Calcular estatísticas gerais
            const totalCompleted = meditations.filter(m => m.status === 'completed').length;
            const totalInProgress = meditations.filter(m => 
                m.status === 'in_progress' || m.status === 'pending'
            ).length;
            
            const activeCategories = this.categories.filter(c => c.is_active).length;
            const completedCategories = Object.values(this.userProgress).filter(p => p.completed > 0).length;
            
            // Atualizar localStorage
            const stats = {
                totalCompleted,
                totalInProgress,
                activeCategories,
                completedCategories,
                consecutiveDays: Math.min(totalCompleted, 30), // Máximo 30 dias
                totalTime: `${totalCompleted * 15}min` // 15 min por meditação
            };
            
            localStorage.setItem('user_meditation_stats', JSON.stringify(stats));
            
            console.log('✅ Estatísticas gerais atualizadas para dashboard:', stats);
            
        } catch (error) {
            console.error('❌ Erro ao atualizar estatísticas gerais:', error);
        }
    }

    updateDashboardProgressUI() {
        try {
            console.log('🔄 Atualizando interface de progresso espiritual no dashboard...');
            
            // Atualizar cards de progresso
            this.updateDashboardProgressCards();
            
            // Atualizar estatísticas
            this.updateDashboardStatsDisplay();
            
            console.log('✅ Interface de progresso espiritual atualizada no dashboard');
            
        } catch (error) {
            console.error('❌ Erro ao atualizar interface de progresso espiritual:', error);
        }
    }

    updateDashboardProgressCards() {
        const progressGrid = document.getElementById('dashboardProgressGrid');
        if (!progressGrid) {
            console.log('⚠️ Elemento dashboardProgressGrid não encontrado no dashboard');
            return;
        }
        
        // Limpar grid
        progressGrid.innerHTML = '';
        
        const activeProgress = Object.values(this.userProgress).filter(p => p.total > 0);
        
        if (activeProgress.length === 0) {
            progressGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nenhuma categoria ativa encontrada</p>
                    <p style="font-size: 0.9rem;">Comece criando meditações para ver seu progresso espiritual</p>
                </div>
            `;
            return;
        }
        
        // Ordenar por porcentagem de conclusão
        activeProgress.sort((a, b) => b.percentage - a.percentage);
        
        // Limitar a 3 cards principais
        const mainCards = activeProgress.slice(0, 3);
        
        mainCards.forEach(category => {
            const progressCard = document.createElement('div');
            progressCard.className = 'progress-card';
            progressCard.setAttribute('data-category', category.id);
            
            progressCard.innerHTML = `
                <div class="progress-header">
                    <span class="progress-title">${category.icon} ${category.name}</span>
                    <span class="progress-percentage">${category.percentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${category.percentage}%"></div>
                </div>
                <div class="progress-text">${category.completed} de ${category.total} meditações completadas</div>
            `;
            
            progressGrid.appendChild(progressCard);
        });
        
        // Adicionar card "Ver mais" se houver mais categorias
        if (activeProgress.length > 3) {
            const moreCard = document.createElement('div');
            moreCard.className = 'progress-card more-card';
            moreCard.innerHTML = `
                <div class="progress-header">
                    <span class="progress-title">📊 Ver mais categorias</span>
                    <span class="progress-percentage">+${activeProgress.length - 3}</span>
                </div>
                <div class="progress-text">Clique para ver todas as categorias</div>
            `;
            
            moreCard.addEventListener('click', () => {
                window.location.href = 'progresso.html';
            });
            
            progressGrid.appendChild(moreCard);
        }
        
        console.log(`✅ ${mainCards.length} cards de progresso espiritual renderizados no dashboard`);
    }

    updateDashboardStatsDisplay() {
        const stats = JSON.parse(localStorage.getItem('user_meditation_stats') || '{}');
        
        // Atualizar elementos de estatísticas no dashboard
        const elements = {
            consecutiveDays: document.getElementById('consecutiveDays'),
            completedMeditations: document.getElementById('completedMeditations'),
            totalTime: document.getElementById('totalTime'),
            totalCategories: document.getElementById('totalCategories'),
            completedCategories: document.getElementById('completedCategories')
        };
        
        Object.entries(elements).forEach(([key, element]) => {
            if (element && stats[key] !== undefined) {
                element.textContent = stats[key];
            }
        });
        
        console.log('✅ Estatísticas de progresso espiritual atualizadas no dashboard:', stats);
    }

    startAutoSync() {
        console.log('🔄 Iniciando sincronização automática de progresso espiritual...');
        
        // Sincronizar a cada 15 segundos
        setInterval(() => {
            this.syncProgress();
        }, this.syncInterval);
        
        // Sincronizar quando houver mudanças no localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'meditations' || e.key === 'categories' || e.key === 'personalized_meditations') {
                console.log('🔄 Mudança detectada, sincronizando progresso espiritual...');
                setTimeout(() => this.syncProgress(), 100);
            }
        });
    }

    async syncProgress() {
        try {
            console.log('🔄 Sincronizando progresso espiritual...');
            
            // Recarregar categorias do Supabase
            await this.loadCategoriesFromSupabase();
            
            // Recarregar progresso do usuário
            this.loadUserProgress();
            
            // Atualizar interface
            this.updateDashboardProgressUI();
            
            console.log('✅ Progresso espiritual sincronizado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao sincronizar progresso espiritual:', error);
        }
    }

    // Função para forçar sincronização manual
    forceSync() {
        console.log('🔧 Forçando sincronização manual de progresso espiritual...');
        this.syncProgress();
    }
}

// Criar instância global
window.dashboardProgressSync = new DashboardProgressSync();

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.dashboardProgressSync.initialize();
        }, 1000);
    });
} else {
    setTimeout(() => {
        window.dashboardProgressSync.initialize();
    }, 1000);
}

// Tornar funções globais
window.forceDashboardProgressSync = () => window.dashboardProgressSync.forceSync();

console.log('✅ Script de sincronização de progresso espiritual do dashboard carregado'); 