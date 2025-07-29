// Script para corrigir automaticamente o problema do perfil do usuário
console.log('🔧 Iniciando correção automática do perfil do usuário...');

// Função para forçar atualização do perfil
function forceUpdateUserProfile() {
    console.log('🔄 Forçando atualização do perfil do usuário...');
    
    try {
        // Verificar se SessionManager existe
        if (!window.sessionManager) {
            console.error('❌ SessionManager não encontrado');
            return;
        }
        
        // Obter dados do usuário via SessionManager
        const userData = window.sessionManager.getCurrentUser();
        console.log('📊 Dados do usuário via SessionManager:', userData);
        
        // Fallback: tentar obter dados do localStorage diretamente
        if (!userData) {
            console.log('⚠️ Tentando fallback para localStorage...');
            const localStorageUserData = localStorage.getItem('userData');
            if (localStorageUserData) {
                try {
                    const parsedUserData = JSON.parse(localStorageUserData);
                    console.log('📊 Dados do localStorage:', parsedUserData);
                    if (parsedUserData && parsedUserData.name) {
                        console.log('✅ Usando dados do localStorage como fallback');
                        updateUserProfileElements(parsedUserData);
                        return;
                    }
                } catch (error) {
                    console.error('❌ Erro ao parsear dados do localStorage:', error);
                }
            }
            
            // Fallback adicional: verificar se há usuário logado em outras sessões
            const activeSessions = window.sessionManager.getActiveSessions();
            if (activeSessions && activeSessions.length > 0) {
                const latestSession = activeSessions[activeSessions.length - 1];
                console.log('✅ Usando dados da sessão ativa:', latestSession.name);
                updateUserProfileElements(latestSession);
                return;
            }
            
            console.log('⚠️ Nenhum usuário logado encontrado');
            return;
        }
        
        // Atualizar elementos com os dados do SessionManager
        updateUserProfileElements(userData);
        
    } catch (error) {
        console.error('❌ Erro ao atualizar perfil do usuário:', error);
    }
}

// Função auxiliar para atualizar elementos do perfil
function updateUserProfileElements(userData) {
    try {
        console.log('🔧 Atualizando elementos do perfil com dados:', userData);
        
        if (userData.name) {
            console.log('👤 Atualizando nome do usuário:', userData.name);
            
            // Extrair nome e sobrenome
            const nameParts = userData.name.trim().split(' ');
            const firstName = nameParts[0];
            const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
            
            // Gerar iniciais
            let initials = firstName.charAt(0).toUpperCase();
            if (lastName) {
                initials += lastName.charAt(0).toUpperCase();
            }
            
            console.log('🆔 Iniciais geradas:', initials);
            
            // Atualizar avatar
            const userAvatar = document.getElementById('userAvatar');
            console.log('🔍 userAvatar encontrado:', !!userAvatar);
            if (userAvatar) {
                userAvatar.textContent = initials;
                console.log('✅ Avatar atualizado com iniciais:', initials);
            } else {
                console.warn('⚠️ Elemento userAvatar não encontrado');
            }
            
            // Atualizar nome
            const userName = document.getElementById('userName');
            console.log('🔍 userName encontrado:', !!userName);
            if (userName) {
                userName.textContent = userData.name;
                console.log('✅ Nome atualizado:', userData.name);
            } else {
                console.warn('⚠️ Elemento userName não encontrado');
            }
            
            // Atualizar saudação
            const heroGreeting = document.getElementById('heroGreeting');
            console.log('🔍 heroGreeting encontrado:', !!heroGreeting);
            if (heroGreeting) {
                const now = new Date();
                const hour = now.getHours();
                let greeting = '🌅 Bom dia';
                
                if (hour >= 12 && hour < 18) {
                    greeting = '☀️ Boa tarde';
                } else if (hour >= 18) {
                    greeting = '🌙 Boa noite';
                }
                
                heroGreeting.textContent = `${greeting}, ${firstName}!`;
                console.log('✅ Saudação atualizada:', `${greeting}, ${firstName}!`);
            } else {
                console.warn('⚠️ Elemento heroGreeting não encontrado');
            }
            
            console.log('✅ Perfil do usuário atualizado com sucesso:', userData.name);
        } else {
            console.log('⚠️ Nome do usuário não encontrado nos dados');
        }
    } catch (error) {
        console.error('❌ Erro ao atualizar elementos do perfil:', error);
    }
}

// Executar correção após carregamento da página
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(forceUpdateUserProfile, 1000);
    });
} else {
    setTimeout(forceUpdateUserProfile, 1000);
}

// Tornar função global para uso manual
window.forceUpdateUserProfile = forceUpdateUserProfile;

console.log('✅ Script de correção do perfil do usuário carregado'); 