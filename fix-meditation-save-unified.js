// Script unificado para corrigir o salvamento de meditações
console.log('🔧 Script unificado de salvamento de meditações carregado');

// Função para salvar meditação de forma unificada
async function saveMeditationUnified(meditationData) {
    console.log('🔄 Salvando meditação de forma unificada...');
    
    try {
        // 1. Validar dados
        if (!meditationData.title || !meditationData.content) {
            throw new Error('Título e conteúdo são obrigatórios');
        }
        
        console.log('📋 Dados da meditação:', meditationData);
        
        // 2. Criar no Supabase primeiro
        console.log('📤 Criando no Supabase...');
        const supabaseVars = getSupabaseVariables();
        
        const supabaseData = {
            title: meditationData.title,
            content: meditationData.content,
            category_id: meditationData.category_id,
            duration: meditationData.duration || 10,
            status: meditationData.status || 'available',
            type: meditationData.type || 'free',
            difficulty: meditationData.difficulty || 'intermediate',
            is_active: meditationData.is_active !== undefined ? meditationData.is_active : true,
            sort_order: meditationData.sort_order || 0,
            bible_verse: meditationData.bible_verse || '',
            prayer: meditationData.prayer || '',
            practical_application: meditationData.practical_application || '',
            tags: meditationData.tags || [],
            icon: meditationData.icon || '📖',
            color: meditationData.color || '#7ee787',
            created_by: meditationData.created_by || null,
            version: meditationData.version || 1
        };
        
        console.log('📤 Dados para enviar ao Supabase:', supabaseData);
        
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
            
            // 3. Salvar localmente com ID do Supabase
            const localMeditation = {
                id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                supabase_id: supabaseResult[0].id,
                title: meditationData.title,
                content: meditationData.content,
                category_id: meditationData.category_id,
                duration: meditationData.duration || 10,
                status: meditationData.status || 'available',
                type: meditationData.type || 'free',
                difficulty: meditationData.difficulty || 'intermediate',
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
            updateMeditationsDisplayUnified();
            
            // 5. Mostrar notificação
            showNotificationUnified('Meditação criada com sucesso!', 'success');
            
            return {
                success: true,
                supabase: supabaseResult[0],
                local: localMeditation
            };
            
        } else {
            const errorData = await response.json();
            console.error('❌ Erro ao criar meditação no Supabase:', errorData);
            throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro desconhecido'}`);
        }
        
    } catch (error) {
        console.error('❌ Erro no salvamento unificado:', error);
        showNotificationUnified('Erro ao criar meditação: ' + error.message, 'error');
        return { success: false, error: error.message };
    }
}

// Função para atualizar a exibição das meditações de forma unificada
function updateMeditationsDisplayUnified() {
    console.log('🔄 Atualizando exibição das meditações (unificado)...');
    
    // 1. Atualizar lista no painel admin
    const meditationsList = document.getElementById('meditationsList');
    if (meditationsList) {
        console.log('✅ Lista de meditações encontrada, atualizando...');
        
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
    
    // 2. Atualizar dashboard se estiver na página
    if (window.loadDashboardMeditations) {
        window.loadDashboardMeditations();
    }
    
    // 3. Disparar evento de atualização
    const event = new CustomEvent('meditationsUpdated', {
        detail: { source: 'saveMeditationUnified' }
    });
    document.dispatchEvent(event);
    
    console.log('✅ Exibição das meditações atualizada (unificado)');
}

// Função para mostrar notificação unificada
function showNotificationUnified(message, type = 'info') {
    console.log(`📢 ${type.toUpperCase()}: ${message}`);
    
    // Criar elemento de notificação
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
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Função para substituir o listener do formulário de forma unificada
function replaceMeditationFormListenerUnified() {
    console.log('🔧 Substituindo listener do formulário de meditações (unificado)...');
    
    // Encontrar o formulário de meditações
    const meditationForm = document.getElementById('meditationForm');
    if (!meditationForm) {
        console.error('❌ Formulário de meditações não encontrado');
        return;
    }
    
    // Remover listeners existentes
    const newForm = meditationForm.cloneNode(true);
    meditationForm.parentNode.replaceChild(newForm, meditationForm);
    
    // Adicionar novo listener
    newForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('🔄 Formulário de meditação submetido (unificado)...');
        
        try {
            // Obter dados do formulário
            const formData = new FormData(newForm);
            const meditationData = {
                title: formData.get('title'),
                content: formData.get('content'),
                category_id: formData.get('category'),
                duration: parseInt(formData.get('duration')) || 10,
                status: 'available',
                type: 'free',
                difficulty: formData.get('difficulty') || 'intermediate',
                bible_verse: formData.get('bible_verse') || '',
                prayer: formData.get('prayer') || '',
                practical_application: formData.get('practical_application') || '',
                tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [],
                icon: formData.get('icon') || '📖',
                color: formData.get('color') || '#7ee787',
                is_active: true,
                sort_order: 0
            };
            
            console.log('📋 Dados da meditação:', meditationData);
            
            // Salvar meditação unificada
            const result = await saveMeditationUnified(meditationData);
            
            if (result.success) {
                // Limpar formulário
                newForm.reset();
                console.log('✅ Meditação criada com sucesso (unificado)');
            } else {
                console.error('❌ Erro ao criar meditação:', result.error);
            }
            
        } catch (error) {
            console.error('❌ Erro na criação da meditação:', error);
            showNotificationUnified('Erro ao criar meditação: ' + error.message, 'error');
        }
    });
    
    console.log('✅ Listener do formulário substituído (unificado)');
}

// Função para testar o salvamento unificado
async function testUnifiedSave() {
    console.log('🧪 Testando salvamento unificado...');
    
    try {
        // Buscar primeira categoria disponível
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const testCategory = categories[0];
        
        if (!testCategory) {
            throw new Error('Nenhuma categoria disponível para teste');
        }
        
        // Criar meditação de teste
        const testMeditation = {
            title: 'Teste Salvamento Unificado',
            content: 'Esta é uma meditação de teste para verificar o salvamento unificado.',
            category_id: testCategory.id,
            duration: 15,
            status: 'available',
            type: 'free',
            difficulty: 'beginner',
            bible_verse: 'Salmo 1:1-2',
            prayer: 'Senhor, obrigado por este teste.',
            practical_application: 'Aplicar os ensinamentos do teste.',
            tags: ['teste', 'salvamento', 'unificado'],
            icon: '🧪',
            color: '#7ee787',
            is_active: true,
            sort_order: 0
        };
        
        console.log('📋 Meditação de teste:', testMeditation);
        
        // Tentar salvar
        const result = await saveMeditationUnified(testMeditation);
        
        if (result.success) {
            console.log('✅ Teste de salvamento unificado bem-sucedido:', result);
            return true;
        } else {
            console.error('❌ Erro no teste de salvamento:', result.error);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro no teste de salvamento:', error);
        return false;
    }
}

// Função para limpar scripts conflitantes
function clearConflictingScripts() {
    console.log('🧹 Limpando scripts conflitantes...');
    
    // Desabilitar auto-sync
    if (window.disableAutoSync) {
        window.disableAutoSync();
    }
    
    // Parar loops de sincronização
    if (window.stopSyncLoop) {
        window.stopSyncLoop();
    }
    
    // Limpar listeners conflitantes
    const meditationForm = document.getElementById('meditationForm');
    if (meditationForm) {
        const newForm = meditationForm.cloneNode(true);
        meditationForm.parentNode.replaceChild(newForm, meditationForm);
    }
    
    console.log('✅ Scripts conflitantes limpos');
}

// Exportar funções
window.saveMeditationUnified = saveMeditationUnified;
window.updateMeditationsDisplayUnified = updateMeditationsDisplayUnified;
window.showNotificationUnified = showNotificationUnified;
window.replaceMeditationFormListenerUnified = replaceMeditationFormListenerUnified;
window.testUnifiedSave = testUnifiedSave;
window.clearConflictingScripts = clearConflictingScripts;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script unificado de salvamento carregado');
    
    setTimeout(async () => {
        console.log('🔧 Aplicando correções unificadas...');
        
        // Limpar scripts conflitantes
        clearConflictingScripts();
        
        // Substituir listener do formulário
        replaceMeditationFormListenerUnified();
        
        // Testar salvamento unificado
        await testUnifiedSave();
        
        // Atualizar exibição inicial
        updateMeditationsDisplayUnified();
    }, 3000);
});

console.log('✅ Script unificado de salvamento de meditações carregado'); 