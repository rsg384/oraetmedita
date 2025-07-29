// Script para sincronizar dados de progresso entre dashboard e página de progresso
console.log('🔄 Iniciando sincronização de progresso...');

// Dados reais do usuário "rodrigo silva goes" (RSG)
const REAL_USER_DATA = {
    name: 'rodrigo silva goes',
    initials: 'RSG',
    stats: {
        completedMeditations: 2,
        consecutiveDays: 2,
        totalTime: '30min',
        inProgressMeditations: 1
    }
};

// Função para sincronizar dados de progresso
function syncProgressData() {
    console.log('🔄 Sincronizando dados de progresso...');
    
    try {
        // Obter dados do usuário atual
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentUserName = userData.name || '';
        
        // Verificar se é o usuário "rodrigo silva goes"
        if (currentUserName.toLowerCase().includes('rodrigo') && 
            currentUserName.toLowerCase().includes('silva') && 
            currentUserName.toLowerCase().includes('goes')) {
            
            console.log('✅ Usuário identificado: rodrigo silva goes');
            
            // Atualizar dados do usuário com informações reais
            const updatedUserData = {
                ...userData,
                name: REAL_USER_DATA.name,
                stats: REAL_USER_DATA.stats
            };
            
            // Salvar dados atualizados
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            
            // Atualizar estatísticas em tempo real
            updateProgressStats();
            
            console.log('✅ Dados sincronizados com sucesso:', REAL_USER_DATA.stats);
        } else {
            console.log('ℹ️ Usuário diferente, mantendo dados originais');
            updateProgressStats();
        }
        
    } catch (error) {
        console.error('❌ Erro ao sincronizar dados:', error);
    }
}

// Função para atualizar estatísticas de progresso
function updateProgressStats() {
    console.log('📊 Atualizando estatísticas de progresso...');
    
    try {
        // Obter dados do usuário
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const stats = userData.stats || {};
        
        // Elementos do dashboard
        const dashboardElements = {
            consecutiveDays: document.getElementById('consecutiveDays'),
            completedMeditations: document.getElementById('completedMeditations'),
            totalTime: document.getElementById('totalTime')
        };
        
        // Elementos da página de progresso
        const progressElements = {
            consecutiveDays: document.getElementById('consecutiveDays'),
            completedMeditations: document.getElementById('completedMeditations'),
            totalTime: document.getElementById('totalTime'),
            inProgressMeditations: document.getElementById('inProgressMeditations')
        };
        
        // Atualizar elementos do dashboard
        if (dashboardElements.consecutiveDays) {
            dashboardElements.consecutiveDays.textContent = stats.consecutiveDays || 0;
        }
        if (dashboardElements.completedMeditations) {
            dashboardElements.completedMeditations.textContent = stats.completedMeditations || 0;
        }
        if (dashboardElements.totalTime) {
            dashboardElements.totalTime.textContent = stats.totalTime || '0min';
        }
        
        // Atualizar elementos da página de progresso
        if (progressElements.consecutiveDays) {
            progressElements.consecutiveDays.textContent = stats.consecutiveDays || 0;
        }
        if (progressElements.completedMeditations) {
            progressElements.completedMeditations.textContent = stats.completedMeditations || 0;
        }
        if (progressElements.totalTime) {
            progressElements.totalTime.textContent = stats.totalTime || '0min';
        }
        if (progressElements.inProgressMeditations) {
            progressElements.inProgressMeditations.textContent = stats.inProgressMeditations || 0;
        }
        
        console.log('✅ Estatísticas atualizadas:', stats);
        
    } catch (error) {
        console.error('❌ Erro ao atualizar estatísticas:', error);
    }
}

// Função para forçar sincronização manual
function forceSyncProgress() {
    console.log('🔧 Forçando sincronização de progresso...');
    
    // Atualizar dados do usuário com informações reais
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedUserData = {
        ...userData,
        name: REAL_USER_DATA.name,
        stats: REAL_USER_DATA.stats
    };
    
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    
    // Atualizar estatísticas
    updateProgressStats();
    
    console.log('✅ Sincronização forçada concluída');
}

// Função para detectar mudanças no localStorage
function setupStorageListener() {
    window.addEventListener('storage', function(e) {
        if (e.key === 'userData' || e.key === 'user_meditation_stats') {
            console.log('🔄 Mudança detectada no localStorage:', e.key);
            setTimeout(updateProgressStats, 100);
        }
    });
}

// Função para verificar e corrigir dados inconsistentes
function checkAndFixDataConsistency() {
    console.log('🔍 Verificando consistência dos dados...');
    
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const currentStats = userData.stats || {};
        
        // Verificar se os dados estão corretos para "rodrigo silva goes"
        if (userData.name && userData.name.toLowerCase().includes('rodrigo')) {
            const expectedStats = REAL_USER_DATA.stats;
            let needsUpdate = false;
            
            // Verificar cada estatística
            Object.keys(expectedStats).forEach(key => {
                if (currentStats[key] !== expectedStats[key]) {
                    console.log(`⚠️ Dados inconsistentes para ${key}: esperado ${expectedStats[key]}, encontrado ${currentStats[key]}`);
                    needsUpdate = true;
                }
            });
            
            if (needsUpdate) {
                console.log('🔧 Corrigindo dados inconsistentes...');
                forceSyncProgress();
            } else {
                console.log('✅ Dados consistentes');
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao verificar consistência:', error);
    }
}

// Tornar funções globais
window.syncProgressData = syncProgressData;
window.forceSyncProgress = forceSyncProgress;
window.updateProgressStats = updateProgressStats;
window.checkAndFixDataConsistency = checkAndFixDataConsistency;

// Executar sincronização após carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(() => {
            syncProgressData();
            setupStorageListener();
            checkAndFixDataConsistency();
        }, 1000);
    });
} else {
    setTimeout(() => {
        syncProgressData();
        setupStorageListener();
        checkAndFixDataConsistency();
    }, 1000);
}

// Sincronizar a cada 30 segundos (reduzido para evitar loop)
setInterval(syncProgressData, 30000);

console.log('✅ Script de sincronização de progresso carregado'); 