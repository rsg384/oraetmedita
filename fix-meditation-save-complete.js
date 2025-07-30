// Script para corrigir o salvamento completo de meditações
console.log('🔧 Script de correção do salvamento de meditações carregado');

// Função para salvar meditação completa (Supabase + Local)
async function saveMeditationComplete(meditationData) {
    console.log('🔄 Salvando meditação completa...');
    
    try {
        // 1. Criar no Supabase primeiro
        console.log('📤 Criando no Supabase...');
        const supabaseVars = getSupabaseVariables();
        
        const supabaseData = {
            title: meditationData.title || meditationData.name,
            content: meditationData.content || meditationData.description || '',
            category_id: meditationData.category_id || meditationData.categoryId,
            duration: meditationData.duration || 10,
            status: meditationData.status || 'available',
            type: meditationData.type || 'free',
            difficulty: meditationData.difficulty || 'intermediate',
            is_active: meditationData.is_active !== undefined ? meditationData.is_active : true,
            sort_order: meditationData.sort_order || meditationData.sortOrder || 0,
            bible_verse: meditationData.bible_verse || meditationData.bibleVerse || '',
            prayer: meditationData.prayer || '',
            practical_application: meditationData.practical_application || meditationData.practicalApplication || '',
            tags: meditationData.tags || [],
            icon: meditationData.icon || '📖',
            color: meditationData.color || '#7ee787',
            created_by: meditationData.created_by || meditationData.createdBy || null,
            version: meditationData.version || 1
        };
        
        console.log('📋 Dados para enviar ao Supabase:', supabaseData);
        
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
            
            // 2. Salvar localmente com ID do Supabase
            const localMeditation = {
                id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                supabase_id: supabaseResult[0].id,
                title: meditationData.title || meditationData.name,
                content: meditationData.content || meditationData.description || '',
                category_id: meditationData.category_id || meditationData.categoryId,
                duration: meditationData.duration || 10,
                status: meditationData.status || 'available',
                type: meditationData.type || 'free',
                difficulty: meditationData.difficulty || 'intermediate',
                bible_verse: meditationData.bible_verse || meditationData.bibleVerse || '',
                prayer: meditationData.prayer || '',
                practical_application: meditationData.practical_application || meditationData.practicalApplication || '',
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
            
            // 3. Atualizar interface
            updateMeditationsDisplay();
            
            // 4. Mostrar notificação
            showNotification('Meditação criada com sucesso!', 'success');
            
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
        console.error('❌ Erro no salvamento completo:', error);
        showNotification('Erro ao criar meditação: ' + error.message, 'error');
        return { success: false, error: error.message };
    }
}

// Função para atualizar a exibição das meditações
function updateMeditationsDisplay() {
    console.log('🔄 Atualizando exibição das meditações...');
    
    // Atualizar lista no painel admin
    if (window.displayMeditations) {
        window.displayMeditations();
    }
    
    // Atualizar dashboard se estiver na página
    if (window.loadDashboardMeditations) {
        window.loadDashboardMeditations();
    }
    
    // Disparar evento de atualização
    const event = new CustomEvent('meditationsUpdated', {
        detail: { source: 'saveMeditationComplete' }
    });
    document.dispatchEvent(event);
    
    console.log('✅ Exibição das meditações atualizada');
}

// Função para mostrar notificação
function showNotification(message, type = 'info') {
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

// Função para substituir o listener do formulário de meditações
function replaceMeditationFormListener() {
    console.log('🔧 Substituindo listener do formulário de meditações...');
    
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
        console.log('🔄 Formulário de meditação submetido...');
        
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
            
            // Salvar meditação completa
            const result = await saveMeditationComplete(meditationData);
            
            if (result.success) {
                // Limpar formulário
                newForm.reset();
                console.log('✅ Meditação criada com sucesso');
            } else {
                console.error('❌ Erro ao criar meditação:', result.error);
            }
            
        } catch (error) {
            console.error('❌ Erro na criação da meditação:', error);
            showNotification('Erro ao criar meditação: ' + error.message, 'error');
        }
    });
    
    console.log('✅ Listener do formulário substituído');
}

// Função para testar o salvamento completo
async function testCompleteSave() {
    console.log('🧪 Testando salvamento completo...');
    
    try {
        // Buscar primeira categoria disponível
        const categories = JSON.parse(localStorage.getItem('categories') || '[]');
        const testCategory = categories[0];
        
        if (!testCategory) {
            throw new Error('Nenhuma categoria disponível para teste');
        }
        
        // Criar meditação de teste
        const testMeditation = {
            title: 'Teste Salvamento Completo',
            content: 'Esta é uma meditação de teste para verificar o salvamento completo.',
            category_id: testCategory.id,
            duration: 15,
            status: 'available',
            type: 'free',
            difficulty: 'beginner',
            bible_verse: 'Salmo 1:1-2',
            prayer: 'Senhor, obrigado por este teste.',
            practical_application: 'Aplicar os ensinamentos do teste.',
            tags: ['teste', 'salvamento'],
            icon: '🧪',
            color: '#7ee787',
            is_active: true,
            sort_order: 0
        };
        
        console.log('📋 Meditação de teste:', testMeditation);
        
        // Tentar salvar
        const result = await saveMeditationComplete(testMeditation);
        
        if (result.success) {
            console.log('✅ Teste de salvamento completo bem-sucedido:', result);
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

// Exportar funções
window.saveMeditationComplete = saveMeditationComplete;
window.updateMeditationsDisplay = updateMeditationsDisplay;
window.showNotification = showNotification;
window.replaceMeditationFormListener = replaceMeditationFormListener;
window.testCompleteSave = testCompleteSave;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção do salvamento carregado');
    
    setTimeout(async () => {
        console.log('🔧 Aplicando correções do salvamento...');
        
        // Substituir listener do formulário
        replaceMeditationFormListener();
        
        // Testar salvamento completo
        await testCompleteSave();
    }, 3000);
});

console.log('✅ Script de correção do salvamento de meditações carregado'); 