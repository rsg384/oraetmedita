// Script Melhorado para Sincronização de Progresso com Categorias do Supabase
// Garante que o progresso espiritual seja alimentado pelas informações da tabela categorias

console.log('🔄 Iniciando sincronização de progresso com categorias do Supabase...');

class ProgressSyncManager {
    constructor() {
        this.supabaseManager = null;
        this.isInitialized = false;
        this.categories = [];
        this.userProgress = {};
        this.syncInterval = 10000; // 10 segundos
    }

    async initialize() {
        if (this.isInitialized) return;
        
        console.log('🔄 Inicializando ProgressSyncManager...');
        
        // Aguardar SupabaseManager
        await this.waitForSupabaseManager();
        
        // Carregar categorias do Supabase
        await this.loadCategoriesFromSupabase();
        
        // Carregar progresso do usuário
        this.loadUserProgress();
        
        // Configurar sincronização automática
        this.startAutoSync();
        
        this.isInitialized = true;
        console.log('✅ ProgressSyncManager inicializado');
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
        console.log('✅ SupabaseManager conectado');
    }

    async loadCategoriesFromSupabase() {
        try {
            console.log('🔄 Carregando categorias do Supabase para progresso...');
            
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
                
                console.log(`✅ ${this.categories.length} categorias carregadas do Supabase para progresso`);
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
            console.log('🔄 Carregando progresso do usuário...');
            
            // Carregar dados do usuário
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
            const personalizedMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            
            // Calcular progresso por categoria
            this.userProgress = this.calculateProgressByCategory(meditations, personalizedMeditations);
            
            // Atualizar estatísticas gerais
            this.updateGeneralStats();
            
            console.log('✅ Progresso do usuário carregado:', this.userProgress);
            
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
            
            console.log('✅ Estatísticas gerais atualizadas:', stats);
            
        } catch (error) {
            console.error('❌ Erro ao atualizar estatísticas gerais:', error);
        }
    }

    updateProgressUI() {
        try {
            console.log('🔄 Atualizando interface de progresso...');
            
            // Atualizar cards de progresso
            this.updateProgressCards();
            
            // Atualizar estatísticas
            this.updateStatsDisplay();
            
            console.log('✅ Interface de progresso atualizada');
            
        } catch (error) {
            console.error('❌ Erro ao atualizar interface de progresso:', error);
        }
    }

    updateProgressCards() {
        const progressGrid = document.getElementById('progressGrid');
        if (!progressGrid) return;
        
        // Limpar grid
        progressGrid.innerHTML = '';
        
        const activeProgress = Object.values(this.userProgress).filter(p => p.total > 0);
        
        if (activeProgress.length === 0) {
            progressGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">Nenhuma categoria ativa encontrada</p>
                    <p style="font-size: 0.9rem;">Comece criando meditações para ver seu progresso</p>
                </div>
            `;
            return;
        }
        
        // Ordenar por porcentagem de conclusão
        activeProgress.sort((a, b) => b.percentage - a.percentage);
        
        activeProgress.forEach(category => {
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
        
        console.log(`✅ ${activeProgress.length} cards de progresso renderizados`);
    }

    updateStatsDisplay() {
        const stats = JSON.parse(localStorage.getItem('user_meditation_stats') || '{}');
        
        // Atualizar elementos de estatísticas
        const elements = {
            completedMeditations: document.getElementById('completedMeditations'),
            totalCategories: document.getElementById('totalCategories'),
            completedCategories: document.getElementById('completedCategories'),
            consecutiveDays: document.getElementById('consecutiveDays')
        };
        
        Object.entries(elements).forEach(([key, element]) => {
            if (element && stats[key] !== undefined) {
                element.textContent = stats[key];
            }
        });
        
        console.log('✅ Estatísticas exibidas atualizadas:', stats);
    }

    startAutoSync() {
        console.log('🔄 Iniciando sincronização automática...');
        
        // Sincronizar a cada 10 segundos
        setInterval(() => {
            this.syncProgress();
        }, this.syncInterval);
        
        // Sincronizar quando houver mudanças no localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'meditations' || e.key === 'categories' || e.key === 'personalized_meditations') {
                console.log('🔄 Mudança detectada, sincronizando progresso...');
                setTimeout(() => this.syncProgress(), 100);
            }
        });
    }

    async syncProgress() {
        try {
            console.log('🔄 Sincronizando progresso...');
            
            // Recarregar categorias do Supabase
            await this.loadCategoriesFromSupabase();
            
            // Recarregar progresso do usuário
            this.loadUserProgress();
            
            // Atualizar interface
            this.updateProgressUI();
            
            console.log('✅ Progresso sincronizado com sucesso');
            
        } catch (error) {
            console.error('❌ Erro ao sincronizar progresso:', error);
        }
    }

    // Função para forçar sincronização manual
    forceSync() {
        console.log('🔧 Forçando sincronização manual...');
        this.syncProgress();
    }
}

// Criar instância global
window.progressSyncManager = new ProgressSyncManager();

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.progressSyncManager.initialize();
        }, 1000);
    });
} else {
    setTimeout(() => {
        window.progressSyncManager.initialize();
    }, 1000);
}

// Tornar funções globais
window.forceProgressSync = () => window.progressSyncManager.forceSync();

console.log('✅ Script de sincronização de progresso melhorado carregado'); 