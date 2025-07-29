// Script para corrigir a função generateDashboardMeditation
console.log('🔧 Carregando correção da função generateDashboardMeditation...');

// Função para gerar meditação a partir do dashboard
async function generateDashboardMeditation() {
    console.log('🚀 Função generateDashboardMeditation chamada');
    
    const topicInput = document.getElementById('dashboard-meditation-topic');
    if (!topicInput) {
        console.error('❌ Campo dashboard-meditation-topic não encontrado');
        alert('Erro: Campo de tópico não encontrado');
        return;
    }
    
    const topic = topicInput.value.trim();
    console.log('📝 Tópico digitado:', topic);
    
    if (!topic) {
        alert('Por favor, digite um assunto para a meditação');
        return;
    }
    
    // Desabilitar botão durante a geração
    const sendBtn = document.querySelector('#dashboard-meditation-topic').closest('.chatgpt-style-input').querySelector('.chatgpt-send-btn');
    const originalText = sendBtn.innerHTML;
    sendBtn.disabled = true;
    sendBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="spinning">
            <path d="M12 2L12 6M12 18L12 22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12L6 12M18 12L22 12M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    
    
    
    try {
        // Verificar se as funções necessárias estão disponíveis
        console.log('🔍 Verificando se as funções necessárias estão disponíveis...');
        console.log('checkAPIStatus disponível:', typeof checkAPIStatus);
        console.log('generateMeditations disponível:', typeof generateMeditations);
        
        if (typeof checkAPIStatus !== 'function') {
            throw new Error('Função checkAPIStatus não está disponível');
        }
        
        if (typeof generateMeditations !== 'function') {
            throw new Error('Função generateMeditations não está disponível');
        }
        
        // Verificar se a API está disponível
        console.log('🔍 Verificando status da API...');
        const apiStatus = await checkAPIStatus();
        console.log('📊 Status da API:', apiStatus);
        
        if (!apiStatus.status || apiStatus.status !== 'success') {
            throw new Error('API do ChatGPT não está disponível');
        }
        
        // Gerar com ChatGPT usando as mesmas regras
        console.log('🤖 Gerando meditação com ChatGPT para:', topic);
        const result = await generateMeditations(topic);
        console.log('📄 Resultado da geração:', result);
        
        if (result && result.meditations && result.meditations.length > 0) {
            console.log('✅ Meditação gerada:', result.meditations[0].title);
            
            // Obter usuário atual
            const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
            const userId = currentUser.id || 'anonymous';
            
            console.log('👤 Usuário atual na geração:', currentUser.name, 'ID:', userId);
            
            // Salvar meditação personalizada no formato correto
            const existingPersonalized = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
            
            const meditation = result.meditations[0];
            const meditationWithMeta = {
                id: meditation.id,
                title: meditation.title,
                topic: result.category,
                content: meditation.content,
                duration: meditation.duration || '15 min',
                status: 'pending',
                createdAt: new Date().toISOString(),
                lastUpdated: new Date().toISOString(),
                source: 'chatgpt',
                type: 'simple',
                userId: userId,
                userName: currentUser.name || 'Usuário'
            };
            
            // Verificar se já existe uma meditação com o mesmo ID
            const existingMeditationIndex = existingPersonalized.findIndex(m => m.id === meditation.id);
            
            let updatedMeditations;
            if (existingMeditationIndex !== -1) {
                // Atualizar meditação existente
                existingPersonalized[existingMeditationIndex] = meditationWithMeta;
                updatedMeditations = existingPersonalized;
                console.log('🔄 Meditação existente atualizada');
            } else {
                // Adicionar nova meditação ao array existente
                updatedMeditations = existingPersonalized.concat([meditationWithMeta]);
                console.log('➕ Nova meditação adicionada');
            }
            
            localStorage.setItem('personalized_meditations', JSON.stringify(updatedMeditations));
            
            // Também salvar no histórico
            const existingHistory = JSON.parse(localStorage.getItem('personalized_meditations_history') || '[]');
            const historyEntry = {
                ...meditationWithMeta,
                generatedAt: new Date().toISOString(),
                generationMethod: 'dashboard'
            };
            existingHistory.push(historyEntry);
            localStorage.setItem('personalized_meditations_history', JSON.stringify(existingHistory));
            
            // Limpar campo
            document.getElementById('dashboard-meditation-topic').value = '';
            
            // Reabilitar botão
            sendBtn.disabled = false;
            sendBtn.innerHTML = originalText;
            
            // Atualizar cards
            if (window.updateDashboardMeditationCards) {
                window.updateDashboardMeditationCards();
            }
            
            // Tentar novamente após um delay para garantir
            setTimeout(() => {
                if (window.updateDashboardMeditationCards) {
                    window.updateDashboardMeditationCards();
                }
            }, 500);
            
            
            
            // Registrar atividade
            if (window.sessionManager) {
                window.sessionManager.addActivity({
                    type: 'meditation_created',
                    title: `Meditação criada: ${meditation.title}`,
                    description: `Você criou uma meditação personalizada sobre ${topic}`,
                    metadata: {
                        topic: topic,
                        duration: meditation.duration,
                        source: 'chatgpt'
                    }
                });
            }
            
            console.log('✅ Meditação salva e dashboard atualizado');
            
        } else {
            throw new Error('Nenhuma meditação foi gerada');
        }
        
    } catch (error) {
        console.error('❌ Erro ao gerar meditação:', error);
        
        // Reabilitar botão
        sendBtn.disabled = false;
        sendBtn.innerHTML = originalText;
        
        alert(`Erro ao gerar meditação: ${error.message}`);
    }
}

// Tornar função global
window.generateDashboardMeditation = generateDashboardMeditation;

console.log('✅ Função generateDashboardMeditation corrigida e disponível globalmente'); 