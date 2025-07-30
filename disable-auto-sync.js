// Script para desabilitar sincronização automática temporariamente
console.log('🚫 Desabilitando sincronização automática temporariamente...');

// Função para desabilitar auto-sync
function disableAutoSync() {
    console.log('🔄 Desabilitando sincronização automática...');
    
    if (window.adminSupabaseSync) {
        // Desabilitar auto-sync
        window.adminSupabaseSync.autoSyncEnabled = false;
        console.log('✅ Auto-sync desabilitado');
        
        // Remover listeners de storage se existirem
        if (window.adminSupabaseSync.storageListener) {
            window.removeEventListener('storage', window.adminSupabaseSync.storageListener);
            console.log('✅ Listener de storage removido');
        }
        
        // Limpar intervalos de sincronização
        if (window.adminSupabaseSync.syncInterval) {
            clearInterval(window.adminSupabaseSync.syncInterval);
            console.log('✅ Intervalo de sincronização limpo');
        }
    }
    
    // Desabilitar listeners de storage globais
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function(type, listener, options) {
        if (type === 'storage' && listener.toString().includes('adminSupabaseSync')) {
            console.log('🚫 Bloqueando listener de storage para adminSupabaseSync');
            return;
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
    
    console.log('✅ Sincronização automática desabilitada');
}

// Função para habilitar sincronização manual
function enableManualSync() {
    console.log('🔄 Habilitando sincronização manual...');
    
    if (window.adminSupabaseSync) {
        // Adicionar método de sincronização manual
        window.adminSupabaseSync.manualSync = async function() {
            console.log('🔄 Executando sincronização manual...');
            try {
                await this.forceSync();
                console.log('✅ Sincronização manual concluída');
                return true;
            } catch (error) {
                console.error('❌ Erro na sincronização manual:', error);
                return false;
            }
        };
        
        console.log('✅ Sincronização manual habilitada');
    }
}

// Função para criar meditação sem sincronização automática
function createMeditationWithoutAutoSync(meditationData) {
    console.log('💾 Criando meditação sem auto-sync:', meditationData.title);
    
    try {
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        
        const newMeditation = {
            id: 'med_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ...meditationData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            total: 0,
            completed: 0,
            inProgress: 0,
            locked: 0
        };
        
        meditations.push(newMeditation);
        localStorage.setItem('meditations', JSON.stringify(meditations));
        
        console.log('✅ Meditação criada sem auto-sync:', newMeditation.id);
        
        // Sincronizar manualmente após um delay
        setTimeout(async () => {
            if (window.adminSupabaseSync && window.adminSupabaseSync.manualSync) {
                await window.adminSupabaseSync.manualSync();
            }
        }, 2000);
        
        return newMeditation;
        
    } catch (error) {
        console.error('❌ Erro ao criar meditação:', error);
        throw error;
    }
}

// Função para substituir a função de criação de meditações
function replaceMeditationCreation() {
    console.log('🔄 Substituindo função de criação de meditações...');
    
    // Substituir a função global de criação
    window.createMeditationWithoutAutoSync = createMeditationWithoutAutoSync;
    
    // Substituir a função de submit do formulário
    const form = document.getElementById('meditation-form');
    if (form) {
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        newForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('🔄 Formulário de meditação submetido (sem auto-sync)');
            
            const formData = new FormData(this);
            const editingId = this.dataset.editing;
            
            // Validação
            const title = formData.get('title').trim();
            const categoryId = formData.get('categoryId');
            
            if (!title || !categoryId) {
                showNotification('Título e categoria são obrigatórios!', 'error');
                return;
            }
            
            // Capturar dados
            const meditationData = {
                title: formData.get('title') || '',
                categoryId: formData.get('categoryId') || '',
                duration: formData.get('duration') || '12',
                status: formData.get('status') || 'available',
                type: formData.get('type') || 'free',
                icon: formData.get('icon') || '📖',
                lectio: formatTextToHTML(formData.get('reading') || ''),
                meditatio: formatTextToHTML(formData.get('meditation') || ''),
                oratio: formatTextToHTML(formData.get('prayer') || ''),
                contemplatio: formatTextToHTML(formData.get('contemplation') || ''),
                reading: formatTextToHTML(formData.get('reading') || ''),
                meditation: formatTextToHTML(formData.get('meditation') || ''),
                prayer: formatTextToHTML(formData.get('prayer') || ''),
                contemplation: formatTextToHTML(formData.get('contemplation') || '')
            };
            
            try {
                if (editingId) {
                    // Edição
                    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
                    const index = meditations.findIndex(m => m.id === editingId);
                    
                    if (index !== -1) {
                        meditations[index] = {
                            ...meditations[index],
                            ...meditationData,
                            updatedAt: new Date().toISOString()
                        };
                        
                        localStorage.setItem('meditations', JSON.stringify(meditations));
                        showNotification('Meditação atualizada com sucesso!', 'success');
                    }
                } else {
                    // Criação sem auto-sync
                    createMeditationWithoutAutoSync(meditationData);
                    showNotification('Meditação criada com sucesso!', 'success');
                }
                
                // Recarregar lista
                loadMeditations();
                
                // Fechar modal
                closeModal('meditation');
                this.removeAttribute('data-editing');
                document.getElementById('meditation-modal-title').textContent = 'Nova Meditação';
                
            } catch (error) {
                console.error('❌ Erro ao processar meditação:', error);
                showNotification('Erro ao salvar meditação!', 'error');
            }
        });
        
        console.log('✅ Função de criação substituída');
    }
}

// Função para verificar se as meditações persistem
function checkMeditationPersistence() {
    console.log('🔍 Verificando persistência das meditações...');
    
    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
    console.log('📊 Meditações atuais:', meditations.length);
    
    if (meditations.length > 0) {
        meditations.forEach((meditation, index) => {
            console.log(`  ${index + 1}. ${meditation.title} (ID: ${meditation.id})`);
        });
    }
    
    return meditations.length;
}

// Função principal
function disableAutoSyncAndFix() {
    console.log('🔧 Iniciando desabilitação de auto-sync e correção...');
    
    // 1. Desabilitar auto-sync
    disableAutoSync();
    
    // 2. Habilitar sync manual
    enableManualSync();
    
    // 3. Substituir função de criação
    replaceMeditationCreation();
    
    // 4. Verificar persistência
    checkMeditationPersistence();
    
    console.log('✅ Auto-sync desabilitado e correções aplicadas');
}

// Exportar funções
window.disableAutoSyncAndFix = disableAutoSyncAndFix;
window.disableAutoSync = disableAutoSync;
window.enableManualSync = enableManualSync;
window.createMeditationWithoutAutoSync = createMeditationWithoutAutoSync;
window.checkMeditationPersistence = checkMeditationPersistence;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de desabilitação de auto-sync carregado');
    
    // Aguardar um pouco e executar
    setTimeout(() => {
        console.log('🔧 Executando desabilitação automática...');
        disableAutoSyncAndFix();
    }, 1500);
});

console.log('✅ Script de desabilitação de auto-sync carregado'); 