// SOLUÇÃO DEFINITIVA PARA SALVAMENTO DE MEDITAÇÕES
console.log('🔧 SOLUÇÃO DEFINITIVA - Script de salvamento final carregado');

// Função definitiva para salvar meditação
async function saveMeditationFinal(meditationData) {
    console.log('🔄 SALVAMENTO DEFINITIVO - Iniciando...');
    
    try {
        // 1. Validar dados
        if (!meditationData.title || !meditationData.content) {
            throw new Error('Título e conteúdo são obrigatórios');
        }
        
        console.log('📋 Dados da meditação:', meditationData);
        
        // 2. Criar no Supabase
        console.log('📤 Criando no Supabase...');
        const supabaseVars = getSupabaseVariables();
        
        const supabaseData = {
            title: meditationData.title,
            content: meditationData.content,
            category_id: meditationData.category_id,
            duration: meditationData.duration || 10,
            status: 'available',
            type: 'free',
            difficulty: 'intermediate',
            is_active: true,
            sort_order: 0,
            bible_verse: meditationData.bible_verse || '',
            prayer: meditationData.prayer || '',
            practical_application: meditationData.practical_application || '',
            tags: meditationData.tags || [],
            icon: meditationData.icon || '📖',
            color: meditationData.color || '#7ee787'
        };
        
        const response = await fetch(`${supabaseVars.url}/rest/v1/meditations`, {
            method: 'POST',
            headers: {
                'apikey': supabaseVars.key,
                'Authorization': `Bearer ${supabaseVars.key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(supabaseData)
        });
        
        console.log('📊 Status da resposta Supabase:', response.status);
        
        if (response.ok) {
            const supabaseResult = await response.json();
            console.log('✅ Meditação criada no Supabase:', supabaseResult);
            
            // 3. Salvar localmente
            const localMeditation = {
                id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                supabase_id: supabaseResult[0].id,
                title: meditationData.title,
                content: meditationData.content,
                category_id: meditationData.category_id,
                duration: meditationData.duration || 10,
                status: 'available',
                type: 'free',
                difficulty: 'intermediate',
                bible_verse: meditationData.bible_verse || '',
                prayer: meditationData.prayer || '',
                practical_application: meditationData.practical_application || '',
                tags: meditationData.tags || [],
                icon: meditationData.icon || '📖',
                color: meditationData.color || '#7ee787',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            // Salvar no localStorage
            const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
            meditations.push(localMeditation);
            localStorage.setItem('meditations', JSON.stringify(meditations));
            
            console.log('✅ Meditação salva localmente:', localMeditation);
            
            // 4. Atualizar interface
            updateMeditationsDisplayFinal();
            
            // 5. Mostrar notificação
            showNotificationFinal('Meditação criada com sucesso!', 'success');
            
            return { success: true, supabase: supabaseResult[0], local: localMeditation };
            
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao criar meditação no Supabase:', errorData);
            throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro desconhecido'}`);
        }
        
    } catch (error) {
        console.error('❌ Erro no salvamento definitivo:', error);
        showNotificationFinal('Erro ao criar meditação: ' + error.message, 'error');
        return { success: false, error: error.message };
    }
}

// Função para atualizar exibição final
function updateMeditationsDisplayFinal() {
    console.log('🔄 Atualizando exibição final...');
    
    // Atualizar lista no painel admin
    const meditationsList = document.getElementById('meditationsList');
    if (meditationsList) {
        console.log('✅ Lista encontrada, atualizando...');
        
        const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        
        meditationsList.innerHTML = '';
        
        meditations.forEach(meditation => {
            const category = categories.find(cat => cat.id === meditation.category_id);
            const categoryName = category ? category.name : 'Sem categoria';
            
            const meditationItem = document.createElement('div');
            meditationItem.className = 'meditation-item';
            meditationItem.innerHTML = `
                <div class="meditation-header">
                    <h4>${meditation.title}</h4>
                    <span class="category">${categoryName}</span>
                </div>
                <div class="meditation-content">
                    <p>${meditation.content.substring(0, 100)}...</p>
                </div>
                <div class="meditation-actions">
                    <button onclick="editMeditation('${meditation.id}')" class="btn-edit">Editar</button>
                    <button onclick="deleteMeditation('${meditation.id}')" class="btn-delete">Excluir</button>
                </div>
            `;
            
            meditationsList.appendChild(meditationItem);
        });
        
        console.log(`✅ ${meditations.length} meditações exibidas`);
    } else {
        console.log('❌ Lista de meditações não encontrada');
    }
}

// Função para mostrar notificação final
function showNotificationFinal(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        ${type === 'success' ? 'background-color: #4CAF50;' : ''}
        ${type === 'error' ? 'background-color: #f44336;' : ''}
        ${type === 'info' ? 'background-color: #2196F3;' : ''}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Função para substituir listener do formulário de forma definitiva
function replaceMeditationFormListenerFinal() {
    console.log('🔧 Substituindo listener do formulário de forma definitiva...');
    
    const meditationForm = document.getElementById('meditationForm');
    if (!meditationForm) {
        console.error('❌ Formulário de meditações não encontrado');
        return;
    }
    
    // Remover todos os listeners existentes
    const newForm = meditationForm.cloneNode(true);
    meditationForm.parentNode.replaceChild(newForm, meditationForm);
    
    // Adicionar novo listener
    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🔄 Formulário submetido (DEFINITIVO)...');
        
        try {
            const formData = new FormData(newForm);
            const meditationData = {
                title: formData.get('title'),
                content: formData.get('content'),
                category_id: formData.get('category'),
                duration: parseInt(formData.get('duration')) || 10,
                bible_verse: formData.get('bible_verse') || '',
                prayer: formData.get('prayer') || '',
                practical_application: formData.get('practical_application') || '',
                tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
                icon: formData.get('icon') || '📖',
                color: formData.get('color') || '#7ee787'
            };
            
            console.log('📋 Dados da meditação:', meditationData);
            
            const result = await saveMeditationFinal(meditationData);
            
            if (result.success) {
                newForm.reset();
                console.log('✅ Meditação criada com sucesso (DEFINITIVO)');
            } else {
                console.error('❌ Erro ao criar meditação:', result.error);
            }
            
        } catch (error) {
            console.error('❌ Erro na criação da meditação:', error);
            showNotificationFinal('Erro ao criar meditação: ' + error.message, 'error');
        }
    });
    
    console.log('✅ Listener do formulário substituído (DEFINITIVO)');
}

// Função para desabilitar todos os scripts conflitantes
function disableAllConflictingScripts() {
    console.log('🚫 Desabilitando todos os scripts conflitantes...');
    
    // Desabilitar auto-sync
    if (window.disableAutoSync) {
        window.disableAutoSync();
    }
    
    // Parar loops de sincronização
    if (window.stopSyncLoop) {
        window.stopSyncLoop();
    }
    
    // Remover listeners conflitantes
    const meditationForm = document.getElementById('meditationForm');
    if (meditationForm) {
        const newForm = meditationForm.cloneNode(true);
        meditationForm.parentNode.replaceChild(newForm, meditationForm);
    }
    
    console.log('✅ Scripts conflitantes desabilitados');
}

// Exportar funções
window.saveMeditationFinal = saveMeditationFinal;
window.updateMeditationsDisplayFinal = updateMeditationsDisplayFinal;
window.showNotificationFinal = showNotificationFinal;
window.replaceMeditationFormListenerFinal = replaceMeditationFormListenerFinal;
window.disableAllConflictingScripts = disableAllConflictingScripts;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SOLUÇÃO DEFINITIVA carregada');
    
    setTimeout(() => {
        console.log('🔧 Aplicando solução definitiva...');
        
        // Desabilitar scripts conflitantes
        disableAllConflictingScripts();
        
        // Substituir listener do formulário
        replaceMeditationFormListenerFinal();
        
        // Atualizar exibição inicial
        updateMeditationsDisplayFinal();
        
        console.log('✅ Solução definitiva aplicada');
    }, 2000);
});

console.log('✅ SOLUÇÃO DEFINITIVA carregada'); 