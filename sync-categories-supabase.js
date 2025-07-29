// Sistema de Sincronização de Categorias do Supabase
// Este arquivo garante que as categorias do Supabase sejam carregadas em todas as páginas

console.log('🔄 Inicializando sistema de sincronização de categorias...');

class CategorySyncManager {
    constructor() {
        this.supabaseManager = null;
        this.isInitialized = false;
        this.initializationPromise = null;
        this.categories = [];
        this.lastSyncTime = null;
        this.syncInterval = 30000; // 30 segundos
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._initialize();
        return this.initializationPromise;
    }

    async _initialize() {
        console.log('🔄 Inicializando CategorySyncManager...');
        
        // Aguardar até que o SupabaseManager esteja disponível
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!window.supabaseManager && attempts < maxAttempts) {
            console.log(`⏳ Aguardando SupabaseManager... (tentativa ${attempts + 1}/${maxAttempts})`);
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }

        if (!window.supabaseManager) {
            console.error('❌ SupabaseManager não encontrado após várias tentativas');
            this.isInitialized = true;
            return;
        }

        this.supabaseManager = window.supabaseManager;
        console.log('✅ SupabaseManager encontrado e conectado');
        
        // Carregar categorias iniciais
        await this.loadCategoriesFromSupabase();
        
        // Configurar sincronização automática
        this.startAutoSync();
        
        this.isInitialized = true;
        console.log('✅ CategorySyncManager inicializado com sucesso');
    }

    async loadCategoriesFromSupabase() {
        try {
            console.log('🔄 Carregando categorias do Supabase...');
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

                // Salvar no localStorage para uso offline
                localStorage.setItem('categories', JSON.stringify(this.categories));
                this.lastSyncTime = new Date();
                
                console.log(`✅ ${this.categories.length} categorias carregadas do Supabase`);
                console.log('📋 Categorias:', this.categories.map(c => c.name));
                
                // Disparar evento de categorias atualizadas
                this.dispatchCategoriesUpdatedEvent();
                
                return this.categories;
            } else {
                console.warn('⚠️ Nenhuma categoria encontrada no Supabase');
                return [];
            }
        } catch (error) {
            console.error('❌ Erro ao carregar categorias do Supabase:', error);
            
            // Fallback: carregar do localStorage
            const localCategories = JSON.parse(localStorage.getItem('categories') || '[]');
            if (localCategories.length > 0) {
                console.log('🔄 Usando categorias do localStorage como fallback');
                this.categories = localCategories;
                return this.categories;
            }
            
            return [];
        }
    }

    async syncCategoriesToPages() {
        await this.initialize();
        
        console.log('🔄 Sincronizando categorias com as páginas...');
        
        // Atualizar dashboard se estiver na página
        if (typeof updateDashboardCategories === 'function') {
            try {
                updateDashboardCategories(this.categories);
                console.log('✅ Dashboard atualizado com categorias do Supabase');
            } catch (error) {
                console.error('❌ Erro ao atualizar dashboard:', error);
            }
        }

        // Atualizar admin panel se estiver na página
        if (typeof loadCategories === 'function') {
            try {
                loadCategories();
                console.log('✅ Admin panel atualizado com categorias do Supabase');
            } catch (error) {
                console.error('❌ Erro ao atualizar admin panel:', error);
            }
        }

        // Atualizar outras páginas que usam categorias
        this.updateCategoryDependentPages();
    }

    updateCategoryDependentPages() {
        console.log('🔄 Atualizando páginas dependentes de categorias...');
        
        // Atualizar cards de categorias no dashboard
        if (typeof updateCategoryCards === 'function') {
            try {
                updateCategoryCards(this.categories);
                console.log('✅ Cards de categorias atualizados');
            } catch (error) {
                console.error('❌ Erro ao atualizar cards de categorias:', error);
            }
        }

        // Atualizar seletor de categorias em formulários
        if (typeof updateCategorySelectors === 'function') {
            try {
                updateCategorySelectors(this.categories);
                console.log('✅ Seletores de categorias atualizados');
            } catch (error) {
                console.error('❌ Erro ao atualizar seletores de categorias:', error);
            }
        }

        // Atualizar estatísticas baseadas em categorias
        if (typeof updateCategoryStats === 'function') {
            try {
                updateCategoryStats(this.categories);
                console.log('✅ Estatísticas de categorias atualizadas');
            } catch (error) {
                console.error('❌ Erro ao atualizar estatísticas de categorias:', error);
            }
        }
    }

    startAutoSync() {
        console.log('🔄 Iniciando sincronização automática de categorias...');
        
        setInterval(async () => {
            try {
                await this.loadCategoriesFromSupabase();
                await this.syncCategoriesToPages();
            } catch (error) {
                console.error('❌ Erro na sincronização automática:', error);
            }
        }, this.syncInterval);
    }

    dispatchCategoriesUpdatedEvent() {
        const event = new CustomEvent('categoriesUpdated', {
            detail: {
                categories: this.categories,
                timestamp: new Date(),
                source: 'supabase'
            }
        });
        document.dispatchEvent(event);
        console.log('📡 Evento categoriesUpdated disparado');
    }

    getCategories() {
        return this.categories;
    }

    getCategoryById(id) {
        return this.categories.find(cat => cat.id === id);
    }

    getCategoryByName(name) {
        return this.categories.find(cat => cat.name === name);
    }

    async refreshCategories() {
        console.log('🔄 Forçando atualização de categorias...');
        await this.loadCategoriesFromSupabase();
        await this.syncCategoriesToPages();
        return this.categories;
    }

    getLastSyncTime() {
        return this.lastSyncTime;
    }

    isConnected() {
        return this.supabaseManager !== null;
    }
}

// Criar instância global
window.categorySyncManager = new CategorySyncManager();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando CategorySyncManager no DOMContentLoaded...');
    window.categorySyncManager.initialize().then(() => {
        console.log('✅ CategorySyncManager inicializado no DOMContentLoaded');
        window.categorySyncManager.syncCategoriesToPages();
    }).catch(error => {
        console.error('❌ Erro ao inicializar CategorySyncManager:', error);
    });
});

// Fallback para caso o DOMContentLoaded já tenha sido disparado
if (document.readyState === 'loading') {
    console.log('⏳ DOM ainda carregando, aguardando DOMContentLoaded...');
} else {
    console.log('⚡ DOM já carregado, inicializando imediatamente...');
    window.categorySyncManager.initialize().then(() => {
        console.log('✅ CategorySyncManager inicializado imediatamente');
        window.categorySyncManager.syncCategoriesToPages();
    }).catch(error => {
        console.error('❌ Erro ao inicializar CategorySyncManager:', error);
    });
}

// Funções auxiliares para compatibilidade
window.getCategoriesFromSupabase = function() {
    return window.categorySyncManager.getCategories();
};

window.refreshCategoriesFromSupabase = function() {
    return window.categorySyncManager.refreshCategories();
};

window.syncCategoriesToAllPages = function() {
    return window.categorySyncManager.syncCategoriesToPages();
};

console.log('✅ Sistema de sincronização de categorias carregado'); 