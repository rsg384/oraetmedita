// Gerenciador de Notificações Push para Ora et Medita
class NotificationManager {
    constructor() {
        this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
        this.permission = 'default';
        this.subscription = null;
    }

    // Inicializar sistema de notificações
    async init() {
        if (!this.isSupported) {
            console.warn('⚠️ Notificações push não suportadas neste navegador');
            return false;
        }

        try {
            // Registrar service worker
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registrado:', registration);

            // Verificar permissão
            this.permission = await this.checkPermission();
            
            if (this.permission === 'granted') {
                await this.subscribeToPush();
            }

            return true;
        } catch (error) {
            console.error('❌ Erro ao inicializar notificações:', error);
            return false;
        }
    }

    // Verificar permissão de notificações
    async checkPermission() {
        if (!('Notification' in window)) {
            return 'denied';
        }

        return Notification.permission;
    }

    // Solicitar permissão
    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('⚠️ Notificações não suportadas');
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            
            if (permission === 'granted') {
                await this.subscribeToPush();
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('❌ Erro ao solicitar permissão:', error);
            return false;
        }
    }

    // Inscrever para notificações push
    async subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready;
            
            // Verificar se já está inscrito
            this.subscription = await registration.pushManager.getSubscription();
            
            if (!this.subscription) {
                // Criar nova inscrição
                this.subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: this.urlBase64ToUint8Array(this.getVapidPublicKey())
                });
                
                console.log('✅ Inscrito para notificações push:', this.subscription);
                
                // Salvar inscrição no servidor (se necessário)
                await this.saveSubscription(this.subscription);
            }
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao inscrever para notificações:', error);
            return false;
        }
    }

    // Enviar notificação local
    async sendLocalNotification(title, body, options = {}) {
        if (this.permission !== 'granted') {
            console.warn('⚠️ Permissão de notificação não concedida');
            return false;
        }

        try {
            const notification = new Notification(title, {
                body: body,
                icon: '/icon-192x192.png',
                badge: '/badge-72x72.png',
                vibrate: [100, 50, 100],
                ...options
            });

            // Gerenciar clique na notificação
            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            return true;
        } catch (error) {
            console.error('❌ Erro ao enviar notificação local:', error);
            return false;
        }
    }

    // Agendar notificação
    scheduleNotification(title, body, scheduledTime, options = {}) {
        const now = Date.now();
        const delay = scheduledTime - now;

        if (delay <= 0) {
            console.warn('⚠️ Horário de notificação já passou');
            return false;
        }

        setTimeout(() => {
            this.sendLocalNotification(title, body, options);
        }, delay);

        console.log(`⏰ Notificação agendada para ${new Date(scheduledTime).toLocaleString()}`);
        return true;
    }

    // Converter chave VAPID
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Obter chave VAPID pública (exemplo)
    getVapidPublicKey() {
        // Em produção, isso viria do servidor
        return 'BEl62iUYgUivxIkv69yViEuiBIa1HI0FyK1dTNH4gfjGkP5aL9oj3htJvPpYIrO4OHRF8wR3CJTy3HoAvRq4Nk';
    }

    // Salvar inscrição no servidor
    async saveSubscription(subscription) {
        try {
            // Aqui você enviaria a inscrição para seu servidor
            console.log('💾 Salvando inscrição no servidor:', subscription);
            
            // Exemplo de envio para servidor
            // await fetch('/api/subscriptions', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(subscription)
            // });
            
            return true;
        } catch (error) {
            console.error('❌ Erro ao salvar inscrição:', error);
            return false;
        }
    }

    // Cancelar inscrição
    async unsubscribe() {
        try {
            if (this.subscription) {
                await this.subscription.unsubscribe();
                this.subscription = null;
                console.log('✅ Inscrição cancelada');
                return true;
            }
            return false;
        } catch (error) {
            console.error('❌ Erro ao cancelar inscrição:', error);
            return false;
        }
    }

    // Verificar status das notificações
    getStatus() {
        return {
            supported: this.isSupported,
            permission: this.permission,
            subscribed: this.subscription !== null,
            subscription: this.subscription
        };
    }
}

// Instância global
window.notificationManager = new NotificationManager();

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.notificationManager.init();
});

console.log('✅ Notification Manager carregado'); 