// Script para corrigir loop infinito no dashboard
console.log('🔄 Corrigindo loop infinito no dashboard...');

// Função para parar sincronização automática do dashboard
function stopDashboardAutoSync() {
    console.log('🛑 Parando sincronização automática do dashboard...');
    
    if (window.dashboardProgressSync) {
        // Desabilitar sincronização automática
        window.dashboardProgressSync.autoSyncEnabled = false;
        window.dashboardProgressSync.isRunning = false;
        
        // Limpar intervalos
        if (window.dashboardProgressSync.syncInterval) {
            clearInterval(window.dashboardProgressSync.syncInterval);
            window.dashboardProgressSync.syncInterval = null;
        }
        
        // Remover listeners de storage
        if (window.dashboardProgressSync.storageListener) {
            window.removeEventListener('storage', window.dashboardProgressSync.storageListener);
            window.dashboardProgressSync.storageListener = null;
        }
        
        // Sobrescrever métodos para evitar execução automática
        window.dashboardProgressSync.autoSync = function() {
            console.log('🚫 Auto-sync do dashboard bloqueado');
            return Promise.resolve();
        };
        
        window.dashboardProgressSync.startAutoSync = function() {
            console.log('🚫 Start auto-sync do dashboard bloqueado');
        };
        
        console.log('✅ Sincronização automática do dashboard parada');
    }
}

// Função para remover listeners de storage do dashboard
function removeDashboardStorageListeners() {
    console.log('🗑️ Removendo listeners de storage do dashboard...');
    
    // Sobrescrever addEventListener para bloquear listeners de storage do dashboard
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'storage') {
            const listenerStr = listener.toString();
            if (listenerStr.includes('dashboardProgressSync') || 
                listenerStr.includes('progress') || 
                listenerStr.includes('sincronizar')) {
                console.log('🚫 Bloqueando listener de storage do dashboard:', listenerStr.substring(0, 100));
                return;
            }
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    console.log('✅ Listeners de storage do dashboard bloqueados');
}

// Função para implementar sincronização manual do dashboard
function implementDashboardManualSync() {
    console.log('🔄 Implementando sincronização manual do dashboard...');
    
    if (window.dashboardProgressSync) {
        // Adicionar método de sincronização manual
        window.dashboardProgressSync.manualSync = async function() {
            if (this.isRunning) {
                console.log('⏳ Sincronização do dashboard já em andamento, aguardando...');
                return;
            }
            
            this.isRunning = true;
            console.log('🔄 Iniciando sincronização manual do dashboard...');
            
            try {
                // Carregar categorias
                await this.loadCategories();
                
                // Carregar progresso do usuário
                await this.loadUserProgress();
                
                // Atualizar interface
                this.updateProgressInterface();
                
                console.log('✅ Sincronização manual do dashboard concluída');
            } catch (error) {
                console.error('❌ Erro na sincronização manual do dashboard:', error);
            } finally {
                this.isRunning = false;
            }
        };
        
        // Adicionar método para carregar apenas categorias
        window.dashboardProgressSync.loadCategoriesOnly = async function() {
            console.log('🔄 Carregando apenas categorias do dashboard...');
            try {
                await this.loadCategories();
                console.log('✅ Categorias do dashboard carregadas');
            } catch (error) {
                console.error('❌ Erro ao carregar categorias do dashboard:', error);
            }
        };
        
        // Adicionar método para carregar apenas progresso
        window.dashboardProgressSync.loadProgressOnly = async function() {
            console.log('🔄 Carregando apenas progresso do dashboard...');
            try {
                await this.loadUserProgress();
                this.updateProgressInterface();
                console.log('✅ Progresso do dashboard carregado');
            } catch (error) {
                console.error('❌ Erro ao carregar progresso do dashboard:', error);
            }
        };
        
        console.log('✅ Sincronização manual do dashboard implementada');
    }
}

// Função para verificar e corrigir dados do dashboard
function checkAndFixDashboardData() {
    console.log('🔍 Verificando e corrigindo dados do dashboard...');
    
    try {
        const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        
        console.log('📊 Dados do dashboard:', {
            userProgress: Object.keys(userProgress).length,
            categories: categories.length
        });
        
        // Verificar se há dados corrompidos
        let hasCorruptedData = false;
        
        // Verificar progresso do usuário
        for (const categoryId in userProgress) {
            const progress = userProgress[categoryId];
            if (!progress || typeof progress !== 'object') {
                console.log('🔧 Removendo progresso corrompido:', categoryId);
                delete userProgress[categoryId];
                hasCorruptedData = true;
            }
        }
        
        // Salvar dados corrigidos
        if (hasCorruptedData) {
            localStorage.setItem('userProgress', JSON.stringify(userProgress));
            console.log('✅ Dados do dashboard corrigidos');
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar dados do dashboard:', error);
    }
}

// Função para limpar logs excessivos
function cleanExcessiveLogs() {
    console.log('🧹 Limpando logs excessivos...');
    
    // Sobrescrever console.log para limitar logs repetitivos
    const originalLog = console.log;
    const logCounts = {};
    
    console.log = function(...args) {
        const message = args.join(' ');
        
        // Contar logs repetitivos
        if (logCounts[message]) {
            logCounts[message]++;
            
            // Limitar logs repetitivos
            if (logCounts[message] > 3) {
                return; // Não logar mais
            }
        } else {
            logCounts[message] = 1;
        }
        
        originalLog.apply(console, args);
    };
    
    console.log('✅ Logs excessivos limitados');
}

// Função principal para corrigir o loop do dashboard
function fixDashboardLoop() {
    console.log('🔧 Iniciando correção do loop do dashboard...');
    
    // 1. Parar sincronização automática
    stopDashboardAutoSync();
    
    // 2. Remover listeners de storage
    removeDashboardStorageListeners();
    
    // 3. Implementar sincronização manual
    implementDashboardManualSync();
    
    // 4. Verificar e corrigir dados
    checkAndFixDashboardData();
    
    // 5. Limpar logs excessivos
    cleanExcessiveLogs();
    
    console.log('✅ Loop do dashboard corrigido');
    
    // Executar uma sincronização manual inicial
    setTimeout(async () => {
        if (window.dashboardProgressSync && window.dashboardProgressSync.manualSync) {
            console.log('🔄 Executando sincronização manual inicial do dashboard...');
            await window.dashboardProgressSync.manualSync();
        }
    }, 2000);
}

// Função para verificar status do dashboard
function checkDashboardStatus() {
    console.log('📊 Status do dashboard:');
    
    if (window.dashboardProgressSync) {
        console.log('✅ dashboardProgressSync disponível');
        console.log('🔄 Auto-sync habilitado:', window.dashboardProgressSync.autoSyncEnabled);
        console.log('🔄 Executando:', window.dashboardProgressSync.isRunning);
    } else {
        console.log('❌ dashboardProgressSync não disponível');
    }
    
    const userProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    console.log('📋 Categorias:', categories.length);
    console.log('📊 Progresso do usuário:', Object.keys(userProgress).length);
}

// Exportar funções
window.fixDashboardLoop = fixDashboardLoop;
window.stopDashboardAutoSync = stopDashboardAutoSync;
window.checkDashboardStatus = checkDashboardStatus;
window.implementDashboardManualSync = implementDashboardManualSync;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção do loop do dashboard carregado');
    
    // Aguardar um pouco e executar correção
    setTimeout(() => {
        console.log('🔧 Executando correção automática do loop do dashboard...');
        fixDashboardLoop();
    }, 1000);
});

console.log('✅ Script de correção do loop do dashboard carregado'); 