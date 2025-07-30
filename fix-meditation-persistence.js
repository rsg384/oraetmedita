// Script para corrigir problema de persistência das meditações
console.log('🔧 Iniciando correção de persistência das meditações...');

// Função para verificar se uma meditação existe
function meditationExists(meditationId) {
    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
    return meditations.some(m => m.id === meditationId);
}

// Função para salvar meditação com verificação
function saveMeditationWithCheck(meditationData) {
    try {
        console.log('💾 Salvando meditação com verificação:', meditationData.title);
        
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        
        // Criar nova meditação
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
        
        // Adicionar à lista
        meditations.push(newMeditation);
        
        // Salvar no localStorage
        localStorage.setItem('meditations', JSON.stringify(meditations));
        
        console.log('✅ Meditação salva localmente:', newMeditation.id);
        
        // Verificar se foi salva corretamente
        setTimeout(() => {
            const savedMeditations = JSON.parse(localStorage.getItem('meditations') || '[]');
            const saved = savedMeditations.find(m => m.id === newMeditation.id);
            if (saved) {
                console.log('✅ Verificação: Meditação persistida corretamente');
            } else {
                console.error('❌ Verificação: Meditação não foi persistida!');
            }
        }, 100);
        
        return newMeditation;
        
    } catch (error) {
        console.error('❌ Erro ao salvar meditação:', error);
        throw error;
    }
}

// Função para sincronizar meditação com proteção
async function syncMeditationWithProtection(meditation, action = 'create') {
    try {
        console.log(`🔄 Sincronizando meditação com proteção (${action}):`, meditation.title);
        
        // Verificar se a meditação existe localmente antes de sincronizar
        if (!meditationExists(meditation.id)) {
            console.error('❌ Meditação não encontrada localmente antes da sincronização');
            return false;
        }
        
        if (window.adminSupabaseSync) {
            try {
                await window.adminSupabaseSync.syncMeditation(meditation, action);
                console.log('✅ Meditação sincronizada com Supabase');
                
                // Verificar novamente após sincronização
                setTimeout(() => {
                    if (!meditationExists(meditation.id)) {
                        console.error('❌ Meditação foi removida após sincronização!');
                        // Recriar a meditação localmente
                        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
                        if (!meditations.find(m => m.id === meditation.id)) {
                            meditations.push(meditation);
                            localStorage.setItem('meditations', JSON.stringify(meditations));
                            console.log('🔄 Meditação recriada localmente após sincronização');
                        }
                    }
                }, 500);
                
                return true;
            } catch (syncError) {
                console.error('⚠️ Erro na sincronização:', syncError);
                return false;
            }
        } else {
            console.log('ℹ️ Sistema de sincronização não disponível');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro na sincronização com proteção:', error);
        return false;
    }
}

// Função para substituir a função de submit do formulário
function replaceMeditationSubmit() {
    console.log('🔄 Substituindo função de submit do formulário de meditação...');
    
    const form = document.getElementById('meditation-form');
    if (!form) {
        console.error('❌ Formulário de meditação não encontrado');
        return;
    }
    
    // Remover listener antigo
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Adicionar novo listener
    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🔄 Formulário de meditação submetido (versão corrigida)');
        
        const formData = new FormData(this);
        const editingId = this.dataset.editing;
        
        console.log('📝 Editing ID:', editingId);
        
        // Validação dos campos obrigatórios
        const title = formData.get('title').trim();
        const categoryId = formData.get('categoryId');
        
        if (!title) {
            showNotification('O título é obrigatório!', 'error');
            return;
        }
        
        if (!categoryId) {
            showNotification('Selecione uma categoria!', 'error');
            return;
        }
        
        // Capturar dados do formulário
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
                // Modo de edição
                console.log('✏️ Editando meditação existente...');
                const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
                const index = meditations.findIndex(m => m.id === editingId);
                
                if (index !== -1) {
                    meditations[index] = {
                        ...meditations[index],
                        ...meditationData,
                        updatedAt: new Date().toISOString()
                    };
                    
                    localStorage.setItem('meditations', JSON.stringify(meditations));
                    
                    // Sincronizar com proteção
                    await syncMeditationWithProtection(meditations[index], 'update');
                    
                    showNotification('Meditação atualizada com sucesso!', 'success');
                }
            } else {
                // Modo de criação
                console.log('➕ Criando nova meditação...');
                
                // Salvar com verificação
                const newMeditation = saveMeditationWithCheck(meditationData);
                
                // Sincronizar com proteção
                await syncMeditationWithProtection(newMeditation, 'create');
                
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
    
    console.log('✅ Função de submit substituída com sucesso');
}

// Função para verificar e corrigir dados corrompidos
function checkAndFixCorruptedData() {
    console.log('🔍 Verificando dados corrompidos...');
    
    try {
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        
        let fixed = false;
        
        // Verificar meditações sem ID
        const meditationsWithoutId = meditations.filter(m => !m.id);
        if (meditationsWithoutId.length > 0) {
            console.log('🔧 Corrigindo meditações sem ID...');
            meditationsWithoutId.forEach((meditation, index) => {
                meditation.id = 'med_fixed_' + Date.now() + '_' + index;
            });
            fixed = true;
        }
        
        // Verificar meditações sem categoria válida
        const meditationsWithInvalidCategory = meditations.filter(m => {
            return m.categoryId && !categories.some(c => c.id === m.categoryId);
        });
        
        if (meditationsWithInvalidCategory.length > 0) {
            console.log('🔧 Corrigindo meditações com categoria inválida...');
            if (categories.length > 0) {
                meditationsWithInvalidCategory.forEach(meditation => {
                    meditation.categoryId = categories[0].id;
                });
            }
            fixed = true;
        }
        
        if (fixed) {
            localStorage.setItem('meditations', JSON.stringify(meditations));
            console.log('✅ Dados corrigidos');
        } else {
            console.log('✅ Dados estão íntegros');
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar dados:', error);
    }
}

// Função para forçar persistência
function forcePersistence() {
    console.log('🔧 Forçando persistência dos dados...');
    
    try {
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        
        // Forçar salvamento
        localStorage.setItem('meditations', JSON.stringify(meditations));
        localStorage.setItem('categories', JSON.stringify(categories));
        
        // Limpar caches
        localStorage.removeItem('meditations_cache');
        localStorage.removeItem('categories_cache');
        
        console.log('✅ Persistência forçada:', {
            meditations: meditations.length,
            categories: categories.length
        });
        
    } catch (error) {
        console.error('❌ Erro ao forçar persistência:', error);
    }
}

// Função principal de correção
function fixMeditationPersistence() {
    console.log('🔧 Iniciando correção de persistência...');
    
    // 1. Verificar e corrigir dados corrompidos
    checkAndFixCorruptedData();
    
    // 2. Forçar persistência
    forcePersistence();
    
    // 3. Substituir função de submit
    replaceMeditationSubmit();
    
    console.log('✅ Correção de persistência concluída');
}

// Exportar funções para uso global
window.fixMeditationPersistence = fixMeditationPersistence;
window.saveMeditationWithCheck = saveMeditationWithCheck;
window.syncMeditationWithProtection = syncMeditationWithProtection;
window.checkAndFixCorruptedData = checkAndFixCorruptedData;
window.forcePersistence = forcePersistence;
window.replaceMeditationSubmit = replaceMeditationSubmit;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção de persistência carregado');
    
    // Aguardar um pouco e executar correção
    setTimeout(() => {
        console.log('🔧 Executando correção automática...');
        fixMeditationPersistence();
    }, 1000);
});

console.log('✅ Script de correção de persistência das meditações carregado'); 