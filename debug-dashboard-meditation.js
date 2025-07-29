// Script de debug para testar geração de meditações no dashboard
console.log('🔧 Script de debug carregado');

// Função para testar se tudo está funcionando
function testDashboardMeditationDebug() {
    console.log('🧪 Iniciando teste de debug...');
    
    // 1. Verificar se o campo existe
    const topicInput = document.getElementById('dashboard-meditation-topic');
    console.log('1. Campo de tópico encontrado:', !!topicInput);
    
    // 2. Verificar se as funções da API estão disponíveis
    console.log('2. checkAPIStatus disponível:', typeof checkAPIStatus);
    console.log('3. generateMeditations disponível:', typeof generateMeditations);
    console.log('4. chatGPTAPI disponível:', typeof chatGPTAPI);
    
    // 3. Verificar configuração da API
    console.log('5. API_CONFIG disponível:', !!window.API_CONFIG);
    if (window.API_CONFIG) {
        console.log('6. Configuração da API:', window.API_CONFIG);
    }
    
    // 4. Verificar dados do usuário
    const userData = localStorage.getItem('userData');
    console.log('7. Dados do usuário:', userData);
    
    // 5. Verificar se a função generateDashboardMeditation existe
    console.log('8. generateDashboardMeditation disponível:', typeof generateDashboardMeditation);
    
    // 6. Testar chamada da função
    if (typeof generateDashboardMeditation === 'function') {
        console.log('9. ✅ Função generateDashboardMeditation está disponível');
        
        // Definir um tópico de teste
        if (topicInput) {
            topicInput.value = 'Teste de Meditação';
            console.log('10. ✅ Tópico de teste definido');
            
            // Chamar a função
            console.log('11. 🚀 Chamando generateDashboardMeditation...');
            generateDashboardMeditation();
        } else {
            console.log('10. ❌ Campo de tópico não encontrado');
        }
    } else {
        console.log('9. ❌ Função generateDashboardMeditation não está disponível');
    }
}

// Função para testar apenas a API
async function testAPIOnly() {
    console.log('🔍 Testando apenas a API...');
    
    try {
        if (typeof checkAPIStatus === 'function') {
            const status = await checkAPIStatus();
            console.log('Status da API:', status);
        } else {
            console.log('❌ checkAPIStatus não está disponível');
        }
        
        if (typeof generateMeditations === 'function') {
            console.log('✅ generateMeditations está disponível');
        } else {
            console.log('❌ generateMeditations não está disponível');
        }
    } catch (error) {
        console.error('❌ Erro ao testar API:', error);
    }
}

// Função para simular geração de meditação
function simulateMeditationGeneration() {
    console.log('🎭 Simulando geração de meditação...');
    
    const topic = 'Teste de Simulação';
    const meditation = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        title: `Meditação sobre ${topic}`,
        topic: topic,
        content: `Esta é uma meditação de teste sobre "${topic}". Aqui você encontrará reflexões profundas e orientações espirituais para aprofundar sua fé e conexão com Deus através deste tema.`,
        duration: '15 min',
        createdAt: new Date().toISOString(),
        userId: JSON.parse(localStorage.getItem('userData') || '{}').id || 'anonymous',
        userName: JSON.parse(localStorage.getItem('userData') || '{}').name || 'Usuário'
    };
    
    // Salvar meditação
    const existingMeditations = JSON.parse(localStorage.getItem('personalized_meditations') || '[]');
    existingMeditations.push(meditation);
    localStorage.setItem('personalized_meditations', JSON.stringify(existingMeditations));
    
    console.log('✅ Meditação simulada salva:', meditation);
    alert('Meditação simulada criada com sucesso!');
    
    // Atualizar cards se a função existir
    if (window.updateDashboardMeditationCards) {
        window.updateDashboardMeditationCards();
    }
}

// Expor funções globalmente para teste no console
window.testDashboardMeditationDebug = testDashboardMeditationDebug;
window.testAPIOnly = testAPIOnly;
window.simulateMeditationGeneration = simulateMeditationGeneration;

console.log('✅ Script de debug carregado. Use as funções:');
console.log('- testDashboardMeditationDebug() - Teste completo');
console.log('- testAPIOnly() - Teste apenas da API');
console.log('- simulateMeditationGeneration() - Simular geração'); 