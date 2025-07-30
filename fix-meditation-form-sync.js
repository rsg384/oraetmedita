// Script para corrigir sincronização do formulário de meditações
console.log('🔧 Script de correção do formulário de meditações carregado');

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
            
            // Verificar se as variáveis do Supabase estão disponíveis
            const supabaseVars = getSupabaseVariables();
            if (!supabaseVars) {
                throw new Error('Variáveis do Supabase não encontradas');
            }
            
            // Criar meditação no Supabase primeiro
            console.log('🔄 Criando meditação no Supabase...');
            const response = await fetch(`${supabaseVars.url}/rest/v1/meditations`, {
                method: 'POST',
                headers: {
                    'apikey': supabaseVars.key,
                    'Authorization': `Bearer ${supabaseVars.key}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                },
                body: JSON.stringify(meditationData)
            });
            
            console.log('📊 Status da resposta Supabase:', response.status);
            
            if (response.ok) {
                const supabaseResult = await response.json();
                console.log('✅ Meditação criada no Supabase:', supabaseResult);
                
                // Adicionar ID do Supabase aos dados
                meditationData.supabase_id = supabaseResult[0].id;
                meditationData.id = `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                
                // Salvar no localStorage
                const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
                meditations.push(meditationData);
                localStorage.setItem('meditations', JSON.stringify(meditations));
                
                console.log('✅ Meditação salva localmente');
                
                // Limpar formulário
                newForm.reset();
                
                // Atualizar lista de meditações
                displayMeditations();
                
                // Mostrar mensagem de sucesso
                showNotification('Meditação criada com sucesso!', 'success');
                
            } else {
                const errorData = await response.json();
                console.error('❌ Erro ao criar meditação no Supabase:', errorData);
                throw new Error(`Erro ${response.status}: ${errorData.message || 'Erro desconhecido'}`);
            }
            
        } catch (error) {
            console.error('❌ Erro na criação da meditação:', error);
            showNotification('Erro ao criar meditação: ' + error.message, 'error');
        }
    });
    
    console.log('✅ Listener do formulário substituído');
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

// Função para atualizar a exibição das meditações
function displayMeditations() {
    console.log('🔄 Atualizando exibição das meditações...');
    
    const meditations = JSON.parse(localStorage.getItem('meditations') || '[]');
    const meditationsList = document.getElementById('meditationsList');
    
    if (!meditationsList) {
        console.error('❌ Lista de meditações não encontrada');
        return;
    }
    
    meditationsList.innerHTML = '';
    
    meditations.forEach(meditation => {
        const meditationItem = document.createElement('div');
        meditationItem.className = 'meditation-item';
        meditationItem.innerHTML = `
            <h4>${meditation.title}</h4>
            <p>${meditation.content}</p>
            <small>Categoria: ${getCategoryName(meditation.category_id)}</small>
            <small>Duração: ${meditation.duration} min</small>
            ${meditation.supabase_id ? '<span class="sync-status">✅ Sincronizado</span>' : '<span class="sync-status">❌ Não sincronizado</span>'}
        `;
        meditationsList.appendChild(meditationItem);
    });
    
    console.log(`✅ ${meditations.length} meditações exibidas`);
}

// Função para obter nome da categoria
function getCategoryName(categoryId) {
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Categoria não encontrada';
}

// Função para testar a sincronização
async function testFormSync() {
    console.log('🧪 Testando sincronização do formulário...');
    
    try {
        // Simular submissão do formulário
        const testData = {
            title: 'Teste Formulário',
            content: 'Conteúdo de teste do formulário',
            category_id: 'c7293f33-a9fd-4986-ab51-f164d2ab9cfa',
            duration: 20,
            status: 'available',
            type: 'free',
            difficulty: 'beginner',
            bible_verse: 'João 3:16',
            prayer: 'Oração de teste',
            practical_application: 'Aplicação de teste',
            tags: ['teste', 'formulario'],
            icon: '🧪',
            color: '#7ee787',
            is_active: true,
            sort_order: 0
        };
        
        const supabaseVars = getSupabaseVariables();
        if (!supabaseVars) {
            throw new Error('Variáveis do Supabase não encontradas');
        }
        
        const response = await fetch(`${supabaseVars.url}/rest/v1/meditations`, {
            method: 'POST',
            headers: {
                'apikey': supabaseVars.key,
                'Authorization': `Bearer ${supabaseVars.key}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(testData)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Teste do formulário bem-sucedido:', result);
            return true;
        } else {
            const errorData = await response.json();
            console.error('❌ Erro no teste do formulário:', errorData);
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro no teste do formulário:', error);
        return false;
    }
}

// Exportar funções
window.replaceMeditationFormListener = replaceMeditationFormListener;
window.showNotification = showNotification;
window.displayMeditations = displayMeditations;
window.testFormSync = testFormSync;

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script de correção do formulário carregado');
    
    setTimeout(() => {
        console.log('🔧 Aplicando correções do formulário...');
        
        // Substituir listener do formulário
        replaceMeditationFormListener();
        
        // Atualizar exibição
        displayMeditations();
        
        // Testar sincronização
        testFormSync();
    }, 3000);
});

console.log('✅ Script de correção do formulário de meditações carregado'); 