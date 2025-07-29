// Script para corrigir problemas de persistência dos agendamentos
console.log('🔧 Iniciando correção de persistência de agendamentos...');

// Função para verificar e corrigir problemas de persistência
function fixSchedulesPersistence() {
    try {
        console.log('🔍 Verificando problemas de persistência...');
        
        // Obter usuário atual
        const currentUser = window.sessionManager ? window.sessionManager.getCurrentUser() : null;
        const userId = currentUser ? currentUser.id : 'anonymous';
        
        console.log('👤 Usuário atual:', currentUser ? currentUser.name : 'N/A', 'ID:', userId);
        
        if (!currentUser || userId === 'anonymous') {
            console.error('❌ Usuário não está logado. Não é possível corrigir persistência.');
            return false;
        }
        
        // Carregar todos os agendamentos
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        console.log('📋 Total de agendamentos no sistema:', allSchedules.length);
        
        // Verificar problemas
        const issues = [];
        let fixedCount = 0;
        
        // 1. Verificar agendamentos sem userId
        const schedulesWithoutUserId = allSchedules.filter(s => !s.userId);
        if (schedulesWithoutUserId.length > 0) {
            issues.push(`${schedulesWithoutUserId.length} agendamentos sem userId`);
        }
        
        // 2. Verificar agendamentos com userId 'anonymous'
        const anonymousSchedules = allSchedules.filter(s => s.userId === 'anonymous');
        if (anonymousSchedules.length > 0) {
            issues.push(`${anonymousSchedules.length} agendamentos com userId 'anonymous'`);
        }
        
        // 3. Verificar agendamentos do usuário atual
        const userSchedules = allSchedules.filter(s => s.userId === userId);
        console.log('📅 Agendamentos do usuário atual:', userSchedules.length);
        
        // Corrigir problemas se necessário
        if (issues.length > 0) {
            console.log('🔧 Aplicando correções...');
            
            const correctedSchedules = allSchedules.map(schedule => {
                let needsFix = false;
                
                // Corrigir agendamentos sem userId ou com userId 'anonymous'
                if (!schedule.userId || schedule.userId === 'anonymous') {
                    console.log('🔧 Corrigindo agendamento:', schedule.title || 'Sem título');
                    needsFix = true;
                    fixedCount++;
                    
                    return {
                        ...schedule,
                        userId: userId,
                        userName: currentUser.name
                    };
                }
                
                return schedule;
            });
            
            if (fixedCount > 0) {
                localStorage.setItem('user_schedules', JSON.stringify(correctedSchedules));
                console.log('✅ Agendamentos corrigidos e salvos:', fixedCount);
            }
        }
        
        // Verificar se os dados estão sendo salvos corretamente
        const verificationSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        const verificationUserSchedules = verificationSchedules.filter(s => s.userId === userId);
        
        console.log('📊 Verificação pós-correção:');
        console.log('- Total no localStorage:', verificationSchedules.length);
        console.log('- Agendamentos do usuário:', verificationUserSchedules.length);
        console.log('- Problemas encontrados:', issues.length > 0 ? issues.join(', ') : 'Nenhum');
        console.log('- Agendamentos corrigidos:', fixedCount);
        
        // Forçar atualização das interfaces
        forceUpdateAllInterfaces();
        
        return true;
        
    } catch (error) {
        console.error('❌ Erro durante correção de persistência:', error);
        return false;
    }
}

// Função para forçar atualização de todas as interfaces
function forceUpdateAllInterfaces() {
    console.log('🔄 Forçando atualização de todas as interfaces...');
    
    // Atualizar dashboard se estivermos na página do dashboard
    if (window.forceLoadDashboardSchedules) {
        console.log('📊 Atualizando dashboard...');
        window.forceLoadDashboardSchedules();
    }
    
    // Atualizar página de agendamentos se estivermos nela
    if (window.loadSchedules && document.getElementById('scheduleList')) {
        console.log('📅 Atualizando página de agendamentos...');
        window.loadSchedules();
    }
    
    // Disparar evento customizado para notificar outras partes da aplicação
    const event = new CustomEvent('schedulesPersistenceFixed', {
        detail: {
            timestamp: new Date().toISOString(),
            source: 'fix-schedules-persistence.js'
        }
    });
    window.dispatchEvent(event);
    
    console.log('✅ Interfaces atualizadas');
}

// Função para verificar se há problemas de persistência
function checkPersistenceIssues() {
    try {
        const currentUser = window.sessionManager ? window.sessionManager.getCurrentUser() : null;
        const userId = currentUser ? currentUser.id : 'anonymous';
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        const userSchedules = allSchedules.filter(s => s.userId === userId);
        
        const issues = [];
        
        if (allSchedules.length > 0 && userSchedules.length === 0) {
            issues.push('Usuário não tem agendamentos apesar de existirem agendamentos no sistema');
        }
        
        if (allSchedules.some(s => !s.userId)) {
            issues.push('Existem agendamentos sem userId');
        }
        
        if (allSchedules.some(s => s.userId === 'anonymous')) {
            issues.push('Existem agendamentos com userId "anonymous"');
        }
        
        // Verificar se os dados estão sendo salvos corretamente
        const testSave = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        if (testSave.length !== allSchedules.length) {
            issues.push('Problema na verificação de salvamento');
        }
        
        return {
            hasIssues: issues.length > 0,
            issues: issues,
            totalSchedules: allSchedules.length,
            userSchedules: userSchedules.length,
            userId: userId,
            canSave: testSave.length === allSchedules.length
        };
    } catch (error) {
        console.error('❌ Erro ao verificar problemas de persistência:', error);
        return {
            hasIssues: true,
            issues: ['Erro ao verificar problemas: ' + error.message],
            totalSchedules: 0,
            userSchedules: 0,
            userId: 'error',
            canSave: false
        };
    }
}

// Função para criar um agendamento de teste para verificar persistência
function createPersistenceTestSchedule() {
    try {
        const currentUser = window.sessionManager ? window.sessionManager.getCurrentUser() : null;
        const userId = currentUser ? currentUser.id : 'anonymous';
        
        if (!currentUser || userId === 'anonymous') {
            console.error('❌ Usuário não está logado. Não é possível criar agendamento de teste.');
            return false;
        }
        
        const testSchedule = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            title: 'Meditação de Teste - Persistência',
            time: '08:00',
            category: 'Teste',
            days: ['seg', 'qua', 'sex'],
            notifications: true,
            date: new Date().toISOString().split('T')[0],
            duration: 15,
            status: 'agendado',
            createdAt: new Date().toISOString(),
            description: 'Agendamento de teste para verificar persistência',
            userId: userId,
            userName: currentUser.name
        };
        
        console.log('📝 Criando agendamento de teste para persistência:', testSchedule.title);
        
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        allSchedules.push(testSchedule);
        
        localStorage.setItem('user_schedules', JSON.stringify(allSchedules));
        console.log('✅ Agendamento de teste salvo no localStorage');
        
        // Verificar se foi salvo corretamente
        const verificationSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        const savedSchedule = verificationSchedules.find(s => s.id === testSchedule.id);
        
        if (savedSchedule) {
            console.log('✅ Agendamento de teste confirmado no localStorage');
            forceUpdateAllInterfaces();
            return true;
        } else {
            console.error('❌ Agendamento de teste não foi salvo corretamente');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao criar agendamento de teste:', error);
        return false;
    }
}

// Função para forçar salvamento de agendamentos
function forceSaveSchedules(schedules) {
    try {
        console.log('💾 Forçando salvamento de agendamentos...');
        
        const currentUser = window.sessionManager ? window.sessionManager.getCurrentUser() : null;
        const userId = currentUser ? currentUser.id : 'anonymous';
        
        if (!currentUser || userId === 'anonymous') {
            console.error('❌ Usuário não está logado. Não é possível salvar agendamentos.');
            return false;
        }
        
        // Obter todos os agendamentos existentes
        const allSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        
        // Remover agendamentos antigos do usuário atual
        const otherUsersSchedules = allSchedules.filter(schedule => 
            schedule.userId !== userId
        );
        
        // Adicionar os agendamentos do usuário atual
        const updatedAllSchedules = [...otherUsersSchedules, ...schedules];
        
        // Salvar no localStorage
        localStorage.setItem('user_schedules', JSON.stringify(updatedAllSchedules));
        
        // Verificar se foi salvo corretamente
        const verificationSchedules = JSON.parse(localStorage.getItem('user_schedules') || '[]');
        const userSchedules = verificationSchedules.filter(s => s.userId === userId);
        
        console.log('📊 Resultado do salvamento:');
        console.log('- Total no localStorage:', verificationSchedules.length);
        console.log('- Agendamentos do usuário:', userSchedules.length);
        console.log('- Agendamentos esperados:', schedules.length);
        
        if (userSchedules.length === schedules.length) {
            console.log('✅ Salvamento confirmado com sucesso');
            return true;
        } else {
            console.error('❌ Erro na verificação do salvamento');
            return false;
        }
        
    } catch (error) {
        console.error('❌ Erro ao forçar salvamento:', error);
        return false;
    }
}

// Executar correção automaticamente quando o script for carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            console.log('🔄 Executando correção automática de persistência...');
            fixSchedulesPersistence();
        }, 1000);
    });
} else {
    setTimeout(() => {
        console.log('🔄 Executando correção automática de persistência...');
        fixSchedulesPersistence();
    }, 1000);
}

// Monitorar mudanças no localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'user_schedules') {
        console.log('🔄 Mudança detectada nos agendamentos, verificando persistência...');
        setTimeout(() => {
            const issues = checkPersistenceIssues();
            if (issues.hasIssues) {
                console.warn('⚠️ Problemas de persistência detectados:', issues.issues);
                fixSchedulesPersistence();
            }
        }, 500);
    }
});

// Tornar funções globais
window.fixSchedulesPersistence = fixSchedulesPersistence;
window.checkPersistenceIssues = checkPersistenceIssues;
window.createPersistenceTestSchedule = createPersistenceTestSchedule;
window.forceSaveSchedules = forceSaveSchedules;
window.forceUpdateAllInterfaces = forceUpdateAllInterfaces;

console.log('✅ Script de correção de persistência carregado'); 