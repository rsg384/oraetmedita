// Script para diagnosticar problemas de persistência de agendamentos
console.log('🔍 Iniciando diagnóstico de persistência de agendamentos...');

// Função para verificar estado completo dos agendamentos
function checkSchedulePersistence() {
    try {
        console.log('=== DIAGNÓSTICO COMPLETO DE AGENDAMENTOS ===');
        
        // 1. Verificar localStorage
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 1. Total no localStorage:', allSchedules.length);
        
        if (allSchedules.length > 0) {
            allSchedules.forEach((schedule, index) => {
                console.log(`   ${index + 1}. ${schedule.title} (ID: ${schedule.id}, userId: ${schedule.userId || 'N/A'})`);
            });
        }
        
        // 2. Verificar usuário atual
        const currentUser = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('👤 2. Usuário atual:', currentUser.name, 'ID:', currentUser.id);
        
        // 3. Verificar se loadUserSchedules funciona
        if (window.loadUserSchedules) {
            const userSchedules = window.loadUserSchedules();
            console.log('📋 3. Agendamentos do usuário atual:', userSchedules.length);
            
            if (userSchedules.length > 0) {
                userSchedules.forEach((schedule, index) => {
                    console.log(`   ${index + 1}. ${schedule.title} (ID: ${schedule.id})`);
                });
            }
        } else {
            console.warn('⚠️ 3. Função loadUserSchedules não disponível');
        }
        
        // 4. Verificar se há conflitos com outros scripts
        console.log('🔧 4. Verificando scripts carregados:');
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const src = script.src;
            if (src.includes('schedule') || src.includes('sync')) {
                console.log(`   - ${src.split('/').pop()}`);
            }
        });
        
        // 5. Verificar se há eventos interferindo
        console.log('📡 5. Verificando listeners de eventos...');
        
    } catch (error) {
        console.error('❌ Erro no diagnóstico:', error);
    }
}

// Função para testar salvamento e carregamento
function testSchedulePersistence() {
    try {
        console.log('=== TESTE DE PERSISTÊNCIA ===');
        
        // Criar agendamento de teste
        const testSchedule = {
            title: `Teste Persistência ${Date.now()}`,
            category: 'Evangelho',
            time: '08:00',
            days: ['seg', 'qua', 'sex'],
            notifications: true,
            createdAt: new Date().toISOString()
        };
        
        console.log('📝 Criando agendamento de teste:', testSchedule.title);
        
        // Salvar agendamento
        if (window.saveScheduleWithUser) {
            const savedSchedule = window.saveScheduleWithUser(testSchedule);
            console.log('✅ Agendamento salvo:', savedSchedule.title);
            
            // Verificar se foi salvo no localStorage
            setTimeout(() => {
                const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
                const savedInStorage = allSchedules.find(s => s.id === savedSchedule.id);
                
                if (savedInStorage) {
                    console.log('✅ Agendamento encontrado no localStorage');
                } else {
                    console.error('❌ Agendamento NÃO encontrado no localStorage');
                }
                
                // Testar carregamento
                if (window.loadUserSchedules) {
                    const userSchedules = window.loadUserSchedules();
                    const loadedSchedule = userSchedules.find(s => s.id === savedSchedule.id);
                    
                    if (loadedSchedule) {
                        console.log('✅ Agendamento carregado corretamente');
                    } else {
                        console.error('❌ Agendamento NÃO carregado');
                    }
                }
                
            }, 100);
            
        } else {
            console.error('❌ Função saveScheduleWithUser não disponível');
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

// Função para limpar e recriar dados
function resetScheduleData() {
    try {
        console.log('🔄 Resetando dados de agendamentos...');
        
        // Limpar localStorage
        localStorage.removeItem('user_schedules');
        console.log('✅ localStorage limpo');
        
        // Recarregar página após 2 segundos
        setTimeout(() => {
            console.log('🔄 Recarregando página...');
            window.location.reload();
        }, 2000);
        
    } catch (error) {
        console.error('❌ Erro ao resetar:', error);
    }
}

// Função para monitorar mudanças no localStorage
function monitorLocalStorage() {
    console.log('👀 Iniciando monitoramento do localStorage...');
    
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.setItem = function(key, value) {
        console.log(`📝 localStorage.setItem('${key}', ${value.substring(0, 100)}...)`);
        originalSetItem.call(this, key, value);
    };
    
    localStorage.removeItem = function(key) {
        console.log(`🗑️ localStorage.removeItem('${key}')`);
        originalRemoveItem.call(this, key);
    };
    
    // Monitorar eventos de storage
    window.addEventListener('storage', function(e) {
        console.log(`📡 Storage event: ${e.key} = ${e.newValue ? e.newValue.substring(0, 100) + '...' : 'null'}`);
    });
}

// Tornar funções globais
window.checkSchedulePersistence = checkSchedulePersistence;
window.testSchedulePersistence = testSchedulePersistence;
window.resetScheduleData = resetScheduleData;
window.monitorLocalStorage = monitorLocalStorage;

// Executar diagnóstico automático
setTimeout(() => {
    console.log('🔍 Executando diagnóstico automático...');
    checkSchedulePersistence();
    monitorLocalStorage();
}, 3000);

console.log('✅ Script de diagnóstico de persistência carregado'); 