// Script para forçar atualização do perfil do usuário
(function() {
    'use strict';
    
    console.log('🔄 Script de força atualização do usuário carregado...');
    
    // Função para atualizar perfil do usuário
    function forceUpdateUserProfile() {
        try {
            console.log('🔄 Forçando atualização do perfil do usuário...');
            
            // Obter dados do usuário do localStorage
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            console.log('📊 Dados do usuário:', userData);
            
            if (!userData.name) {
                console.log('⚠️ Nenhum usuário logado');
                return;
            }
            
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
            
            // Atualizar avatar - MÚLTIPLAS TENTATIVAS
            let userAvatar = document.getElementById('userAvatar');
            if (userAvatar) {
                userAvatar.textContent = initials;
                console.log('✅ Avatar atualizado:', initials);
            } else {
                console.warn('⚠️ Elemento userAvatar não encontrado na primeira tentativa');
                // Segunda tentativa após delay
                setTimeout(() => {
                    userAvatar = document.getElementById('userAvatar');
                    if (userAvatar) {
                        userAvatar.textContent = initials;
                        console.log('✅ Avatar atualizado na segunda tentativa:', initials);
                    } else {
                        console.error('❌ Elemento userAvatar não encontrado mesmo na segunda tentativa');
                    }
                }, 100);
            }
            
            // Atualizar nome - MÚLTIPLAS TENTATIVAS
            let userName = document.getElementById('userName');
            if (userName) {
                userName.textContent = userData.name;
                console.log('✅ Nome atualizado:', userData.name);
            } else {
                console.warn('⚠️ Elemento userName não encontrado na primeira tentativa');
                // Segunda tentativa após delay
                setTimeout(() => {
                    userName = document.getElementById('userName');
                    if (userName) {
                        userName.textContent = userData.name;
                        console.log('✅ Nome atualizado na segunda tentativa:', userData.name);
                    } else {
                        console.error('❌ Elemento userName não encontrado mesmo na segunda tentativa');
                    }
                }, 100);
            }
            
            // Atualizar saudação (se existir) - MÚLTIPLAS TENTATIVAS
            let heroGreeting = document.getElementById('heroGreeting');
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
                console.warn('⚠️ Elemento heroGreeting não encontrado na primeira tentativa');
                // Segunda tentativa após delay
                setTimeout(() => {
                    heroGreeting = document.getElementById('heroGreeting');
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
                        console.log('✅ Saudação atualizada na segunda tentativa:', `${greeting}, ${firstName}!`);
                    } else {
                        console.error('❌ Elemento heroGreeting não encontrado mesmo na segunda tentativa');
                    }
                }, 100);
            }
            
            console.log('✅ Atualização do perfil concluída');
            
        } catch (error) {
            console.error('❌ Erro ao atualizar perfil:', error);
        }
    }
    
    // Função para limpar cache e forçar recarregamento
    function clearCacheAndReload() {
        console.log('🧹 Limpando cache e forçando recarregamento...');
        sessionStorage.clear();
        localStorage.removeItem('lastLoggedUser');
        
        // Forçar recarregamento da página
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }
    
    // Executar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', forceUpdateUserProfile);
    } else {
        forceUpdateUserProfile();
    }
    
    // Executar múltiplas vezes com delays crescentes
    setTimeout(forceUpdateUserProfile, 100);
    setTimeout(forceUpdateUserProfile, 300);
    setTimeout(forceUpdateUserProfile, 500);
    setTimeout(forceUpdateUserProfile, 1000);
    setTimeout(forceUpdateUserProfile, 2000);
    setTimeout(forceUpdateUserProfile, 5000);
    
    // Monitorar mudanças no localStorage
    window.addEventListener('storage', function(e) {
        if (e.key === 'userData') {
            console.log('🔄 Mudança detectada no userData, atualizando perfil...');
            setTimeout(forceUpdateUserProfile, 100);
            setTimeout(forceUpdateUserProfile, 500);
        }
    });
    
    // Verificar periodicamente se os elementos estão corretos
    setInterval(() => {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.name) {
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');
            
            if (userAvatar && userName) {
                const nameParts = userData.name.trim().split(' ');
                const firstName = nameParts[0];
                const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
                const expectedInitials = firstName.charAt(0).toUpperCase() + (lastName ? lastName.charAt(0).toUpperCase() : '');
                
                if (userAvatar.textContent !== expectedInitials || userName.textContent !== userData.name) {
                    console.log('🔄 Elementos não estão corretos, forçando atualização...');
                    forceUpdateUserProfile();
                }
            }
        }
    }, 3000);
    
    // Expor funções globalmente para debug
    window.forceUpdateUserProfile = forceUpdateUserProfile;
    window.clearCacheAndReload = clearCacheAndReload;
    
    // Verificar se há parâmetro de debug na URL
    const urlParams = new URLSearchParams(window.location.search);
    const debug = urlParams.get('debug');
    if (debug === 'true') {
        console.log('🔍 Modo debug ativado');
        // Executar mais vezes em modo debug
        setTimeout(forceUpdateUserProfile, 100);
        setTimeout(forceUpdateUserProfile, 200);
        setTimeout(forceUpdateUserProfile, 300);
    }
    
})(); 