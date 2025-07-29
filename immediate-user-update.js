// Script para atualização imediata do perfil do usuário
(function() {
    'use strict';
    
    console.log('⚡ Script de atualização imediata carregado...');
    
    // Função para atualizar perfil imediatamente
    function immediateUpdate() {
        try {
            console.log('⚡ Atualização imediata iniciada...');
            
            // Obter dados do usuário
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
            
            // Atualizar elementos DOM
            const elements = [
                { id: 'userAvatar', value: initials, type: 'avatar' },
                { id: 'userName', value: userData.name, type: 'name' },
                { id: 'heroGreeting', value: `${getGreeting()}, ${firstName}!`, type: 'greeting' }
            ];
            
            elements.forEach(element => {
                const domElement = document.getElementById(element.id);
                if (domElement) {
                    domElement.textContent = element.value;
                    console.log(`✅ ${element.type} atualizado:`, element.value);
                } else {
                    console.warn(`⚠️ Elemento ${element.id} não encontrado`);
                }
            });
            
            console.log('✅ Atualização imediata concluída');
            
        } catch (error) {
            console.error('❌ Erro na atualização imediata:', error);
        }
    }
    
    // Função para obter saudação
    function getGreeting() {
        const hour = new Date().getHours();
        if (hour >= 12 && hour < 18) {
            return '☀️ Boa tarde';
        } else if (hour >= 18) {
            return '🌙 Boa noite';
        } else {
            return '🌅 Bom dia';
        }
    }
    
    // Executar imediatamente
    immediateUpdate();
    
    // Executar quando DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', immediateUpdate);
    }
    
    // Executar múltiplas vezes
    setTimeout(immediateUpdate, 50);
    setTimeout(immediateUpdate, 100);
    setTimeout(immediateUpdate, 200);
    setTimeout(immediateUpdate, 500);
    setTimeout(immediateUpdate, 1000);
    
    // Monitorar mudanças
    window.addEventListener('storage', function(e) {
        if (e.key === 'userData') {
            console.log('🔄 Mudança detectada, atualizando imediatamente...');
            immediateUpdate();
        }
    });
    
    // Expor função globalmente
    window.immediateUpdate = immediateUpdate;
    
})(); 