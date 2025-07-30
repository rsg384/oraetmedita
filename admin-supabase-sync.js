// Sistema de Sincronização Automática - Painel Administrativo ↔ Supabase
console.log('🔄 Iniciando sistema de sincronização do painel administrativo...');

class AdminSupabaseSync {
    constructor() {
        this.supabaseManager = null;
        this.isInitialized = false;
        this.syncInterval = 10000; // 10 segundos
        this.lastSync = {
            categories: null,
            meditations: null
        };
    }

    async initialize() {
        if (this.isInitialized) return;
        
        console.log('🔄 Inicializando AdminSupabaseSync...');
        
        // Aguardar SupabaseManager
        await this.waitForSupabaseManager();
        
        // Configurar sincronização automática
        this.startAutoSync();
        
        // Sincronizar dados iniciais
        await this.initialSync();
        
        this.isInitialized = true;
        console.log('✅ AdminSupabaseSync inicializado');
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
        console.log('✅ SupabaseManager conectado para admin sync');
    }

    async initialSync() {
        try {
            console.log('🔄 Sincronização inicial do painel administrativo...');
            
            // Sincronizar categorias
            await this.syncCategoriesFromSupabase();
            
            // Sincronizar meditações
            await this.syncMeditationsFromSupabase();
            
            console.log('✅ Sincronização inicial concluída');
            
        } catch (error) {
            console.error('❌ Erro na sincronização inicial:', error);
        }
    }

    async syncCategoriesFromSupabase() {
        try {
            console.log('🔄 Sincronizando categorias do Supabase para o painel admin...');
            
            const supabaseCategories = await this.supabaseManager.getCategories();
            
            if (supabaseCategories && Array.isArray(supabaseCategories)) {
                // Converter para formato do painel admin
                const adminCategories = supabaseCategories.map(cat => ({
                    id: cat.id,
                    name: cat.name,
                    description: cat.description || '',
                    icon: cat.icon || '📖',
                    color: cat.color || '#7ee787',
                    is_active: cat.is_active !== false,
                    sort_order: cat.sort_order || 0,
                    created_at: cat.created_at,
                    updated_at: cat.updated_at
                }));

                // Salvar no localStorage
                localStorage.setItem('categories', JSON.stringify(adminCategories));
                
                console.log(`✅ ${adminCategories.length} categorias sincronizadas do Supabase`);
                
                // Atualizar interface se estiver no painel admin
                if (typeof loadCategories === 'function') {
                    loadCategories();
                }
                
                return adminCategories;
            } else {
                console.warn('⚠️ Nenhuma categoria encontrada no Supabase');
                return [];
            }
        } catch (error) {
            console.error('❌ Erro ao sincronizar categorias:', error);
            return [];
        }
    }

    async syncMeditationsFromSupabase() {
        try {
            console.log('🔄 Sincronizando meditações do Supabase para o painel admin...');
            
            const supabaseMeditations = await this.supabaseManager.getMeditations();
            
            if (supabaseMeditations && Array.isArray(supabaseMeditations)) {
                // Converter para formato do painel admin
                const adminMeditations = supabaseMeditations.map(med => ({
                    id: med.id,
                    title: med.title,
                    content: med.content || '',
                    categoryId: med.category_id,
                    duration: med.duration || 15,
                    status: med.status || 'available',
                    type: med.type || 'free',
                    icon: med.icon || '📖',
                    lectio: med.lectio || '',
                    meditatio: med.meditatio || '',
                    oratio: med.oratio || '',
                    contemplatio: med.contemplatio || '',
                    created_at: med.created_at,
                    updated_at: med.updated_at
                }));

                // Salvar no localStorage
                localStorage.setItem('meditations', JSON.stringify(adminMeditations));
                
                console.log(`✅ ${adminMeditations.length} meditações sincronizadas do Supabase`);
                
                // Atualizar interface se estiver no painel admin
                if (typeof loadMeditations === 'function') {
                    loadMeditations();
                }
                
                return adminMeditations;
            } else {
                console.warn('⚠️ Nenhuma meditação encontrada no Supabase');
                return [];
            }
        } catch (error) {
            console.error('❌ Erro ao sincronizar meditações:', error);
            return [];
        }
    }

    async syncCategoryToSupabase(category, action = 'create') {
        try {
            console.log(`🔄 Sincronizando categoria para Supabase (${action})...`);
            
            let result;
            
            if (action === 'create') {
                result = await this.supabaseManager.createCategory({
                    name: category.name,
                    description: category.description,
                    icon: category.icon,
                    color: category.color,
                    is_active: category.is_active,
                    sort_order: category.sort_order
                });
            } else if (action === 'update') {
                result = await this.supabaseManager.updateCategory(category.id, {
                    name: category.name,
                    description: category.description,
                    icon: category.icon,
                    color: category.color,
                    is_active: category.is_active,
                    sort_order: category.sort_order
                });
            } else if (action === 'delete') {
                result = await this.supabaseManager.deleteCategory(category.id);
            }
            
            console.log(`✅ Categoria ${action === 'create' ? 'criada' : action === 'update' ? 'atualizada' : 'excluída'} no Supabase`);
            return result;
            
        } catch (error) {
            console.error(`❌ Erro ao sincronizar categoria (${action}):`, error);
            throw error;
        }
    }

    async syncMeditationToSupabase(meditation, action = 'create') {
        try {
            console.log(`🔄 Sincronizando meditação para Supabase (${action})...`);
            
            let result;
            
            if (action === 'create') {
                result = await this.supabaseManager.createMeditation({
                    title: meditation.title,
                    content: meditation.content,
                    category_id: meditation.categoryId,
                    duration: meditation.duration,
                    status: meditation.status,
                    type: meditation.type,
                    icon: meditation.icon,
                    lectio: meditation.lectio,
                    meditatio: meditation.meditatio,
                    oratio: meditation.oratio,
                    contemplatio: meditation.contemplatio
                });
            } else if (action === 'update') {
                result = await this.supabaseManager.updateMeditation(meditation.id, {
                    title: meditation.title,
                    content: meditation.content,
                    category_id: meditation.categoryId,
                    duration: meditation.duration,
                    status: meditation.status,
                    type: meditation.type,
                    icon: meditation.icon,
                    lectio: meditation.lectio,
                    meditatio: meditation.meditatio,
                    oratio: meditation.oratio,
                    contemplatio: meditation.contemplatio
                });
            } else if (action === 'delete') {
                result = await this.supabaseManager.deleteMeditation(meditation.id);
            }
            
            console.log(`✅ Meditação ${action === 'create' ? 'criada' : action === 'update' ? 'atualizada' : 'excluída'} no Supabase`);
            return result;
            
        } catch (error) {
            console.error(`❌ Erro ao sincronizar meditação (${action}):`, error);
            throw error;
        }
    }

    startAutoSync() {
        console.log('🔄 Iniciando sincronização automática do painel admin...');
        
        // Sincronizar a cada 10 segundos
        setInterval(() => {
            this.autoSync();
        }, this.syncInterval);
        
        // Sincronizar quando houver mudanças no localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'categories' || e.key === 'meditations') {
                console.log('🔄 Mudança detectada no localStorage, sincronizando...');
                setTimeout(() => this.autoSync(), 100);
            }
        });
    }

    async autoSync() {
        try {
            console.log('🔄 Sincronização automática do painel admin...');
            
            // Verificar se há mudanças locais que precisam ser sincronizadas
            await this.checkAndSyncLocalChanges();
            
            // Sincronizar dados do Supabase (para capturar mudanças de outros usuários)
            await this.syncCategoriesFromSupabase();
            await this.syncMeditationsFromSupabase();
            
            console.log('✅ Sincronização automática concluída');
            
        } catch (error) {
            console.error('❌ Erro na sincronização automática:', error);
        }
    }

    async checkAndSyncLocalChanges() {
        try {
            // Verificar categorias
            const localCategories = JSON.parse(localStorage.getItem('categories') || '[]');
            const lastCategoriesSync = this.lastSync.categories;
            
            if (lastCategoriesSync !== JSON.stringify(localCategories)) {
                console.log('🔄 Mudanças detectadas em categorias locais, sincronizando...');
                await this.syncLocalCategoriesToSupabase(localCategories);
                this.lastSync.categories = JSON.stringify(localCategories);
            }
            
            // Verificar meditações
            const localMeditations = JSON.parse(localStorage.getItem('meditations') || '[]');
            const lastMeditationsSync = this.lastSync.meditations;
            
            if (lastMeditationsSync !== JSON.stringify(localMeditations)) {
                console.log('🔄 Mudanças detectadas em meditações locais, sincronizando...');
                await this.syncLocalMeditationsToSupabase(localMeditations);
                this.lastSync.meditations = JSON.stringify(localMeditations);
            }
            
        } catch (error) {
            console.error('❌ Erro ao verificar mudanças locais:', error);
        }
    }

    async syncLocalCategoriesToSupabase(localCategories) {
        try {
            const supabaseCategories = await this.supabaseManager.getCategories();
            
            // Encontrar categorias que existem localmente mas não no Supabase
            for (const localCat of localCategories) {
                const existsInSupabase = supabaseCategories.some(supCat => 
                    supCat.id === localCat.id || supCat.name === localCat.name
                );
                
                if (!existsInSupabase) {
                    console.log(`🔄 Criando categoria no Supabase: ${localCat.name}`);
                    await this.syncCategoryToSupabase(localCat, 'create');
                }
            }
            
        } catch (error) {
            console.error('❌ Erro ao sincronizar categorias locais:', error);
        }
    }

    async syncLocalMeditationsToSupabase(localMeditations) {
        try {
            const supabaseMeditations = await this.supabaseManager.getMeditations();
            
            // Encontrar meditações que existem localmente mas não no Supabase
            for (const localMed of localMeditations) {
                const existsInSupabase = supabaseMeditations.some(supMed => 
                    supMed.id === localMed.id || supMed.title === localMed.title
                );
                
                if (!existsInSupabase) {
                    console.log(`🔄 Criando meditação no Supabase: ${localMed.title}`);
                    await this.syncMeditationToSupabase(localMed, 'create');
                }
            }
            
        } catch (error) {
            console.error('❌ Erro ao sincronizar meditações locais:', error);
        }
    }

    // Função para forçar sincronização manual
    async forceSync() {
        console.log('🔧 Forçando sincronização manual do painel admin...');
        await this.autoSync();
    }

    // Função para sincronizar uma categoria específica
    async syncCategory(category, action = 'create') {
        try {
            await this.syncCategoryToSupabase(category, action);
            console.log(`✅ Categoria sincronizada: ${category.name}`);
        } catch (error) {
            console.error(`❌ Erro ao sincronizar categoria: ${error.message}`);
            throw error;
        }
    }

    // Função para sincronizar uma meditação específica
    async syncMeditation(meditation, action = 'create') {
        try {
            await this.syncMeditationToSupabase(meditation, action);
            console.log(`✅ Meditação sincronizada: ${meditation.title}`);
        } catch (error) {
            console.error(`❌ Erro ao sincronizar meditação: ${error.message}`);
            throw error;
        }
    }
}

// Criar instância global
window.adminSupabaseSync = new AdminSupabaseSync();

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.adminSupabaseSync.initialize();
        }, 1000);
    });
} else {
    setTimeout(() => {
        window.adminSupabaseSync.initialize();
    }, 1000);
}

// Tornar funções globais
window.forceAdminSync = () => window.adminSupabaseSync.forceSync();
window.syncAdminCategory = (category, action) => window.adminSupabaseSync.syncCategory(category, action);
window.syncAdminMeditation = (meditation, action) => window.adminSupabaseSync.syncMeditation(meditation, action);

console.log('✅ Sistema de sincronização do painel administrativo carregado'); 