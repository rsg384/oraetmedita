// Script para corrigir loop infinito de sincronização
console.log('🔄 Corrigindo loop infinito de sincronização...');

// Função para parar completamente a sincronização automática
function stopAutoSync() {
    console.log('🛑 Parando sincronização automática...');
    
    if (window.adminSupabaseSync) {
        // Desabilitar completamente
        window.adminSupabaseSync.autoSyncEnabled = false;
        window.adminSupabaseSync.isRunning = false;
        
        // Limpar todos os intervalos
        if (window.adminSupabaseSync.syncInterval) {
            clearInterval(window.adminSupabaseSync.syncInterval);
            window.adminSupabaseSync.syncInterval = null;
        }
        
        // Remover listeners de storage
        if (window.adminSupabaseSync.storageListener) {
            window.removeEventListener('storage', window.adminSupabaseSync.storageListener);
            window.adminSupabaseSync.storageListener = null;
        }
        
        // Sobrescrever métodos para evitar execução
        window.adminSupabaseSync.autoSync = function() {
            console.log('🚫 Auto-sync bloqueado');
            return Promise.resolve();
        };
        
        window.adminSupabaseSync.startAutoSync = function() {
            console.log('🚫 Start auto-sync bloqueado');
        };
        
        console.log('✅ Sincronização automática parada');
    }
}

// Função para remover listeners de storage globais
function removeStorageListeners() {
    console.log('🗑️ Removendo listeners de storage...');
    
    // Sobrescrever addEventListener para bloquear listeners de storage
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'storage') {
            const listenerStr = listener.toString();
            if (listenerStr.includes('adminSupabaseSync') || 
                listenerStr.includes('autoSync') || 
                listenerStr.includes('sincronizar')) {
                console.log('🚫 Bloqueando listener de storage:', listenerStr.substring(0, 100));
                return;
            }
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    console.log('✅ Listeners de storage bloqueados');
}

// Função para limpar localStorage de forma segura
function safeLocalStorageUpdate() {
    console.log('🔒 Implementando atualizações seguras do localStorage...');
    
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // Verificar se é uma atualização de categorias ou meditações
        if (key === 'categories' || key === 'meditations') {
            const oldValue = localStorage.getItem(key);
            if (oldValue === value) {
                console.log('🚫 Evitando atualização desnecessária:', key);
                return;
            }
        }
        
        // Executar atualização normal
        originalSetItem.call(this, key, value);
        console.log('✅ localStorage atualizado:', key);
    };
    
    console.log('✅ Atualizações seguras do localStorage implementadas');
}

// Função para implementar sincronização manual controlada
function implementManualSync() {
    console.log('🔄 Implementando sincronização manual controlada...');
    
    if (window.adminSupabaseSync) {
        // Adicionar método de sincronização manual
        window.adminSupabaseSync.manualSync = async function() {
            if (this.isRunning) {
                console.log('⏳ Sincronização já em andamento, aguardando...');
                return;
            }
            
            this.isRunning = true;
            console.log('🔄 Iniciando sincronização manual...');
            
            try {
                // Sincronizar categorias
                await this.syncCategoriesFromSupabase();
                
                // Sincronizar meditações
                await this.syncMeditationsFromSupabase();
                
                console.log('✅ Sincronização manual concluída');
            } catch (error) {
                console.error('❌ Erro na sincronização manual:', error);
            } finally {
                this.isRunning = false;
            }
        };
        
        // Adicionar método para sincronizar apenas categorias
        window.adminSupabaseSync.syncCategoriesOnly = async function() {
            console.log('🔄 Sincronizando apenas categorias...');
            try {
                await this.syncCategoriesFromSupabase();
                console.log('✅ Categorias sincronizadas');
            } catch (error) {
                console.error('❌ Erro ao sincronizar categorias:', error);
            }
        };
        
        // Adicionar método para sincronizar apenas meditações
        window.adminSupabaseSync.syncMeditationsOnly = async function() {
            console.log('🔄 Sincronizando apenas meditações...');
            try {
                await this.syncMeditationsFromSupabase();
                console.log('✅ Meditações sincronizadas');
            } catch (error) {
                console.error('❌ Erro ao sincronizar meditações:', error);
            }
        };
        
        console.log('✅ Sincronização manual implementada');
    }
}

// Função para verificar e corrigir dados corrompidos
function checkAndFixData() {
    console.log('🔍 Verificando e corrigindo dados...');
    
    try {
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        
        console.log('📊 Dados atuais:', {
            categories: categories.length,
            meditations: meditations.length
        });
        
        // Verificar se há dados duplicados
        const categoryIds = categories.map(c => c.id);
        const uniqueCategoryIds = [...new Set(categoryIds)];
        
        if (categoryIds.length !== uniqueCategoryIds.length) {
            console.log('🔧 Removendo categorias duplicadas...');
            const uniqueCategories = categories.filter((category, index) => 
                categoryIds.indexOf(category.id) === index
            );
            localStorage.setItem('categories', JSON.stringify(uniqueCategories));
            console.log('✅ Categorias duplicadas removidas');
        }
        
        // Verificar meditações
        const meditationIds = meditations.map(m => m.id);
        const uniqueMeditationIds = [...new Set(meditationIds)];
        
        if (meditationIds.length !== uniqueMeditationIds.length) {
            console.log('🔧 Removendo meditações duplicadas...');
            const uniqueMeditations = meditations.filter((meditation, index) => 
                meditationIds.indexOf(meditation.id) === index
            );
            localStorage.setItem('meditations', JSON.stringify(uniqueMeditations));
            console.log('✅ Meditações duplicadas removidas');
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar dados:', error);
    }
}

// Função principal para corrigir o loop
function fixSyncLoop() {
    console.log('🔧 Iniciando correção do loop de sincronização...');
    
    // 1. Parar sincronização automática
    stopAutoSync();
    
    // 2. Remover listeners de storage
    removeStorageListeners();
    
    // 3. Implementar atualizações seguras do localStorage
    safeLocalStorageUpdate();
    
    // 4. Implementar sincronização manual
    implementManualSync();
    
    // 5. Verificar e corrigir dados
    checkAndFixData();
    
    console.log('✅ Loop de sincronização corrigido');
    
    // Executar uma sincronização manual inicial
    setTimeout(async () => {
        if (window.adminSupabaseSync && window.adminSupabaseSync.manualSync) {
            console.log('🔄 Executando sincronização manual inicial...');
            await window.adminSupabaseSync.manualSync();
        }
    }, 2000);
}

// Função para verificar status da sincronização
function checkSyncStatus() {
    console.log('📊 Status da sincronização:');
    
    if (window.adminSupabaseSync) {
        console.log('✅ adminSupabaseSync disponível');
        console.log('🔄 Auto-sync habilitado:', window.adminSupabaseSync.autoSyncEnabled);
        console.log('🔄 Executando:', window.adminSupabaseSync.isRunning);
    } else {
        console.log('❌ adminSupabaseSync não disponível');
    }
    
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
    
    console.log('📋 Categorias:', categories.length);
    console.log('📖 Meditações:', meditations.length);
}

// Exportar funções
window.fixSyncLoop = fixSyncLoop;
window.stopAutoSync = stopAutoSync;
window.checkSyncStatus = checkSyncStatus;
window.implementManualSync = implementManualSync;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção de loop carregado');
    
    // Aguardar um pouco e executar correção
    setTimeout(() => {
        console.log('🔧 Executando correção automática do loop...');
        fixSyncLoop();
    }, 1000);
});

console.log('✅ Script de correção de loop de sincronização carregado'); 