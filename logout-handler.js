// Script para gerenciar o logout do sistema
console.log('🔧 Iniciando handler de logout...');

// Função principal de logout
function performLogout() {
    console.log('🔍 Função logout chamada');
    
    if (confirm('Tem certeza que deseja sair?')) {
        console.log('✅ Usuário confirmou logout');
        
        try {
            // Mostrar notificação de saída
            if (typeof showNotification === 'function') {
                showNotification('Saindo...', 'info');
            }
            console.log('✅ Notificação mostrada');
        } catch (error) {
            console.error('❌ Erro ao mostrar notificação:', error);
        }
        
        // Limpar dados do usuário
        try {
            localStorage.removeItem('userData');
            localStorage.removeItem('current_user');
            localStorage.removeItem('current_session');
            localStorage.removeItem('currentSessionId');
            sessionStorage.clear();
            console.log('✅ Dados do usuário limpos');
        } catch (error) {
            console.error('❌ Erro ao limpar dados:', error);
        }
        
        // Fazer logout via SessionManager se disponível
        if (window.sessionManager && typeof window.sessionManager.logoutUser === 'function') {
            try {
                window.sessionManager.logoutUser();
                console.log('✅ Logout realizado via SessionManager');
            } catch (error) {
                console.error('❌ Erro no SessionManager:', error);
            }
        } else {
            console.warn('⚠️ SessionManager não encontrado ou método logoutUser não disponível');
        }
        
        // Aguardar um pouco antes de redirecionar para garantir que tudo foi limpo
        setTimeout(() => {
            console.log('🔄 Redirecionando para página inicial...');
            window.location.href = 'index.html';
        }, 500);
    } else {
        console.log('❌ Usuário cancelou logout');
    }
}

// Event listener específico para o botão Sair
function setupLogoutButton() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        console.log('🔧 Configurando event listener para botão Sair');
        
        // Remover event listeners anteriores
        logoutButton.removeEventListener('click', handleLogoutClick);
        
        // Adicionar novo event listener
        logoutButton.addEventListener('click', handleLogoutClick);
        
        console.log('✅ Event listener configurado para botão Sair');
    } else {
        console.warn('⚠️ Botão Sair não encontrado');
    }
}

// Handler para o clique no botão Sair
function handleLogoutClick(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log('🖱️ Botão Sair clicado');
    performLogout();
}

// Tornar funções globais
window.logout = performLogout;
window.setupLogoutButton = setupLogoutButton;

// Executar configuração após carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(setupLogoutButton, 1000);
    });
} else {
    setTimeout(setupLogoutButton, 1000);
}

console.log('✅ Handler de logout carregado'); 