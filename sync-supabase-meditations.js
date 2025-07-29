// Sincronização de Meditações Personalizadas com Supabase
// Garante que as meditações sejam salvas e excluídas tanto no localStorage quanto no Supabase

class MeditationSyncManager {
    constructor() {
        this.supabaseManager = null;
        this.isInitialized = false;
        this.initializationPromise = null;
    }

    // Inicializar o gerenciador
    async initialize() {
        if (this.initializationPromise) {
            return this.initializationPromise;
        }

        this.initializationPromise = this._doInitialize();
        return this.initializationPromise;
    }

    async _doInitialize() {
        try {
            console.log('🔄 Inicializando MeditationSyncManager...');
            
            // Aguardar um pouco para garantir que o supabaseManager esteja disponível
            let attempts = 0;
            const maxAttempts = 10;
            
            while (attempts < maxAttempts) {
                this.supabaseManager = window.supabaseManager;
                
                if (this.supabaseManager) {
                    console.log('✅ Supabase Manager encontrado');
                    
                    // Testar a conexão
                    try {
                        const isConnected = await this.supabaseManager.testConnection();
                        if (isConnected) {
                            console.log('✅ Conexão com Supabase estabelecida');
                            this.isInitialized = true;
                            return true;
                        } else {
                            console.log('⚠️ Supabase Manager disponível mas conexão falhou');
                        }
                    } catch (error) {
                        console.log('⚠️ Erro ao testar conexão Supabase:', error.message);
                    }
                } else {
                    console.log(`⏳ Aguardando Supabase Manager... (tentativa ${attempts + 1}/${maxAttempts})`);
                }
                
                // Aguardar 500ms antes da próxima tentativa
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }
            
            if (!this.isInitialized) {
                console.log('⚠️ Supabase Manager não disponível após várias tentativas - usando apenas localStorage');
            }
            
            return this.isInitialized;
        } catch (error) {
            console.error('❌ Erro ao inicializar MeditationSyncManager:', error);
            return false;
        }
    }

    // Obter usuário atual
    getCurrentUser() {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                return user;
            }
        } catch (error) {
            console.error('❌ Erro ao obter usuário atual:', error);
        }
        return { id: 'anonymous', name: 'Usuário Anônimo' };
    }

    // Salvar meditação (localStorage + Supabase)
    async saveMeditation(meditationData) {
        try {
            // Garantir que está inicializado
            await this.initialize();
            
            const user = this.getCurrentUser();
            console.log('💾 Salvando meditação para usuário:', user.name, 'ID:', user.id);

            // Preparar dados da meditação
            const meditationToSave = {
                ...meditationData,
                userId: user.id,
                userName: user.name,
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };

            // 1. Salvar no localStorage
            console.log('📱 Salvando no localStorage...');
            const existingMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            
            // Verificar se já existe uma meditação com o mesmo ID
            const existingIndex = existingMeditations.findIndex(med => 
                med.id === meditationToSave.id && med.userId === user.id
            );

            if (existingIndex >= 0) {
                // Atualizar meditação existente
                existingMeditations[existingIndex] = meditationToSave;
                console.log('🔄 Meditação atualizada no localStorage');
            } else {
                // Adicionar nova meditação
                existingMeditations.push(meditationToSave);
                console.log('➕ Nova meditação adicionada ao localStorage');
            }

            localStorage.setItem('personalized_meditations', JSON.stringify(existingMeditations));

            // 2. Salvar no Supabase (se disponível)
            if (this.isInitialized && this.supabaseManager) {
                try {
                    console.log('☁️ Salvando no Supabase...');
                    
                    // Preparar dados para Supabase
                    const supabaseData = {
                        user_id: user.id,
                        user_name: user.name,
                        meditation_id: meditationToSave.id,
                        title: meditationToSave.title,
                        topic: meditationToSave.topic || meditationToSave.category,
                        content: meditationToSave.content,
                        duration: meditationToSave.duration || '15 min',
                        status: meditationToSave.status || 'completed',
                        source: meditationToSave.source || 'chatgpt',
                        type: meditationToSave.type || 'simple',
                        created_at: meditationToSave.createdAt,
                        updated_at: meditationToSave.lastUpdated
                    };

                    console.log('📤 Dados para Supabase:', supabaseData);

                    // Verificar se já existe no Supabase
                    const existingSupabase = await this.supabaseManager.getPersonalizedMeditations(user.id);
                    const existingMeditation = existingSupabase.find(med => 
                        med.meditation_id === meditationToSave.id
                    );

                    if (existingMeditation) {
                        // Atualizar meditação existente
                        await this.supabaseManager.updatePersonalizedMeditation(existingMeditation.id, supabaseData);
                        console.log('🔄 Meditação atualizada no Supabase');
                    } else {
                        // Criar nova meditação
                        const result = await this.supabaseManager.createPersonalizedMeditation(supabaseData);
                        console.log('➕ Nova meditação criada no Supabase:', result);
                    }

                    console.log('✅ Meditação sincronizada com sucesso');
                } catch (supabaseError) {
                    console.error('⚠️ Erro ao salvar no Supabase:', supabaseError);
                    console.log('ℹ️ Meditação salva apenas localmente');
                }
            } else {
                console.log('ℹ️ Supabase não disponível - meditação salva apenas localmente');
            }

            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar meditação:', error);
            return false;
        }
    }

    // Excluir meditação (localStorage + Supabase)
    async deleteMeditation(meditationId) {
        try {
            // Garantir que está inicializado
            await this.initialize();
            
            const user = this.getCurrentUser();
            console.log('🗑️ Excluindo meditação:', meditationId, 'para usuário:', user.name);

            // 1. Excluir do localStorage
            console.log('📱 Excluindo do localStorage...');
            const existingMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            
            const meditationToDelete = existingMeditations.find(med => 
                med.id === meditationId && med.userId === user.id
            );

            if (!meditationToDelete) {
                console.log('⚠️ Meditação não encontrada no localStorage');
                return false;
            }

            // Remover do localStorage
            const updatedMeditations = existingMeditations.filter(med => 
                !(med.id === meditationId && med.userId === user.id)
            );
            localStorage.setItem('personalized_meditations', JSON.stringify(updatedMeditations));
            console.log('✅ Meditação excluída do localStorage');

            // 2. Excluir do Supabase (se disponível)
            if (this.isInitialized && this.supabaseManager) {
                try {
                    console.log('☁️ Excluindo do Supabase...');
                    
                    // Buscar a meditação no Supabase
                    const existingSupabase = await this.supabaseManager.getPersonalizedMeditations(user.id);
                    const supabaseMeditation = existingSupabase.find(med => 
                        med.meditation_id === meditationId
                    );

                    if (supabaseMeditation) {
                        await this.supabaseManager.deletePersonalizedMeditation(supabaseMeditation.id);
                        console.log('✅ Meditação excluída do Supabase');
                    } else {
                        console.log('⚠️ Meditação não encontrada no Supabase');
                    }
                } catch (supabaseError) {
                    console.error('⚠️ Erro ao excluir do Supabase:', supabaseError);
                    console.log('ℹ️ Meditação excluída apenas localmente');
                }
            } else {
                console.log('ℹ️ Supabase não disponível - meditação excluída apenas localmente');
            }

            return true;
        } catch (error) {
            console.error('❌ Erro ao excluir meditação:', error);
            return false;
        }
    }

    // Carregar meditações (prioridade: Supabase, fallback: localStorage)
    async loadMeditations(userId = null) {
        try {
            // Garantir que está inicializado
            await this.initialize();
            
            const user = userId ? { id: userId } : this.getCurrentUser();
            console.log('📚 Carregando meditações para usuário:', user.id);

            // 1. Tentar carregar do Supabase primeiro
            if (this.isInitialized && this.supabaseManager) {
                try {
                    console.log('☁️ Carregando do Supabase...');
                    const supabaseMeditations = await this.supabaseManager.getPersonalizedMeditations(user.id);
                    
                    if (supabaseMeditations && supabaseMeditations.length > 0) {
                        console.log('✅ Meditações carregadas do Supabase:', supabaseMeditations.length);
                        
                        // Converter formato do Supabase para formato local
                        const localMeditations = supabaseMeditations.map(supabaseMed => ({
                            id: supabaseMed.meditation_id,
                            title: supabaseMed.title,
                            topic: supabaseMed.topic,
                            content: supabaseMed.content,
                            duration: supabaseMed.duration,
                            status: supabaseMed.status,
                            source: supabaseMed.source,
                            type: supabaseMed.type,
                            userId: supabaseMed.user_id,
                            userName: supabaseMed.user_name,
                            createdAt: supabaseMed.created_at,
                            lastUpdated: supabaseMed.updated_at
                        }));

                        // Sincronizar localStorage com dados do Supabase
                        localStorage.setItem('personalized_meditations', JSON.stringify(localMeditations));
                        console.log('🔄 localStorage sincronizado com Supabase');
                        
                        return localMeditations;
                    } else {
                        console.log('📭 Nenhuma meditação encontrada no Supabase');
                    }
                } catch (supabaseError) {
                    console.error('⚠️ Erro ao carregar do Supabase:', supabaseError);
                    console.log('📱 Fallback para localStorage...');
                }
            } else {
                console.log('ℹ️ Supabase não disponível - carregando do localStorage');
            }

            // 2. Fallback para localStorage
            console.log('📱 Carregando do localStorage...');
            const localMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            
            // Filtrar apenas meditações do usuário atual
            const userMeditations = localMeditations.filter(med => med.userId === user.id);
            console.log('✅ Meditações carregadas do localStorage:', userMeditations.length);
            
            return userMeditations;
        } catch (error) {
            console.error('❌ Erro ao carregar meditações:', error);
            return [];
        }
    }

    // Sincronizar todas as meditações do localStorage com o Supabase
    async syncAllMeditations() {
        try {
            // Garantir que está inicializado
            await this.initialize();
            
            if (!this.isInitialized || !this.supabaseManager) {
                console.log('ℹ️ Supabase não disponível - sincronização ignorada');
                return false;
            }

            const user = this.getCurrentUser();
            console.log('🔄 Sincronizando todas as meditações para usuário:', user.name);

            const localMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            const userMeditations = localMeditations.filter(med => med.userId === user.id);

            let syncedCount = 0;
            for (const meditation of userMeditations) {
                try {
                    await this.saveMeditation(meditation);
                    syncedCount++;
                } catch (error) {
                    console.error(`❌ Erro ao sincronizar meditação ${meditation.id}:`, error);
                }
            }

            console.log(`✅ Sincronização concluída: ${syncedCount}/${userMeditations.length} meditações`);
            return syncedCount === userMeditations.length;
        } catch (error) {
            console.error('❌ Erro na sincronização:', error);
            return false;
        }
    }

    // Verificar status da sincronização
    async checkSyncStatus() {
        try {
            // Garantir que está inicializado
            await this.initialize();
            
            const user = this.getCurrentUser();
            console.log('🔍 Verificando status da sincronização para usuário:', user.name);

            const localMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            const userLocalMeditations = localMeditations.filter(med => med.userId === user.id);

            let userSupabaseMeditations = [];
            if (this.isInitialized && this.supabaseManager) {
                try {
                    userSupabaseMeditations = await this.supabaseManager.getPersonalizedMeditations(user.id);
                } catch (error) {
                    console.error('⚠️ Erro ao verificar Supabase:', error);
                }
            }

            const status = {
                localCount: userLocalMeditations.length,
                supabaseCount: userSupabaseMeditations.length,
                supabaseAvailable: this.isInitialized && this.supabaseManager,
                localMeditations: userLocalMeditations,
                supabaseMeditations: userSupabaseMeditations
            };

            console.log('📊 Status da sincronização:', status);
            return status;
        } catch (error) {
            console.error('❌ Erro ao verificar status:', error);
            return null;
        }
    }
}

// Criar instância global e inicializar
window.meditationSyncManager = new MeditationSyncManager();

// Inicializar quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando MeditationSyncManager global...');
    window.meditationSyncManager.initialize().then(() => {
        console.log('✅ MeditationSyncManager inicializado com sucesso');
    }).catch(error => {
        console.error('❌ Erro ao inicializar MeditationSyncManager:', error);
    });
});

// Fallback para caso o DOMContentLoaded já tenha sido disparado
if (document.readyState === 'loading') {
    // DOM ainda não carregado, aguardar
    console.log('⏳ Aguardando DOM carregar para inicializar MeditationSyncManager...');
} else {
    // DOM já carregado, inicializar imediatamente
    console.log('🚀 DOM já carregado, inicializando MeditationSyncManager imediatamente...');
    window.meditationSyncManager.initialize().then(() => {
        console.log('✅ MeditationSyncManager inicializado com sucesso (fallback)');
    }).catch(error => {
        console.error('❌ Erro ao inicializar MeditationSyncManager (fallback):', error);
    });
} 